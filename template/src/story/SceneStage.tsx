import React from 'react';
import {Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {MainBoy, type BoyExpression, type BoyGesture} from '../chibi/MainBoy';
import {SceneAssetLayer} from './SceneAssetLayer';


export type FilmSceneData = {
  number:number; heading:string; setting:string; action:string; narration:string;
  audio:string; durationInFrames:number; world?:string; character?:string; voiceover?:string; props?:string; shot?:string; mouthFrames?:number[];
};

type World = 'alley'|'archive'|'map'|'teahouse'|'historic'|'countryside'|'modern'|'interior'|'meeting'|'investigation'|'printing'|'community'|'checklist'|'timeline'|'generic';
const chooseWorld = (text:string, preferred?:string):World => {
  const s=text.toLowerCase();
  if (preferred && ['alley','archive','map','teahouse','historic','countryside','modern','interior','meeting','investigation','printing','community','checklist','timeline','generic'].includes(preferred)) return preferred as World;
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
 const sky:Record<World,string>={alley:'#25283b',archive:'#28303a',map:'#e6d9b8',teahouse:'#30251e',historic:'#d8c7a5',countryside:'#d9ebd2',modern:'#b9d9df',interior:'#ded2bf',meeting:'#d7d0c1',investigation:'#29343a',printing:'#b99d7a',community:'#d9e0cb',checklist:'#d8dfdc',timeline:'#c8b99d',generic:'#d8d1c3'};
 const ground:Record<World,string>={alley:'#393746',archive:'#46505a',map:'#c3ae83',teahouse:'#57402e',historic:'#9e9b78',countryside:'#83ad79',modern:'#78999a',interior:'#9a8067',meeting:'#8c7964',investigation:'#46504c',printing:'#76583d',community:'#8e9b7c',checklist:'#7e8c86',timeline:'#8c775e',generic:'#9d947f'};
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
  {world==='investigation'&&<g><rect x="150" y="130" width="1620" height="700" rx="18" fill="#45534f" stroke="#1f292b" strokeWidth="18"/><rect x="270" y="220" width="1380" height="470" fill="#c6b38f" stroke="#594d3d" strokeWidth="14"/><rect x="340" y="300" width="135" height="155" fill="#e7d8b8" stroke="#6b5844" strokeWidth="8"/><rect x="760" y="445" width="135" height="155" fill="#b8c8c0" stroke="#6b5844" strokeWidth="8"/><rect x="1190" y="300" width="135" height="155" fill="#d9b6a2" stroke="#6b5844" strokeWidth="8"/><path d="M410 350L760 470L1190 350M830 520L1260 600" fill="none" stroke="#b34e43" strokeWidth="8" strokeDasharray="18 12"/></g>}
  {world==='printing'&&<g><rect x="120" y="160" width="1680" height="670" fill="#d0b48a" stroke="#5b4632" strokeWidth="18"/><path d="M250 720V390H730V720M300 390V280H680V390" fill="#79583b" stroke="#3f3024" strokeWidth="18"/><rect x="360" y="300" width="250" height="80" fill="#b88b55" stroke="#4b3828" strokeWidth="12"/><path d="M485 380V560M395 560H575" stroke="#493729" strokeWidth="22"/><rect x="900" y="330" width="470" height="350" fill="#e9dfc9" stroke="#6d5943" strokeWidth="14"/><path d="M960 390H1310M960 435H1310M960 480H1310M960 525H1310M960 570H1310" stroke="#8c7b61" strokeWidth="8"/></g>}
  {world==='community'&&<g><rect x="130" y="130" width="1660" height="700" rx="24" fill="#e3ddc9" stroke="#76664e" strokeWidth="16"/><rect x="250" y="220" width="420" height="310" fill="#a8c3c2" stroke="#6d604c" strokeWidth="14"/><path d="M460 220V530M250 375H670" stroke="#6d604c" strokeWidth="12"/><rect x="850" y="480" width="620" height="160" rx="18" fill="#8a6548" stroke="#4e3a2a" strokeWidth="12"/><rect x="285" y="580" width="130" height="90" rx="18" fill="#9a7958" stroke="#554735" strokeWidth="9"/><rect x="1500" y="580" width="130" height="90" rx="18" fill="#9a7958" stroke="#554735" strokeWidth="9"/></g>}
  {world==='checklist'&&<g><rect x="120" y="120" width="1680" height="730" fill="#dce2dc" stroke="#5c6a64" strokeWidth="18"/><rect x="380" y="190" width="1160" height="520" rx="18" fill="#b9c8bd" stroke="#64776c" strokeWidth="14"/><path d="M500 310H1420M500 455H1420M500 600H1420" stroke="#8b9b8f" strokeWidth="8"/><rect x="250" y="820" width="1420" height="110" fill="#8a7156"/></g>}
  {world==='timeline'&&<g><rect x="120" y="140" width="1680" height="680" fill="#e5d8bd" stroke="#76634b" strokeWidth="18"/><path d="M260 530H1660" stroke="#806b4d" strokeWidth="18" strokeLinecap="round"/><circle cx="380" cy="530" r="44" fill="#a84e43" stroke="#f5e9d1" strokeWidth="10"/><circle cx="760" cy="530" r="44" fill="#66816a" stroke="#f5e9d1" strokeWidth="10"/><circle cx="1140" cy="530" r="44" fill="#b58b52" stroke="#f5e9d1" strokeWidth="10"/><circle cx="1520" cy="530" r="44" fill="#526e83" stroke="#f5e9d1" strokeWidth="10"/><rect x="270" y="300" width="220" height="120" fill="#f0e4ca" stroke="#806b4d" strokeWidth="9"/><rect x="650" y="300" width="220" height="120" fill="#f0e4ca" stroke="#806b4d" strokeWidth="9"/><rect x="1030" y="300" width="220" height="120" fill="#f0e4ca" stroke="#806b4d" strokeWidth="9"/><rect x="1410" y="300" width="220" height="120" fill="#f0e4ca" stroke="#806b4d" strokeWidth="9"/></g>}
  {world==='generic'&&<g><path d="M0 780Q400 700 800 780T1600 770T1920 760V1080H0Z" fill="#aaa18d"/><circle cx="1550" cy="200" r="90" fill="#f0d49a"/></g>}
  <rect width="1920" height="1080" fill="url(#film-glow)" opacity=".24"/>
 </svg>;
};


const SceneObjects:React.FC<{scene:FilmSceneData}> = ({scene}) => {

 const propText=(scene.props||[scene.setting,scene.action,scene.heading].join(' ')).toLowerCase();
 const visualKey=/cánh cửa|tấm giấy mời/.test(propText)?'invitation':
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
  /bảng checklist/.test(propText)?'checklist':
  /dòng thời gian/.test(propText)?'timeline':
  /cánh cửa mở/.test(propText)?'open-door':'generic';
 const label=(_x:number,_y:number,_value:string,_color='#594b3a')=>null;
 const card=(x:number,y:number,w:number,h:number,fill='#e7d8b8')=><g><rect x={x} y={y} width={w} height={h} rx="10" fill={fill} stroke="#68563f" strokeWidth="9"/><rect x={x+9} y={y+9} width={w-18} height={h-18} rx="6" fill="none" stroke="#fff6df" strokeOpacity=".38" strokeWidth="4"/><path d={`M${x+18} ${y+17}H${x+w-18}`} stroke="#fff8e9" strokeOpacity=".28" strokeWidth="4" strokeLinecap="round"/><path d={`M${x+18} ${y+h-15}H${x+w-18}`} stroke="#3f3024" strokeOpacity=".16" strokeWidth="3" strokeLinecap="round"/></g>;
 return <svg viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid meet" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
  <defs><filter id="story-prop-depth" x="-35%" y="-35%" width="180%" height="190%"><feGaussianBlur in="SourceAlpha" stdDeviation="3" result="contact-blur"/><feOffset in="contact-blur" dx="0" dy="7" result="contact-offset"/><feComponentTransfer in="contact-offset" result="contact-shadow"><feFuncA type="linear" slope="0.30"/></feComponentTransfer><feGaussianBlur in="SourceAlpha" stdDeviation="18" result="ambient-blur"/><feOffset in="ambient-blur" dx="12" dy="24" result="ambient-offset"/><feComponentTransfer in="ambient-offset" result="ambient-shadow"><feFuncA type="linear" slope="0.24"/></feComponentTransfer><feMerge><feMergeNode in="ambient-shadow"/><feMergeNode in="contact-shadow"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
  <g filter="url(#story-prop-depth)">
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
   {visualKey==='open-door'&&<g><rect x="650" y="210" width="380" height="500" rx="10" fill="#75563d" stroke="#30251e" strokeWidth="18"/><path d="M840 210v500" stroke="#4b3729" strokeWidth="12"/><circle cx="990" cy="475" r="13" fill="#e7c47f"/>{card(1090,320,340,280,'#e7d8b8')}{label(1140,400,'THÔNG TIN')}{label(1140,455,'CÔNG KHAI')}{label(1140,535,'CỨ HỎI RÕ')}</g>}
  </g>
 </svg>;
};

export const SceneStage:React.FC<{scene:FilmSceneData}> = ({scene}) => {
 const frame=useCurrentFrame();
 const {fps}=useVideoConfig();
 const world=chooseWorld(scene.setting+' '+scene.action+' '+scene.heading,scene.world);
 const actionText=(scene.action+' '+scene.heading+' '+scene.setting+' '+scene.narration).toLowerCase();
 const expression:BoyExpression=/bạo lực|đàn áp|đe dọa|cảnh báo|nguy|áp bức|bắt/i.test(actionText)?'worried':/bất ngờ|nhướng mày|rơi xuống|hé cửa|bí mật/i.test(actionText)?'surprised':/châm biếm|quảng cáo|siêu giảm|mua một|mập mờ/i.test(actionText)?'angry':/chào|mỉm cười|kết|cứ hỏi/i.test(actionText)?'happy':'neutral';
 const points=/chỉ|đánh dấu|dán|gắn|mở|dùng kính|gạch chân|soi|đặt|kéo|kiểm tra|phóng to|giơ tấm bảng|từng câu hỏi|xếp|đóng dấu|checklist|di chuyển trên bản đồ/i.test(actionText+' '+(scene.props||''));
 const waves=/vẫy|chào|quay sang camera|giơ tấm bảng/i.test(actionText);
 // Full-body staging: stable scale, complete silhouette and inward-facing eyeline.
 const referencePhoto=scene.number===3?'reference/cochinchina-map.jpg':scene.number===7?'reference/saigon-maison-centrale.jpg':scene.number===10?'reference/nguyen-an-ninh-1929.jpg':null;
 const characterSide:'left'|'right'=referencePhoto?'left':scene.number%2===0?'left':'right';
 const facing=characterSide==='left'?'right':'left';
 const entrance=spring({frame,fps,config:{damping:18,stiffness:120}});
 const entranceX=interpolate(entrance,[0,1],[characterSide==='left'?-26:26,0]);
 const entranceOpacity=interpolate(entrance,[0,1],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 const actionPhase=interpolate(frame,[8,24,42],[0,1,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 const gesture:BoyGesture=waves?'wave':points&&actionPhase>.15&&frame<scene.durationInFrames*.88
  ? (facing==='right'?'point-right':'point-left')
  : 'rest';

 const mouthFrames=scene.mouthFrames||[];
 const speakingLevel=mouthFrames.length?mouthFrames[Math.min(frame,mouthFrames.length-1)]:undefined;
 const referencePhoto=scene.number===3?'reference/cochinchina-map.jpg':scene.number===7?'reference/saigon-maison-centrale.jpg':scene.number===10?'reference/nguyen-an-ninh-1929.jpg':null;
 return <div style={{position:'absolute',inset:0,overflow:'hidden',background:'#20252b',fontFamily:'Be Vietnam Pro, sans-serif'}}>
  <div style={{position:'absolute',inset:0}}><Backdrop world={world}/></div>
  <SceneObjects scene={scene}/>
  <SceneAssetLayer scene={scene}/>
  {referencePhoto ? <div style={{position:'absolute',right:150,top:140,width:scene.number===3||scene.number===10?520:680,height:scene.number===3||scene.number===10?700:470,padding:14,boxSizing:'border-box',background:'#eee5d3',border:'2px solid rgba(72,57,42,.72)',borderRadius:8,zIndex:2,filter:'drop-shadow(0 24px 30px rgba(0,0,0,.48))',transform:'rotate(-1.2deg)'}}><Img src={staticFile(referencePhoto)} style={{width:'100%',height:'100%',objectFit:'contain',display:'block'}}/></div> : null}
  <div style={{position:'absolute',left:'10%',right:'10%',bottom:42,zIndex:8,margin:'0 auto',maxWidth:1600,padding:'18px 30px',boxSizing:'border-box',background:'rgba(16,20,24,.72)',borderRadius:18,color:'#fffaf0',fontSize:34,lineHeight:1.42,fontWeight:650,textAlign:'center',whiteSpace:'normal',overflowWrap:'anywhere',textShadow:'0 2px 0 rgba(0,0,0,.55),0 5px 12px rgba(0,0,0,.68)',opacity:interpolate(frame,[0,8],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})}}>{scene.narration}</div>
  {scene.character !== 'none' ? <div style={{position:'absolute',left:characterSide==='left'?96:undefined,right:characterSide==='right'?96:undefined,bottom:170,width:270,height:360,overflow:'visible',zIndex:6,pointerEvents:'none',filter:'drop-shadow(0 18px 20px rgba(0,0,0,.34))',opacity:entranceOpacity,transform:'translateX('+entranceX+'px)'}}><div style={{width:270,height:360}}><MainBoy facing={facing} expression={expression} gesture={gesture} speaking={Boolean(scene.voiceover)} speakingLevel={speakingLevel} mouth={expression==='happy'?'smile':'closed'} blink={frame%112>104&&frame%112<109}/></div></div> : null}
 </div>;
};
