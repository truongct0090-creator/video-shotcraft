import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';

export type BoyExpression = 'happy' | 'sad' | 'surprised' | 'angry' | 'worried' | 'neutral';
export type BoyMouth = 'closed' | 'smile' | 'open' | 'wide' | 'small-o';
export type BoyGesture = 'rest' | 'wave' | 'point-left' | 'point-right';

export type MainBoyProps = {
  expression?: BoyExpression;
  mouth?: BoyMouth;
  gesture?: BoyGesture;
  blink?: boolean;
  speaking?: boolean;
  speakingLevel?: number;
};

const skin = '#F7D5C8';
const outline = '#59433F';
const navy = '#B08088';
const red = '#B08088';

export const MainBoy: React.FC<MainBoyProps> = ({
  expression = 'happy',
  mouth = 'smile',
  gesture = 'rest',
  blink = false,
  speaking = false,
  speakingLevel,
}) => {
  const frame = useCurrentFrame();
  const mouthShape = speakingLevel !== undefined
    ? (speakingLevel < 0.16 ? 'closed' : speakingLevel < 0.48 ? 'small-o' : 'open')
    : speaking ? (frame % 12 < 4 ? 'open' : frame % 12 < 8 ? 'small-o' : 'closed') : mouth;
  const idleBob = 0;
  const headTilt = 0;
  const leftArmAngle = gesture === 'point-left' ? 63 : gesture === 'wave' ? -8 + Math.sin(frame / 7) * 9 : 0;
  const rightArmAngle = gesture === 'point-right' ? -63 : gesture === 'wave' ? -25 + Math.sin(frame / 7) * 11 : 0;

  const eye = (x: number) => {
    if (blink) {
      return <path d={`M${x - 12} 246 q12 9 24 0`} fill="none" stroke={outline} strokeWidth="7" strokeLinecap="round" />;
    }
    if (expression === 'surprised') {
      return <ellipse cx={x} cy="246" rx="13" ry="19" fill={outline} />;
    }
    return <ellipse cx={x} cy="246" rx="12" ry={expression === 'worried' ? 16 : 17} fill={outline} />;
  };

  return (
    <svg viewBox="0 0 600 800" role="img" aria-label="Bé trai chibi tóc hồng đất kiểu Hàn Quốc rẽ ngôi 7/3, áo polo hồng đất, quần sọt trắng và giày thể thao" style={{width: '100%', height: '100%', overflow: 'visible'}}>
      <g transform={`translate(0 ${idleBob})`}>
        <ellipse cx="300" cy="758" rx="145" ry="18" fill="#6E8D78" opacity=".16" />

        {/* Legs, shorts and shoes: stable shapes, independent from upper-body motion. */}
        <g>
          <path d="M250 566 Q246 620 244 686 L287 686 L294 570Z M306 570 L313 686 L356 686 L350 566Z" fill={skin} stroke={outline} strokeWidth="8" strokeLinejoin="round"/>
          <path d="M216 531 Q300 518 384 531 L375 632 Q341 646 305 628 Q269 646 225 632Z" fill="#FFFDF8" stroke={outline} strokeWidth="9" strokeLinejoin="round"/>
          <path d="M300 543 L300 628" stroke="#D9D9D4" strokeWidth="5"/>
          <path d="M232 681 Q257 670 288 685 Q300 706 284 727 L207 727 Q192 718 204 699Z" fill="#F9FAF8" stroke={outline} strokeWidth="9" strokeLinejoin="round"/>
          <path d="M312 685 Q343 670 373 681 L399 700 Q410 717 394 727 L316 727 Q301 713 312 685Z" fill="#F9FAF8" stroke={outline} strokeWidth="9" strokeLinejoin="round"/>
          <path d="M210 709 Q248 717 287 709 M319 709 Q357 717 396 709" fill="none" stroke="#6C9CCB" strokeWidth="9" strokeLinecap="round"/>
          <path d="M245 686 l24 14 M338 686 l24 14" stroke="#6C9CCB" strokeWidth="7" strokeLinecap="round"/>
        </g>

        {/* Torso first; the neck is layered above the shirt and below the head. */}
        <path d="M220 405 Q247 382 276 382 L324 382 Q353 382 380 405 L408 535 Q300 568 192 535Z" fill={navy} stroke={outline} strokeWidth="10" strokeLinejoin="round"/>

        {/* Short, anatomically placed neck joining the jaw to the collar. */}
        <path d="M273 357 Q278 350 286 350 L314 350 Q322 350 327 357 L327 425 Q300 440 273 425Z" fill={skin} stroke={outline} strokeWidth="7" strokeLinejoin="round"/>

        {/* Polo collar sits in front of the neck at shoulder level. */}
        <path d="M264 384 L300 425 L336 384 L323 450 L277 450Z" fill="#F7F8F6" stroke={outline} strokeWidth="7" strokeLinejoin="round"/>
        <path d="M300 425 L300 538" stroke="#31577C" strokeWidth="5"/>
        <circle cx="312" cy="469" r="5" fill="#E7EDF2"/>
        <circle cx="312" cy="493" r="5" fill="#E7EDF2"/>

        {/* Arms rotate at the shoulders. Mittens are round and have no fingers. */}
        <g transform={`rotate(${leftArmAngle} 222 420)`}>
          <path d="M222 420 Q181 444 171 510" fill="none" stroke={navy} strokeWidth="45" strokeLinecap="round"/>
          <circle cx="169" cy="523" r="24" fill={skin} stroke={outline} strokeWidth="8"/>
        </g>
        <g transform={`rotate(${rightArmAngle} 378 420)`}>
          <path d="M378 420 Q419 445 429 510" fill="none" stroke={navy} strokeWidth="46" strokeLinecap="round"/>
          <circle cx="431" cy="523" r="24" fill={skin} stroke={outline} strokeWidth="8"/>
        </g>

        {/* Head is a single, proportioned shape; no non-uniform scaling. */}
        <g transform={`rotate(${headTilt} 300 245)`}>
          <ellipse cx="300" cy="245" rx="151" ry="157" fill={skin} stroke={outline} strokeWidth="10"/>

          {/* Korean 7:3 side-part: lifted crown, deep side part, and a clear swept fringe. */}
          <path d="M151 239 Q137 190 158 145 Q180 99 232 80 Q282 60 331 77 Q385 67 424 108 Q455 142 451 192 Q449 220 438 239 Q431 214 414 199 Q396 183 375 178 Q356 174 338 181 Q315 192 294 207 Q270 224 246 230 Q220 237 198 222 Q180 211 166 224 Q158 232 151 239Z" fill={red} stroke={outline} strokeWidth="9" strokeLinejoin="round"/>
          {/* Larger 7-side: raised volume swept diagonally across the forehead. */}
          <path d="M166 158 Q188 108 241 88 Q291 69 333 88 Q351 96 365 113 Q346 108 327 118 Q305 130 286 149 Q264 172 244 190 Q222 209 202 211 Q187 210 176 197 Q195 191 207 174 Q221 153 240 137 Q207 143 184 176 Q174 189 165 204 Q157 184 166 158Z" fill={red} stroke={outline} strokeWidth="7" strokeLinejoin="round"/>
          {/* Smaller 3-side follows the right temple neatly. */}
          <path d="M349 91 Q395 91 425 126 Q445 153 438 194 Q427 178 411 169 Q392 157 372 160 Q354 163 338 179 Q349 148 349 91Z" fill={red} stroke={outline} strokeWidth="6" strokeLinejoin="round"/>
          {/* Defined part line and curved comb marks. */}
          <path d="M350 91 Q343 119 326 145" fill="none" stroke="#8F252F" strokeWidth="8" strokeLinecap="round"/>
          <path d="M184 143 Q222 100 273 96 Q305 94 328 109 M193 166 Q220 143 250 128 M211 188 Q239 168 264 145 M374 111 Q405 124 420 151" fill="none" stroke="#F27670" strokeWidth="7" strokeLinecap="round"/>
          <path d="M174 195 Q185 171 204 157 M407 166 Q423 181 429 201" fill="none" stroke="#E96A68" strokeWidth="5" strokeLinecap="round"/>

          {expression === 'angry' ? (
            <>
              <path d="M218 216 l42 11 M340 227 l42 -11" fill="none" stroke={outline} strokeWidth="7" strokeLinecap="round"/>
            </>
          ) : expression === 'worried' ? (
            <>
              <path d="M218 214 q22 -15 44 0 M338 214 q22 -15 44 0" fill="none" stroke={outline} strokeWidth="7" strokeLinecap="round"/>
            </>
          ) : (
            <>
              <path d="M218 222 q22 -9 44 0 M338 222 q22 -9 44 0" fill="none" stroke={outline} strokeWidth="7" strokeLinecap="round"/>
            </>
          )}

          {eye(244)}
          {eye(356)}
          <ellipse cx="190" cy="292" rx="25" ry="13" fill="#F29B9B" opacity=".72"/>
          <ellipse cx="410" cy="292" rx="25" ry="13" fill="#F29B9B" opacity=".72"/>
          <path d="M292 278 q8 7 16 0" fill="none" stroke="#D59A86" strokeWidth="5" strokeLinecap="round"/>

          {mouthShape === 'closed' && <path d="M281 330 Q300 338 319 330" fill="none" stroke="#9E5756" strokeWidth="7" strokeLinecap="round"/>}
          {mouthShape === 'smile' && <path d="M273 324 Q300 361 327 324" fill="#A94F55" stroke={outline} strokeWidth="6" strokeLinecap="round"/>}
          {mouthShape === 'open' && <ellipse cx="300" cy="338" rx="19" ry="25" fill="#7E3540" stroke={outline} strokeWidth="6"/>}
          {mouthShape === 'wide' && <path d="M270 325 Q300 380 330 325 Q300 350 270 325Z" fill="#7E3540" stroke={outline} strokeWidth="6"/>}
          {mouthShape === 'small-o' && <ellipse cx="300" cy="337" rx="13" ry="17" fill="#7E3540" stroke={outline} strokeWidth="6"/>}
        </g>
      </g>
    </svg>
  );
};
