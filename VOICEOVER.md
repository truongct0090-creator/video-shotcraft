# Voiceover and font pipeline

## Typography

The Remotion bundle self-hosts Be Vietnam Pro through `@fontsource/be-vietnam-pro`. The film and animatic wait for the required font face before rendering, so Vietnamese glyphs and font weights do not depend on an external Google Fonts request.

## Vietnamese narration

The story workflow generates one WAV per scene using VieNeu-TTS v3 Turbo with the built-in **Adam** preset (male, Southern Vietnamese). It uses the SDK's CPU/ONNX backend and produces 48 kHz WAV files. Scene lengths are extended when the synthesized speech is longer than the script estimate, preventing narration from being cut off.

- GitHub Actions PR render: narration is generated automatically.
- Manual workflow dispatch: narration is enabled by default and can be switched off.
- Local full render with narration: from `template/`, run `npm run render:film:voice`.
- Local render without narration: `npm run render:film`.

The first TTS run downloads the model and dependencies; subsequent GitHub Actions runs reuse the model cache. The model itself is free/open source under Apache-2.0; no hosted API or usage-based billing is involved.

See [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md) for license and attribution details.
