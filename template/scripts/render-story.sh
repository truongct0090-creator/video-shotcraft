#!/usr/bin/env bash
set -euo pipefail

SCRIPT_PATH="${1:-story_scripts/01-nhung-hoi-kin-tung-lam-mua-lam-gio-o-viet-nam.md}"
MODE="${2:-test}"
ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT_DIR"

node scripts/parse-story.mjs --script="$SCRIPT_PATH" --mode="$MODE" --output=template/out/story-props.json
cd template
npm ci
mkdir -p out
npx remotion render src/index.ts StoryAnimatic out/story-animatic.mp4 --props=out/story-props.json --codec=h264
echo "Rendered: template/out/story-animatic.mp4"
