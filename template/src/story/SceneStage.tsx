import React from 'react';
import {Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {MainBoy, type BoyExpression, type BoyGesture} from '../chibi/MainBoy';
import type {CharacterRigPose} from '../chibi/CharacterRig';
import {buildMainBoyPerformance} from '../chibi/CharacterMotion';
import {SceneAssetLayer} from './SceneAssetLayer';
import {SceneSupportingCast} from './SceneSupportingCast';


export type FilmSceneData = {
  number:number; heading:string; setting:string; action:string; narration:string;
  audio:string; durationInFrames:number; startTimeInFrames?:number; world?:string; character?:string; voiceover?:string; props?:string; objectKey?:string; shot?:string; mouthFrames?:number[];
  stage?:'white-intro'|'white-photo'|'white-title'|'normal'; photo?:string; photoCaption?:string; photoLabel?:string; cardTitle?:string;
  expression?:BoyExpression; supportingCast?:string; rig?:CharacterRigPose; supportingRigs?:CharacterRigPose[]; debugRig?:boolean;
};

type World = 'alley'|'archive'|'map'|'teahouse'|'historic'|'countryside'|'modern'|'interior'|'meeting'|'courtroom'|'investigation'|'printing'|'community'|'checklist'|'timeline'|'generic'|'family-home'|'statistics-room'|'community-room'|'mountain-village'|'funeral-house'|'research-room'|'social-media';
const chooseWorld = (text:string, preferred?:string):World => {
  const s=text.toLowerCase();
  if (preferred && ['alley','archive','map','teahouse','historic','countryside','modern','interior','meeting','courtroom','investigation','printing','community','checklist','timeline','generic','family-home','statistics-room','community-room','mountain-village','funeral-house','research-room','social-media'].includes(preferred)) return preferred as World;
  if (/tòa án|phòng xử|xét xử|thẩm phán|bị cáo|luật sư|phiên tòa/.test(s)) return 'courtroom';
  if (/phòng họp|phòng sinh hoạt|buổi họp|phòng hội nghị/.test(s)) return 'meeting';
  if (/bản đồ|map|địa danh|đường dây|mốc thời gian/.test(s)) return 'map';
  if (/hồ sơ|phòng hồ sơ|bảng ghim|tài liệu|văn bản|báo chí|bàn làm việc/.test(s)) return 'archive';
  if (/quán trà|đèn dầu|bàn gỗ|người hoa/.test(s)) return 'teahouse';
  if (/hẻm|con hẻm|cửa khép|cánh cửa|đêm/.test(s)) return 'alley';
  if (/điện thoại|cà phê|thành phố hiện đại|tin nhắn|mạng xã hội/.test(s)) return 'modern';
  if (/ruộng|đồng|làng|cây|sông|vườn|nông thôn/.test(s)) return 'countryside';
  if (/sài gòn|nam kỳ|pháp thuộc|1916|thập niên 1920|khám lớn|làng quê|phố xưa|lịch sử/.test(s)) return 'historic';
  if (/phòng|buổi họp|cuộc gặp|nhà|nội thất/.test(s)) return 'interior';
  return 'generic';
};

const Backdrop:React.FC<{world:World}> = ({world}) => {
 const sky:Record<World,string>={alley:'#25283b',archive:'#28303a',map:'#e6d9b8',teahouse:'#30251e',historic:'#d8c7a5',countryside:'#d9ebd2',modern:'#b9d9df',interior:'#ded2bf',meeting:'#d7d0c1',courtroom:'#d9d1c4',investigation:'#29343a',printing:'#b99d7a',community:'#d9e0cb',checklist:'#d8dfdc',timeline:'#c8b99d',generic:'#d8d1c3','family-home':'#e7d9c7','statistics-room':'#d7dce0','community-room':'#d8d0bd','mountain-village':'#c8d8c5','funeral-house':'#d1c5ad','research-room':'#d8d0c0','social-media':'#222d38'};
 const ground:Record<World,string>={alley:'#393746',archive:'#46505a',map:'#c3ae83',teahouse:'#57402e',historic:'#9e9b78',countryside:'#83ad79',modern:'#78999a',interior:'#9a8067',meeting:'#8c7964',courtroom:'#5d4636',investigation:'#46504c',printing:'#76583d',community:'#8e9b7c',checklist:'#7e8c86',timeline:'#8c775e',generic:'#9d947f','family-home':'#9c8064','statistics-room':'#77858b','community-room':'#8c7964','mountain-village':'#78936e','funeral-house':'#806b54','research-room':'#796b58','social-media':'#151d27'};
 return <svg viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
  <defs><linearGradient id="film-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={sky[world]}/><stop offset="1" stopColor={ground[world]}/></linearGradient><linearGradient id="film-glow" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff3cb" stopOpacity=".65"/><stop offset="1" stopColor="#fff3cb" stopOpacity="0"/></linearGradient></defs>
  <rect width="1920" height="1080" fill="url(#film-sky)"/>
  {(world==='alley'||world==='historic'||world==='modern')&&<g fill={world==='modern'?'#405c67':'#514a45'} stroke="#292b30" strokeWidth="9">
   <path d="M-80 720V250L250 145 530 250V720Z"/><path d="M1390 720V190L1710 95 2010 220V720Z"/>
   {Array.from({length:4},(_,i)=><g key={i}><rect x={45+i*115} y="340" width="70" height="130" fill="#e7bb79"/><rect x={1450+i*120} y="290" width="75" height="145" fill="#e7bb79"/></g>)}
   <path d="M0 820L500 690H1400L1920 820V1080H0Z" fill={ground[world]}/>
  </g>}
  {world==='alley'&&<g><path d="M0 0H1920V1080H0Z" fill="#111522" opacity=".18"/><path d="M780 0H1140V750H780Z" fill="#151a27"/><rect x="850" y="340" width="220" height="360" rx="8" fill="#654b39" stroke="#c59c61" strokeWidth="12"/><circle cx="1030" cy="520" r="10" fill="#f5d18a"/><path d="M900 360H1020" stroke="#e9c98f" strokeWidth="5"/></g>}
  {world==='archive'&&<g><rect x="120" y="170" width="1680" height="680" rx="18" fill="#d5c5a7" stroke="#695947" strokeWidth="16"/>{Array.from({length:8},(_,i)=><g key={i}><path d={`M${210+i*210} 245V770`} stroke="#a28e70" strokeWidth="5"/><rect x={225+i*210} y={290+(i%3)*45} width="140" height="180" fill={['#b66f50','#6f8290','#c7a66e'][i%3]} stroke="#66513d" strokeWidth="7"/><path d={`M${240+i*210} ${520+(i%2)*70}h110m-110 25h85`} stroke="#725f49" strokeWidth="7"/></g>)}</g>}
  {world==='map'&&<g><rect x="130" y="110" width="1660" height="810" rx="24" fill="#e8dbba" stroke="#6e5b42" strokeWidth="18"/><path d="M260 300Q520 180 700 370T1080 350T1620 270M260 690Q510 530 800 690T1420 600" fill="none" stroke="#8c9b77" strokeWidth="24" strokeLinecap="round"/><path d="M380 200L550 810M900 160L1050 850M1400 180L1280 820" stroke="#b99d71" strokeWidth="10" strokeDasharray="20 20"/>{[[500,360],[930,420],[1320,580],[690,700]].map(([x,y],i)=><g key={i}><circle cx={x} cy={y} r="28" fill="#b44d43" stroke="#fff1d1" strokeWidth="8"/></g>)}</g>}
  {world==='teahouse'&&<g><rect x="170" y="170" width="1580" height="660" fill="#6d4d34" stroke="#241d19" strokeWidth="18"/><path d="M170 340H1750M170 650H1750" stroke="#b88a54" strokeWidth="14"/><rect x="530" y="560" width="860" height="210" rx="20" fill="#4b3024" stroke="#201b18" strokeWidth="16"/><path d="M700 550q0-100 110-100t110 100M1050 550q0-100 110-100t110 100" fill="#d7a65e" stroke="#3b2a20" strokeWidth="10"/></g>}
  {world==='historic'&&<g><path d="M0 750Q400 650 800 760T1920 740V1080H0Z" fill="#8d9a72"/><path d="M180 700V390L500 240 820 390V700Z" fill="#b8a17b" stroke="#695b48" strokeWidth="12"/><path d="M300 700V500Q500 370 700 500V700" fill="#514b43"/><path d="M1150 700V430L1400 300 1650 430V700Z" fill="#c8b18a" stroke="#76634b" strokeWidth="12"/><path d="M0 820H1920" stroke="#776f5a" strokeWidth="30"/></g>}
  {world==='countryside'&&<g><circle cx="1540" cy="200" r="105" fill="#f8d98e"/><path d="M0 700Q360 540 700 700T1400 670T1920 650V1080H0Z" fill="#a9c78e"/><path d="M0 820Q420 650 800 840T1600 800T1920 850V1080H0Z" fill="#789c6d"/>{[180,400,1500,1740].map((x,i)=><g key={i} transform={`translate(${x} 0)`}><path d="M0 700V480" stroke="#6a7046" strokeWidth="22"/><circle cx="0" cy="450" r="100" fill="#648b5c"/><circle cx="-55" cy="490" r="55" fill="#7da66c"/></g>)}</g>}
  {world==='modern'&&<g>{Array.from({length:8},(_,i)=><g key={i}><rect x={100+i*230} y={220+(i%3)*65} width="170" height={500-(i%3)*65} fill="#526b75" stroke="#354c55" strokeWidth="9"/>{Array.from({length:6},(_,j)=><rect key={j} x={120+i*230+(j%2)*70} y={250+(i%3)*65+Math.floor(j/2)*65} width="42" height="38" fill="#f0d49a"/> )}</g>)}</g>}
  {world==='interior'&&<g><rect x="120" y="110" width="1680" height="820" fill="#d6c5a8" stroke="#735d48" strokeWidth="18"/><rect x="230" y="220" width="520" height="420" fill="#9ab0b1" stroke="#6b5948" strokeWidth="16"/><path d="M490 220V640M230 430H750" stroke="#6b5948" strokeWidth="12"/><rect x="900" y="520" width="700" height="220" rx="14" fill="#78553a"/></g>}
  {world==='meeting'&&<g><rect x="170" y="120" width="1580" height="650" rx="16" fill="#d9cbb0" stroke="#665442" strokeWidth="18"/><rect x="760" y="190" width="400" height="210" rx="8" fill="#9aafaa" stroke="#655644" strokeWidth="12"/><path d="M960 190V400M760 295H1160" stroke="#655644" strokeWidth="9"/><rect x="780" y="510" width="360" height="95" rx="12" fill="#70523a" stroke="#473729" strokeWidth="12"/>{[300,520,1400,1620].map((x,i)=><g key={i} transform={'translate('+x+' 0)'}><path d="M-48 620v110m96-110v110" stroke="#493c31" strokeWidth="16"/><rect x="-70" y="500" width="140" height="120" rx="18" fill="#8a6045" stroke="#493c31" strokeWidth="10"/></g>)}<circle cx="1510" cy="235" r="52" fill="#f2e6cb" stroke="#655644" strokeWidth="10"/><path d="M1510 235v-30m0 30l25 18" stroke="#655644" strokeWidth="8" strokeLinecap="round"/><path d="M0 850H1920" stroke="#685b4b" strokeWidth="30"/></g>}
  {world==='courtroom'&&<g>
   <path d="M120 170H1800V850H120Z" fill="#d7c7ad" stroke="#4a382b" strokeWidth="22"/>
   <path d="M120 170H1800V285H120Z" fill="#76513a" stroke="#3b2b21" strokeWidth="18"/>
   <path d="M210 300V760M1710 300V760" stroke="#5a4030" strokeWidth="24"/>
   {[280,470,1450,1640].map((x,i)=><g key={i}><rect x={x} y="335" width="135" height="260" fill="#9b7957" stroke="#4a382b" strokeWidth="12"/><path d={`M${x+20} 380H${x+115}M${x+20} 430H${x+115}M${x+20} 480H${x+115}`} stroke="#d9c29b" strokeWidth="8"/></g>)}
   <rect x="720" y="300" width="480" height="250" rx="10" fill="#795638" stroke="#3b2b21" strokeWidth="18"/>
   <rect x="780" y="550" width="360" height="90" fill="#503725" stroke="#33251c" strokeWidth="12"/>
   <path d="M0 900H1920" stroke="#4a3528" strokeWidth="38"/>
   <path d="M450 760H690V850H450ZM1230 760H1470V850H1230Z" fill="#795638" stroke="#3b2b21" strokeWidth="14"/>
  </g>}
  {world==='investigation'&&<g><rect x="150" y="130" width="1620" height="700" rx="18" fill="#45534f" stroke="#1f292b" strokeWidth="18"/><rect x="270" y="220" width="1380" height="470" fill="#c6b38f" stroke="#594d3d" strokeWidth="14"/><rect x="340" y="300" width="135" height="155" fill="#e7d8b8" stroke="#6b5844" strokeWidth="8"/><rect x="760" y="445" width="135" height="155" fill="#b8c8c0" stroke="#6b5844" strokeWidth="8"/><rect x="1190" y="300" width="135" height="155" fill="#d9b6a2" stroke="#6b5844" strokeWidth="8"/><path d="M410 350L760 470L1190 350M830 520L1260 600" fill="none" stroke="#b34e43" strokeWidth="8" strokeDasharray="18 12"/></g>}
  {world==='printing'&&<g><rect x="120" y="160" width="1680" height="670" fill="#d0b48a" stroke="#5b4632" strokeWidth="18"/><path d="M250 720V390H730V720M300 390V280H680V390" fill="#79583b" stroke="#3f3024" strokeWidth="18"/><rect x="360" y="300" width="250" height="80" fill="#b88b55" stroke="#4b3828" strokeWidth="12"/><path d="M485 380V560M395 560H575" stroke="#493729" strokeWidth="22"/><rect x="900" y="330" width="470" height="350" fill="#e9dfc9" stroke="#6d5943" strokeWidth="14"/><path d="M960 390H1310M960 435H1310M960 480H1310M960 525H1310M960 570H1310" stroke="#8c7b61" strokeWidth="8"/></g>}
  {world==='community'&&<g><rect x="130" y="130" width="1660" height="700" rx="24" fill="#e3ddc9" stroke="#76664e" strokeWidth="16"/><rect x="250" y="220" width="420" height="310" fill="#a8c3c2" stroke="#6d604c" strokeWidth="14"/><path d="M460 220V530M250 375H670" stroke="#6d604c" strokeWidth="12"/><rect x="850" y="480" width="620" height="160" rx="18" fill="#8a6548" stroke="#4e3a2a" strokeWidth="12"/><rect x="285" y="580" width="130" height="90" rx="18" fill="#9a7958" stroke="#554735" strokeWidth="9"/><rect x="1500" y="580" width="130" height="90" rx="18" fill="#9a7958" stroke="#554735" strokeWidth="9"/></g>}
  {world==='checklist'&&<g><rect x="120" y="120" width="1680" height="730" fill="#dce2dc" stroke="#5c6a64" strokeWidth="18"/><rect x="380" y="190" width="1160" height="520" rx="18" fill="#b9c8bd" stroke="#64776c" strokeWidth="14"/><path d="M500 310H1420M500 455H1420M500 600H1420" stroke="#8b9b8f" strokeWidth="8"/><rect x="250" y="820" width="1420" height="110" fill="#8a7156"/></g>}
  {world==='timeline'&&<g><rect x="120" y="140" width="1680" height="680" fill="#e5d8bd" stroke="#76634b" strokeWidth="18"/><path d="M260 530H1660" stroke="#806b4d" strokeWidth="18" strokeLinecap="round"/><circle cx="380" cy="530" r="44" fill="#a84e43" stroke="#f5e9d1" strokeWidth="10"/><circle cx="760" cy="530" r="44" fill="#66816a" stroke="#f5e9d1" strokeWidth="10"/><circle cx="1140" cy="530" r="44" fill="#b58b52" stroke="#f5e9d1" strokeWidth="10"/><circle cx="1520" cy="530" r="44" fill="#526e83" stroke="#f5e9d1" strokeWidth="10"/><rect x="270" y="300" width="220" height="120" fill="#f0e4ca" stroke="#806b4d" strokeWidth="9"/><rect x="650" y="300" width="220" height="120" fill="#f0e4ca" stroke="#806b4d" strokeWidth="9"/><rect x="1030" y="300" width="220" height="120" fill="#f0e4ca" stroke="#806b4d" strokeWidth="9"/><rect x="1410" y="300" width="220" height="120" fill="#f0e4ca" stroke="#806b4d" strokeWidth="9"/></g>}
  {world==='family-home'&&<g><rect x="90" y="120" width="1740" height="760" rx="24" fill="#e8dcc8" stroke="#76614b" strokeWidth="18"/><rect x="210" y="220" width="470" height="300" fill="#a9c2c2" stroke="#6b5948" strokeWidth="16"/><path d="M445 220V520M210 370H680" stroke="#6b5948" strokeWidth="12"/><rect x="930" y="510" width="610" height="180" rx="28" fill="#806047" stroke="#4e392a" strokeWidth="16"/><rect x="990" y="430" width="230" height="120" rx="28" fill="#a67c5c" stroke="#4e392a" strokeWidth="12"/><rect x="1260" y="430" width="230" height="120" rx="28" fill="#a67c5c" stroke="#4e392a" strokeWidth="12"/><path d="M1010 690V820M1460 690V820" stroke="#4e392a" strokeWidth="24"/><rect x="260" y="700" width="420" height="70" rx="12" fill="#8c6748"/></g>}
  {world==='statistics-room'&&<g><rect x="130" y="120" width="1660" height="730" rx="18" fill="#e4e2d9" stroke="#5c6261" strokeWidth="18"/><rect x="330" y="205" width="1260" height="430" fill="#31424b" stroke="#202d33" strokeWidth="16"/>{[0,1,2,3,4,5].map(i=><rect key={i} x={430+i*170} y={510-(i%3)*65} width="90" height={115+(i%3)*65} fill={['#d1a76b','#9fb5aa','#b46b57'][i%3]}/>) }<rect x="760" y="690" width="400" height="90" fill="#73563e" stroke="#443326" strokeWidth="12"/></g>}
  {world==='community-room'&&<g><rect x="120" y="120" width="1680" height="760" rx="20" fill="#e2d7c3" stroke="#695740" strokeWidth="18"/><rect x="350" y="210" width="1220" height="300" rx="12" fill="#b9c8bd" stroke="#64756a" strokeWidth="14"/><path d="M430 310H1490M430 390H1490" stroke="#87958a" strokeWidth="8"/><rect x="560" y="610" width="800" height="110" rx="16" fill="#76563b" stroke="#493729" strokeWidth="12"/>{[380,700,1220,1540].map((x,i)=><g key={i}><path d={'M'+x+' 730v110'} stroke="#493729" strokeWidth="18"/><rect x={x-70} y="520" width="140" height="150" rx="16" fill="#8b674a" stroke="#493729" strokeWidth="10"/></g>)}</g>}
  {world==='mountain-village'&&<g><path d="M0 610L280 320L540 610L840 230L1180 620L1510 290L1920 640V1080H0Z" fill="#829a7a"/><path d="M0 720L360 490L710 760L1110 470L1500 760L1920 520V1080H0Z" fill="#637f61"/>{[260,900,1460].map((x,i)=><g key={i} transform={'translate('+x+' 0)'}><path d="M-130 790V560L0 450L130 560V790Z" fill="#b69a72" stroke="#51483b" strokeWidth="14"/><path d="M-155 565L0 420L155 565" fill="#54483b" stroke="#352f29" strokeWidth="16"/><rect x="-48" y="635" width="96" height="155" fill="#574735"/><path d="M-100 600H100" stroke="#e4d3b2" strokeWidth="12"/></g>)}<path d="M0 930Q450 850 900 930T1920 900" fill="none" stroke="#c6b18b" strokeWidth="34"/></g>}
  {world==='funeral-house'&&<g><rect x="120" y="260" width="1680" height="580" fill="#c5b398" stroke="#5e4b39" strokeWidth="18"/><path d="M190 300L960 90L1730 300" fill="#5a4a3b" stroke="#332c25" strokeWidth="22"/><path d="M300 330V820M1620 330V820M520 330V820M1400 330V820" stroke="#765b43" strokeWidth="22"/><rect x="720" y="470" width="480" height="250" fill="#e5d8c0" stroke="#715b44" strokeWidth="14"/><path d="M790 520H1130M790 580H1130M790 640H1130" stroke="#a08a68" strokeWidth="8"/><path d="M0 900H1920" stroke="#594c3b" strokeWidth="34"/></g>}
  {world==='research-room'&&<g><rect x="120" y="130" width="1680" height="730" fill="#d6c9b2" stroke="#65533e" strokeWidth="18"/>{[0,1,2,3,4].map(i=><g key={i}><rect x={220+i*300} y="220" width="220" height="390" fill="#72553d" stroke="#473729" strokeWidth="12"/>{[0,1,2,3].map(j=><rect key={j} x={245+i*300} y={250+j*82} width="170" height="55" fill={['#c7a875','#8da29a','#ad7968'][j%3]} stroke="#473729" strokeWidth="5"/>)}</g>)}</g>}
  {world==='social-media'&&<g><rect x="130" y="100" width="1660" height="790" rx="30" fill="#26333d" stroke="#111a22" strokeWidth="20"/><rect x="210" y="180" width="1000" height="620" rx="18" fill="#e3e9e7"/>{[0,1,2,3].map(i=><g key={i}><rect x="270" y={250+i*125} width="850" height="90" rx="12" fill={['#c3d1cc','#d9c6b8','#b8c7d4','#d7d1bf'][i]}/><circle cx="325" cy={295+i*125} r="24" fill="#6e8b85"/><path d={'M380 '+(280+i*125)+'h650'} stroke="#75827f" strokeWidth="10"/><path d={'M380 '+(310+i*125)+'h460'} stroke="#9ba8a2" strokeWidth="8"/></g>)}<rect x="1300" y="210" width="370" height="520" rx="24" fill="#e9dfcb"/><rect x="1350" y="280" width="270" height="360" rx="24" fill="#202a32"/><rect x="1370" y="315" width="230" height="280" rx="12" fill="#dce5e2"/></g>}
  {world==='generic'&&<g><path d="M0 780Q400 700 800 780T1600 770T1920 760V1080H0Z" fill="#aaa18d"/><circle cx="1550" cy="200" r="90" fill="#f0d49a"/></g>}
  <rect width="1920" height="1080" fill="url(#film-glow)" opacity=".24"/>
 </svg>;
};


const SceneObjects:React.FC<{scene:FilmSceneData}> = ({scene}) => {

 const propText=[scene.props||'',scene.setting||'',scene.action||'',scene.heading||''].join(' ').toLowerCase();
 const inferredVisualKey=scene.number===12?'compare':scene.number===16?'legal-case':scene.number===18?'mountain-timeline':scene.number===21?'research-stack':scene.number===22?'community-legacy':scene.number===24?'three-questions':scene.number===25?'pitch':scene.number===29?'source-library':scene.number===30?'satire-boundary':scene.number===31?'social-feed':/cánh cửa|tấm giấy mời/.test(propText)?'invitation':
  /bảng ghim|ba thẻ màu/.test(propText)?'categories':
  /bản đồ nam kỳ/.test(propText)?'south-map':
  /ấm trà|chén trà/.test(propText)?'teahouse':
  /thẻ hồ sơ/.test(propText)?'files':
  /chân dung phan xích long/.test(propText)?'portrait':
  /khám lớn sài gòn/.test(propText)?'prison':
  /ruộng lúa|sổ thuế/.test(propText)?'countryside':
  /hai hồ sơ/.test(propText)?'compare':
  /tiệm sách|máy in/.test(propText)?'printing':
  /cửa phòng họp/.test(propText)?'curtain':
  /điện thoại thông minh/.test(propText)?'phone':
  /bản đồ thế giới/.test(propText)?'world-map':
  /văn bản chính thức/.test(propText)?'documents':
  /bong bóng thoại/.test(propText)?'pitch':
  /phễu tuyển thành viên/.test(propText)?'funnel':
  /khung gia đình/.test(propText)?'faith':
  /bảng checklist|checklist|bốn mục/.test(propText)?'checklist':
  /dòng thời gian/.test(propText)?'timeline':
  /bữa ăn|bàn ăn|bữa cơm|ghế trống|hai chiếc ghế|bàn trà/.test(propText)?'family-table':
  /bảng số liệu|họp báo|12 vụ|85 người/.test(propText)?'stats-board':
  /có được hỏi|có được từ chối|có được rời đi|quyền tự quyết/.test(propText)?'rights-board':
  /bản đồ bình chánh|bản đồ gia lai|bản đồ kon tum|bản đồ.*long an/.test(propText)?'route-map':
  /cặp sách|quyền riêng tư|bảo vệ danh tính|quyền học tập/.test(propText)?'school-protection':
  /lời kể|lời đồn|thông điệp thiêng|tờ giấy ghi/.test(propText)?'testimony':
  /vụ án|bị cáo|tòa án|xét xử|điều 331|bản án/.test(propText)?'legal-case':
  /bản làng|nhà sàn|người mông|miền núi phía bắc/.test(propText)?'village-house':
  /tài liệu nghiên cứu|viện hàn lâm|trích dẫn nguồn|nghiên cứu|bốn thẻ nguồn|biểu tượng tài liệu/.test(propText)?'research-stack':
  /màn hình bình luận|mạng xã hội|bình luận|video clip/.test(propText)?'social-feed':
  /hai cột|châm biếm|niềm tin cá nhân|hành vi cụ thể/.test(propText)?'two-column':
  /nhà đòn|tang lễ|nghi lễ/.test(propText)?'funeral-house':
  /cánh cửa mở/.test(propText)?'open-door':'generic';
 const visualKey=scene.objectKey&&scene.objectKey!=='auto'?scene.objectKey:inferredVisualKey;
 // Text belongs to the object/card that it describes. Keep it compact and
  // scale the type down for longer labels so it never spills outside its panel.
  // Object artwork stays clean: labels are presented separately as animated scene captions.
 if(scene.objectKey==='none') return null;
 const label=(_x:number,_y:number,_value:string,_color='#594b3a')=>null;
 const card=(x:number,y:number,w:number,h:number,fill='#e7d8b8')=><g><rect x={x} y={y} width={w} height={h} rx="10" fill={fill} stroke="#68563f" strokeWidth="9"/><rect x={x+9} y={y+9} width={w-18} height={h-18} rx="6" fill="none" stroke="#fff6df" strokeOpacity=".38" strokeWidth="4"/><path d={`M${x+18} ${y+17}H${x+w-18}`} stroke="#fff8e9" strokeOpacity=".28" strokeWidth="4" strokeLinecap="round"/><path d={`M${x+18} ${y+h-15}H${x+w-18}`} stroke="#3f3024" strokeOpacity=".16" strokeWidth="3" strokeLinecap="round"/></g>;
 return <svg viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid meet" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
  <defs><filter id="story-prop-depth" x="-35%" y="-35%" width="180%" height="190%"><feGaussianBlur in="SourceAlpha" stdDeviation="3" result="contact-blur"/><feOffset in="contact-blur" dx="0" dy="7" result="contact-offset"/><feComponentTransfer in="contact-offset" result="contact-shadow"><feFuncA type="linear" slope="0.30"/></feComponentTransfer><feGaussianBlur in="SourceAlpha" stdDeviation="18" result="ambient-blur"/><feOffset in="ambient-blur" dx="12" dy="24" result="ambient-offset"/><feComponentTransfer in="ambient-offset" result="ambient-shadow"><feFuncA type="linear" slope="0.24"/></feComponentTransfer><feMerge><feMergeNode in="ambient-shadow"/><feMergeNode in="contact-shadow"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
  <g filter="url(#story-prop-depth)">
   {visualKey==='evidence-board'&&<g>{card(360,205,1040,570,'#b9a783')}{card(430,280,250,190,'#e9dfc8')}{card(770,280,250,190,'#d7e0d9')}{card(1110,280,220,190,'#e5c8b7')}<path d="M680 375H770M1020 375H1110M555 470V575H1220V470" fill="none" stroke="#9c5145" strokeWidth="13" strokeDasharray="18 12"/><circle cx="850" cy="625" r="58" fill="none" stroke="#8b6b47" strokeWidth="16"/><path d="M892 667L975 750" stroke="#8b6b47" strokeWidth="22" strokeLinecap="round"/>{card(1000,600,260,110,'#e9dfc8')}</g>}
   {visualKey==='invitation'&&<g>{card(720,250,330,430,'#76543b')}<rect x="770" y="330" width="225" height="150" fill="#f1dfb8" stroke="#6b543e" strokeWidth="8"/>{label(790,390,'BUỔI SINH HOẠT')}{label(820,435,'ĐẶC BIỆT')}<path d="M1040 500q95-45 145 12l-15 60q-70 30-125-5" fill="#f2d1bd" stroke="#59433f" strokeWidth="12"/>{card(1110,510,190,110,'#f5e8c8')}{label(1130,560,'NGƯỜI ĐƯỢC')}{label(1160,594,'CHỌN')}</g>}
   {visualKey==='categories'&&<g>{card(470,235,760,490,'#bba987')}{[0,1,2].map(i=><g key={i}><path d={'M850 340V'+(420+i*110)+'H'+(590+i*260)} fill="none" stroke={['#a84f43','#567c91','#69865c'][i]} strokeWidth="12"/>{card(490+i*260,420+i*110,220,105,['#d9a28e','#a9c1cb','#b7c89f'][i])}{label(515+i*260,482,['YÊU NƯỚC','CỘNG ĐỒNG','TÔN GIÁO'][i])}</g>)}{card(785,270,150,75,'#e7d6ae')}{label(805,318,'PHÂN BIỆT')}</g>}
   {visualKey==='south-map'&&<g><path d="M430 240l180-85 250 65 175-25 160 120-80 175-185 80-170-55-190 45-160-145z" fill="#e9d8b5" stroke="#77664b" strokeWidth="12"/><path d="M520 330q190-100 310 30t320-20M500 480q190-90 350 10t300-10" fill="none" stroke="#b39b70" strokeWidth="9" strokeDasharray="18 15"/>{[[570,350],[850,405],[1120,330],[960,550],[650,545]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="23" fill="#b54e43" stroke="#fff2d6" strokeWidth="7"/>)}<circle cx="1225" cy="500" r="55" fill="none" stroke="#5b5549" strokeWidth="13"/><path d="M1265 540l60 60" stroke="#5b5549" strokeWidth="18" strokeLinecap="round"/></g>}
   {visualKey==='teahouse'&&<g>{card(520,570,780,115,'#68472f')}{[690,950,1150].map(x=><g key={x}><path d={'M'+x+' 550q0-85 55-85t55 85'} fill="#d6a766" stroke="#4c3424" strokeWidth="10"/><ellipse cx={x+55} cy="550" rx="55" ry="17" fill="#f0d5a2" stroke="#4c3424" strokeWidth="8"/></g>)}<path d="M600 570V360h610v210" fill="none" stroke="#b48a55" strokeWidth="12"/></g>}
   {visualKey==='files'&&<g>{[0,1,2,3,4].map(i=><g key={i} transform={'translate('+(430+i*175)+' '+(310+(i%2)*150)+') rotate('+(i-2)*5+')'}>{card(0,0,150,190,['#d6b77d','#a7bdc0','#c98b72','#c4c49b','#d7c5a4'][i])}<path d="M22 55h105M22 85h90M22 115h105" stroke="#725e48" strokeWidth="7"/></g>)}</g>}
   {visualKey==='portrait'&&<g>{card(580,220,360,480,'#9c805c')}{card(625,265,270,390,'#e3d2ae')}<ellipse cx="760" cy="400" rx="78" ry="95" fill="#d3a88d" stroke="#55463b" strokeWidth="9"/><path d="M685 390q5-130 145-105 65 35 15 95l-60 5-60 55z" fill="#40352f"/><path d="M680 515q80-95 165 0v110H680z" fill="#364c62"/>{card(1020,390,300,360,'#e8d9b9')}{label(1050,450,'TRUYỀN ĐƠN')}{label(1050,505,'TÁI HIỆN')}</g>}
   {visualKey==='prison'&&<g><path d="M480 650V370l210-150 210 150v280z" fill="#b5a184" stroke="#594d3e" strokeWidth="16"/><path d="M590 650V450q100-130 200 0v200" fill="#413c39" stroke="#594d3e" strokeWidth="12"/>{[630,700,770].map(x=><path key={x} d={'M'+x+' 470v165'} stroke="#b7b1a4" strokeWidth="12"/>)}<path d="M930 590q180-160 330-10" stroke="#b84f43" strokeWidth="10" fill="none" strokeDasharray="18 16"/>{label(1000,700,'KHÁM LỚN · 1916')}</g>}
   {visualKey==='countryside'&&<g><path d="M320 650q300-170 600 0t620 0v300H320z" fill="#91ad72" stroke="#5c754d" strokeWidth="8"/>{[0,1,2,3].map(i=><path key={i} d={'M'+(390+i*280)+' 670q120-85 240 0'} stroke="#d5c58b" strokeWidth="10" fill="none"/>)}<path d="M520 540V370l120-90 120 90v170z" fill="#b89a70" stroke="#67533e" strokeWidth="10"/>{card(1050,300,240,300,'#e4d4b3')}{label(1080,360,'SỔ THUẾ')}{[0,1,2,3,4].map(i=><path key={i} d={'M1080 '+(410+i*35)+'h170'} stroke="#8d795b" strokeWidth="6"/> )}</g>}
   {visualKey==='compare'&&<g>{card(380,260,430,450,'#d9c7a7')}{card(900,260,430,450,'#c9c2b4')}{label(450,335,'HỒ SƠ A','#526e59')}{label(980,335,'HỒ SƠ B','#a44f43')}<path d="M440 390h300M440 430h260M440 470h300M960 390h300M960 430h260M960 470h300" stroke="#85765f" strokeWidth="10"/><path d="M780 580l80 80m0-80l-80 80" stroke="#a64b42" strokeWidth="16" strokeLinecap="round"/></g>}
   {visualKey==='printing'&&<g>{card(400,460,500,210,'#76573c')}{card(475,390,350,110,'#b38b5d')}<path d="M530 390v-90h230v90" stroke="#4a3a2e" strokeWidth="14" fill="none"/>{card(990,300,300,390,'#e5d7ba')}<path d="M1140 310v370" stroke="#8d785b" strokeWidth="7"/>{label(1030,390,'SÁCH MỞ')}{label(1030,455,'NHÀ IN')}</g>}
   {visualKey==='curtain'&&<g>{card(420,220,800,480,'#4e3c31')}<path d="M820 230v450M620 230q-100 220 0 450M1020 230q100 220 0 450" stroke="#b28a55" strokeWidth="14" fill="none"/>{card(650,500,360,130,'#e8d8b8')}{label(695,580,'MỤC TIÊU?')}</g>}
   {visualKey==='phone'&&<g><rect x="700" y="240" width="300" height="520" rx="42" fill="#202a31" stroke="#15191c" strokeWidth="20"/><rect x="725" y="290" width="250" height="420" rx="20" fill="#dce8e5"/>{card(750,345,200,105,'#9eb7c5')}{label(770,405,'BUỔI HỌC')}{card(775,485,175,95,'#c5d9b9')}{label(795,545,'ĐỪNG KỂ')}</g>}
   {visualKey==='world-map'&&<g><circle cx="820" cy="450" r="220" fill="#e3d5b8" stroke="#8b795e" strokeWidth="10"/><path d="M700 360l70-55 70 35 45 85-70 60-90-30zM850 520l80-50 75 35 35 75-80 60-95-35z" fill="#8da47b" stroke="#6e7c61" strokeWidth="8"/><path d="M930 430q180-120 330 30" fill="none" stroke="#a44e42" strokeWidth="10" strokeDasharray="18 14"/><circle cx="970" cy="410" r="22" fill="#a44e42"/><circle cx="1260" cy="465" r="22" fill="#a44e42"/>{label(1110,360,'1964','#a44e42')}{label(1180,535,'VIỆT NAM')}</g>}
   {visualKey==='documents'&&<g>{card(440,240,400,500,'#e8dfcb')}{card(920,330,340,270,'#d5c5a7')}{label(520,345,'VĂN BẢN')}{label(965,405,'BÁO CHÍ')}{[0,1,2,3,4,5].map(i=><path key={i} d={'M490 '+(415+i*42)+'h280'} stroke="#8d806b" strokeWidth="7"/>)}<circle cx="1330" cy="600" r="60" fill="none" stroke="#a44e42" strokeWidth="12"/><path d="M1370 640l75 75" stroke="#a44e42" strokeWidth="15"/></g>}
   {visualKey==='pitch'&&<g><path d="M430 300q0-100 110-100h540q110 0 110 100v190q0 100-110 100H720l-100 90 20-90h-100q-110 0-110-100z" fill="#f4e5c5" stroke="#68533c" strokeWidth="12"/></g>}
   {visualKey==='funnel'&&<g><path d="M520 260h620l-210 280H730z" fill="#d8c39a" stroke="#68553d" strokeWidth="12"/><path d="M760 540h140v110H760z" fill="#b78a55" stroke="#68553d" strokeWidth="10"/>{['LÀM QUEN','TIN TƯỞNG','CAM KẾT'].map((t,i)=><g key={i}><circle cx={620+i*210} cy={340+i*40} r="24" fill="#a64e43"/>{label(660+i*170,350+i*40,t)}</g>)}{card(1080,650,260,120,'#e7d9ba')}{label(1100,720,'SỔ THU CHI')}</g>}
   {visualKey==='faith'&&<g>{card(370,260,430,420,'#b9c9a8')}{card(900,260,430,420,'#e4c0ae')}<circle cx="585" cy="430" r="70" fill="#eac5aa"/><path d="M480 600q100-160 210 0" fill="#67826b"/><path d="M1050 500l80-150 80 150z" fill="#c35b4e" stroke="#7a3934" strokeWidth="10"/><path d="M1130 400v55m0 25v8" stroke="#fff4df" strokeWidth="14" strokeLinecap="round"/></g>}
   {visualKey==='checklist'&&<g>{card(470,220,750,520,'#e7d8b8')}{['AI TỔ CHỨC?','TÀI CHÍNH MINH BẠCH?','CÓ QUYỀN RỜI ĐI?'].map((t,i)=><g key={i}><rect x="550" y={310+i*125} width="58" height="58" rx="8" fill="#f7f0df" stroke="#6d5b43" strokeWidth="7"/><path d={'M565 '+(340+i*125)+'l15 15 28-36'} fill="none" stroke="#66845f" strokeWidth="9"/>{label(650,350+i*125,t)}</g>)}</g>}
   {visualKey==='timeline'&&<g><path d="M380 520H1370" stroke="#78664d" strokeWidth="16" strokeLinecap="round"/>{[450,700,950,1200].map((x,i)=><g key={i}><circle cx={x} cy="520" r="36" fill={['#a64e43','#64806a','#b18a55','#526e83'][i]} stroke="#f3e4c4" strokeWidth="9"/>{card(x-100,350,200,100,'#e6d6b7')}{label(x-80,410,['1910s','1920s','1964','HIỆN NAY'][i])}</g>)}</g>}
   {visualKey==='family-table'&&<g>
    <ellipse cx="920" cy="690" rx="520" ry="125" fill="#76543a" stroke="#3f3027" strokeWidth="16"/>
    {[650,920,1190].map((x,i)=><g key={x}><ellipse cx={x} cy="650" rx="76" ry="27" fill="#f2e7d2" stroke="#a28d6c" strokeWidth="8"/><circle cx={x} cy="650" r="19" fill="#d5b88a"/></g>)}
    <rect x="1290" y="285" width="170" height="285" rx="22" fill="#26343b" stroke="#151d21" strokeWidth="16"/><rect x="1310" y="325" width="130" height="205" rx="10" fill="#dce7e1"/>
    <rect x="390" y="310" width="245" height="210" rx="12" fill="#eee2c9" stroke="#816b4d" strokeWidth="10"/>{[0,1,2,3].map(i=><path key={i} d={'M425 '+(365+i*35)+'h170'} stroke="#b5a58b" strokeWidth="8"/> )}
    {[520,1320].map(x=><g key={x}><path d={'M'+(x-70)+' 760v115m140-115v115'} stroke="#4c4137" strokeWidth="18"/><rect x={x-95} y="700" width="190" height="80" rx="18" fill="#b38b67" stroke="#5c4937" strokeWidth="10"/></g>)}
   </g>}
   {visualKey==='stats-board'&&<g>
    <rect x="250" y="170" width="1420" height="690" rx="24" fill="#34484a" stroke="#1c2d31" strokeWidth="18"/>
    <rect x="360" y="260" width="520" height="470" rx="18" fill="#f0e6d1" stroke="#8e795b" strokeWidth="10"/>
    <text x="620" y="390" textAnchor="middle" fontSize="145" fontWeight="900" fill="#a54d42">12</text><text x="620" y="455" textAnchor="middle" fontSize="32" fontWeight="800" fill="#554c40">VỤ VIỆC</text>
    <text x="620" y="620" textAnchor="middle" fontSize="145" fontWeight="900" fill="#557b75">85</text><text x="620" y="685" textAnchor="middle" fontSize="32" fontWeight="800" fill="#554c40">NGƯỜI</text>
    <rect x="1010" y="270" width="520" height="390" rx="18" fill="#d8c9a9" stroke="#887454" strokeWidth="10"/>
    {[0,1,2,3,4].map(i=><rect key={i} x={1080+i*82} y={570-[90,160,125,235,195][i]} width="48" height={[90,160,125,235,195][i]} rx="7" fill={['#a64f43','#607f80','#c49a59','#82966f','#a9795f'][i]}/> )}
    <path d="M1060 580H1480" stroke="#645642" strokeWidth="8"/>
    <rect x="1120" y="710" width="340" height="70" rx="12" fill="#f1e6ce" stroke="#8b7658" strokeWidth="8"/>
   </g>}
   {visualKey==='rights-board'&&<g>
    <path d="M300 260H1620" stroke="#6b5945" strokeWidth="24" strokeLinecap="round"/>
    {[0,1,2].map(i=><g key={i} transform={'translate('+(390+i*470)+' 0)'}><rect x="0" y="340" width="360" height="360" rx="26" fill={['#e8d7b7','#c5d4c9','#d8b9a8'][i]} stroke="#5f5547" strokeWidth="12"/><circle cx="180" cy="470" r="72" fill="#f7efdf" stroke="#82725b" strokeWidth="10"/><path d="M145 470l25 28 55-68" fill="none" stroke={['#69836a','#69836a','#a34e43'][i]} strokeWidth="18" strokeLinecap="round" strokeLinejoin="round"/><rect x="65" y="590" width="230" height="24" rx="12" fill="#88775f"/></g>)}
   </g>}
   {visualKey==='route-map'&&<g>
    <path d="M260 230L700 160L1030 250L1500 175V800L1050 875L690 785L260 850Z" fill="#e8dfc9" stroke="#736247" strokeWidth="16"/>
    <path d="M350 700Q510 570 650 610T920 430T1270 490T1450 300" fill="none" stroke="#668d83" strokeWidth="34" strokeLinecap="round"/>
    <path d="M420 320Q600 380 760 300T1100 350T1400 270" fill="none" stroke="#b48a57" strokeWidth="14" strokeDasharray="22 18"/>
    {[[430,680],[730,590],[930,425],[1270,490],[1450,300]].map(([x,y],i)=><g key={i}><circle cx={x} cy={y} r="36" fill={i%2?'#a64e43':'#597e7a'} stroke="#fff4dc" strokeWidth="10"/><circle cx={x} cy={y} r="10" fill="#fff4dc"/></g>)}
    <circle cx="1515" cy="760" r="74" fill="#d8c9a8" stroke="#6c5c44" strokeWidth="10"/><path d="M1515 700v120m-60-60h120" stroke="#6c5c44" strokeWidth="9"/>
   </g>}
   {visualKey==='school-protection'&&<g>
    <path d="M520 340q0-90 95-90h170q95 0 95 90v380q0 60-60 60H580q-60 0-60-60z" fill="#b36f51" stroke="#543f35" strokeWidth="18"/>
    <path d="M625 330q75-90 150 0" fill="none" stroke="#543f35" strokeWidth="18"/><rect x="600" y="430" width="200" height="180" rx="18" fill="#e5d8b9" stroke="#6c5a43" strokeWidth="10"/>
    <path d="M1000 310l190 70v165q0 170-190 245-190-75-190-245V380z" fill="#8ca99c" stroke="#405d54" strokeWidth="16"/>
    <rect x="930" y="500" width="140" height="105" rx="18" fill="#f2ead7" stroke="#52695f" strokeWidth="10"/><path d="M960 500v-45q0-55 40-55t40 55v45" fill="none" stroke="#52695f" strokeWidth="16"/>
    <rect x="1300" y="390" width="220" height="290" rx="8" fill="#f1e7d2" stroke="#826e51" strokeWidth="12"/>{[0,1,2,3,4].map(i=><path key={i} d={'M1340 '+(450+i*42)+'h140'} stroke="#a99a7e" strokeWidth="8"/> )}
   </g>}
   {visualKey==='testimony'&&<g>
    {[0,1,2].map(i=><g key={i} transform={'translate('+(430+i*310)+' '+(300+(i%2)*75)+') rotate('+(i-1)*4+')'}><rect width="250" height="350" rx="8" fill={['#eadfc9','#d8e1da','#e5cdbd'][i]} stroke="#76644d" strokeWidth="10"/>{[0,1,2,3,4].map(n=><path key={n} d={'M35 '+(85+n*42)+'h180'} stroke="#a99b82" strokeWidth="8"/> )}</g>)}
    <path d="M1180 250q0-80 85-80h250q85 0 85 80v110q0 80-85 80h-95l-70 65 15-65h-100q-85 0-85-80z" fill="#f2e5cc" stroke="#79664c" strokeWidth="10"/>
    <circle cx="1270" cy="325" r="12" fill="#a64e43"/><circle cx="1350" cy="325" r="12" fill="#a64e43"/><circle cx="1430" cy="325" r="12" fill="#a64e43"/>
    <circle cx="1530" cy="700" r="75" fill="none" stroke="#596d68" strokeWidth="16"/><path d="M1585 755l100 100" stroke="#596d68" strokeWidth="22" strokeLinecap="round"/>
   </g>}
   {visualKey==='legal-case'&&<g>
    <rect x="350" y="210" width="1220" height="630" rx="14" fill="#e8dfcd" stroke="#665540" strokeWidth="16"/>
    <path d="M500 760V390h130v370m170 0V390h130v370m170 0V390h130v370" fill="#b9a17b" stroke="#665540" strokeWidth="14"/>
    <path d="M450 390h1060M460 320h1040" stroke="#665540" strokeWidth="22"/>
    <path d="M1060 260l210 0-30 70h-150z" fill="#a64e43"/><rect x="1110" y="335" width="110" height="95" fill="#d3bd98" stroke="#665540" strokeWidth="10"/>
    <rect x="740" y="620" width="400" height="140" rx="12" fill="#d3c09b" stroke="#79654a" strokeWidth="10"/><path d="M800 670h280m-280 42h220" stroke="#88765c" strokeWidth="10"/>
   </g>}
   {visualKey==='village-house'&&<g>
    <path d="M0 690L280 330L520 620L850 230L1180 640L1510 310L1920 690V1080H0Z" fill="#748d7d"/>
    <path d="M0 790Q330 640 650 790T1300 760T1920 780V1080H0Z" fill="#a4b28c"/>
    <path d="M650 760V490L950 300L1250 490V760Z" fill="#c8b797" stroke="#594f43" strokeWidth="18"/>
    <path d="M590 500L950 260L1310 500" fill="none" stroke="#51493f" strokeWidth="28" strokeLinejoin="round"/>
    <rect x="860" y="560" width="180" height="200" fill="#6d8177" stroke="#594f43" strokeWidth="12"/>
    {[280,1520].map(x=><g key={x}><path d={'M'+x+' 800v-180'} stroke="#5e684b" strokeWidth="20"/><circle cx={x} cy="590" r="100" fill="#6f8e67"/></g>)}
    <path d="M0 930Q500 790 980 930T1920 900" fill="none" stroke="#e8dfc9" strokeWidth="22"/>
   </g>}
   {visualKey==='research-stack'&&<g>
    {[0,1,2,3].map(i=><g key={i} transform={'translate('+(360+i*290)+' '+(610-i*70)+') rotate('+(i-1.5)*-4+')'}><rect width="250" height="90" rx="8" fill={['#a96c51','#637e7d','#b69a67','#82936f'][i]} stroke="#51483c" strokeWidth="10"/><path d="M35 25h175m-175 30h145" stroke="#f1e7d2" strokeWidth="8"/></g>)}
    <rect x="680" y="220" width="560" height="330" rx="12" fill="#f0e6d2" stroke="#75644b" strokeWidth="12"/>
    <path d="M960 220v330M740 300h180m-180 55h180m-180 55h180m280-110h180m-180 55h180m-180 55h180" stroke="#a99a80" strokeWidth="8"/>
    <circle cx="1380" cy="340" r="92" fill="#d6c49f" stroke="#76644b" strokeWidth="12"/><path d="M1335 340h90m-45-45v90" stroke="#76644b" strokeWidth="14"/>
   </g>}
   {visualKey==='social-feed'&&<g>
    <rect x="690" y="140" width="420" height="760" rx="48" fill="#26343c" stroke="#111b21" strokeWidth="18"/><rect x="720" y="210" width="360" height="650" rx="28" fill="#e7e9e2"/>
    {[0,1,2,3].map(i=><g key={i}><circle cx="775" cy={300+i*130} r="34" fill={['#a64e43','#658b7d','#bd965e','#7d87a4'][i]}/><rect x="830" y={275+i*130} width="205" height="22" rx="11" fill="#77827c"/><rect x="830" y={315+i*130} width="165" height="16" rx="8" fill="#b3b9b1"/></g>)}
    <path d="M1160 290q0-70 75-70h350q75 0 75 70v120q0 70-75 70h-115l-80 65 15-65h-170q-75 0-75-70z" fill="#f0dfc4" stroke="#7b684e" strokeWidth="10"/>
    <path d="M1220 335h300m-300 42h240" stroke="#9b896f" strokeWidth="10" strokeLinecap="round"/>
    <path d="M1220 620l42 42 86-105" fill="none" stroke="#a64e43" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round"/>
   </g>}
   {visualKey==='two-column'&&<g>
    <rect x="300" y="220" width="570" height="560" rx="22" fill="#d8e0d6" stroke="#597365" strokeWidth="14"/>
    <rect x="1050" y="220" width="570" height="560" rx="22" fill="#e4c9b8" stroke="#93664f" strokeWidth="14"/>
    <path d="M390 360h390m-390 70h330m-330 70h390m-390 70h300" stroke="#789082" strokeWidth="14" strokeLinecap="round"/>
    <path d="M1140 360h390m-390 70h330m-330 70h390m-390 70h300" stroke="#a87a61" strokeWidth="14" strokeLinecap="round"/>
    <circle cx="585" cy="665" r="48" fill="#6c8a70"/><path d="M560 665l18 20 38-45" fill="none" stroke="#f7f1e5" strokeWidth="14" strokeLinecap="round"/>
    <circle cx="1335" cy="665" r="48" fill="#ad5547"/><path d="M1315 645l40 40m0-40l-40 40" stroke="#f7f1e5" strokeWidth="14" strokeLinecap="round"/>
   </g>}
   {visualKey==='funeral-house'&&<g>
    <path d="M360 720V410L950 180L1540 410V720Z" fill="#b6a78d" stroke="#5e5448" strokeWidth="18"/>
    <path d="M290 420L950 130L1610 420" fill="none" stroke="#51483e" strokeWidth="28" strokeLinejoin="round"/>
    <rect x="790" y="480" width="320" height="240" fill="#665b50" stroke="#51483e" strokeWidth="14"/>
    <path d="M950 480v240" stroke="#d4c6ad" strokeWidth="8"/>
    <path d="M450 770h1000" stroke="#4f6257" strokeWidth="22"/>
    {[520,650,1250,1380].map(x=><g key={x}><path d={'M'+x+' 750v-80'} stroke="#5f795f" strokeWidth="10"/><circle cx={x} cy="655" r="28" fill="#d4b99a"/><circle cx={x-20} cy="645" r="20" fill="#a65a4d"/><circle cx={x+20} cy="645" r="20" fill="#a65a4d"/></g>)}
   </g>}
   {visualKey==='mountain-timeline'&&<g>
    <path d="M0 760L260 390L470 650L760 260L1030 640L1320 330L1620 690L1920 420V1080H0Z" fill="#81978b"/>
    <path d="M0 870Q380 700 760 870T1520 850T1920 830V1080H0Z" fill="#a7b58f"/>
    <path d="M260 540H1640" stroke="#6b5841" strokeWidth="20" strokeLinecap="round"/>
    {[390,790,1190,1530].map((x,i)=><g key={x}><circle cx={x} cy="540" r="42" fill={['#a84e43','#688477','#c29a5e','#59718a'][i]} stroke="#f4e8d0" strokeWidth="10"/><rect x={x-92} y="360" width="184" height="95" rx="12" fill="#efe3ca" stroke="#76634a" strokeWidth="8"/><path d={'M'+(x-55)+' 405h110'} stroke="#a18e70" strokeWidth="8"/></g>)}
    <path d="M330 760V640l100-70 100 70v120zM1390 760V640l100-70 100 70v120z" fill="#bca989" stroke="#5b5143" strokeWidth="12"/>
   </g>}
   {visualKey==='community-legacy'&&<g>
    <path d="M0 730Q350 590 700 730T1400 710T1920 720V1080H0Z" fill="#879b7d"/>
    {[250,520,1430,1680].map((x,i)=><g key={x}><path d={'M'+(x-85)+' 710V'+(580+(i%2)*35)+'l85-75 85 75v130z'} fill={['#c9b797','#b6c5b5','#d0b99a','#b7c6b8'][i]} stroke="#5d584b" strokeWidth="10"/><path d={'M'+(x-105)+' '+(590+(i%2)*35)+'l105-95 105 95'} fill="none" stroke="#514b42" strokeWidth="15"/></g>)}
    <rect x="710" y="310" width="500" height="330" rx="18" fill="#e8dfca" stroke="#6e5b43" strokeWidth="14"/>
    <path d="M960 310v330M760 390h160m-160 55h160m-160 55h160m280-110h160m-160 55h160m-160 55h160" stroke="#9b8a6d" strokeWidth="9"/>
    <circle cx="1450" cy="280" r="120" fill="#d7c49e" stroke="#7c674b" strokeWidth="14"/><path d="M1450 210v140m-70-70h140" stroke="#a64e43" strokeWidth="18" strokeLinecap="round"/>
    <path d="M1340 460H1570" stroke="#f1e7d3" strokeWidth="16" strokeLinecap="round"/>
   </g>}
   {visualKey==='three-questions'&&<g>
    <path d="M250 770Q960 80 1670 770" fill="none" stroke="#7a6449" strokeWidth="28"/>
    {[0,1,2].map(i=><g key={i} transform={'translate('+(330+i*470)+' 0)'}><rect x="0" y="300" width="390" height="420" rx="24" fill={['#e7d7b8','#c6d6cb','#d9b9a8'][i]} stroke="#675944" strokeWidth="12"/><circle cx="195" cy="440" r="82" fill="#f6efdf" stroke="#857257" strokeWidth="10"/><text x="195" y="475" textAnchor="middle" fontSize="100" fontWeight="900" fill={['#9e4d42','#5c7e70','#9b7650'][i]}>?</text><path d="M80 590h230m-230 42h180" stroke="#8e7c60" strokeWidth="12" strokeLinecap="round"/></g>)}
   </g>}
   {visualKey==='source-library'&&<g>
    {[0,1,2,3].map(i=><g key={i} transform={'translate('+(300+i*350)+' '+(260+(i%2)*100)+') rotate('+(i-1.5)*4+')'}><rect width="270" height="430" rx="12" fill={['#e8dcc4','#c7d4cb','#d9c0a8','#c5cce0'][i]} stroke="#665743" strokeWidth="12"/><rect x="26" y="35" width="218" height="78" rx="8" fill={['#a64f43','#597f79','#b38a56','#687997'][i]}/><path d="M45 165h180m-180 52h165m-165 52h180m-180 52h135" stroke="#8e7e64" strokeWidth="10" strokeLinecap="round"/><circle cx="210" cy="370" r="25" fill="#8c9a80"/></g>)}
   </g>}
   {visualKey==='satire-boundary'&&<g>
    <path d="M300 820L600 250H1320L1620 820Z" fill="#e4d5b8" stroke="#6d5940" strokeWidth="14"/>
    <circle cx="960" cy="410" r="165" fill="#f4e7c9" stroke="#aa8c5c" strokeWidth="16"/>
    <path d="M820 430q140-130 280 0" fill="none" stroke="#a64e43" strokeWidth="22" strokeLinecap="round"/><path d="M870 490h180" stroke="#5d776a" strokeWidth="18" strokeLinecap="round"/>
    <rect x="420" y="650" width="430" height="150" rx="20" fill="#d7b39e" stroke="#8f5c4c" strokeWidth="12"/><rect x="1070" y="650" width="430" height="150" rx="20" fill="#c8d5ca" stroke="#5c7b6d" strokeWidth="12"/>
    <path d="M625 695l70 70m0-70l-70 70" stroke="#a64e43" strokeWidth="18" strokeLinecap="round"/><path d="M1200 735l40 40 90-110" fill="none" stroke="#5f826c" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M960 610v180" stroke="#6d5940" strokeWidth="16" strokeDasharray="16 16"/>
   </g>}
   {visualKey==='open-door'&&<g><rect x="650" y="210" width="380" height="500" rx="10" fill="#75563d" stroke="#30251e" strokeWidth="18"/><path d="M840 210v500" stroke="#4b3729" strokeWidth="12"/><circle cx="990" cy="475" r="13" fill="#e7c47f"/>{card(1090,320,340,280,'#e7d8b8')}{label(1140,400,'THÔNG TIN')}{label(1140,455,'CÔNG KHAI')}{label(1140,535,'CỨ HỎI RÕ')}</g>}
  </g>
 </svg>;
};

const extractSceneLabels=(scene:FilmSceneData):string[]=>{
 const source=[scene.audio||'',scene.props||''].join(' ');
 const quoted=[...source.matchAll(/[“"‘']([^”"’']{2,})[”"’']/g)].map(match=>match[1].trim());
 const labels=quoted.length?quoted:(/nhãn ảnh minh họa/i.test(source)?['ẢNH MINH HỌA']:[]);
 const cardTitle=(scene.cardTitle||'').trim().toLowerCase();
 // Production notes are not viewer-facing captions.
 return [...new Set(labels)]
  .filter(label=>label.toLowerCase()!==cardTitle)
  .filter(label=>!/tái\s*hiện|lời\s*kể/i.test(label))
  .slice(0,3);
};


type ReferenceArtworkKind = 'building'|'unverified'|'communique'|'community-hall'|'hamon-map'|'hmong-village';
const tinhThatPhotoUrl = 'https://media.techz.vn/resize_x700x/media2019/source/myphan/2025/thang-5/12-5/tinh-that-bong-lai-7.jpg';
const archivalPhotoStyle:React.CSSProperties = {
 filter:'grayscale(1) sepia(.34) contrast(.92) brightness(.91)',
};
const archivalOverlayStyle:React.CSSProperties = {
 position:'absolute',inset:0,pointerEvents:'none',
 background:'linear-gradient(135deg,rgba(255,246,220,.16),rgba(45,37,28,.12)),radial-gradient(ellipse at center,transparent 48%,rgba(34,28,22,.28) 100%),repeating-linear-gradient(0deg,rgba(70,55,38,.035) 0px,rgba(70,55,38,.035) 1px,transparent 1px,transparent 4px)',
 mixBlendMode:'multiply',
};
const ReferenceArtwork:React.FC<{kind:ReferenceArtworkKind}> = ({kind}) => {
  if(kind==='community-hall') return <svg viewBox="0 0 820 610" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
   <rect width="820" height="610" fill="#d8ded9"/><path d="M0 430Q180 390 360 435T820 410V610H0Z" fill="#9da996"/>
   <path d="M95 450V240L410 105L725 240V450Z" fill="#b9b4a7" stroke="#4d514d" strokeWidth="15"/>
   <path d="M65 248L410 78L755 248" fill="none" stroke="#414642" strokeWidth="22" strokeLinejoin="round"/>
   <rect x="155" y="270" width="510" height="180" fill="#e8e2d4" stroke="#625f55" strokeWidth="11"/>
   <rect x="340" y="305" width="140" height="145" fill="#647b78" stroke="#4a514c" strokeWidth="10"/>
   <rect x="210" y="310" width="85" height="75" fill="#9aa9a1" stroke="#5b625b" strokeWidth="8"/><rect x="525" y="310" width="85" height="75" fill="#9aa9a1" stroke="#5b625b" strokeWidth="8"/>
   <path d="M110 468H710" stroke="#5d5142" strokeWidth="14"/><path d="M190 500h440" stroke="#e4d7bd" strokeWidth="8"/>
  </svg>;
  if(kind==='hamon-map') return <svg viewBox="0 0 820 610" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
   <rect width="820" height="610" fill="#d9dfd8"/>
   <path d="M0 420Q130 340 245 410T470 390T820 370V610H0Z" fill="#a4b29a"/>
   <path d="M30 345L175 135L285 310L410 95L560 320L690 155L820 355" fill="#8b9d8b" stroke="#657767" strokeWidth="12" strokeLinejoin="round"/>
   <path d="M80 445Q200 365 310 430T540 420T790 400" fill="none" stroke="#e9dfc9" strokeWidth="18"/>
   <path d="M125 500Q260 420 385 475T690 455" fill="none" stroke="#8c9c80" strokeWidth="12"/>
   <path d="M410 190L410 300" stroke="#a94e43" strokeWidth="12" strokeLinecap="round"/><circle cx="410" cy="170" r="42" fill="#b24f43" stroke="#f4ead8" strokeWidth="12"/>
   <circle cx="410" cy="170" r="12" fill="#f4ead8"/>
   <rect x="520" y="455" width="220" height="72" rx="8" fill="#eee6d6" stroke="#786c59" strokeWidth="6"/><path d="M545 480h170M545 503h115" stroke="#9b8c73" strokeWidth="7" strokeLinecap="round"/>
  </svg>;
  if(kind==='hmong-village') return <svg viewBox="0 0 820 610" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
   <rect width="820" height="610" fill="#d9e0df"/><circle cx="650" cy="125" r="58" fill="#e9d5a9"/>
   <path d="M0 380L155 180L300 365L470 120L650 365L790 205L900 410V610H0Z" fill="#87998e"/>
   <path d="M0 455Q190 365 350 455T820 430V610H0Z" fill="#9caa8d"/>
   {[130,345,565].map((x,i)=><g key={x} transform={'translate('+x+' '+(i===1?0:18)+')'}><path d="M-70 385V300L0 245L70 300V385Z" fill="#c5b79d" stroke="#5d5a4f" strokeWidth="9"/><path d="M-86 300L0 225L86 300" fill="none" stroke="#514b42" strokeWidth="15" strokeLinejoin="round"/><rect x="-18" y="325" width="36" height="60" fill="#65756c"/><path d="M-90 390H90" stroke="#5e6d59" strokeWidth="12"/></g>)}
   <path d="M0 500Q210 440 410 510T820 485" fill="none" stroke="#e7dfca" strokeWidth="13"/>
  </svg>;
 if(kind==='building') return <svg viewBox="0 0 820 610" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
  <rect width="820" height="610" fill="#dce7df"/><text x="410" y="52" textAnchor="middle" fontSize="30" fontWeight="900" fill="#514536">TỊNH THẤT BỒNG LAI</text><circle cx="690" cy="110" r="58" fill="#f4dca6"/>
  <path d="M0 430Q180 390 360 430T820 410V610H0Z" fill="#9bb48e"/>
  <path d="M95 450V235L410 95L725 235V450Z" fill="#d7c8ac" stroke="#685846" strokeWidth="14"/>
  <path d="M65 245L410 75L755 245" fill="none" stroke="#5c5144" strokeWidth="22" strokeLinejoin="round"/>
  <rect x="145" y="265" width="530" height="185" fill="#eee5d4" stroke="#75634d" strokeWidth="10"/>
  <rect x="335" y="300" width="150" height="150" fill="#758d78" stroke="#4e5b4c" strokeWidth="10"/>
  <path d="M145 450H675" stroke="#5d4b3a" strokeWidth="14"/><rect x="105" y="468" width="610" height="55" rx="8" fill="#6f8e72"/>
  <text x="410" y="565" textAnchor="middle" fontSize="24" fontWeight="800" fill="#514536">TÁI HIỆN ĐỊA ĐIỂM · KHÔNG PHẢI ẢNH CHỤP</text>
 </svg>;
 if(kind==='communique') return <svg viewBox="0 0 820 610" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
  <rect width="820" height="610" fill="#e8e3d8"/><rect x="105" y="28" width="610" height="554" rx="8" fill="#fffdf7" stroke="#9b8b72" strokeWidth="5"/>
  <text x="410" y="92" textAnchor="middle" fontSize="25" fontWeight="800" fill="#33312d">HỘI ĐỒNG GIÁM MỤC VIỆT NAM</text>
  <text x="410" y="128" textAnchor="middle" fontSize="19" fontWeight="700" fill="#625a4e">ỦY BAN GIÁO LÝ ĐỨC TIN</text>
  <path d="M185 153H635" stroke="#9a8b72" strokeWidth="2"/><text x="410" y="225" textAnchor="middle" fontSize="48" fontWeight="900" fill="#33312d">THÔNG CÁO</text>
  <text x="410" y="278" textAnchor="middle" fontSize="26" fontWeight="800" fill="#514638">VỀ “NHÓM TRỪ QUỶ</text><text x="410" y="315" textAnchor="middle" fontSize="26" fontWeight="800" fill="#514638">BẢO LỘC”</text>
  {[0,1,2,3,4,5,6].map(i=><path key={i} d={'M190 '+(365+i*22)+'H630'} stroke="#b8ad9a" strokeWidth="5" strokeLinecap="round"/>)}
  <text x="410" y="545" textAnchor="middle" fontSize="21" fontWeight="700" fill="#665b4b">30.05.2022 · VĂN BẢN CHÍNH THỨC</text>
 </svg>;
 return <svg viewBox="0 0 820 610" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
  <rect width="820" height="610" fill="#e4e7e5"/><text x="410" y="42" textAnchor="middle" fontSize="27" fontWeight="900" fill="#38423d">TƯ LIỆU KIỂM CHỨNG</text><rect x="100" y="55" width="620" height="500" rx="24" fill="#f7f7f2" stroke="#87918d" strokeWidth="5"/>
  <circle cx="410" cy="205" r="78" fill="#d6dfda" stroke="#7b8982" strokeWidth="8"/><path d="M365 205h90M410 160v90" stroke="#718178" strokeWidth="12" strokeLinecap="round"/>
  <text x="410" y="355" textAnchor="middle" fontSize="34" fontWeight="900" fill="#38423d">KHÔNG DÙNG ẢNH</text>
  <text x="410" y="398" textAnchor="middle" fontSize="34" fontWeight="900" fill="#38423d">CHƯA XÁC MINH</text>
  <text x="410" y="465" textAnchor="middle" fontSize="22" fontWeight="600" fill="#68736d">Ưu tiên bản đồ và nghiên cứu</text>
  <text x="410" y="497" textAnchor="middle" fontSize="22" fontWeight="600" fill="#68736d">không gán ảnh người bất kỳ</text>
 </svg>;
};
const IntroSixReferenceGrid:React.FC<{frame:number}> = ({frame}) => {
 const items: Array<{title:string;note:string;photo:string;left:string;top:string;angle:number;z:number}>=[
  {title:'HỘI THÁNH ĐỨC CHÚA TRỜI MẸ',note:'HÀN QUỐC · 1964',photo:'reference/scene-04-reference.jpg',left:'0%',top:'1%',angle:-3.2,z:2},
  {title:'TỊNH THẤT BỒNG LAI',note:'BÌNH CHÁNH · TP HỒ CHÍ MINH',photo:'reference/scene-08-reference.jpg',left:'47%',top:'0%',angle:2.4,z:4},
  {title:'ĐẠO HÀ MÒN',note:'KON TUM · TÂY NGUYÊN',photo:'reference/scene-14-reference.jpg',left:'3%',top:'45%',angle:2.1,z:5},
  {title:'DƯƠNG VĂN MÌNH',note:'CỘNG ĐỒNG NGƯỜI MÔNG',photo:'reference/scene-22-reference.jpg',left:'48%',top:'43%',angle:-2.6,z:3},
 ];
 return <div style={{position:'absolute',left:530,right:22,top:145,bottom:24,zIndex:4}}>
  {items.map((item,index)=>{
   const p=interpolate(frame,[index*5,index*5+16],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
   return <div key={item.title} style={{position:'absolute',left:item.left,top:item.top,width:'54%',height:'54%',minWidth:0,minHeight:0,overflow:'hidden',padding:13,boxSizing:'border-box',borderRadius:3,background:'#faf7ef',border:'1px solid #b9ad98',boxShadow:'0 5px 9px rgba(28,24,20,.20),0 18px 28px rgba(28,24,20,.25),0 32px 48px rgba(28,24,20,.13)',opacity:p,transform:'translateY('+(1-p)*28+'px) rotate('+item.angle+'deg)',transformOrigin:'center center',zIndex:item.z,display:'flex',flexDirection:'column'}}>
    <div style={{position:'relative',flex:'1 1 70%',minHeight:0,overflow:'hidden',background:'#d8d2c4',border:'1px solid #d0c5b1'}}>
     <Img src={staticFile(item.photo)} style={{width:'100%',height:'100%',objectFit:'contain',display:'block',...archivalPhotoStyle}}/>
     <div style={archivalOverlayStyle}/>
    </div>
    <div style={{flex:'0 0 auto',minHeight:0,padding:'7px 8px 3px',display:'flex',flexDirection:'column',justifyContent:'center',textAlign:'center',background:'#faf7ef'}}>
     <div style={{fontFamily:'Be Vietnam Pro, sans-serif',fontSize:15,fontWeight:800,lineHeight:1.05,letterSpacing:.35,color:'#514638',textTransform:'none'}}>Ảnh minh hoạ</div>
     <div style={{fontSize:22,fontWeight:900,lineHeight:1.08,color:'#302d28',marginTop:4}}>{item.title}</div>
     <div style={{fontSize:16,fontWeight:650,lineHeight:1.08,color:'#71695d',marginTop:3}}>{item.note}</div>
    </div>
   </div>;
  })}
 </div>;
};

const SceneTwoOverview:React.FC<{frame:number}> = ({frame}) => {
 const items=[
  {title:'HỘI THÁNH ĐỨC CHÚA TRỜI MẸ',photo:'reference/scene-04-reference.jpg',left:54,top:190,angle:-2.5},
  {title:'TỊNH THẤT BỒNG LAI',photo:'reference/scene-08-reference.jpg',left:1436,top:190,angle:2.2},
  {title:'ĐẠO HÀ MÒN',photo:'reference/scene-14-reference.jpg',left:54,top:635,angle:2.1},
  {title:'DƯƠNG VĂN MÌNH',photo:'reference/scene-22-reference.jpg',left:1436,top:635,angle:-2.4},
 ];
 return <div style={{position:'absolute',inset:0,zIndex:4,pointerEvents:'none',background:'transparent'}}>
  <div style={{position:'absolute',top:38,left:360,right:360,textAlign:'center',fontSize:56,fontWeight:850,letterSpacing:1.1,lineHeight:1.08,color:'#514638',textShadow:'0 2px 0 #fffaf0,0 5px 12px rgba(60,48,32,.15)'}}>BỐN CÂU CHUYỆN · MỘT CÂU HỎI</div>
  {items.map((item,index)=>{
   const p=interpolate(frame,[index*5,index*5+16],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
   return <div key={item.title} style={{position:'absolute',left:item.left,top:item.top,width:430,height:270,padding:10,boxSizing:'border-box',background:'#faf7ef',border:'1px solid #b9ad98',boxShadow:'0 7px 14px rgba(28,24,20,.18),0 18px 30px rgba(28,24,20,.16)',opacity:p,transform:'translateY('+(1-p)*22+'px) rotate('+item.angle+'deg)',display:'flex',flexDirection:'column'}}>
    <div style={{flex:1,minHeight:0,overflow:'hidden',background:'#d8d2c4'}}><Img src={staticFile(item.photo)} style={{width:'100%',height:'100%',objectFit:'contain',display:'block',...archivalPhotoStyle}}/><div style={archivalOverlayStyle}/></div>
    <div style={{padding:'7px 4px 2px',fontSize:18,fontWeight:900,lineHeight:1.05,textAlign:'center',color:'#514638'}}>{item.title}</div>
   </div>;
  })}
  <div style={{position:'absolute',top:112,left:500,right:500,textAlign:'center',fontSize:25,fontWeight:900,letterSpacing:2,color:'#514638',textShadow:'0 2px 0 #fffaf0,0 4px 10px rgba(60,48,32,.18)'}}>SỰ KIỆN · CHỨNG CỨ · TRÁCH NHIỆM</div>
 </div>;
};

const SceneRecapOverview:React.FC = () => {
 const items=[
  {symbol:'▤',title:'TỔ CHỨC VÀ NIỀM TIN',note:'NHÌN VÀO CƠ CHẾ HOẠT ĐỘNG',tone:'#e7c99a'},
  {symbol:'⌂',title:'CƠ SỞ VÀ TRẺ EM',note:'ĐẶT QUYỀN TRẺ EM LÊN TRƯỚC',tone:'#b8c9c0'},
  {symbol:'⌖',title:'LỜI ĐỒN VÀ CHỨNG CỨ',note:'TÁCH LỜI KỂ KHỎI KẾT LUẬN',tone:'#d7b2a1'},
  {symbol:'△',title:'CỘNG ĐỒNG VÀ TRÁCH NHIỆM',note:'KHÔNG ĐÁNH ĐỒNG CON NGƯỜI',tone:'#bdc5dc'},
 ];
 return <div style={{position:'absolute',inset:0,zIndex:4,overflow:'hidden',background:'radial-gradient(ellipse at 82% 18%,#526b60 0%,#2b4543 52%,#1f3436 100%)'}}>
  <div style={{position:'absolute',left:470,top:72,fontSize:54,fontWeight:900,letterSpacing:1.2,color:'#fff4df',textShadow:'0 4px 16px rgba(0,0,0,.35)'}}>BỐN CÂU CHUYỆN · BỐN BỐI CẢNH</div>
  <div style={{position:'absolute',left:470,top:148,fontSize:24,fontWeight:700,color:'#d9d1bd'}}>MỖI CÂU CHUYỆN CẦN ĐƯỢC NHÌN ĐÚNG BẰNG CHỨNG VÀ HOÀN CẢNH</div>
  {items.map((item,index)=><div key={item.title} style={{position:'absolute',left:index%2===0?470:1170,top:index<2?250:625,width:620,height:285,padding:28,boxSizing:'border-box',borderRadius:18,background:'linear-gradient(145deg,rgba(255,249,234,.97),rgba(224,216,196,.96))',boxShadow:'0 20px 35px rgba(0,0,0,.24)',display:'flex',alignItems:'center',gap:24}}>
   <div style={{width:118,height:118,flex:'0 0 118px',borderRadius:28,background:item.tone,display:'flex',alignItems:'center',justifyContent:'center',fontSize:70,fontWeight:900,color:'#34443f',boxShadow:'inset 0 0 0 2px rgba(70,60,45,.16)'}}>{item.symbol}</div>
   <div style={{minWidth:0}}><div style={{fontSize:27,fontWeight:900,lineHeight:1.1,color:'#293a36'}}>{item.title}</div><div style={{fontSize:19,fontWeight:700,lineHeight:1.25,color:'#68736b',marginTop:14}}>{item.note}</div></div>
  </div>)}
  <div style={{position:'absolute',right:58,bottom:38,fontSize:18,fontWeight:800,letterSpacing:2,color:'#d8d0bd'}}>HỒ SƠ · STORY ANIMATIC</div>
 </div>;
};

const SceneClosingOverview:React.FC = () => <div style={{position:'absolute',inset:0,zIndex:4,overflow:'hidden',background:'radial-gradient(ellipse at 82% 50%,#526e63 0%,#304b45 38%,#1e3336 100%)'}}>
 <div style={{position:'absolute',left:-180,top:-240,width:820,height:820,borderRadius:'50%',border:'2px solid rgba(236,220,188,.16)'}}/>
 <div style={{position:'absolute',left:130,top:160,width:1110,height:740,borderRadius:30,background:'linear-gradient(145deg,#f4eddd,#d9d0bc)',boxShadow:'0 28px 60px rgba(0,0,0,.30)',padding:'74px 78px',boxSizing:'border-box'}}>
  <div style={{fontSize:24,fontWeight:900,letterSpacing:4,color:'#7b6a53'}}>HẾT TẬP · HẸN GẶP LẠI</div>
  <div style={{fontSize:72,fontWeight:950,lineHeight:1.02,letterSpacing:.5,color:'#263a36',marginTop:42,textShadow:'0 3px 0 rgba(255,255,255,.55),0 8px 18px rgba(0,0,0,.12)'}}>CẢM ƠN BẠN ĐÃ THEO DÕI</div>
  <div style={{fontSize:31,fontWeight:750,lineHeight:1.25,color:'#53645b',marginTop:34,maxWidth:820}}>HÃY GIỮ SỰ TÒ MÒ, KIỂM CHỨNG THÔNG TIN VÀ TÔN TRỌNG CON NGƯỜI</div>
  <div style={{display:'flex',gap:14,marginTop:54,flexWrap:'wrap'}}>
   {['KIỂM CHỨNG','LẮNG NGHE','TÔN TRỌNG'].map((x)=><div key={x} style={{padding:'16px 22px',borderRadius:30,background:'#334e47',color:'#fff4df',fontSize:18,fontWeight:900,letterSpacing:1}}>{x}</div>)}
  </div>
  <div style={{position:'absolute',left:78,bottom:58,fontSize:19,fontWeight:800,color:'#82745e',letterSpacing:2}}>MAINBOY · HẸN GẶP LẠI</div>
 </div>
 <div style={{position:'absolute',right:105,top:150,width:430,height:700,borderRadius:34,border:'2px solid rgba(244,230,201,.25)',background:'linear-gradient(160deg,rgba(244,230,201,.16),rgba(244,230,201,.04))'}}/>
 <div style={{position:'absolute',right:175,top:260,width:280,height:150,borderRadius:24,background:'#e8d7b7',transform:'rotate(5deg)',boxShadow:'0 16px 30px rgba(0,0,0,.2)'}}/>
 <div style={{position:'absolute',right:225,top:315,width:250,height:120,borderRadius:24,background:'#b6c8bd',transform:'rotate(-5deg)',boxShadow:'0 16px 30px rgba(0,0,0,.2)'}}/>
</div>;

const normalizeVisualText=(value:string)=>value
 .replace(/[;；]/g,' ')
 .replace(/[–—−]/g,' ')
 .replace(/\s*-\s*/g,' ')
 .replace(/\s+/g,' ')
 .trim()
 .toLocaleUpperCase('vi-VN');

const wrapVisualText=(value:string,maxChars:number):string[]=>{
 const words=value.split(/\s+/).filter(Boolean);
 const lines:string[]=[];
 let line='';
 for(const word of words){
  const candidate=line?line+' '+word:word;
  if(line && candidate.length>maxChars){lines.push(line);line=word;}
  else line=candidate;
 }
 if(line) lines.push(line);
 return lines;
};

const SceneInfoCaptions:React.FC<{scene:FilmSceneData;frame:number;whiteStage:boolean;characterOnLeft:boolean;hasPhoto:boolean}> = ({scene,frame,whiteStage,characterOnLeft,hasPhoto})=>{
 const labels=(scene.number===1||scene.number===2)?[]:extractSceneLabels(scene).map(normalizeVisualText).filter(Boolean);
 const labelWidth=hasPhoto?420:'min(760px, 44%)';
 const captionFontSize=hasPhoto?44:56;
 const captionMaxChars=hasPhoto?13:20;
 const labelSide=hasPhoto
  ? (characterOnLeft?{left:600}:{right:600})
  : (characterOnLeft?{right:72}:{left:72});
 return <>
  {!whiteStage && hasPhoto && scene.photoCaption ? <div style={{position:'absolute',right:150,top:620,width:680,maxWidth:'42%',zIndex:8,padding:'9px 14px',boxSizing:'border-box',background:'rgba(28,31,32,.82)',color:'#fff8e8',fontSize:18,fontWeight:700,lineHeight:1.25,textAlign:'center',textShadow:'0 2px 4px rgba(0,0,0,.55)',borderRadius:5}}>{normalizeVisualText(scene.photoCaption)}</div> : null}
  {labels.length>0?<div style={{position:'absolute',top:hasPhoto?175:76,...labelSide,width:labelWidth,zIndex:9,display:'flex',flexDirection:'column',alignItems:characterOnLeft?'flex-start':'flex-end',gap:16,pointerEvents:'none'}}>
   {labels.map((label,index)=>{
    const reveal=interpolate(frame,[index*6+3,index*6+18],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
    const lines=wrapVisualText(label,captionMaxChars);
    return <div key={label} style={{width:'100%',maxWidth:'100%',padding:'2px 4px',boxSizing:'border-box',textAlign:characterOnLeft?'left':'right',opacity:reveal,transform:'translateY('+(1-reveal)*18+'px) scale('+(0.98+reveal*0.02)+')',transformOrigin:characterOnLeft?'left center':'right center',textShadow:whiteStage?'1px 1px 0 #d7c8b2,2px 2px 0 #b8a58b,3px 3px 0 #927e64,4px 5px 0 rgba(63,49,34,.24),0 9px 18px rgba(0,0,0,.22)':'1px 1px 0 #c8b89c,2px 2px 0 #a39174,3px 3px 0 #77664f,4px 5px 0 rgba(0,0,0,.52),0 9px 18px rgba(0,0,0,.65)'}}>
     {lines.map((line,lineIndex)=><div key={lineIndex} style={{fontSize:captionFontSize,lineHeight:1.24,fontWeight:900,letterSpacing:.2,color:whiteStage?'#282522':'#fff8e8',whiteSpace:'nowrap',maxWidth:'100%',display:'block'}}>{line}</div>)}
    </div>;
   })}
  </div>:null}
 </>;
};

export const SceneStage:React.FC<{scene:FilmSceneData}> = ({scene}) => {
 const frame=useCurrentFrame();
 const {fps}=useVideoConfig();
 const world=chooseWorld(scene.setting+' '+scene.action+' '+scene.heading,scene.world);
 const actionText=(scene.action+' '+scene.heading+' '+scene.setting+' '+scene.narration).toLowerCase();
 const inferredExpression:BoyExpression=/tức giận|phẫn nộ|châm biếm|mỉa mai|vô lý|thiếu minh bạch|lừa dối|ép buộc/i.test(actionText)?'angry':/thắc mắc|tò mò|vì sao|tại sao|câu hỏi|điều gì|bạn có bao giờ|bạn sẽ hỏi/i.test(actionText)?'surprised':/đau lòng|buồn|mất mát|qua đời|trẻ em|tổn thương/i.test(actionText)?'sad':/đe dọa|nguy hiểm|lo lắng|cảnh báo|áp lực|sợ hãi|bạo lực|đàn áp/i.test(actionText)?'worried':/bất ngờ|phát hiện|hé lộ|bí mật|đột ngột/i.test(actionText)?'surprised':/chào|mỉm cười|cảm ơn|hẹn gặp|hy vọng|tốt đẹp/i.test(actionText)?'happy':'neutral';
 const expression:BoyExpression=scene.expression||inferredExpression;
 const performanceRig=buildMainBoyPerformance({frame,fps,durationInFrames:scene.durationInFrames,action:scene.action,narration:scene.narration,heading:scene.heading});
 const whiteStage=Boolean(scene.stage && scene.stage.startsWith('white-'));
 // EdgeOne links in the approved script currently resolve to HTML/404, not image bytes.
 // Never pass these URLs to Remotion: use the built-in, clearly illustrative artwork instead.
 const unavailableUserPhoto=Boolean(scene.photo && /\.edgeone\.dev\/?$/i.test(scene.photo));
 const referencePhoto=(unavailableUserPhoto?null:scene.photo) || (!whiteStage ? (/Nam Kỳ đầu thế kỷ/.test(scene.heading)?'reference/cochinchina-map.jpg':/Khám Lớn Sài Gòn/.test(scene.heading)?'reference/saigon-maison-centrale.jpg':/Thanh niên Cao vọng/.test(scene.heading)?'reference/nguyen-an-ninh-1929.jpg':null) : null);
 // Use the original ChibiDemo entrance: spring up from below and scale from zero,
 // followed by one short settling bounce. Do not add idle bobbing after entrance.
 const entrance=spring({frame,fps,config:{damping:12,stiffness:95}});
 const bounce=frame<30?Math.sin((frame/12)*Math.PI*2)*9*(1-frame/30):0;
 const entranceY=(1-entrance)*180+bounce;
 const entranceScale=entrance;
 const propEntrance=spring({frame:Math.max(0,frame-3),fps,config:{damping:18,stiffness:125}});
 const propOpacity=interpolate(frame,[2,15],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 // Gesture intent comes from the action, not narration or props; merely opening,
 // moving, or handling an object must not make MainBoy point at empty space.
 const waves=/vẫy|chào|giơ tay chào/i.test(scene.action);
 const characterOnLeft=scene.number===15 ? true : whiteStage || scene.number%2===0 || Boolean(referencePhoto) || unavailableUserPhoto;
 const gesture:BoyGesture=waves?'wave':'rest';
const facing=characterOnLeft?'right':'left';
 const characterPosition:React.CSSProperties=scene.number===2?{left:757,bottom:42}:scene.number===32?{right:100,bottom:45}:whiteStage?{left:55,bottom:55}:(referencePhoto||unavailableUserPhoto)?{left:55,bottom:45}:world==='meeting'?{right:190,bottom:105}:characterOnLeft?{left:62,bottom:45}:{right:62,bottom:45};

 const mouthFrames=scene.mouthFrames||[];
 const speakingLevel=mouthFrames.length?mouthFrames[Math.min(frame,mouthFrames.length-1)]:undefined;

 const fallbackKind:ReferenceArtworkKind|undefined=unavailableUserPhoto?'unverified':undefined;
 const scaleSteps=[1.22,1.27,1.24,1.30,1.26,1.23];
 const characterScale=scene.number===2?1.32:scene.stage==='white-intro'?1.20:scaleSteps[(scene.number*5+1)%scaleSteps.length];
 return <div style={{position:'absolute',inset:0,overflow:'hidden',background:whiteStage?((scene.number===23||scene.number===32)?'#243b3b':'#ffffff'):'#20252b',fontFamily:'Be Vietnam Pro, sans-serif',textTransform:'uppercase'}}>
  {!whiteStage ? <><div style={{position:'absolute',inset:0}}><Backdrop world={world}/></div><div style={{position:'absolute',inset:0,opacity:propOpacity,transform:'translateY('+(1-propEntrance)*42+'px) scale('+(0.94+propEntrance*0.06)+')',transformOrigin:'center center'}}><SceneObjects scene={scene}/><SceneAssetLayer scene={scene}/></div></> : null}
  {referencePhoto ? <div style={{position:'absolute',right:whiteStage?105:150,top:whiteStage?125:140,width:whiteStage?820:(scene.number===3||scene.number===10?520:680),height:whiteStage?610:(scene.number===3||scene.number===10?700:470),padding:14,boxSizing:'border-box',background:'#f5f0e7',border:'2px solid rgba(72,57,42,.42)',borderRadius:8,zIndex:2,filter:'drop-shadow(0 18px 22px rgba(0,0,0,.22))',transform:whiteStage?'none':'rotate(-1.2deg)'}}><div style={{position:'relative',width:'100%',height:'100%',background:'#d8cdb8',overflow:'hidden'}}><Img src={referencePhoto.startsWith('http')?referencePhoto:staticFile(referencePhoto)} style={{width:'100%',height:'100%',objectFit:'contain',display:'block',...archivalPhotoStyle}}/><div style={archivalOverlayStyle}/></div></div> : null}
  {referencePhoto && scene.photoLabel ? <div style={{position:'absolute',right:whiteStage?105:150,top:whiteStage?744:620,width:whiteStage?820:680,zIndex:7,textAlign:'center',fontFamily:'Be Vietnam Pro, sans-serif',fontSize:11,lineHeight:1.2,fontWeight:700,letterSpacing:.2,color:whiteStage?'#282522':'#fff8e8',textTransform:'none',textShadow:whiteStage?'1px 1px 0 #e5dccd,2px 2px 0 #c9b99f,3px 3px 0 #a18d70,4px 5px 0 rgba(40,32,24,.30),0 9px 18px rgba(0,0,0,.24)':'1px 1px 0 #c8b89c,2px 2px 0 #a39174,3px 3px 0 #77664f,4px 5px 0 rgba(0,0,0,.52),0 9px 18px rgba(0,0,0,.65)'}}>{'Ảnh minh hoạ'}</div> : null}
  {scene.number===2?<SceneTwoOverview frame={frame}/>:null}
  {scene.number===23?<SceneRecapOverview/>:null}
  {scene.number===32?<SceneClosingOverview/>:null}
   {scene.stage==='white-intro'&&scene.number===1?<><div style={{position:'absolute',left:555,right:48,top:38,zIndex:5,textAlign:'center',fontSize:62,fontWeight:900,letterSpacing:.5,lineHeight:1.1,color:'#282522',textShadow:'1px 1px 0 #e4d8c6,2px 2px 0 #c7b69c,3px 3px 0 #9d896d,4px 5px 0 rgba(67,51,34,.25),0 9px 18px rgba(0,0,0,.22)'}}>4 CÁNH CỬA NIỀM TIN</div><IntroSixReferenceGrid frame={frame}/></>:null}
  {fallbackKind?<div style={{position:'absolute',right:105,top:125,width:820,height:610,padding:12,boxSizing:'border-box',background:'#f5f0e7',border:'2px solid rgba(72,57,42,.42)',borderRadius:8,zIndex:2,filter:'drop-shadow(0 18px 22px rgba(0,0,0,.22))'}}><div style={{width:'100%',height:'100%',...archivalPhotoStyle}}><ReferenceArtwork kind={fallbackKind}/></div>{unavailableUserPhoto?<div style={{position:'absolute',left:12,right:12,bottom:12,textAlign:'center',fontSize:11,fontWeight:700,color:'#282522',textTransform:'none',textShadow:'1px 1px 0 #e5dccd,2px 2px 0 #c9b99f,3px 3px 0 #a18d70'}}>Ảnh minh hoạ</div>:null}</div>:null}
  {whiteStage && scene.cardTitle && !fallbackKind ? <div style={{position:'absolute',right:95,top:referencePhoto?800:270,width:820,zIndex:7,textAlign:'center',fontSize:54,lineHeight:1.08,fontWeight:900,color:'#282828',textShadow:'1px 1px 0 #e5dccd,2px 2px 0 #c9b99f,3px 3px 0 #a18d70,4px 5px 0 rgba(40,32,24,.30),0 9px 18px rgba(0,0,0,.24)'}}>{normalizeVisualText(scene.cardTitle)}</div> : null}
  {whiteStage && scene.photoCaption && !fallbackKind ? <div style={{position:'absolute',right:105,top:referencePhoto?744:690,width:800,zIndex:7,textAlign:'center',fontSize:24,lineHeight:1.22,fontWeight:700,color:'#555',textShadow:'1px 1px 0 rgba(255,255,255,.75),2px 2px 0 rgba(115,98,76,.14),0 5px 10px rgba(0,0,0,.16)'}}>{normalizeVisualText(scene.photoCaption)}</div> : null}
   <SceneInfoCaptions scene={scene} frame={frame} whiteStage={whiteStage} characterOnLeft={characterOnLeft} hasPhoto={Boolean(referencePhoto)||unavailableUserPhoto}/>
  {!whiteStage ? <SceneSupportingCast scene={scene}/> : null}
  {scene.character !== 'none' ? <div style={{position:'absolute',...characterPosition,width:405,height:540,overflow:'visible',zIndex:6,pointerEvents:'none',filter:whiteStage?'drop-shadow(0 12px 14px rgba(0,0,0,.16))':'drop-shadow(0 18px 20px rgba(0,0,0,.34))',transform:'translateY('+entranceY+'px) scale('+(entranceScale*characterScale)+')',transformOrigin:'center bottom'}}><div style={{position:'relative',width:405,height:540}}><MainBoy facing={facing} expression={expression} gesture={gesture} speaking={Boolean(scene.voiceover)} speakingLevel={speakingLevel} mouth={expression==='happy'?'smile':'closed'} blink={frame%112>104&&frame%112<109} rig={{...performanceRig,...(scene.rig||{})}} debugRig={scene.debugRig}/></div></div> : null}
 </div>;
};
