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

## Naturalness pilot

- Scene-level **TTS cue** metadata supports only the non-verbal cues documented by VieNeu v3.3.0: `chuckle`, `sigh`, and `clear-throat`. Syntax: `**TTS cue:** chuckle|exact phrase from the narration`. The cue is inserted after that exact phrase; unknown tags or unmatched anchors fail validation.
- This is not a general emotion/style control. VieNeu v3 Turbo deprecates its old `style` argument, so the pipeline does not pretend that a `sarcastic` or `playful` label can change the whole spoken prosody.
- Every generated WAV receives a continuous, restrained HVAC-like room-tone bed calibrated to **-50 dBFS RMS**. It stays under speech and pauses instead of switching on/off at every gap, so transitions remain smooth. This is generated tonal/airflow ambience, not a field recording of a specific air conditioner. The PCM is audited sample-by-sample; exact-zero samples and all-channel digital-silence runs must both be zero. This is a technical continuity measure, not a YouTube monetization guarantee.
- Approved inhale source: [Long single breath through mouth (male) 01](https://pixabay.com/sound-effects/people-long-single-breath-trough-mouth-male-01-30375/) by thomasXkiteXforXlife (Freesound), available under the Pixabay Content License. The direct MP3 supplied for this pilot is downloaded by GitHub Actions from the user's public `image2url.com` link. The source MP3 and temporary WAVs stay under the runner's temporary directory and are not committed to the public repository or included in the listening artifact.
- The workflow validates the direct URL host/path, downloads the MP3 with a 25 MB cap, converts it to 48 kHz mono PCM WAV with FFmpeg, then selects a short active region (0.12–2.5 seconds) and applies 35 ms edge fades. The selected segment is a candidate crop based on signal activity; it still requires listening review before it is treated as the final approved inhale.
- Natural inhalation is inserted only at a story marker: `**Hơi thở sau:** exact phrase from the narration`. The current pilot marker is in scene 18 after “Nhưng ở đây, mình muốn chậm lại một chút.” The generator inserts the supplied sample at that phrase boundary at a conservative default gain of -24 dB, with short gaps on either side. Without a supplied sample, no artificial breath is fabricated; the room-tone bed still covers the pause.
- The pilot marks one restrained chuckle in the opening and one reflective inhale point later in the episode. These are review points, not a blanket effect applied to every scene.
- The Adam pilot is for listening review only; do not start the full film render until the FP32/INT8 audio and the breath crop have been reviewed.
