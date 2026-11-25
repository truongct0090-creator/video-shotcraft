#!/usr/bin/env node
/**
 * Fetch only the two pre-reviewed, public-domain archival images used by the
 * starter episode. URLs are fixed allow-listed Wikimedia Commons originals.
 * No user script or external input can choose an arbitrary download URL.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';

const outputDir = path.resolve('template/public/reference');
const assets = [
  {
    file: 'cochinchina-map.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Map_of_Cochinchina.jpg',
    minBytes: 100_000,
    maxBytes: 8_000_000,
    sha1: null,
  },
  {
    file: 'nguyen-an-ninh-1929.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/8/84/Portrait_of_Nguy%E1%BB%85n_An_Ninh.jpg',
    minBytes: 50_000,
    maxBytes: 500_000,
    sha1: null,
  },
  {
    file: 'saigon-maison-centrale.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/5/5b/Saigon._Maison_Centrale.jpg',
    minBytes: 50_000,
    maxBytes: 2_000_000,
    sha1: '52dd6f45a7ea181e9b325930a158fdf31d8b6403',
  },
];

await fs.mkdir(outputDir, {recursive: true});
for (const asset of assets) {
  const response = await fetch(asset.url, {
    headers: {'user-agent': 'video-shotcraft-story-render/1.0 (archival-image attribution in repository)'},
    redirect: 'follow',
  });
  if (!response.ok) throw new Error('Could not fetch ' + asset.file + ': HTTP ' + response.status);
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.toLowerCase().includes('image/jpeg')) {
    throw new Error('Unexpected content type for ' + asset.file + ': ' + contentType);
  }
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length < asset.minBytes || bytes.length > asset.maxBytes) {
    throw new Error('Unexpected file size for ' + asset.file + ': ' + bytes.length);
  }
  const signature = bytes.subarray(0, 3).toString('hex');
  if (signature !== 'ffd8ff') throw new Error('Downloaded file is not a JPEG: ' + asset.file);
  const sha1 = createHash('sha1').update(bytes).digest('hex');
  if (asset.sha1 && sha1 !== asset.sha1) {
    throw new Error('SHA-1 mismatch for ' + asset.file + ': ' + sha1);
  }
  await fs.writeFile(path.join(outputDir, asset.file), bytes);
  console.log('Verified ' + asset.file + ' (' + bytes.length + ' bytes; SHA-1 ' + sha1 + ')');
}
