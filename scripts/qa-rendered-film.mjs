#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';

const files = process.argv.slice(2);
if (files.length < 2) {
  throw new Error('Usage: node scripts/qa-rendered-film.mjs <film.mp4> <animatic.mp4>');
}
const parseRate = (value = '0/1') => {
  const [n, d] = value.split('/').map(Number);
  return d ? n / d : 0;
};
const inspect = (file, requireAudio) => {
  if (!fs.existsSync(file)) throw new Error('Render output missing: ' + file);
  const stat = fs.statSync(file);
  if (stat.size < 10_000) throw new Error('Render output is unexpectedly small: ' + file);
  const raw = execFileSync('ffprobe', [
    '-v', 'error', '-show_entries',
    'format=duration,size:stream=codec_type,codec_name,width,height,r_frame_rate,avg_frame_rate',
    '-of', 'json', file,
  ], {encoding: 'utf8'});
  const probe = JSON.parse(raw);
  const video = probe.streams?.find((stream) => stream.codec_type === 'video');
  const audio = probe.streams?.find((stream) => stream.codec_type === 'audio');
  const duration = Number(probe.format?.duration ?? 0);
  const fps = parseRate(video?.avg_frame_rate || video?.r_frame_rate);
  const errors = [];
  if (!video) errors.push('no video stream');
  if (video && video.codec_name !== 'h264') errors.push('expected H.264 video, got ' + video.codec_name);
  if (video && (video.width !== 1920 || video.height !== 1080)) errors.push('expected 1920x1080, got ' + video.width + 'x' + video.height);
  if (video && Math.abs(fps - 30) > 0.01) errors.push('expected 30fps, got ' + fps);
  if (!duration || duration <= 0) errors.push('invalid duration');
  if (requireAudio && !audio) errors.push('film has no audio stream; expected transition SFX or supplied audio');
  if (errors.length) throw new Error(file + ': ' + errors.join('; '));
  return {
    file: path.basename(file),
    bytes: stat.size,
    durationSeconds: Number(duration.toFixed(3)),
    width: video.width,
    height: video.height,
    fps: Number(fps.toFixed(3)),
    videoCodec: video.codec_name,
    audioCodec: audio?.codec_name ?? null,
    hasAudio: Boolean(audio),
    status: 'passed',
  };
};
const results = [
  inspect(files[0], true),
  inspect(files[1], false),
];
const report = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  checks: ['file-exists', 'non-empty-output', 'video-stream', 'h264-codec', '1920x1080', '30fps', 'positive-duration', 'film-audio-stream'],
  outputs: results,
  status: 'passed',
};
const out = path.resolve(path.dirname(files[0]), 'render-qa.json');
fs.mkdirSync(path.dirname(out), {recursive: true});
fs.writeFileSync(out, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
