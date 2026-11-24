#!/usr/bin/env bash
set -euo pipefail

SCRIPT_PATH="${1:-story_scripts/01-nhung-hoi-kin-tung-lam-mua-lam-gio-o-viet-nam.md}"
MODE="${2:-full}"
ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT_DIR"

node scripts/parse-story.mjs --script="$SCRIPT_PATH" --mode="$MODE" --output=template/out/story-props.json
cd template
npm ci
mkdir -p out
npx remotion render src/index.ts IllustratedStoryFilm out/story-film.mp4 --props=out/story-props.json --codec=h264
npx remotion render src/index.ts StoryAnimatic out/story-animatic.mp4 --props=out/story-props.json --codec=h264
node ../scripts/validate-rendered-film.mjs --file=out/story-film.mp4 --props=out/story-props.json --output=out/story-film-qa.json
node ../scripts/validate-rendered-film.mjs --file=out/story-animatic.mp4 --props=out/story-props.json --output=out/story-animatic-qa.json
node ../scripts/qa-rendered-film.mjs out/story-film.mp4 out/story-animatic.mp4
echo "Rendered: template/out/story-film.mp4 and template/out/story-animatic.mp4"
