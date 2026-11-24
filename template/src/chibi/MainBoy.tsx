import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';

export type BoyExpression = 'happy' | 'sad' | 'surprised' | 'angry' | 'worried' | 'neutral';
export type BoyMouth = 'closed' | 'smile' | 'open' | 'wide' | 'small-o';
export type BoyGesture = 'rest' | 'wave' | 'point';

export type MainBoyProps = {
  expression?: BoyExpression;
  mouth?: BoyMouth;
  gesture?: BoyGesture;
  blink?: boolean;
  speaking?: boolean;
};

const skin = '#F7D5C8';
const outline = '#59433F';
const navy = '#183B63';
const red = '#C9363B';

export const MainBoy: React.FC<MainBoyProps> = ({
  expression = 'happy',
  mouth = 'smile',
  gesture = 'rest',
  blink = false,
  speaking = false,
}) => {
  const frame = useCurrentFrame();
  const mouthShape = speaking ? (frame % 10 < 5 ? 'open' : 'closed') : mouth;
  const idleBob = Math.sin(frame / 18) * 3.5;
  const headTilt = Math.sin(frame / 38) * 1.2;
  const waveAngle = gesture === 'wave' ? -24 + Math.sin(frame / 7) * 12 : 0;
  const pointAngle = gesture === 'point' ? -12 : 0;
  const armAngle = interpolate(frame % 90, [0, 45, 90], [-2, 2, -2]);

  const eye = (x: number) => {
    if (blink) return <path d={`M${x - 13} 300 q13 10 26 0`} fill="none" stroke={outline} strokeWidth="8" strokeLinecap="round" />;
    if (expression === 'surprised') return <ellipse cx={x} cy="300" rx="15" ry="22" fill={outline} />;
    return <ellipse cx={x} cy="300" rx="13" ry={expression === 'worried' ? 17 : 19} fill={outline} />;
  };

  return (
    <svg viewBox="0 0 600 800" role="img" aria-label="Bé trai chibi da trắng hồng, tóc đỏ ngắn gọn, áo polo xanh than, quần sọt trắng và giày thể thao" style={{width: '100%', height: '100%', overflow: 'visible'}}>
      <g transform={`translate(0 ${idleBob})`}>
        <ellipse cx="300" cy="760" rx="155" ry="20" fill="#6E8D78" opacity=".16" />

        {/* Lower body remains rigid during gestures. */}
        <g>
          <path d="M250 565 Q245 625 242 690 L286 690 L292 575Z M310 575 L315 690 L359 690 L350 565Z" fill={skin} stroke={outline} strokeWidth="8" strokeLinejoin="round"/>
          <path d="M215 535 Q300 520 385 535 L375 635 Q340 650 305 630 Q270 650 225 635Z" fill="#FFFDF8" stroke={outline} strokeWidth="9" strokeLinejoin="round"/>
          <path d="M300 545 L300 632" stroke="#D9D9D4" strokeWidth="5"/>
          <path d="M230 685 Q255 672 288 688 Q300 711 284 730 L205 730 Q190 720 202 701Z" fill="#F9FAF8" stroke={outline} strokeWidth="9" strokeLinejoin="round"/>
          <path d="M312 688 Q345 672 374 685 L402 703 Q412 720 396 730 L316 730 Q300 716 312 688Z" fill="#F9FAF8" stroke={outline} strokeWidth="9" strokeLinejoin="round"/>
          <path d="M210 711 Q247 719 287 711 M318 711 Q357 719 398 711" fill="none" stroke="#6C9CCB" strokeWidth="9" strokeLinecap="round"/>
          <path d="M245 690 l24 15 M338 690 l24 15" stroke="#6C9CCB" strokeWidth="7" strokeLinecap="round"/>
        </g>

        {/* Shirt and jointed arms. Hands are simple round mittens with no fingers. */}
        <g>
          <path d="M220 385 Q245 355 275 350 L325 350 Q355 355 380 385 L410 535 Q300 570 190 535Z" fill={navy} stroke={outline} strokeWidth="10" strokeLinejoin="round"/>
          <path d="M265 355 L300 405 L335 355 L320 430 L280 430Z" fill="#F7F8F6" stroke={outline} strokeWidth="7" strokeLinejoin="round"/>
          <path d="M300 407 L300 535" stroke="#31577C" strokeWidth="5"/>
          <circle cx="312" cy="453" r="5" fill="#E7EDF2"/><circle cx="312" cy="480" r="5" fill="#E7EDF2"/>
          <g transform={`rotate(${armAngle} 215 405)`}>
            <path d="M215 405 Q175 425 168 500" fill="none" stroke={navy} strokeWidth="47" strokeLinecap="round"/>
            <circle cx="166" cy="510" r="25" fill={skin} stroke={outline} strokeWidth="8"/>
          </g>
          <g transform={`rotate(${waveAngle + pointAngle} 380 405)`}>
            <path d="M380 405 Q420 440 426 500" fill="none" stroke={navy} strokeWidth="48" strokeLinecap="round"/>
            <circle cx="428" cy="510" r="25" fill={skin} stroke={outline} strokeWidth="8"/>
          </g>
        </g>

        {/* Head and facial features rotate together as one rigid group. */}
        <g transform={`rotate(${headTilt} 300 400)`}>
          {/* Short neck, visible between the head and polo collar. */}
          <path d="M278 355 L278 408 Q300 427 322 408 L322 355Z" fill={skin} stroke={outline} strokeWidth="7" strokeLinejoin="round"/>
          <g transform="translate(300 270) scale(0.85) translate(-300 -270)">
            <ellipse cx="300" cy="270" rx="174" ry="177" fill={skin} stroke={outline} strokeWidth="10"/>

            {/* Close-cropped red crew cut: smooth scalp silhouette, no fringe or hanging hair. */}
            <path d="M132 267 Q118 211 140 158 Q161 111 207 91 Q249 68 300 72 Q351 68 393 91 Q439 111 460 158 Q482 211 468 267
              Q451 239 440 217 Q433 192 425 175 Q405 137 378 124 Q342 104 300 105 Q258 104 222 124 Q195 139 176 175 Q167 192 160 217 Q149 239 132 267Z"
              fill={red} stroke={outline} strokeWidth="10" strokeLinejoin="round"/>
            <path d="M207 112 Q250 83 300 88 Q350 83 393 112" fill="none" stroke="#F27670" strokeWidth="8" strokeLinecap="round"/>
            <path d="M157 198 Q165 168 181 148 M443 198 Q435 168 419 148 M236 103 l-8 17 M270 91 l-3 15 M330 91 l3 15 M364 103 l8 17"
              fill="none" stroke="#E96A68" strokeWidth="6" strokeLinecap="round"/>

          <path d={expression === 'angry' ? 'M220 266 l45 12 M335 278 l45 -12' : expression === 'worried' ? 'M220 257 q25 -18 48 0 M332 257 q25 -18 48 0' : 'M220 267 q23 -12 45 0 M335 267 q23 -12 45 0'} fill="none" stroke={outline} strokeWidth="8" strokeLinecap="round"/>
          {eye(244)}{eye(356)}
          <ellipse cx="190" cy="345" rx="28" ry="15" fill="#F29B9B" opacity=".72"/>
          <ellipse cx="410" cy="345" rx="28" ry="15" fill="#F29B9B" opacity=".72"/>
          <path d="M292 326 q8 8 16 0" fill="none" stroke="#D59A86" strokeWidth="5" strokeLinecap="round"/>

          {mouthShape === 'closed' && <path d="M280 375 Q300 385 320 375" fill="none" stroke="#9E5756" strokeWidth="8" strokeLinecap="round"/>}
          {mouthShape === 'smile' && <path d="M270 370 Q300 410 330 370" fill="#A94F55" stroke={outline} strokeWidth="6" strokeLinecap="round"/>}
          {mouthShape === 'open' && <ellipse cx="300" cy="382" rx="22" ry="30" fill="#7E3540" stroke={outline} strokeWidth="6"/>}
          {mouthShape === 'wide' && <path d="M266 370 Q300 430 334 370 Q300 398 266 370Z" fill="#7E3540" stroke={outline} strokeWidth="6"/>}
          {mouthShape === 'small-o' && <ellipse cx="300" cy="380" rx="14" ry="19" fill="#7E3540" stroke={outline} strokeWidth="6"/>}
          {/* No blue tear marks or decorative strokes on the face. */}
          </g>
        </g>
      </g>
    </svg>
  );
};
