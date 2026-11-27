#!/usr/bin/env node
/**
 * Fail the render before Remotion if any scene reference photo is missing,
 * invalid, remote, or inconsistent with the user-supplied episode manifest.
 */
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';

const script = process.env.STORY_SCRIPT ?? 'story_scripts/02-sau-canh-cua-bi-mat.md';
const manifestPath = 'reference-images/episodes/02-sau-canh-cua-bi-mat/manifest.json';
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const markdown = fs.readFileSync(script, 'utf8').replace(/^\uFEFF/, '');
const publicRoot = path.resolve('template/public/reference');
const assets = manifest.assets.filter((asset) => asset.file && asset.source_url);
const byFile = new Map(assets.map((asset) => [asset.file, asset]));

const verifyJpeg = (file, expectedHash) => {
  const absolute = path.resolve('template/public', file);
  if (!absolute.startsWith(publicRoot + path.sep)) {
    throw new Error('Reference photo must be inside template/public/reference/: ' + file);
  }
  if (!fs.existsSync(absolute)) throw new Error('Missing user-supplied reference photo: ' + file);
  const bytes = fs.readFileSync(absolute);
  if (bytes.length < 8000 || bytes.length > 20 * 1024 * 1024) {
    throw new Error('Reference photo has an implausible size: ' + file + ' (' + bytes.length + ' bytes)');
  }
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8 || bytes[2] !== 0xff ||
      bytes[bytes.length - 2] !== 0xff || bytes[bytes.length - 1] !== 0xd9) {
    throw new Error('Reference photo is not a complete JPEG: ' + file);
  }
  const hash = createHash('sha256').update(bytes).digest('hex');
  if (expectedHash && hash !== expectedHash) {
    throw new Error('Reference photo SHA-256 does not match manifest: ' + file);
  }
};

const sceneBlocks = [...markdown.matchAll(/^###\s+(\d{1,2})\.\s+(.+?)\s*$/gm)];
const scenePhotos = [];
for (let i = 0; i < sceneBlocks.length; i++) {
  const start = sceneBlocks[i].index + sceneBlocks[i][0].length;
  const end = sceneBlocks[i + 1]?.index ?? markdown.length;
  const block = markdown.slice(start, end).split(/^##\s+/m)[0];
  const photo = block.match(/^\*\*Ảnh tư liệu:\*\*\s*(.+)$/m)?.[1]?.trim();
  if (!photo) continue;
  if (!photo.startsWith('reference/') || /^https?:/i.test(photo) || photo.includes('..')) {
    throw new Error('Scene ' + sceneBlocks[i][1] + ' must use a local, validated reference/ image path: ' + photo);
  }
  const file = path.basename(photo);
  const asset = byFile.get(file);
  if (!asset) throw new Error('Scene ' + sceneBlocks[i][1] + ' photo is not listed in the user-supplied manifest: ' + file);
  verifyJpeg(photo, asset.sha256);
  scenePhotos.push({scene: sceneBlocks[i][1], file});
}

const opening = [
  ['opening-hoi-thanh-duc-chua-troi-me', 'scene-04-reference.jpg'],
  ['opening-tinh-that-bong-lai', 'scene-08-reference.jpg'],
  ['opening-dao-ha-mon', 'scene-14-reference.jpg'],
  ['opening-duong-van-minh', 'scene-22-reference.jpg'],
];
for (const [id, file] of opening) {
  const entry = manifest.assets.find((asset) => asset.id === id);
  if (!entry || entry.status !== 'reuse' || entry.file !== file) {
    throw new Error('Opening photo mapping is incorrect for ' + id + '; expected ' + file);
  }
  const source = fs.readFileSync(path.resolve('template/src/story/SceneStage.tsx'), 'utf8');
  if (!source.includes("reference/" + file)) {
    throw new Error('Opening collage does not reference supplied photo ' + file);
  }
  verifyJpeg('reference/' + file, byFile.get(file)?.sha256);
}

if (scenePhotos.length !== 9) {
  throw new Error('Expected 9 scene-level supplied reference photos, found ' + scenePhotos.length);
}
console.log('Verified ' + scenePhotos.length + ' scene photos and all 4 supplied opening photos against the manifest.');
