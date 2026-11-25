import React from 'react';

type SceneAssetInput = {
  number: number;
  setting: string;
  action: string;
  heading: string;
  props?: string;
  character?: string;
};

const ink = '#514238';
const paper = '#eadfc9';

const TeaSet = () => (
  <g stroke={ink} strokeWidth="9" strokeLinejoin="round">
    <ellipse cx="0" cy="45" rx="115" ry="24" fill="#4d3528" opacity=".2" stroke="none"/>
    <path d="M-80 -5Q-85 -65 -20 -75Q45 -75 48 -5L30 35H-65Z" fill="#b87950"/>
    <path d="M42 -35Q105 -75 105 -18Q105 25 42 12" fill="none" stroke="#9b6748" strokeWidth="16"/>
    <path d="M-12 -75Q-4 -105 20 -105Q42 -105 45 -75" fill="none" stroke="#d9b77e" strokeWidth="12"/>
    <ellipse cx="-12" cy="-5" rx="78" ry="18" fill="#e8d7b7"/>
    <path d="M-150 5Q-145 45 -100 45Q-55 45 -55 5Z" fill="#e4d4b8"/>
    <ellipse cx="-102" cy="5" rx="48" ry="12" fill="#f3e9d6"/>
    <path d="M78 5Q82 45 125 45Q168 45 168 5Z" fill="#e4d4b8"/>
    <ellipse cx="123" cy="5" rx="45" ry="12" fill="#f3e9d6"/>
  </g>
);

const Magnifier = () => (
  <g transform="rotate(-18)" stroke={ink} strokeWidth="13" strokeLinecap="round">
    <circle cx="0" cy="0" r="72" fill="#a9c7c6" fillOpacity=".42"/>
    <circle cx="0" cy="0" r="72" fill="none"/>
    <path d="M52 54L130 132" stroke="#76543c" strokeWidth="28"/>
    <path d="M-45 -35Q-20 -62 15 -60" fill="none" stroke="#fff8e8" strokeWidth="10" opacity=".8"/>
  </g>
);

const Ledger = () => (
  <g stroke={ink} strokeWidth="8" strokeLinejoin="round">
    <path d="M-120 -100L90 -115L125 100L-95 120Z" fill="#9a6848"/>
    <path d="M-95 -83L72 -95L96 77L-70 93Z" fill={paper}/>
    <path d="M-48 -90L-22 88" stroke="#a88f70" strokeWidth="5"/>
    <path d="M-5 -58L55 -62M-2 -22L62 -28M4 15L68 8M10 50L73 44" stroke="#9c8b73" strokeWidth="6" strokeLinecap="round"/>
    <path d="M-116 -100L-80 -104" stroke="#d8b36e" strokeWidth="12"/>
  </g>
);

const PrintingPress = () => (
  <g stroke={ink} strokeWidth="12" strokeLinejoin="round">
    <path d="M-130 70V-20H115V70Z" fill="#78563b"/>
    <path d="M-95 -20V-105H80V-20" fill="#a57b50"/>
    <path d="M-48 -105V-145H38V-105" fill="none"/>
    <path d="M-5 -145V-30" stroke="#4d3829" strokeWidth="18"/>
    <path d="M-95 15H80M-65 70V110M65 70V110" fill="none"/>
    <path d="M145 -80V80" stroke="#b78a55" strokeWidth="14"/>
    <path d="M165 -80V80" stroke="#e8d7b7" strokeWidth="6"/>
  </g>
);

const Phone = () => (
  <g stroke={ink} strokeWidth="11" strokeLinejoin="round">
    <rect x="-75" y="-135" width="150" height="270" rx="24" fill="#27343a"/>
    <rect x="-58" y="-105" width="116" height="205" rx="10" fill="#d7e2dc"/>
    <rect x="-40" y="-75" width="80" height="52" rx="8" fill="#91aeb5" strokeWidth="5"/>
    <path d="M-38 5H38M-38 28H20M-38 50H32" stroke="#74847e" strokeWidth="7" strokeLinecap="round"/>
    <circle cx="0" cy="117" r="8" fill="#d8c8ad"/>
  </g>
);

