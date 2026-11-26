#!/usr/bin/env python3
"""Generate Vietnamese narration and trim only trailing silence, preserving pauses inside speech."""
from __future__ import annotations
import argparse, json, math, struct, wave
from pathlib import Path

FPS = 30
TAIL_SECONDS = 0.20
WINDOW_SECONDS = 0.01
ABSOLUTE_RMS_FLOOR = 0.0025
RELATIVE_RMS_FLOOR = 0.012


EMOTION_TAGS = {
    "chuckle": "[chuckle]",
    "sigh": "[sigh]",
    "clear-throat": "[clear throat]",
}
SAMPLE_RATE = 48_000


def apply_tts_cue(narration: str, cue_spec: str) -> str:
    """Insert one documented VieNeu non-verbal cue after an exact narration anchor."""
    if not cue_spec:
        return narration
    cue, separator, anchor = cue_spec.partition("|")
    cue = cue.strip().lower()
    anchor = anchor.strip()
    if not separator or cue not in EMOTION_TAGS or not anchor:
        raise ValueError("TTS cue must be '<chuckle|sigh|clear-throat>|<exact narration phrase>'.")
    start = narration.casefold().find(anchor.casefold())
    if start < 0:
        raise ValueError(f"TTS cue anchor was not found in narration: {anchor!r}")
    end = start + len(anchor)
    return narration[:end] + " " + EMOTION_TAGS[cue] + narration[end:]


def split_after_anchor(text: str, anchor: str) -> tuple[str, str]:
    """Split narration at an exact phrase so a recorded inhale can occupy that pause."""
    anchor = (anchor or "").strip()
    start = text.casefold().find(anchor.casefold())
    if not anchor or start < 0:
        raise ValueError(f"Breath anchor was not found in narration: {anchor!r}")
    end = start + len(anchor)
    before, after = text[:end].strip(), text[end:].strip()
    if not before or not after:
        raise ValueError("Breath anchor must leave spoken text on both sides.")
    return before, after


def load_breath_sample(path: Path, gain_db: float):
    """Load a short, clean 48 kHz breath recording without fabricating breath noise."""
    try:
        import numpy as np
        import soundfile as sf
    except ImportError as exc:
        raise RuntimeError("Breath insertion requires numpy and soundfile from the VieNeu install.") from exc
    audio, sample_rate = sf.read(str(path), dtype="float32", always_2d=True)
    if sample_rate != SAMPLE_RATE:
        raise ValueError(f"Breath sample must be {SAMPLE_RATE} Hz; got {sample_rate} Hz.")
    audio = audio.mean(axis=1)
    active = np.flatnonzero(np.abs(audio) > 0.0005)
    if active.size == 0:
        raise ValueError("Breath sample is silent.")
    start = max(0, int(active[0]) - int(0.02 * sample_rate))
    end = min(len(audio), int(active[-1]) + int(0.04 * sample_rate))
    audio = audio[start:end]
    duration = len(audio) / sample_rate
    if duration < 0.12 or duration > 2.5:
        raise ValueError(f"Breath sample must be 0.12–2.5 seconds after trimming; got {duration:.2f}s.")
    audio = audio * (10 ** (gain_db / 20))
    return audio.astype("float32")


def synthesize_scene(tts, narration: str, voice: str, cue_spec: str = "",
                     breath_after: str = "", breath_sample: Path | None = None,
                     breath_gain_db: float = -24.0):
    """Synthesize Adam with optional supported emotion cue and recorded inhale."""
    import numpy as np
    tts_text = apply_tts_cue(narration, cue_spec)
    if breath_after and breath_sample is not None:
        before, after = split_after_anchor(tts_text, breath_after)
        inhale = load_breath_sample(breath_sample, breath_gain_db)
        left = np.asarray(tts.infer(before, voice=voice), dtype="float32").reshape(-1)
        right = np.asarray(tts.infer(after, voice=voice), dtype="float32").reshape(-1)
        short_gap = np.zeros(int(SAMPLE_RATE * 0.10), dtype="float32")
        return np.concatenate((left, short_gap, inhale, short_gap, right))
    if breath_after and breath_sample is None:
        print("WARNING: scene requests a breath, but no --breath-sample was supplied; leaving the pause natural.")
    return tts.infer(tts_text, voice=voice)


