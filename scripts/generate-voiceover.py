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

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument("--props",required=True)
    parser.add_argument("--output-dir",required=True)
    parser.add_argument("--voice",default="Adam")
    args=parser.parse_args()
    props_path=Path(args.props)
    output_dir=Path(args.output_dir)
    props=json.loads(props_path.read_text(encoding="utf-8"))
    scenes=props.get("scenes") or []
    if not scenes: raise SystemExit("No scenes found in story props.")
    from vieneu import Vieneu
    tts=Vieneu(backend="onnx")
    output_dir.mkdir(parents=True,exist_ok=True)
    for old in output_dir.glob("scene-*.wav"): old.unlink()
    for scene in scenes:
        narration=(scene.get("narration") or "").strip()
        if not narration: raise SystemExit("Scene "+str(scene.get("number"))+" has no narration.")
        number=int(scene["number"])
        target=output_dir/("scene-%02d.wav"%number)
        audio=tts.infer(narration,voice=args.voice)
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
        scene_duration=max(int(scene.get("durationInFrames",0)),1)/FPS
        print(f"Scene {number:02d}: {before:.2f}s -> {trimmed:.2f}s; trimmed {max(original-trimmed, 0):.2f}s trailing silence; scene {scene_duration:.2f}s")
    props["voiceover"]=""
    props["totalFrames"]=sum(int(s["durationInFrames"]) for s in scenes)
    props_path.write_text(json.dumps(props,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print("Generated %d Adam voice tracks; internal pauses preserved; only trailing silence trimmed."%len(scenes))

if __name__=="__main__": main()
