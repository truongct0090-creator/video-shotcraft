# Approved narration audio sources

The episode 02 narration uses the exact recording selected by the user:

- **Title:** Long single breath trough mouth (male) 01
- **Creator:** thomasXkiteXforXlife (Freesound)
- **Pixabay listing:** https://pixabay.com/sound-effects/people-long-single-breath-trough-mouth-male-01-30375/
- **Original Freesound sound:** https://freesound.org/people/thomasXkiteXforXlife/sounds/410865/
- **Required filename:** `pixabay-long-single-breath-male-01.mp3`

The workflow first reads the Pixabay AudioObject metadata and downloads that
listing's MP3. If automated access to Pixabay is blocked, it uses only the
identical original Freesound recording (same title, creator and source sound
410865) and its public MP3 preview. It does not substitute another recording
or synthesize a fake breath.

The workflow converts the MP3 to 48 kHz mono WAV, extracts one clean active inhale
with `scripts/prepare-breath-sample.py`, and passes the prepared sample to Adam
at -24 dB. If neither exact source exposes a valid MP3, the workflow stops before
TTS and Remotion. Room tone is not a substitute for the recorded inhale.

The Pixabay listing is free under the Pixabay Content License. The original
Freesound recording is marked Creative Commons 0 on its source page.