const DocumentStack = () => (
  <g stroke={ink} strokeWidth="8" strokeLinejoin="round">
    <path d="M-115 -90L60 -112L95 105L-90 122Z" fill="#b8a27d"/>
    <path d="M-78 -112L100 -92L76 112L-104 91Z" fill="#e9dfcb"/>
    <path d="M-48 -60H60M-52 -22H54M-56 16H50M-60 54H44" stroke="#9a8a73" strokeWidth="7" strokeLinecap="round"/>
    <path d="M-100 -112L-45 -118" stroke="#b44f43" strokeWidth="13"/>
  </g>
);

const Cast: React.FC<{scene:SceneAssetInput}> = () => null;

const Props: React.FC<{scene:SceneAssetInput}> = ({scene}) => {
  const text = [scene.props,scene.action,scene.setting].filter(Boolean).join(' ').toLowerCase();
  if (/ấm trà|chén trà|bàn gỗ/.test(text)) return <g transform="translate(1330 790) scale(.72)"><TeaSet/></g>;
  if (/kính lúp|soi|phóng to|kiểm tra nguồn/.test(text)) return <g transform="translate(1450 780) scale(.72)"><Magnifier/></g>;
  if (/sổ thuế|sổ thu chi|tài chính|đóng góp tiền/.test(text)) return <g transform="translate(1440 790) scale(.72)"><Ledger/></g>;
  if (/máy in|xưởng in|nhà in/.test(text)) return <g transform="translate(1400 790) scale(.72)"><PrintingPress/></g>;
  if (/điện thoại|tin nhắn/.test(text)) return <g transform="translate(1450 770) scale(.72)"><Phone/></g>;
  if (/văn bản|báo chí|hồ sơ|tài liệu|truyền đơn|sách mở/.test(text)) return <g transform="translate(1450 790) scale(.72)"><DocumentStack/></g>;
  return null;
};

const EnvironmentDetail: React.FC<{scene:SceneAssetInput}> = ({scene}) => {
  const text = [scene.setting,scene.action].join(' ').toLowerCase();
  if (/đêm|ánh đèn vàng|con hẻm/.test(text)) return <g opacity=".9"><path d="M220 110V350M180 150H260" stroke="#40352d" strokeWidth="20"/><path d="M180 150Q220 205 260 150L300 290H140Z" fill="#e7bd78" opacity=".28"/><circle cx="220" cy="350" r="16" fill="#f5d18a"/><path d="M1700 160V380" stroke="#40352d" strokeWidth="18"/><path d="M1655 190Q1700 235 1745 190L1785 360H1615Z" fill="#e7bd78" opacity=".2"/></g>;
  if (/bản đồ|địa danh/.test(text)) return <g opacity=".7" stroke="#9d8969" strokeWidth="7" fill="none"><path d="M210 820Q450 700 620 820T1020 800M1120 240Q1300 340 1550 230"/><circle cx="620" cy="820" r="16" fill="#b44d43"/><circle cx="1550" cy="230" r="16" fill="#b44d43"/></g>;
  if (/làng|ruộng|đồng quê/.test(text)) return <g opacity=".55" stroke="#557b50" strokeWidth="12" fill="none"><path d="M0 900Q300 820 620 900T1240 900T1920 880"/><path d="M100 950Q400 870 760 950T1500 940"/></g>;
  return null;
};

export const SceneAssetLayer: React.FC<{scene:SceneAssetInput}> = ({scene}) => (
  <svg viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid meet" aria-hidden="true" style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none',overflow:'visible'}}>
    <defs>
      <filter id="scene-asset-shadow" x="-30%" y="-30%" width="170%" height="180%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="8" result="blur"/>
        <feOffset in="blur" dx="8" dy="14" result="offset"/>
        <feComponentTransfer in="offset" result="shadow"><feFuncA type="linear" slope=".28"/></feComponentTransfer>
        <feMerge><feMergeNode in="shadow"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <g filter="url(#scene-asset-shadow)">
      <EnvironmentDetail scene={scene}/>
      <Cast scene={scene}/>
      <Props scene={scene}/>
    </g>
  </svg>
);
