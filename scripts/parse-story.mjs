#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const args = Object.fromEntries(process.argv.slice(2).map((arg) => {
  const i = arg.indexOf('=');
  if (i < 0) return [arg.replace(/^--/, ''), 'true'];
  return [arg.slice(2, i), arg.slice(i + 1)];
}));

const script = args.script ?? 'story_scripts/01-nhung-hoi-kin-tung-lam-mua-lam-gio-o-viet-nam.md';
const mode = args.mode ?? 'test';
const output = args.output ?? 'template/out/story-props.json';

if (!script.startsWith('story_scripts/') || !script.endsWith('.md')) {
  throw new Error('Script path must point to a Markdown file inside story_scripts/.');
}
if (!['test', 'full'].includes(mode)) throw new Error('Mode must be test or full.');

const absolute = path.resolve(script);
const root = path.resolve('story_scripts') + path.sep;
if (!absolute.startsWith(root)) throw new Error('Script path escapes story_scripts/.');
if (!fs.existsSync(absolute)) throw new Error(`Script not found: ${script}`);

const markdown = fs.readFileSync(absolute, 'utf8').replace(/^\uFEFF/, '');
const title = markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? path.basename(script, '.md');
const headings = [...markdown.matchAll(/^###\\s+(\\d{1,2})\\.\\s+(.+?)\\s*$/gm)];
const clean = (value = '') => value
  .replace(/\\r/g, '')
  .replace(/^\\*\\*[^*]+:\\*\\*\\s*/gm, '')
  .replace(/\\[([^\\]]+)\\]\\([^)]+\\)/g, '$1')
  .replace(/[*_`]/g, '')
  .replace(/\\n{3,}/g, '\\n\\n')
  .trim();

const scenes = headings.map((match, index) => {
  const start = match.index + match[0].length;
  const end = headings[index + 1]?.index ?? markdown.length;
  const body = markdown.slice(start, end).split(/^##\\s+/m)[0];
  const field = (label) => {
    const escaped = label.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&');
    const found = body.match(new RegExp('^\\\\*\\\\*' + escaped + ':\\\\*\\\\*\\\\s*([\\\\s\\\\S]*?)(?=^\\\\*\\\\*[^*]+:\\\\*\\\\*|(?![\\\\s\\\\S]))', 'm'));
    return clean(found?.[1] ?? '');
  };
  return {
    number: Number(match[1]),
    heading: clean(match[2]),
    setting: field('Bối cảnh'),
    action: field('Hành động'),
    narration: field('Lời dẫn'),
    audio: field('Âm thanh/Chữ') || field('Âm thanh/Chữ màn hình'),
  };
}).filter((scene) => scene.heading);

if (scenes.length === 0) throw new Error('No scenes found. Expected headings like ### 01. Scene title.');
for (const scene of scenes) {
  if (!scene.narration) throw new Error(`Scene ${scene.number} is missing **Lời dẫn:**.`);
}
const selected = mode === 'test' ? scenes.slice(0, 10) : scenes;
const props = {
  title,
  mode,
  framesPerScene: 150,
  scenes: selected,
  source: script,
  totalScenes: scenes.length,
};
fs.mkdirSync(path.dirname(output), {recursive: true});
fs.writeFileSync(output, JSON.stringify(props, null, 2) + '\n');
console.log(`Validated ${selected.length}/${scenes.length} scenes from ${script}; wrote ${output}`);
