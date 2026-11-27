#!/usr/bin/env node
/**
 * Download the nine user-supplied documentary reference photos from Dropbox.
 * The source list is allow-listed in the episode manifest. Files are validated
 * as JPEGs before they are copied into the Remotion public directory.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';

const manifestPath = path.resolve('reference-images/episodes/02-sau-canh-cua-bi-mat/manifest.json');
const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
const canonicalDir = path.resolve(manifest.root);
const publicDir = path.resolve('template/public/reference');
await fs.mkdir(canonicalDir, {recursive: true});
await fs.mkdir(publicDir, {recursive: true});

const assets = manifest.assets.filter(asset => asset.source_url && asset.file && asset.status === 'download-on-render');
if (assets.length !== 9) {
  throw new Error('Expected exactly nine allow-listed Dropbox reference images; found ' + assets.length);
}
const validateJpeg = (bytes, file) => {
  if (bytes.length < 8_000 || bytes.length > 20 * 1024 * 1024) {
    throw new Error(file + ' has an implausible size (' + bytes.length + ' bytes).');
  }
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8 || bytes[2] !== 0xff) {
    throw new Error(file + ' is not a JPEG (invalid file signature; Dropbox may have returned HTML).');
  }
  if (bytes[bytes.length - 2] !== 0xff || bytes[bytes.length - 1] !== 0xd9) {
    throw new Error(file + ' is a truncated JPEG (missing end marker).');
  }
};

for (const asset of assets) {
  const canonicalPath = path.join(canonicalDir, asset.file);
  const publicPath = path.join(publicDir, asset.file);
  const url = new URL(asset.source_url);
  if (url.hostname !== 'www.dropbox.com' || !url.pathname.includes('/scl/fi/')) {
    throw new Error('Refusing non-Dropbox source for ' + asset.file);
  }
  url.searchParams.set('dl', '1');

  let bytes = null;
  let lastError = null;
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const response = await fetch(url, {
        headers: {'user-agent': 'video-shotcraft-reference-import/1.0'},
        redirect: 'follow',
      });
      if ((response.status === 429 || response.status >= 500) && attempt < 4) {
        const retryAfter = Number(response.headers.get('retry-after'));
        const delay = Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 1200 * (2 ** attempt);
        console.warn('Dropbox returned HTTP ' + response.status + ' for ' + asset.file + '; retrying in ' + delay + 'ms');
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      if (!response.ok) throw new Error('Dropbox returned HTTP ' + response.status + ' for ' + asset.file);
      const candidate = Buffer.from(await response.arrayBuffer());
      validateJpeg(candidate, asset.file);
      bytes = candidate;
      break;
    } catch (error) {
      lastError = error;
      if (attempt === 4) break;
      if (/invalid file signature|truncated JPEG|implausible size|Refusing non-Dropbox/.test(String(error))) throw error;
      const delay = 1000 * (attempt + 1);
      console.warn('Download attempt ' + (attempt + 1) + ' failed for ' + asset.file + ': ' + error.message);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  if (!bytes) throw new Error('Could not download ' + asset.file + ': ' + (lastError?.message || 'unknown error'));

  const sha256 = createHash('sha256').update(bytes).digest('hex');
  await fs.writeFile(canonicalPath, bytes);
  await fs.copyFile(canonicalPath, publicPath);
  asset.status = 'downloaded-jpeg-validated';
  asset.bytes = bytes.length;
  asset.sha256 = sha256;
  console.log('Verified ' + asset.file + ' (' + bytes.length + ' bytes; SHA-256 ' + sha256 + ')');
}

await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
console.log('Imported ' + assets.length + ' JPEG reference images into ' + manifest.root);
console.log('Copied render-ready images into template/public/reference/');
