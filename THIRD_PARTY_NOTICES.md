# Third-party notices

## Be Vietnam Pro

- Package: `@fontsource/be-vietnam-pro` version 5.3.0
- Typeface license: SIL Open Font License 1.1 (OFL-1.1)
- The font files are installed from npm and bundled locally by the Remotion build; no Google Fonts runtime request is made.

## VieNeu-TTS v3 Turbo

- SDK: `vieneu==3.3.0`; CPU/ONNX backend.
- Model: VieNeu-TTS v3 Turbo, preset voice **Adam** (male, Southern Vietnamese).
- Model and bundled preset-voice assets: Apache License 2.0.
- The model card states that preset voices and generated audio may be used in commercial and monetized content without an additional fee. Retain this notice and the model attribution if redistributing model assets.
- Project: https://github.com/pnnbao97/VieNeu-TTS
- Model card: https://huggingface.co/ngoctham/VieNeu-TTS-v3-Turbo

The TTS model is downloaded on first use and cached by GitHub Actions. Synthesis runs on CPU locally in the workflow; there is no paid TTS API or per-character charge.
