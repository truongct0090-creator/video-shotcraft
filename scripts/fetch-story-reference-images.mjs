#!/usr/bin/env node
/**
 * Fetch only the pre-reviewed archival reference image used by the
 * currently approved 32-scene episode. Add another entry only when a script uses it. URLs are fixed allow-listed Wikimedia Commons originals.
 * No user script or external input can choose an arbitrary download URL.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';

const outputDir = path.resolve('template/public/reference');
const assets = [
  {
    file: 'kon-tum-city-1972.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/f/f6/Kon_Tum_City%2C_Viet_Nam_1972.jpg',
    minBytes: 350_000,
    maxBytes: 550_000,
  },
  {
    file: 'church-of-god-singapore.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/f/f5/World_Mission_Society_Church_of_God%2C_Singapore_%282025%29_-_img_01.jpg',
    minBytes: 1_000_000,
    maxBytes: 3_500_000,
    sha1: 'be5d04c6ac94141ca0548c51ca0126052827532a',
  },
];

await fs.mkdir(outputDir, {recursive: true});
const isValidImage = (bytes, asset) => {
  if (bytes.length < asset.minBytes || bytes.length > asset.maxBytes) return false;
  if (bytes.subarray(0, 3).toString('hex') !== 'ffd8ff') return false;
  const sha1 = createHash('sha1').update(bytes).digest('hex');
  return !asset.sha1 || sha1 === asset.sha1;
};
for (const asset of assets) {
  const target = path.join(outputDir, asset.file);
  try {
    const cached = await fs.readFile(target);
    if (isValidImage(cached, asset)) {
      console.log('Reused verified ' + asset.file + ' (' + cached.length + ' bytes)');
      continue;
    }
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }

  let bytes = null;
  for (let attempt = 0; attempt < 5; attempt++) {
    const response = await fetch(asset.url, {
      headers: {'user-agent': 'video-shotcraft-story-render/1.0 (+https://github.com/truongct0090-creator/video-shotcraft; archival image attribution in repository)'},
      redirect: 'follow',
    });
    if ((response.status === 429 || response.status >= 500) && attempt < 4) {
      const retryAfter = Number(response.headers.get('retry-after'));
      const delayMs = Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 1500 * (2 ** attempt);
      console.warn('Wikimedia returned HTTP ' + response.status + ' for ' + asset.file + '; retrying in ' + delayMs + 'ms');
      await new Promise(resolve => setTimeout(resolve, delayMs));
      continue;
    }
    if (!response.ok) throw new Error('Could not fetch ' + asset.file + ': HTTP ' + response.status);
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.toLowerCase().includes('image/jpeg')) {
      throw new Error('Unexpected content type for ' + asset.file + ': ' + contentType);
    }
    bytes = Buffer.from(await response.arrayBuffer());
    break;
  }
  if (!bytes) throw new Error('Could not download ' + asset.file + ' after retrying Wikimedia rate limits.');
  if (!isValidImage(bytes, asset)) throw new Error('Downloaded image failed size, JPEG signature or SHA-1 validation: ' + asset.file);
  const sha1 = createHash('sha1').update(bytes).digest('hex');
  await fs.writeFile(target, bytes);
  console.log('Verified ' + asset.file + ' (' + bytes.length + ' bytes; SHA-1 ' + sha1 + ')');
}
