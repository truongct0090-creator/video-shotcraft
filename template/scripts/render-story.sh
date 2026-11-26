#!/usr/bin/env bash
set -euo pipefail

SCRIPT_PATH="${1:-story_scripts/02-sau-canh-cua-bi-mat.md}"
MODE="${2:-full}"
ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT_DIR"

# Fail before npm install or any expensive render if the media QA dependency is absent.
if ! command -v ffprobe >/dev/null 2>&1; then
  echo "ERROR: ffprobe is required for MP4 QA but was not found on PATH." >&2
  echo "Install FFmpeg first (macOS: brew install ffmpeg; Ubuntu/Debian: sudo apt-get install ffmpeg)." >&2
  exit 1
fi

node scripts/parse-story.mjs --script="$SCRIPT_PATH" --mode="$MODE" --output=template/out/story-props.json
if [[ "${GENERATE_VOICEOVER:-0}" == "1" ]]; then
  python3 -m pip install -r scripts/requirements-tts.txt
  python3 scripts/generate-voiceover.py --props template/out/story-props.json --output-dir template/public/voiceover --voice Adam
fi
cd template
npm ci
mkdir -p out
npx remotion render src/index.ts IllustratedStoryFilm out/story-film.mp4 --props=out/story-props.json --codec=h264
npx remotion render src/index.ts StoryAnimatic out/story-animatic.mp4 --props=out/story-props.json --codec=h264
node ../scripts/validate-rendered-film.mjs --file=out/story-film.mp4 --props=out/story-props.json --output=out/story-film-qa.json
node ../scripts/validate-rendered-film.mjs --file=out/story-animatic.mp4 --props=out/story-props.json --output=out/story-animatic-qa.json
node ../scripts/qa-rendered-film.mjs out/story-film.mp4 out/story-animatic.mp4
echo "Rendered: template/out/story-film.mp4 and template/out/story-animatic.mp4"