def sample_values(raw: bytes, width: int):
    if width == 1: return [b - 128 for b in raw]
    if width == 2:
        n=len(raw)//2
        return struct.unpack("<"+"h"*n, raw[:n*2])
    if width == 3:
        out=[]
        for i in range(0,len(raw)-2,3):
            v=int.from_bytes(raw[i:i+3],"little",signed=False)
            out.append(v-0x1000000 if v&0x800000 else v)
        return out
    if width == 4:
        n=len(raw)//4
        return struct.unpack("<"+"i"*n,raw[:n*4])
    raise ValueError("Unsupported PCM sample width: "+str(width))

def trim_trailing_silence(path: Path):
    """Trim only quiet audio after the final voiced 10ms window; inner pauses remain untouched."""
    with wave.open(str(path),"rb") as wav:
        params=wav.getparams()
        if params.comptype!="NONE": raise ValueError("Unsupported WAV compression: "+params.comptype)
        raw=wav.readframes(params.nframes)
    width,channels=params.sampwidth,params.nchannels
    values=sample_values(raw,width)
    if not values: raise ValueError("WAV contains no samples.")
    scale=float(1 << (8*width-1))
    frames=len(values)//channels
    window=max(1,int(params.framerate*WINDOW_SECONDS))
    rms_windows=[]
    peak=0.0
    for start in range(0,frames,window):
        end=min(frames,start+window)
        block=values[start*channels:end*channels]
        if not block: continue
        rms=math.sqrt(sum(float(v)*float(v) for v in block)/len(block))/scale
        rms_windows.append((end,rms))
        peak=max(peak,rms)
    threshold=max(ABSOLUTE_RMS_FLOOR,peak*RELATIVE_RMS_FLOOR)
    last_voice_end=0
    for end,rms in rms_windows:
        if rms>=threshold: last_voice_end=end
    if last_voice_end==0:
        duration=frames/params.framerate
        return duration,duration
    keep=min(frames,last_voice_end+int(params.framerate*TAIL_SECONDS))
    if keep>=frames:
        duration=frames/params.framerate
        return duration,duration
    kept=values[:keep*channels]
    if width==1: output=bytes(max(0,min(255,int(v)+128)) for v in kept)
    elif width==2: output=struct.pack("<"+"h"*len(kept),*kept)
    elif width==3: output=b"".join(int(v).to_bytes(3,"little",signed=True) for v in kept)
    else: output=struct.pack("<"+"i"*len(kept),*kept)
    with wave.open(str(path),"wb") as wav:
        wav.setparams(params)
        wav.writeframes(output)
    return frames/params.framerate,keep/params.framerate

def frame_mouth_envelope(path: Path):
    """Return one normalized RMS mouth-opening value per 30fps video frame."""
    with wave.open(str(path), "rb") as wav:
        params = wav.getparams()
        raw = wav.readframes(params.nframes)
    values = sample_values(raw, params.sampwidth)
    channels = params.nchannels
    total_frames = len(values) // channels
    video_frame_count = math.ceil(total_frames * FPS / params.framerate)
    envelope = []
    for video_frame in range(video_frame_count):
        start = round(video_frame * params.framerate / FPS)
        end = min(total_frames, round((video_frame + 1) * params.framerate / FPS))
        block = values[start * channels:end * channels]
        if not block:
            envelope.append(0.0)
            continue
        rms = math.sqrt(sum(float(v) * float(v) for v in block) / len(block))
        envelope.append(rms)
    peak = max(envelope, default=0.0)
    if peak <= 0:
        return [0.0 for _ in envelope]
    normalized = [min(1.0, value / peak) for value in envelope]
    # A short moving average avoids one-frame mouth flicker while preserving pauses.
    smoothed = []
    for index in range(len(normalized)):
        window = normalized[max(0, index - 1):min(len(normalized), index + 2)]
        smoothed.append(round(sum(window) / len(window), 3))
    return smoothed

