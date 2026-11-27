#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const args = Object.fromEntries(process.argv.slice(2).map((arg) => {
  const i = arg.indexOf('=');
  if (i < 0) return [arg.replace(/^--/, ''), 'true'];
  return [arg.slice(2, i), arg.slice(i + 1)];
}));

const script = args.script ?? 'story_scripts/02-sau-canh-cua-bi-mat.md';
const mode = args.mode ?? 'test';
const output = args.output ?? 'template/out/story-props.json';

if (!script.startsWith('story_scripts/') || !script.endsWith('.md')) {
  throw new Error('Script path must point to a Markdown file inside story_scripts/.');
}
if (!['test', 'breath-test', 'full'].includes(mode)) throw new Error('Mode must be test, breath-test, or full.');

const absolute = path.resolve(script);
const root = path.resolve('story_scripts') + path.sep;
if (!absolute.startsWith(root)) throw new Error('Script path escapes story_scripts/.');
if (!fs.existsSync(absolute)) throw new Error('Script not found: ' + script);

const markdown = fs.readFileSync(absolute, 'utf8').replace(/^\uFEFF/, '');
const title = markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? path.basename(script, '.md');
const headings = [...markdown.matchAll(/^###\s+(\d{1,2})\.\s+(.+?)\s*$/gm)];

const clean = (value = '') => value
  .replace(/\r/g, '')
  .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
  .replace(/[*_\`]/g, '')
  .replace(/\n{3,}/g, '\n\n')
  .trim();

const scenes = headings.map((match, index) => {
  const start = match.index + match[0].length;
  const end = headings[index + 1]?.index ?? markdown.length;
  const body = markdown.slice(start, end).split(/^##\s+/m)[0];
  const field = (label) => {
    const escaped = label.replaceAll('/', '\\/');
    const pattern = new RegExp('^\\*\\*' + escaped + ':\\*\\*\\s*([\\s\\S]*?)(?=^\\*\\*[^*]+:\\*\\*|(?![\\s\\S]))', 'm');
    return clean(body.match(pattern)?.[1] ?? '');
  };
  return {
    number: Number(match[1]),
    heading: clean(match[2]),
    setting: field('Bối cảnh'),
    action: field('Hành động'),
    props: field('Đạo cụ'),
    shot: field('Shot'),
    narration: field('Lời dẫn'),
    audio: field('Âm thanh/Chữ') || field('Âm thanh/Chữ màn hình'),
    world: field('Loại cảnh').toLowerCase(),
    character: field('Nhân vật').toLowerCase() || 'main-boy',
    duration: field('Thời lượng'),
    stage: field('Sân khấu').toLowerCase(),
    photo: field('Ảnh tư liệu'),
    photoCaption: field('Chú thích ảnh'),
    photoLabel: field('Nhãn ảnh'),
    cardTitle: field('Tiêu đề ảnh'),
    expression: field('Biểu cảm').toLowerCase(),
    ttsCue: field('TTS cue'),
    breathAfter: field('Hơi thở sau'),
  };
}).filter((scene) => scene.heading);

if (scenes.length === 0) throw new Error('No scenes found. Expected headings like ### 01. Scene title.');
for (const scene of scenes) {
  if (!scene.narration) throw new Error('Scene ' + scene.number + ' is missing **Lời dẫn:**.');
  if (!scene.props) throw new Error('Scene ' + scene.number + ' is missing **Đạo cụ:**; each scene needs concrete visual objects.');
  if (scene.stage && !['white-intro','white-photo','white-title','normal'].includes(scene.stage)) throw new Error('Scene ' + scene.number + ' has an unsupported **Sân khấu:** value.');
  const safeReferencePhoto = scene.photo.startsWith('reference/') && !scene.photo.includes('..') && /^[a-z0-9/_-]+\.(jpg|jpeg|png|webp)$/i.test(scene.photo);
  const safeExternalPhoto = /^https:\/\/(media\.techz\.vn|danviet\.ex-cdn\.com|upload\.wikimedia\.org)\/[a-z0-9/_?=&.%+-]+$/i.test(scene.photo);
  const safeUserReferencePhoto = /^https:\/\/[a-z0-9-]+\.edgeone\.dev\/?$/i.test(scene.photo);
  if (scene.photo && !safeReferencePhoto && !safeExternalPhoto && !safeUserReferencePhoto) throw new Error('Scene ' + scene.number + ' **Ảnh tư liệu:** must be a safe reference path or an HTTPS URL from an approved image host.');
  if (scene.photoLabel && !scene.photo) throw new Error('Scene ' + scene.number + ' has **Nhãn ảnh:** but no **Ảnh tư liệu:**.');
  if (scene.photoCaption && !scene.photo) throw new Error('Scene ' + scene.number + ' has **Chú thích ảnh:** but no **Ảnh tư liệu:**.');
  if (scene.world && !['alley','archive','map','teahouse','historic','countryside','modern','interior','meeting','courtroom','investigation','printing','community','checklist','timeline','generic'].includes(scene.world)) throw new Error('Scene ' + scene.number + ' has an unsupported **Loại cảnh:**.');
  if (!['main-boy','none'].includes(scene.character)) throw new Error('Scene ' + scene.number + ' **Nhân vật:** must be main-boy or none.');
  if (scene.expression && !['happy','sad','surprised','angry','worried','neutral'].includes(scene.expression)) throw new Error('Scene ' + scene.number + ' **Biểu cảm:** must be happy, sad, surprised, angry, worried, or neutral.');
  if (scene.ttsCue) {
    const cue = scene.ttsCue.match(/^(chuckle|sigh|clear-throat)\s*\|\s*(.+)$/i);
    if (!cue || !scene.narration.toLowerCase().includes(cue[2].trim().toLowerCase())) throw new Error('Scene ' + scene.number + ' **TTS cue:** must be chuckle|, sigh|, or clear-throat| followed by an exact phrase from **Lời dẫn:**.');
  }
  if (scene.breathAfter && !scene.narration.toLowerCase().includes(scene.breathAfter.toLowerCase())) throw new Error('Scene ' + scene.number + ' **Hơi thở sau:** must be an exact phrase from **Lời dẫn:**.');
}
const parseDuration = (value, narration = '') => {
  if (!value) {
    const words = narration.trim().split(/\s+/).filter(Boolean).length;
    const seconds = Math.max(5, Math.ceil(words / 2.6 + 2));
    return seconds * 30;
  }
  const seconds = value.match(/(\d+(?:[.,]\d+)?)\s*(?:s|giây|seconds?)\b/i);
  const frames = value.match(/(\d+)\s*(?:f|frame|frames)\b/i);
  const minutes = value.match(/(\d+(?:[.,]\d+)?)\s*(?:phút|minutes?)\b/i);
  if (frames) return Math.max(30, Number(frames[1]));
  if (minutes) return Math.max(30, Math.round(Number(minutes[1].replace(',', '.')) * 60 * 30));
  if (seconds) return Math.max(30, Math.round(Number(seconds[1].replace(',', '.')) * 30));
  throw new Error('Invalid **Thời lượng:**. Use e.g. 6s, 180f, or 1 phút.');
};
// "test" is a strict first-10-scenes preview. "breath-test" adds only scenes
// carrying a recorded-breath marker, so the breath path is exercised without a full pilot.
const selected = mode === 'test'
  ? scenes.slice(0, 10)
  : mode === 'breath-test'
    ? [...scenes.slice(0, 10), ...scenes.slice(10).filter((scene) => scene.breathAfter)]
    : scenes;
let nextStartFrame = 0;
const withTiming = selected.map((scene) => {
  const durationInFrames = parseDuration(scene.duration, scene.narration);
  const timedScene = {...scene, startTimeInFrames: nextStartFrame, durationInFrames};
  nextStartFrame += durationInFrames;
  return timedScene;
});
const voiceover = markdown.match(/^\*\*Giọng đọc:\*\*[ \t]*([^\r\n]*)$/m)?.[1]?.trim() ?? '';
const music = markdown.match(/^\*\*Nhạc nền:\*\*[ \t]*([^\r\n]*)$/m)?.[1]?.trim() ?? '';
for (const [label, file] of [['Giọng đọc', voiceover], ['Nhạc nền', music]]) {
  if (file && (!file.startsWith('audio/') || file.includes('..') || !/\.(mp3|wav|m4a|aac|ogg)$/i.test(file))) throw new Error(label + ' must be a safe audio/<filename> path inside template/public/.');
  if (file && !fs.existsSync(path.resolve('template/public', file))) throw new Error(label + ' file not found: template/public/' + file);
}
const props = {
  title,
  mode,
  framesPerScene: 150,
  scenes: withTiming,
  totalFrames: withTiming.reduce((sum, scene) => sum + scene.durationInFrames, 0),
  voiceover,
  music,
  source: script,
  totalScenes: scenes.length,
};
fs.mkdirSync(path.dirname(output), {recursive: true});
fs.writeFileSync(output, JSON.stringify(props, null, 2) + '\n');
console.log('Validated ' + selected.length + '/' + scenes.length + ' scenes from ' + script + '; wrote ' + output);
