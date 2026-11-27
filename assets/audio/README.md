# Approved narration audio sources

The episode 02 narration uses the exact sound selected by the user:

- **Title:** Long single breath trough mouth (male) 01
- **Artist:** thomasXkiteXforXlife (Freesound)
- **Pixabay page:** https://pixabay.com/sound-effects/people-long-single-breath-trough-mouth-male-01-30375/
- **Source ID:** 30375
- **Required filename:** `pixabay-long-single-breath-male-01.mp3`

The Story Animatic workflow reads the public Pixabay page's AudioObject metadata,
extracts its direct MP3 content URL, downloads the selected source, and validates
that the response is an MP3 before starting TTS. It does not substitute another
breath recording or fabricate breath noise.

The workflow converts the MP3 to 48 kHz mono WAV, extracts one clean active inhale
with `scripts/prepare-breath-sample.py`, and passes the prepared sample to Adam
at -24 dB. If the page cannot supply the MP3 or the file fails validation, the
workflow stops before TTS and Remotion. Room tone is not a substitute for the
recorded inhale.

The source is listed as free for use under the Pixabay Content License on the
asset page. Retain this source note with the episode assets.