def format_scene_report(number: int, before: float, original: float, trimmed: float, scene_duration: float) -> str:
    """Format one scene progress line without fragile percent-placeholder counts."""
    removed = max(original - trimmed, 0.0)
    return f"Scene {number:02d}: {before:.2f}s -> {trimmed:.2f}s; trimmed {removed:.2f}s trailing silence; scene {scene_duration:.2f}s"

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument("--props",required=True)
    parser.add_argument("--output-dir",required=True)
    parser.add_argument("--voice",default="Adam")
    parser.add_argument("--precision", choices=("fp32", "int8"), default="fp32",
                        help="VieNeu ONNX precision; fp32 prioritizes fidelity.")
    parser.add_argument("--breath-sample", type=Path, default=None,
                        help="Optional clean 48 kHz mono human inhale WAV; never synthesized from noise.")
    parser.add_argument("--breath-gain-db", type=float, default=-24.0,
                        help="Breath sample gain relative to full scale (default: -24 dB).")
    args=parser.parse_args()
    props_path=Path(args.props)
    output_dir=Path(args.output_dir)
    props=json.loads(props_path.read_text(encoding="utf-8"))
    scenes=props.get("scenes") or []
    if not scenes: raise SystemExit("No scenes found in story props.")
    from vieneu import Vieneu
    if args.breath_sample is not None and not args.breath_sample.is_file():
        raise SystemExit("Breath sample not found: " + str(args.breath_sample))
    tts=Vieneu(backend="onnx", precision=args.precision)
    print(f"VieNeu-TTS: backend=onnx, precision={args.precision}, voice={args.voice}")
    output_dir.mkdir(parents=True,exist_ok=True)
    for old in output_dir.glob("scene-*.wav"): old.unlink()
    for scene in scenes:
        narration=(scene.get("narration") or "").strip()
        if not narration: raise SystemExit("Scene "+str(scene.get("number"))+" has no narration.")
        number=int(scene["number"])
        target=output_dir/("scene-%02d.wav"%number)
        try:
            audio=synthesize_scene(
                tts,
                narration,
                args.voice,
                cue_spec=scene.get("ttsCue", ""),
                breath_after=scene.get("breathAfter", ""),
                breath_sample=args.breath_sample,
                breath_gain_db=args.breath_gain_db,
            )
        except ValueError as exc:
            raise SystemExit(f"Scene {number:02d}: {exc}") from exc
        tts.save(audio,str(target))
        if not target.is_file() or target.stat().st_size<1024: raise SystemExit("TTS did not produce a valid WAV for scene %d."%number)
        try:
            with wave.open(str(target),"rb") as wav: before=wav.getnframes()/wav.getframerate()
            original,trimmed=trim_trailing_silence(target)
            with wave.open(str(target),"rb") as wav:
                if wav.getframerate()<=0 or wav.getnframes()<=0: raise wave.Error("empty or invalid audio")
        except (wave.Error,EOFError,ValueError) as exc:
            raise SystemExit("Invalid WAV for scene %d: %s"%(number,exc)) from exc
        audio_frames=math.ceil(trimmed*FPS)
        if scene.get("duration"):
            scene["durationInFrames"]=max(int(scene.get("durationInFrames",0)),audio_frames)
        else:
            scene["durationInFrames"]=audio_frames
        scene["voiceover"]="voiceover/scene-%02d.wav"%number
        scene["mouthFrames"]=frame_mouth_envelope(target)
        scene_duration=max(int(scene.get("durationInFrames",0)),1)/FPS
        print(format_scene_report(number, before, original, trimmed, scene_duration))
    props["voiceover"]=""
    props["totalFrames"]=sum(int(s["durationInFrames"]) for s in scenes)
    props_path.write_text(json.dumps(props,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print("Generated %d Adam voice tracks; FP32 selected; internal pauses preserved; only trailing silence trimmed."%len(scenes))
    if any(scene.get("breathAfter") for scene in scenes) and args.breath_sample is None:
        print("NOTE: recorded inhale insertion is wired but not activated; supply --breath-sample after approving a clean licensed recording.")

if __name__=="__main__": main()
