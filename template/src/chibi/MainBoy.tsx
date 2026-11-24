import React from 'react';

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
  const mouthShape = speaking ? 'open' : mouth;
  const eye = (x: number) => {
    if (blink) return <path d={`M${x - 13} 300 q13 10 26 0`} fill="none" stroke={outline} strokeWidth="8" strokeLinecap="round" />;
    if (expression === 'surprised') return <ellipse cx={x} cy="300" rx="15" ry="22" fill={outline} />;
    return <ellipse cx={x} cy="300" rx="13" ry={expression === 'worried' ? 17 : 19} fill={outline} />;
  };

  return (
    <svg viewBox="0 0 600 800" role="img" aria-label="Bé trai chibi tóc đỏ, áo polo xanh than, quần sọt trắng và giày thể thao" style={{width: '100%', height: '100%'}}>
      <ellipse cx="300" cy="760" rx="155" ry="20" fill="#6E8D78" opacity=".16" />

      {/* legs, white shorts and sneakers */}
      <path d="M250 565 Q245 625 242 690 L286 690 L292 575Z M310 575 L315 690 L359 690 L350 565Z" fill={skin} stroke={outline} strokeWidth="8" strokeLinejoin="round"/>
      <path d="M215 535 Q300 520 385 535 L375 635 Q340 650 305 630 Q270 650 225 635Z" fill="#FFFDF8" stroke={outline} strokeWidth="9" strokeLinejoin="round"/>
      <path d="M300 545 L300 632" stroke="#D9D9D4" strokeWidth="5"/>
      <path d="M230 685 Q255 672 288 688 Q300 711 284 730 L205 730 Q190 720 202 701Z" fill="#F9FAF8" stroke={outline} strokeWidth="9" strokeLinejoin="round"/>
      <path d="M312 688 Q345 672 374 685 L402 703 Q412 720 396 730 L316 730 Q300 716 312 688Z" fill="#F9FAF8" stroke={outline} strokeWidth="9" strokeLinejoin="round"/>
      <path d="M210 711 Q247 719 287 711 M318 711 Q357 719 398 711" fill="none" stroke="#6C9CCB" strokeWidth="9" strokeLinecap="round"/>
      <path d="M245 690 l24 15 M338 690 l24 15" stroke="#6C9CCB" strokeWidth="7" strokeLinecap="round"/>

      {/* polo shirt */}
      <path d="M220 385 Q245 355 275 350 L325 350 Q355 355 380 385 L410 535 Q300 570 190 535Z" fill={navy} stroke={outline} strokeWidth="10" strokeLinejoin="round"/>
      <path d="M265 355 L300 405 L335 355 L320 430 L280 430Z" fill="#F7F8F6" stroke={outline} strokeWidth="7" strokeLinejoin="round"/>
      <path d="M300 407 L300 535" stroke="#31577C" strokeWidth="5"/>
      <circle cx="312" cy="453" r="5" fill="#E7EDF2"/><circle cx="312" cy="480" r="5" fill="#E7EDF2"/>
      <path d="M215 405 Q175 425 168 500" fill="none" stroke={navy} strokeWidth="47" strokeLinecap="round"/>
      <circle cx="166" cy="510" r="25" fill={skin} stroke={outline} strokeWidth="8"/>
      <g transform={gesture === 'wave' ? 'rotate(-32 380 410)' : gesture === 'point' ? 'rotate(25 380 410)' : ''}>
        <path d="M380 405 Q420 440 426 500" fill="none" stroke={navy} strokeWidth="48" strokeLinecap="round"/>
        <circle cx="428" cy="510" r="25" fill={skin} stroke={outline} strokeWidth="8"/>
        {gesture === 'wave' && <path d="M414 493 l-10 -25 M429 487 l0 -30 M444 494 l12 -24" stroke={outline} strokeWidth="7" strokeLinecap="round"/>}
        {gesture === 'point' && <path d="M437 500 l35 -34" stroke={skin} strokeWidth="16" strokeLinecap="round"/>}
      </g>

      {/* neck and oversized chibi head */}
      <path d="M270 365 L270 390 Q300 415 330 390 L330 365Z" fill={skin} stroke={outline} strokeWidth="7"/>
      <ellipse cx="300" cy="270" rx="174" ry="177" fill={skin} stroke={outline} strokeWidth="10"/>

      {/* red side-parted 7/3 hairstyle */}
      <path d="M130 267 Q105 135 205 94 Q250 42 322 82 Q405 50 461 132 Q492 187 465 263
        Q437 227 409 219 Q387 190 357 195 Q329 169 301 197 Q264 163 231 204
        Q190 194 164 245Z" fill={red} stroke={outline} strokeWidth="10" strokeLinejoin="round"/>
      <path d="M315 91 Q350 125 360 183 Q391 142 427 153 Q390 104 315 91Z" fill="#E85A58" opacity=".9"/>
      <path d="M160 231 Q193 182 239 199 M235 151 Q278 111 321 130 M340 112 Q385 111 418 145" fill="none" stroke="#F27670" strokeWidth="12" strokeLinecap="round"/>

      {/* brows and eyes */}
      <path d={expression === 'angry' ? 'M220 266 l45 12 M335 278 l45 -12' : expression === 'worried' ? 'M220 257 q25 -18 48 0 M333 257 q25 -18 48 0' : 'M220 267 q23 -12 45 0 M335 267 q23 -12 45 0'} fill="none" stroke={outline} strokeWidth="8" strokeLinecap="round"/>
      {eye(244)}{eye(356)}
      <ellipse cx="190" cy="345" rx="28" ry="15" fill="#F29B9B" opacity=".72"/>
      <ellipse cx="410" cy="345" rx="28" ry="15" fill="#F29B9B" opacity=".72"/>
      <path d="M292 326 q8 8 16 0" fill="none" stroke="#D59A86" strokeWidth="5" strokeLinecap="round"/>

      {/* expression-driven mouth */}
      {mouthShape === 'closed' && <path d="M280 375 Q300 385 320 375" fill="none" stroke="#9E5756" strokeWidth="8" strokeLinecap="round"/>}
      {mouthShape === 'smile' && <path d="M270 370 Q300 410 330 370" fill="#A94F55" stroke={outline} strokeWidth="6" strokeLinecap="round"/>}
      {mouthShape === 'open' && <ellipse cx="300" cy="382" rx="22" ry="30" fill="#7E3540" stroke={outline} strokeWidth="6"/>}
      {mouthShape === 'wide' && <path d="M266 370 Q300 430 334 370 Q300 398 266 370Z" fill="#7E3540" stroke={outline} strokeWidth="6"/>}
      {mouthShape === 'small-o' && <ellipse cx="300" cy="380" rx="14" ry="19" fill="#7E3540" stroke={outline} strokeWidth="6"/>}

      {expression === 'sad' && <path d="M210 390 q-8 22 0 34" fill="none" stroke="#72B8E8" strokeWidth="7" strokeLinecap="round"/>}
      {expression === 'surprised' && <path d="M430 380 q15 -8 22 8" fill="none" stroke="#72B8E8" strokeWidth="5" strokeLinecap="round"/>}
    </svg>
  );
};
