import React from 'react';

/**
 * Supporting character redrawn from the original ChibiDemo character artwork.
 * Keep the original brown hair, teal top, warm skin, brown trousers and coral
 * shoes; this is deliberately separate from MainBoy so the lead is untouched.
 */
export const ChibiSupportingCharacter: React.FC<{facing?: 'left'|'right'; scale?: number}> = ({facing='right', scale=1}) => (
  <svg viewBox="-230 0 460 800" role="img" aria-label="Nhân vật phụ chibi theo mẫu gốc của repo" style={{width:'100%',height:'100%',overflow:'visible'}}>
    <g transform={`translate(0 790) scale(${scale}) ${facing==='left'?'scale(-1 1)':''}`}>
      <ellipse cx="0" cy="5" rx="150" ry="25" fill="#7f9b83" opacity=".18"/>
      <path d="M-58 -145 Q-70 -75 -65 -34 M58 -145 Q70 -75 65 -34" fill="none" stroke="#76564c" strokeWidth="30" strokeLinecap="round"/>
      <ellipse cx="-76" cy="-27" rx="48" ry="23" fill="#f08d79"/>
      <ellipse cx="76" cy="-27" rx="48" ry="23" fill="#f08d79"/>
      <path d="M-105 -365 Q-125 -280 -98 -145 Q0 -105 98 -145 Q125 -280 105 -365 Q0 -420 -105 -365Z" fill="#79b9a7" stroke="#654d49" strokeWidth="9" strokeLinejoin="round"/>
      <path d="M-48 -330 Q0 -300 48 -330" fill="none" stroke="#a9d8c8" strokeWidth="13" strokeLinecap="round"/>
      <path d="M-92 -345 Q-160 -295 -158 -230" fill="none" stroke="#f5c9a8" strokeWidth="34" strokeLinecap="round"/>
      <circle cx="-158" cy="-220" r="27" fill="#f5c9a8" stroke="#654d49" strokeWidth="7"/>
      <g transform="rotate(-25 90 -345)">
        <path d="M90 -345 Q155 -395 157 -475" fill="none" stroke="#f5c9a8" strokeWidth="36" strokeLinecap="round"/>
        <circle cx="158" cy="-493" r="29" fill="#f5c9a8" stroke="#654d49" strokeWidth="7"/>
        <path d="M145 -515l-12 -25 M158 -520v-28 M171 -515l13 -24" stroke="#654d49" strokeWidth="7" strokeLinecap="round"/>
      </g>
      <circle cx="0" cy="-500" r="190" fill="#f8d7bd" stroke="#654d49" strokeWidth="10"/>
      <path d="M-184 -535 Q-188 -700 -42 -690 Q35 -755 118 -675 Q206 -640 181 -520 Q140 -560 104 -555 Q70 -590 35 -558 Q-10 -600 -52 -558 Q-115 -590 -148 -535Z" fill="#5b4945" stroke="#654d49" strokeWidth="9" strokeLinejoin="round"/>
      <path d="M-160 -545 Q-130 -605 -90 -570 M-35 -575 Q-5 -620 30 -575 M85 -570 Q120 -610 150 -555" fill="none" stroke="#80645b" strokeWidth="13" strokeLinecap="round"/>
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
