#!/usr/bin/env node
/**
 * Asset-first audit for the animation workshop.
 * This script never generates art or downloads media: it inventories what is
 * already in the repository and proposes reusable shot recipes for review.
 */
import fs from 'node:fs';
import path from 'node:path';

const args = Object.fromEntries(process.argv.slice(2).map((arg) => {
  const i = arg.indexOf('=');
  return i < 0 ? [arg.replace(/^--/, ''), 'true'] : [arg.slice(2, i), arg.slice(i + 1)];
}));
const script = args.script ?? 'story_scripts/01-nhung-hoi-kin-tung-lam-mua-lam-gio-o-viet-nam.md';
const output = args.output ?? 'template/out/animation-asset-audit.json';
const root = process.cwd();
const safe = (p) => path.resolve(root, p);
if (!script.startsWith('story_scripts/') || !script.endsWith('.md') || !safe(script).startsWith(safe('story_scripts') + path.sep)) {
  throw new Error('script must be a Markdown file inside story_scripts/.');
}
if (!fs.existsSync(safe(script))) throw new Error('Script not found: ' + script);
const readJson = (p) => JSON.parse(fs.readFileSync(safe(p), 'utf8'));
const markdown = fs.readFileSync(safe(script), 'utf8').replace(/^\uFEFF/, '');
const headings = [...markdown.matchAll(/^###\s+(\d{1,2})\.\s+(.+?)\s*$/gm)];
if (!headings.length) throw new Error('No scenes found (expected ### 01. Scene name).');
const clean = (v = '') => v.replace(/\r/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[*_`]/g, '').trim();
const scenes = headings.map((m, i) => {
  const body = markdown.slice(m.index + m[0].length, headings[i + 1]?.index ?? markdown.length).split(/^##\s+/m)[0];
  const field = (label) => {
    const rx = new RegExp('^\\*\\*' + label.replaceAll('/', '\\/') + ':\\*\\*\\s*([\\s\\S]*?)(?=^\\*\\*[^*]+:\\*\\*|(?![\\s\\S]))', 'm');
    return clean(body.match(rx)?.[1] ?? '');
  };
  return {number: Number(m[1]), title: clean(m[2]), setting: field('Bối cảnh'), action: field('Hành động'), narration: field('Lời dẫn'), character: field('Nhân vật'), props: field('Đạo cụ'), shot: field('Shot'), duration: field('Thời lượng'), world: field('Loại cảnh').toLowerCase()};
});
const library = readJson('gallery/api/library.json');
const cards = library.cards ?? [];
const tokenize = (s) => new Set((s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').match(/[a-z0-9-]{3,}/g) ?? []).filter((x) => !['cảnh','nhân','vật','bối','cảnh','hành','động','lời','dẫn','the','and','with','from'].includes(x)));
const ranked = (scene) => {
  const terms = tokenize([scene.title, scene.setting, scene.action, scene.narration].join(' '));
  return cards.map((card) => {
    const corpus = tokenize([card.name, card.summary, card.use, card.intention, ...(card.tags ?? [])].join(' '));
    const overlap = [...terms].filter((term) => corpus.has(term));
    return {name: card.name, category: card.category, source: card.source, score: overlap.length, matchedTerms: overlap};
  }).filter((x) => x.score > 0).sort((a,b) => b.score-a.score || a.name.localeCompare(b.name)).slice(0,5);
};
const walk = (dir, base = dir, out = []) => {
  if (!fs.existsSync(safe(dir))) return out;
  for (const item of fs.readdirSync(safe(dir), {withFileTypes:true})) {
    const rel = path.posix.join(base, item.name);
    if (item.isDirectory()) {
      if (!['node_modules','.git','out','dist','build'].includes(item.name)) walk(path.posix.join(dir,item.name), base, out);
    } else out.push(rel);
  }
  return out;
};
const allPaths = [...new Set(['assets','template/public','template/src','demos','videos'].flatMap((d)=>walk(d)))].sort();
const media = allPaths.filter((p)=>/\.(png|jpe?g|webp|gif|mp4|mov|mp3|wav|ogg|svg)$/i.test(p));
const characterSources = allPaths.filter((p)=>/(character|chibi|avatar|puppet|rig)/i.test(p) && /\.(tsx?|json|svg|png|webp)$/i.test(p));
const chooseSceneTemplate = (scene) => {
  if (['alley','archive','map','teahouse','historic','countryside','modern','interior','generic'].includes(scene.world)) return scene.world;
  const s = [scene.setting, scene.action, scene.title].join(' ').toLowerCase();
  if (/bản đồ|địa danh|đường dây|mốc thời gian/.test(s)) return 'map';
  if (/hồ sơ|phòng hồ sơ|bảng ghim|tài liệu|văn bản|báo chí|bàn làm việc/.test(s)) return 'archive';
  if (/quán trà|đèn dầu|bàn gỗ|người hoa/.test(s)) return 'teahouse';
  if (/hẻm|con hẻm|cửa khép|cánh cửa|đêm/.test(s)) return 'alley';
  if (/điện thoại|cà phê|thành phố hiện đại|tin nhắn|mạng xã hội/.test(s)) return 'modern';
  if (/ruộng|đồng|làng|cây|sông|vườn|nông thôn/.test(s)) return 'countryside';
  if (/sài gòn|nam kỳ|pháp thuộc|1916|thập niên 1920|khám lớn|phố xưa|lịch sử/.test(s)) return 'historic';
  if (/phòng|buổi họp|cuộc gặp|nhà|nội thất/.test(s)) return 'interior';
  return 'generic';
};
const sceneResults = scenes.map((scene) => {
  const candidates = ranked(scene);
  const explicit = scene.shot ? cards.find((c)=>c.name === scene.shot || c.styles?.some((s)=>s.key===scene.shot)) : null;
  return {
    ...scene,
    reuseDecision: explicit ? 'explicit-library-match' : candidates.length ? 'candidate-library-match-review-required' : 'no-obvious-motion-recipe-match',
    selectedShot: explicit ? explicit.name : null,
    candidateShots: explicit ? [] : candidates,
    createNewSceneOnlyIfNoSuitableLibraryScene: null,
    requiresHumanLibraryReview: !explicit,
    sceneBackgroundPlan: {
      template: chooseSceneTemplate(scene),
      source: 'template/src/story/SceneStage.tsx',
      type: 'reusable-vector-stage',
      rationale: 'The repository media inventory contains no verified story-specific background for this scene. Reuse the existing MainBoy rig and motion helpers; use this reusable vector stage as the fallback. Review candidate library shots before commissioning new artwork.',
    },
  };
});
const report = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  source: script,
  library: {cardCount: cards.length, categories: library.categories ?? [], revision: library.revision ?? null},
  inventory: {
    mediaFileCount: media.length,
    mediaFiles: media,
    storyBackgroundAssets: media.filter((p) => /\.(png|jpe?g|webp|svg)$/i.test(p) && /(background|backdrop|environment|scene|location)/i.test(p)),
    characterSourceCount: characterSources.length,
    characterSources,
    knownReusableCharacters: [
      {id:'main-boy', source:'template/src/chibi/MainBoy.tsx', kind:'Remotion SVG character component', capabilities:['blink','idle-bob','happy','sad','surprised','angry','worried','neutral','wave','point','mouth-shapes']},
      {id:'chibi-demo', source:'template/src/chibi/ChibiDemo.tsx', kind:'existing character demo composition'},
    ],
    knownReusableMotionLibrary: 'references/shots/ (124 recipe cards; source implementations in demos/ and assets/lib/)',
    knownReusableAudio: media.filter((p)=>p.startsWith('assets/audio/') || p.startsWith('template/public/audio/')),
  },
  scenes: sceneResults,
  policy: {
    noNewMediaGenerated: true,
    noMediaDownloaded: true,
    sceneTemplateSelectionIsReusable: true,
    storyBackgroundAssetSearch: 'Scanned existing image assets by file type and background/environment naming; all candidates still require visual review.',
    candidatesRequireHumanReview: true,
    unmatchedScenesAreNotAutomaticallyApprovedForNewArtwork: true,
    createNewSceneOnlyWhenNoSuitableLibrarySceneExists: true,
    note: 'A text/keyword match is only a candidate. Review the recipe source and demo before deciding suitability; this audit never claims that a motion recipe is a complete illustrated background or character scene.',
  },
};
fs.mkdirSync(path.dirname(safe(output)), {recursive:true});
fs.writeFileSync(safe(output), JSON.stringify(report,null,2)+'\n');
console.log(`Audited ${scenes.length} scenes; ${cards.length} motion recipes; ${media.length} media files. Wrote ${output}`);
for (const s of sceneResults) console.log(`#${s.number} ${s.title}: ${s.reuseDecision}${s.selectedShot ? ' → '+s.selectedShot : s.candidateShots[0] ? ' (top candidate: '+s.candidateShots[0].name+')' : ''}`);
