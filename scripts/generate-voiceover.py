#!/usr/bin/env python3
"""Generate per-scene Vietnamese narration using the free VieNeu-TTS v3 Turbo CPU engine."""
from __future__ import annotations

import argparse
import json
import math
import wave
from pathlib import Path

FPS = 30
TAIL_SECONDS = 0.5


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--props", required=True)
    parser.add_argument("--output-dir", required=True)
    parser.add_argument("--voice", default="Adam")
    args = parser.parse_args()

    props_path = Path(args.props)
    output_dir = Path(args.output_dir)
    props = json.loads(props_path.read_text(encoding="utf-8"))
    scenes = props.get("scenes") or []
    if not scenes:
        raise SystemExit("No scenes found in story props.")

    from vieneu import Vieneu

    # Force the torch-free ONNX CPU backend; no paid API or GPU is used.
    tts = Vieneu(backend="onnx")
    output_dir.mkdir(parents=True, exist_ok=True)
    for old_file in output_dir.glob("scene-*.wav"):
        old_file.unlink()

    for scene in scenes:
        narration = (scene.get("narration") or "").strip()
        if not narration:
            raise SystemExit(f"Scene {scene.get('number')} has no narration.")
        number = int(scene["number"])
        filename = f"scene-{number:02d}.wav"
        target = output_dir / filename
        audio = tts.infer(narration, voice=args.voice)
        tts.save(audio, str(target))
        if not target.is_file() or target.stat().st_size < 1024:
            raise SystemExit(f"TTS did not produce a valid WAV for scene {number}.")
        try:
            with wave.open(str(target), "rb") as wav:
                sample_rate = wav.getframerate()
                if sample_rate <= 0:
                    raise wave.Error("missing sample rate")
                duration = wav.getnframes() / sample_rate
        except (wave.Error, EOFError) as exc:
            raise SystemExit(f"Invalid WAV for scene {number}: {exc}") from exc
        # Extend the scene if speech exceeds the script estimate, and leave a short natural tail.
        audio_frames = math.ceil((duration + TAIL_SECONDS) * FPS)
        scene["durationInFrames"] = max(int(scene.get("durationInFrames", 0)), audio_frames)
        scene["voiceover"] = f"voiceover/{filename}"
        print(f"Scene {number:02d}: {duration:.2f}s speech -> {scene['durationInFrames'] / FPS:.2f}s scene")

    props["voiceover"] = ""
    props["totalFrames"] = sum(int(scene["durationInFrames"]) for scene in scenes)
    props_path.write_text(json.dumps(props, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Generated {len(scenes)} Adam voice tracks; total duration {props['totalFrames'] / FPS:.1f}s.")


if __name__ == "__main__":
    main()
