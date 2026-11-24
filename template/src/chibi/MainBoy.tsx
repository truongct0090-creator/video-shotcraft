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
  const idleBob = Math.sin(frame / 18) * 2;
  const headTilt = Math.sin(frame / 38) * 0.7;
  const leftArmAngle = gesture === 'wave' ? -8 + Math.sin(frame / 7) * 9 : interpolate(frame % 90, [0, 45, 90], [-1, 1, -1]);
  const rightArmAngle = gesture === 'point' ? -13 : gesture === 'wave' ? -25 + Math.sin(frame / 7) * 11 : 1;

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
    <svg viewBox="0 0 600 800" role="img" aria-label="Bé trai chibi tóc đỏ đầu đinh, áo polo xanh than, quần sọt trắng và giày thể thao" style={{width: '100%', height: '100%', overflow: 'visible'}}>
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

          {/* Korean 7:3 side-part hairstyle: tidy volume, a clean part, and a soft swept fringe. */}
          <path d="M151 239
            Q137 190 158 146
            Q179 101 229 84
            Q276 65 326 79
            Q379 67 419 103
            Q454 134 451 190
            Q449 218 438 239
            Q428 214 425 190
            Q420 163 402 145
            Q383 126 359 122
            Q339 119 322 126
            Q303 133 286 151
            Q271 169 254 171
            Q235 173 222 157
            Q209 143 191 151
            Q171 164 166 195
            Q161 220 151 239Z"
            fill={red} stroke={outline} strokeWidth="9" strokeLinejoin="round"/>
          {/* Larger 7-side sweep, lifted softly from the part. */}
          <path d="M169 165
            Q190 108 250 91
            Q303 75 345 97
            Q365 108 375 128
            Q350 116 328 126
            Q304 137 286 158
            Q266 181 242 183
            Q211 185 194 163
            Q181 151 169 165Z"
            fill={red} stroke={outline} strokeWidth="7" strokeLinejoin="round"/>
          {/* Narrow 3-side, combed neatly toward the temple. */}
          <path d="M345 91 Q392 89 422 123 Q442 148 438 184
            Q422 160 404 151 Q385 140 365 145 Q350 148 337 159
            Q347 133 345 91Z"
            fill={red} stroke={outline} strokeWidth="6" strokeLinejoin="round"/>
          {/* Visible side part and restrained hair texture. */}
          <path d="M345 91 Q337 116 322 137" fill="none" stroke="#8F252F" strokeWidth="7" strokeLinecap="round"/>
          <path d="M190 145 Q229 99 286 99 Q314 99 335 112
            M203 158 Q235 139 263 126
            M366 111 Q398 119 416 145"
            fill="none" stroke="#F27670" strokeWidth="7" strokeLinecap="round"/>
          <path d="M177 191 Q184 168 199 156 M411 157 Q426 176 427 198"
            fill="none" stroke="#E96A68" strokeWidth="5" strokeLinecap="round"/>

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
