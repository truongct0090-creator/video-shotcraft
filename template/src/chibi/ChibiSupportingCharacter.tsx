import React from 'react';

type Outfit = {shirt:string; trousers:string; hair:string; shoes:string; trim:string};

const OUTFITS: Outfit[] = [
  {shirt:'#79b9a7',trousers:'#78604c',hair:'#5b4945',shoes:'#f08d79',trim:'#b4dfd1'},
  {shirt:'#d98d72',trousers:'#52677d',hair:'#493b36',shoes:'#d8b46b',trim:'#f1b9a4'},
  {shirt:'#7898c7',trousers:'#6e7952',hair:'#76564a',shoes:'#c87967',trim:'#b7c9e5'},
  {shirt:'#c4a15f',trousers:'#765b83',hair:'#3f3935',shoes:'#668d83',trim:'#e8d19a'},
  {shirt:'#a78bc0',trousers:'#82654b',hair:'#674b3e',shoes:'#d58b68',trim:'#d3c0e3'},
  {shirt:'#78a3a0',trousers:'#8a5962',hair:'#51433d',shoes:'#c5a05e',trim:'#b8d5d0'},
  {shirt:'#b7a36d',trousers:'#536e67',hair:'#765c4d',shoes:'#b97878',trim:'#e1d3a5'},
  {shirt:'#c77f91',trousers:'#6d6a91',hair:'#473b36',shoes:'#789c6f',trim:'#e5b7c4'},
];

const outfitFor = (variant:string):Outfit => {
  const match=variant.match(/-([a-z])(?:L|R)$/i);
  const identity=match?.[1]?.toLowerCase() || variant;
  let hash=0;
  for (const char of identity) hash=(hash*31+char.charCodeAt(0))>>>0;
  return OUTFITS[hash%OUTFITS.length];
};

/** Supporting chibi with continuous outlined sleeves, forearms and round fingerless hands. */
export const ChibiSupportingCharacter: React.FC<{
  facing?: 'left'|'right';
  scale?: number;
  variant?: string;
  pose?: 'standing'|'seated'|'turning';
}> = ({facing='right', scale=1, variant='supporting-a', pose='standing'}) => {
  const outfit=outfitFor(variant);
  const ink='#111111';
  const skin='#f5c9a8';
  return (
    <svg viewBox="-230 0 460 800" role="img" aria-label="Nhân vật phụ chibi theo mẫu gốc của repo" style={{width:'100%',height:'100%',overflow:'visible'}}>
      <g transform={`translate(0 790) scale(${scale}) ${facing==='left'?'scale(-1 1)':''}`}>
        <ellipse cx="0" cy="5" rx="150" ry="25" fill="#7f9b83" opacity=".18"/>
        <path d="M-91 -352 Q-137 -329 -145 -276" fill="none" stroke={ink} strokeWidth="48" strokeLinecap="round"/>
        <path d="M-91 -352 Q-137 -329 -145 -276" fill="none" stroke={outfit.shirt} strokeWidth="36" strokeLinecap="round"/>
        <path d="M91 -352 Q137 -329 145 -276" fill="none" stroke={ink} strokeWidth="48" strokeLinecap="round"/>
        <path d="M91 -352 Q137 -329 145 -276" fill="none" stroke={outfit.shirt} strokeWidth="36" strokeLinecap="round"/>
        {pose==='seated' ? <g>
          <path d="M-58 -160Q-100 -130 -108 -92L-38 -72M58 -160Q100 -130 108 -92L38 -72" fill="none" stroke={ink} strokeWidth="42" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M-58 -160Q-100 -130 -108 -92L-38 -72M58 -160Q100 -130 108 -92L38 -72" fill="none" stroke={outfit.trousers} strokeWidth="32" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M-38 -72H-112M38 -72H112" fill="none" stroke={ink} strokeWidth="38" strokeLinecap="round"/>
          <path d="M-38 -72H-112M38 -72H112" fill="none" stroke={outfit.shoes} strokeWidth="27" strokeLinecap="round"/>
        </g> : <g>
          <path d="M-58 -160Q-70 -88 -65 -34 M58 -160Q70 -88 65 -34" fill="none" stroke={ink} strokeWidth="42" strokeLinecap="round"/>
          <path d="M-58 -160Q-70 -88 -65 -34 M58 -160Q70 -88 65 -34" fill="none" stroke={outfit.trousers} strokeWidth="32" strokeLinecap="round"/>
          <ellipse cx="-76" cy="-27" rx="48" ry="23" fill={outfit.shoes} stroke={ink} strokeWidth="8"/>
          <ellipse cx="76" cy="-27" rx="48" ry="23" fill={outfit.shoes} stroke={ink} strokeWidth="8"/>
        </g>}
        <path d="M-105 -365 Q-125 -280 -98 -145 Q0 -105 98 -145 Q125 -280 105 -365 Q0 -420 -105 -365Z" fill={outfit.shirt} stroke={ink} strokeWidth="9" strokeLinejoin="round"/>
        <path d="M-48 -330 Q0 -300 48 -330" fill="none" stroke={outfit.trim} strokeWidth="13" strokeLinecap="round"/>
        <path d="M-145 -276 Q-157 -247 -155 -220" fill="none" stroke={ink} strokeWidth="34" strokeLinecap="round"/>
        <path d="M-145 -276 Q-157 -247 -155 -220" fill="none" stroke={skin} strokeWidth="22" strokeLinecap="round"/>
        <path d="M145 -276 Q157 -247 155 -220" fill="none" stroke={ink} strokeWidth="34" strokeLinecap="round"/>
        <path d="M145 -276 Q157 -247 155 -220" fill="none" stroke={skin} strokeWidth="22" strokeLinecap="round"/>
        <ellipse cx="-155" cy="-207" rx="24" ry="23" fill={skin} stroke={ink} strokeWidth="8"/>
        <ellipse cx="155" cy="-207" rx="24" ry="23" fill={skin} stroke={ink} strokeWidth="8"/>
        <circle cx="0" cy="-500" r="190" fill="#f8d7bd" stroke={ink} strokeWidth="10"/>
        <path d="M-184 -535 Q-188 -700 -42 -690 Q35 -755 118 -675 Q206 -640 181 -520 Q140 -560 104 -555 Q70 -590 35 -558 Q-10 -600 -52 -558 Q-115 -590 -148 -535Z" fill={outfit.hair} stroke={ink} strokeWidth="9" strokeLinejoin="round"/>
        <path d="M-160 -545 Q-130 -605 -90 -570 M-35 -575 Q-5 -620 30 -575 M85 -570 Q120 -610 150 -555" fill="none" stroke={outfit.trim} strokeWidth="13" strokeLinecap="round" opacity=".55"/>
        <ellipse cx="-57" cy="-495" rx="17" ry="24" fill="#493d3a"/>
        <ellipse cx="57" cy="-495" rx="17" ry="24" fill="#493d3a"/>
        <circle cx="-62" cy="-503" r="6" fill="white"/><circle cx="52" cy="-503" r="6" fill="white"/>
        <ellipse cx="-112" cy="-445" rx="28" ry="14" fill="#f29c91" opacity=".75"/>
        <ellipse cx="112" cy="-445" rx="28" ry="14" fill="#f29c91" opacity=".75"/>
        <path d="M-28 -425 Q0 -395 28 -425" fill="none" stroke="#a85f58" strokeWidth="10" strokeLinecap="round"/>
        <path d="M-8 -457q8 8 16 0" fill="none" stroke="#d99a83" strokeWidth="6" strokeLinecap="round"/>
      </g>
    </svg>
  );
};
