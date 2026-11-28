#!/usr/bin/env node
import fs from 'node:fs';
const script=process.env.STORY_SCRIPT??'story_scripts/02-sau-canh-cua-bi-mat.md';
const lines=fs.readFileSync(script,'utf8').split('\n');
const heads=[];
for(let i=0;i<lines.length;i++) if(lines[i].startsWith('### ')){
 const rest=lines[i].slice(4),dot=rest.indexOf('. ');
 if(dot>0) heads.push({number:rest.slice(0,dot).padStart(2,'0'),title:rest.slice(dot+2),line:i});
}
if(heads.length!==32) throw new Error('Expected 32 approved scenes, found '+heads.length);
const special=new Set(['01','02','04','08','23','32']);
const expectedCast={'13':'child-standing-center','15':'adult-seated-left, adult-seated-right','16':'adult-standing-center, adult-seated-left, adult-seated-right','20':'adult-standing-left, adult-turning-center, adult-standing-right','26':'adult-seated-left, adult-seated-right'};
const allowed=new Set(['alley','archive','map','teahouse','historic','countryside','modern','interior','meeting','courtroom','investigation','printing','community','checklist','timeline','family-home','statistics-room','community-room','mountain-village','funeral-house','research-room','social-media']);
const counts=new Map(),photos=new Map();
for(let i=0;i<heads.length;i++){
 const h=heads[i],n=h.number,block=lines.slice(h.line+1,heads[i+1]?.line??lines.length);
 const get=name=>{const prefix='**'+name+':**';const row=block.find(x=>x.startsWith(prefix));return row?row.slice(prefix.length).trim():'';};
 const setting=get('Bối cảnh'),action=get('Hành động'),props=get('Đạo cụ'),objectKey=get('Mã vật thể').toLowerCase(),narration=get('Lời dẫn'),world=get('Loại cảnh').toLowerCase(),cast=get('Bóng đen').toLowerCase()||'none',photo=get('Ảnh tư liệu');
 if(!setting||!action||!props||!narration||!objectKey) throw new Error('Scene '+n+' is missing setting/action/props/object key/narration.');
 const objectRenderers=new Set(['none','evidence-board','family-table','stats-board','rights-board','route-map','documents','compare','school-protection','testimony','legal-case','two-column','mountain-timeline','funeral-house','village-house','research-stack','community-legacy','three-questions','pitch','checklist','social-feed','source-library','satire-boundary']);
 if(!objectRenderers.has(objectKey)) throw new Error('Scene '+n+' has no approved object renderer: '+objectKey);
 if(!special.has(n)){if(!allowed.has(world)) throw new Error('Scene '+n+' needs a specific backdrop type.');counts.set(world,(counts.get(world)||0)+1);}
 if(setting.toLowerCase().includes('phòng xử')&&world!=='courtroom') throw new Error('Scene '+n+' must use a courtroom backdrop.');
 if(photo){if(photos.has(photo)) throw new Error('Scene-level photo reused in scenes '+photos.get(photo)+' and '+n+': '+photo);photos.set(photo,n);}
 if(expectedCast[n]&&cast!==expectedCast[n]) throw new Error('Scene '+n+' silhouette plan mismatch: '+cast);
 if(!expectedCast[n]&&cast!=='none') throw new Error('Scene '+n+' has an unapproved silhouette.');
 if(cast!=='none'){
  for(const actor of cast.split(',')){
   const parts=actor.trim().split('-');
   if(parts.length!==3||!['adult','child'].includes(parts[0])||!['standing','seated','turning'].includes(parts[1])||!['left','center','right'].includes(parts[2])) throw new Error('Scene '+n+' has invalid silhouette size/pose/position.');
  }
 }
}
for(const [world,count] of counts) if(count>4) throw new Error('Backdrop '+world+' is repeated in '+count+' scenes.');
const stage=fs.readFileSync('template/src/story/SceneStage.tsx','utf8');
const cast=fs.readFileSync('template/src/story/SceneSupportingCast.tsx','utf8');
const chibi=fs.readFileSync('template/src/chibi/ChibiSupportingCharacter.tsx','utf8');
const rig=fs.readFileSync('template/src/chibi/CharacterRig.tsx','utf8');
const mainBoy=fs.readFileSync('template/src/chibi/MainBoy.tsx','utf8');
const motion=fs.readFileSync('template/src/chibi/CharacterMotion.ts','utf8');
if(!stage.includes(".toLocaleUpperCase('vi-VN')")||!stage.includes('wrapVisualText(label,captionMaxChars)')) throw new Error('Captions must be uppercase and wrapped to their available width.');
if(!stage.includes('lineHeight:1.24')||!stage.includes('captionFontSize=hasPhoto?44:56')) throw new Error('Caption line spacing and font sizing must remain consistent.');
if(!stage.includes('!/tái'+String.fromCharCode(92)+'s*hiện|lời'+String.fromCharCode(92)+'s*kể/i.test(label)')) throw new Error('Editorial reconstruction labels must not appear as viewer captions.');
if(!stage.includes("background:whiteStage?((scene.number===23||scene.number===32)?'#243b3b':'#ffffff')")) throw new Error('White-stage scenes must use a pure white background.');
if(!stage.includes("background:'transparent'")) throw new Error('Scene 2 must not overlay a warm tint on its white stage.');
if(!stage.includes("textTransform:'none'")||!stage.includes("'Ảnh minh hoạ'")) throw new Error('Exact-case photo-label exception is missing.');
for(const w of ['courtroom','family-home','statistics-room','community-room','mountain-village','funeral-house','research-room','social-media']) if(!stage.includes("world==='"+w+"'")) throw new Error('Missing scene-specific backdrop '+w);
if(!cast.includes('child?112:165')||!cast.includes("scene.supportingCast==='none'")||!cast.includes("pose==='seated'")) throw new Error('Silhouette size/opt-in/pose logic is missing.');
if(!chibi.includes("pose==='seated'")) throw new Error('Seated character rig is missing.');
if(!rig.includes('export type CharacterRigPose')||!rig.includes('leftShoulder')||!rig.includes('leftHip')||!rig.includes('visible = false')) throw new Error('Reusable hidden skeleton rig foundation is missing.');
if(!mainBoy.includes('resolveRigPose(rig)')||!mainBoy.includes('rigPose.leftKnee')||!mainBoy.includes('rigPose.leftElbow')||!mainBoy.includes('RigSkeleton visible={debugRig}')) throw new Error('MainBoy joints are not connected to the hidden rig.');
if(!chibi.includes('resolveRigPose(rig)')||!chibi.includes('rigPose.leftShoulder')||!chibi.includes('rigPose.rightHip')||!chibi.includes('RigSkeleton visible={debugRig}')) throw new Error('Supporting character joints are not connected to the hidden rig.');
if(!stage.includes('buildMainBoyPerformance')||!stage.includes('rig={{...performanceRig')) throw new Error('Speech-aware MainBoy performance is not wired into scene rendering.');
if(!motion.includes('anticipation')||!motion.includes('buildMainBoyPerformance')||!motion.includes('SupportingMotion')||!motion.includes('inferSupportingMotion')) throw new Error('Procedural character motion engine is incomplete.');
for(const action of ['walking','jumping','kneeling','bowing']) if(!motion.includes(action)) throw new Error('Missing supporting motion: '+action);
if(!cast.includes('buildSupportingPose')||!cast.includes('inferSupportingMotion')||!cast.includes('durationInFrames')) throw new Error('Contextual supporting-character animation is not wired.');
if(!chibi.includes("pose==='kneeling'")) throw new Error('Supporting-character kneeling pose is missing.');
if(!motion.includes('args.speakingLevel')||!stage.includes('speakingLevel});')) throw new Error('MainBoy gesture intensity must follow the voice track.');
if(!mainBoy.includes('rotate(${rigPose.leftKnee} 266 642)')||!chibi.includes('rotate(${rigPose.leftKnee} -65 -95)')) throw new Error('Legs must have independent knee pivots, not foot-only rotation.');
if(!cast.includes("activeMotion==='walking'")||!cast.includes('rootX=-72+144')) throw new Error('Walking motion must travel through the scene, not run in place.');
if(!stage.includes("visualKey=scene.objectKey&&scene.objectKey!=='auto'?scene.objectKey:inferredVisualKey")) throw new Error('Scene-specific object keys are not authoritative.');
if(!stage.includes("visualKey==='evidence-board'")) throw new Error('Scene 03 evidence board renderer is missing.');
console.log('Scene design QA passed: 32 scenes, specific backdrops, no unintended scene-photo reuse, explicit silhouettes, uppercase captions, and four-word line wrapping.');
