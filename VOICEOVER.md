# Voiceover and font pipeline

## Typography

The Remotion bundle self-hosts Be Vietnam Pro through `@fontsource/be-vietnam-pro`. The film and animatic wait for the required font face before rendering, so Vietnamese glyphs and font weights do not depend on an external Google Fonts request.

## Vietnamese narration

The story workflow generates one WAV per scene using VieNeu-TTS v3 Turbo with the built-in **Adam** preset (male, Southern Vietnamese). It uses the SDK's CPU/ONNX backend, explicitly selects **FP32** for the highest-fidelity ONNX backbone, and produces 48 kHz WAV files. The pinned SDK version 3.3.0 defaults to INT8, so the explicit precision argument is required. Scene lengths are extended when the synthesized speech is longer than the script estimate, preventing narration from being cut off.

- GitHub Actions PR render: narration is generated automatically.
- Manual workflow dispatch: narration is enabled by default and can be switched off.
- Local full render with narration: from `template/`, run `npm run render:film:voice`.
- Local render without narration: `npm run render:film`.

The first TTS run downloads the model and dependencies; subsequent GitHub Actions runs reuse the model cache. The model itself is free/open source under Apache-2.0; no hosted API or usage-based billing is involved.

See [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md) for license and attribution details.


### Naturalness pilot

- Scene-level **TTS cue** metadata supports only the non-verbal cues documented by VieNeu v3.3.0: `chuckle`, `sigh`, and `clear-throat`. Syntax: `**TTS cue:** chuckle|exact phrase from the narration`. The cue is inserted after that exact phrase; unknown tags or unmatched anchors fail validation.
- This is not a general emotion/style control. VieNeu v3 Turbo deprecates its old `style` argument, so the pipeline does not pretend that a `sarcastic` or `playful` label can change the whole spoken prosody.
- Natural inhalation is supported only from an actual short, clean, licensed 48 kHz mono WAV recording. Add `**Hơi thở sau:** exact phrase from the narration` to select the pause, then run the generator with `--breath-sample /path/to/inhale.wav`. The sample is inserted at that exact phrase boundary at a conservative default gain of -24 dB, with short gaps on either side. No synthetic noise is fabricated to imitate breathing. Without a supplied sample, the breath marker is logged and the generated narration remains unchanged.
- Example generation: `python scripts/generate-voiceover.py --props template/out/story-props.json --output-dir template/public/voiceover --voice Adam --precision fp32 --breath-sample /path/to/inhale.wav`.
- The pilot marks one restrained chuckle in the opening and one reflective inhale point later in the episode. These are review points, not a blanket effect applied to every scene.
