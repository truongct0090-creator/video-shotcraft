import React from 'react';
import {useCurrentFrame} from 'remotion';
import {MainBoy, type BoyExpression, type BoyGesture} from '../chibi/MainBoy';
import {dampedSettle} from '../../../assets/lib/helpers/motion';
import {handheld} from '../../../assets/lib/helpers/shake';

export type FilmSceneData = {
  number:number; heading:string; setting:string; action:string; narration:string;
  audio:string; durationInFrames:number; world?:string; character?:string;
};

type World = 'alley'|'archive'|'map'|'teahouse'|'historic'|'countryside'|'modern'|'interior'|'generic';
const chooseWorld = (text:string, preferred?:string):World => {
  if (preferred && ['alley','archive','map','teahouse','historic','countryside','modern','interior','generic'].includes(preferred)) return preferred as World;
  const s=text.toLowerCase();
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

const Backdrop:React.FC<{world:World;frame:number}> = ({world,frame}) => {
 const drift=Math.sin(frame/55)*18;
 const sky:Record<World,string>={alley:'#25283b',archive:'#28303a',map:'#e6d9b8',teahouse:'#30251e',historic:'#d8c7a5',countryside:'#d9ebd2',modern:'#b9d9df',interior:'#ded2bf',generic:'#d8d1c3'};
 const ground:Record<World,string>={alley:'#393746',archive:'#46505a',map:'#c3ae83',teahouse:'#57402e',historic:'#9e9b78',countryside:'#83ad79',modern:'#78999a',interior:'#9a8067',generic:'#9d947f'};
 return <svg viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
  <defs><linearGradient id="film-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={sky[world]}/><stop offset="1" stopColor={ground[world]}/></linearGradient><linearGradient id="film-glow" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff3cb" stopOpacity=".65"/><stop offset="1" stopColor="#fff3cb" stopOpacity="0"/></linearGradient></defs>
  <rect width="1920" height="1080" fill="url(#film-sky)"/>
  {(world==='alley'||world==='historic'||world==='modern')&&<g transform={`translate(${drift} 0)`} fill={world==='modern'?'#405c67':'#514a45'} stroke="#292b30" strokeWidth="9">
   <path d="M-80 720V250L250 145 530 250V720Z"/><path d="M1390 720V190L1710 95 2010 220V720Z"/>
   {Array.from({length:4},(_,i)=><g key={i}><rect x={45+i*115} y="340" width="70" height="130" fill="#e7bb79"/><rect x={1450+i*120} y="290" width="75" height="145" fill="#e7bb79"/></g>)}
   <path d="M0 820L500 690H1400L1920 820V1080H0Z" fill={ground[world]}/>
  </g>}
  {world==='alley'&&<g><path d="M0 0H1920V1080H0Z" fill="#111522" opacity=".18"/><path d="M780 0H1140V750H780Z" fill="#151a27"/><rect x="850" y="340" width="220" height="360" rx="8" fill="#654b39" stroke="#c59c61" strokeWidth="12"/><circle cx="1030" cy="520" r="10" fill="#f5d18a"/><path d="M900 360H1020" stroke="#e9c98f" strokeWidth="5"/></g>}
  {world==='archive'&&<g><rect x="120" y="170" width="1680" height="680" rx="18" fill="#d5c5a7" stroke="#695947" strokeWidth="16"/>{Array.from({length:8},(_,i)=><g key={i}><path d={`M${210+i*210} 245V770`} stroke="#a28e70" strokeWidth="5"/><rect x={225+i*210} y={290+(i%3)*45} width="140" height="180" fill={['#b66f50','#6f8290','#c7a66e'][i%3]} stroke="#66513d" strokeWidth="7"/><path d={`M${240+i*210} ${520+(i%2)*70}h110m-110 25h85`} stroke="#725f49" strokeWidth="7"/></g>)}</g>}
  {world==='map'&&<g><rect x="130" y="110" width="1660" height="810" rx="24" fill="#e8dbba" stroke="#6e5b42" strokeWidth="18"/><path d="M260 300Q520 180 700 370T1080 350T1620 270M260 690Q510 530 800 690T1420 600" fill="none" stroke="#8c9b77" strokeWidth="24" strokeLinecap="round"/><path d="M380 200L550 810M900 160L1050 850M1400 180L1280 820" stroke="#b99d71" strokeWidth="10" strokeDasharray="20 20"/>{[[500,360],[930,420],[1320,580],[690,700]].map(([x,y],i)=><g key={i}><circle cx={x} cy={y} r="28" fill="#b44d43" stroke="#fff1d1" strokeWidth="8"/><text x={x+42} y={y-20} fill="#514431" fontSize="34" fontWeight="bold">ĐIỂM {i+1}</text></g>)}</g>}
  {world==='teahouse'&&<g><rect x="170" y="170" width="1580" height="660" fill="#6d4d34" stroke="#241d19" strokeWidth="18"/><path d="M170 340H1750M170 650H1750" stroke="#b88a54" strokeWidth="14"/><rect x="530" y="560" width="860" height="210" rx="20" fill="#4b3024" stroke="#201b18" strokeWidth="16"/><path d="M700 550q0-100 110-100t110 100M1050 550q0-100 110-100t110 100" fill="#d7a65e" stroke="#3b2a20" strokeWidth="10"/></g>}
  {world==='historic'&&<g><path d="M0 750Q400 650 800 760T1920 740V1080H0Z" fill="#8d9a72"/><path d="M180 700V390L500 240 820 390V700Z" fill="#b8a17b" stroke="#695b48" strokeWidth="12"/><path d="M300 700V500Q500 370 700 500V700" fill="#514b43"/><path d="M1150 700V430L1400 300 1650 430V700Z" fill="#c8b18a" stroke="#76634b" strokeWidth="12"/><path d="M0 820H1920" stroke="#776f5a" strokeWidth="30"/></g>}
  {world==='countryside'&&<g><circle cx="1540" cy="200" r="105" fill="#f8d98e"/><path d="M0 700Q360 540 700 700T1400 670T1920 650V1080H0Z" fill="#a9c78e"/><path d="M0 820Q420 650 800 840T1600 800T1920 850V1080H0Z" fill="#789c6d"/>{[180,400,1500,1740].map((x,i)=><g key={i} transform={`translate(${x} 0)`}><path d="M0 700V480" stroke="#6a7046" strokeWidth="22"/><circle cx="0" cy="450" r="100" fill="#648b5c"/><circle cx="-55" cy="490" r="55" fill="#7da66c"/></g>)}</g>}
  {world==='modern'&&<g>{Array.from({length:8},(_,i)=><g key={i}><rect x={100+i*230} y={220+(i%3)*65} width="170" height={500-(i%3)*65} fill="#526b75" stroke="#354c55" strokeWidth="9"/>{Array.from({length:6},(_,j)=><rect key={j} x={120+i*230+(j%2)*70} y={250+(i%3)*65+Math.floor(j/2)*65} width="42" height="38" fill="#f0d49a"/> )}</g>)}</g>}
  {world==='interior'&&<g><rect x="120" y="110" width="1680" height="820" fill="#d6c5a8" stroke="#735d48" strokeWidth="18"/><rect x="230" y="220" width="520" height="420" fill="#9ab0b1" stroke="#6b5948" strokeWidth="16"/><path d="M490 220V640M230 430H750" stroke="#6b5948" strokeWidth="12"/><rect x="900" y="520" width="700" height="220" rx="14" fill="#78553a"/></g>}
  {world==='generic'&&<g><path d="M0 780Q400 700 800 780T1600 770T1920 760V1080H0Z" fill="#aaa18d"/><circle cx="1550" cy="200" r="90" fill="#f0d49a"/></g>}
  <rect width="1920" height="1080" fill="url(#film-glow)" opacity=".24"/>
 </svg>;
};

export const SceneStage:React.FC<{scene:FilmSceneData}> = ({scene}) => {
 const frame=useCurrentFrame();
 const world=chooseWorld(scene.setting+' '+scene.action+' '+scene.heading,scene.world);
 const expression:BoyExpression=/nguy|cảnh báo|đáng ngờ|tranh cãi|bí mật/i.test(scene.action+' '+scene.heading)?'worried':/bất ngờ|nhướng mày|hé cửa/i.test(scene.action+' '+scene.heading)?'surprised':'neutral';
 const gesture:BoyGesture=/chỉ|đánh dấu|giới thiệu|dán nhãn|mở bản đồ/i.test(scene.action)?'point':/vẫy|chào/i.test(scene.action)?'wave':'rest';
 const settle=dampedSettle(frame-8,0.075,0.16);
 const zoom=1+Math.sin(frame/90)*.018+settle*.025;
 const [driftX,driftY]=handheld(frame,1.4);
 return <div style={{position:'absolute',inset:0,overflow:'hidden',background:'#20252b'}}>
  <div style={{position:'absolute',inset:-30,transform:`translate(${driftX}px,${driftY}px) scale(${zoom})`}}><Backdrop world={world} frame={frame}/></div>
  <div style={{position:'absolute',left:70,top:72,color:'#f4e8d1',fontSize:22,letterSpacing:5,fontWeight:700,textShadow:'0 2px 8px #111'}}>XƯỞNG PHIM · TÁI HIỆN MINH HỌA</div>
  <div style={{position:'absolute',right:68,top:62,padding:'12px 22px',borderRadius:30,background:'rgba(20,24,29,.72)',color:'#f4e8d1',fontSize:22}}>CẢNH {String(scene.number).padStart(2,'0')}</div>
  {scene.character !== 'none' ? <div style={{position:'absolute',right:90,bottom:90,width:390,height:540,filter:'drop-shadow(0 18px 20px rgba(0,0,0,.25))'}}><MainBoy expression={expression} gesture={gesture} speaking={false} mouth="closed" blink={frame%112>104&&frame%112<109}/></div> : null}
  <div style={{position:'absolute',left:100,top:190,maxWidth:1050,padding:'30px 38px',background:'rgba(17,22,28,.74)',borderLeft:'8px solid #e0b56f',borderRadius:12,color:'#fff7e8'}}>
   <div style={{fontSize:18,letterSpacing:4,color:'#e9c47f',marginBottom:18}}>PHÂN CẢNH {String(scene.number).padStart(2,'0')}</div>
   <div style={{fontSize:54,lineHeight:1.12,fontWeight:800}}>{scene.heading}</div>
   <div style={{fontSize:27,lineHeight:1.38,marginTop:24,color:'#e7dfd1'}}>{scene.setting}</div>
  </div>
  <div style={{position:'absolute',left:0,right:0,bottom:0,padding:'30px 90px 42px',background:'linear-gradient(0deg,rgba(10,13,17,.96),rgba(10,13,17,.82))',color:'#fff',minHeight:185}}>
   <div style={{fontSize:18,letterSpacing:4,color:'#e9c47f',marginBottom:12}}>LỜI KỂ · PHỤ ĐỀ</div>
   <div style={{fontSize:32,lineHeight:1.3,fontWeight:600,maxWidth:1710}}>{scene.narration}</div>
  </div>
 </div>;
};
