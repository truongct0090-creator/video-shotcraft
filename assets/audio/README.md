# Approved narration audio sources

The episode 02 voice pipeline uses the exact user-selected Pixabay sound:

- **Title:** Long single breath trough mouth (male) 01
- **Pixabay page:** https://pixabay.com/vi/sound-effects/m%E1%BB%8Di-ng%C6%B0%E1%BB%9Di-long-single-breath-trough-mouth-male-01-30375/
- **Required source filename:** `pixabay-long-single-breath-male-01.mp3`

Place the downloaded MP3 at this path before starting a voiceover render:

`assets/audio/pixabay-long-single-breath-male-01.mp3`

The workflow converts it to 48 kHz mono, extracts one clean active inhale with
`scripts/prepare-breath-sample.py`, and passes the prepared WAV to Adam at
-24 dB. If the story contains a `Hơi thở sau` cue and the source MP3 is missing,
the workflow stops before installing TTS or starting Remotion. Room tone is not
a substitute for the recorded inhale.
