import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const ChibiCharacter: React.FC<{x: number; delay?: number; scale?: number}> = ({
  x,
  delay = 0,
  scale = 1,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const local = Math.max(0, frame - delay);
  const entrance = spring({frame: local, fps, config: {damping: 12, stiffness: 95}});
  const bounce = Math.sin((local / 12) * Math.PI * 2) * 9;
  const wave = Math.sin((local / 4.2) * Math.PI) * 18;
  const blink = frame % 105 > 96 && frame % 105 < 101;

  return (
    <g transform={`translate(${x} ${790 + (1 - entrance) * 180 + (local > 0 ? bounce : 0)}) scale(${scale * entrance})`}>
      {/* soft ground shadow */}
      <ellipse cx="0" cy="5" rx="150" ry="25" fill="#7f9b83" opacity="0.18" />

      {/* legs and shoes */}
      <path d="M-58 -145 Q-70 -75 -65 -34" fill="none" stroke="#76564c" strokeWidth="30" strokeLinecap="round" />
      <path d="M58 -145 Q70 -75 65 -34" fill="none" stroke="#76564c" strokeWidth="30" strokeLinecap="round" />
      <ellipse cx="-76" cy="-27" rx="48" ry="23" fill="#f08d79" />
      <ellipse cx="76" cy="-27" rx="48" ry="23" fill="#f08d79" />

      {/* body */}
      <path d="M-105 -365 Q-125 -280 -98 -145 Q0 -105 98 -145 Q125 -280 105 -365 Q0 -420 -105 -365Z"
        fill="#79b9a7" stroke="#654d49" strokeWidth="9" strokeLinejoin="round" />
      <path d="M-48 -330 Q0 -300 48 -330" fill="none" stroke="#a9d8c8" strokeWidth="13" strokeLinecap="round" />

      {/* left arm */}
      <path d="M-92 -345 Q-160 -295 -158 -230" fill="none" stroke="#f5c9a8" strokeWidth="34" strokeLinecap="round" />
      <circle cx="-158" cy="-220" r="27" fill="#f5c9a8" stroke="#654d49" strokeWidth="7" />

      {/* waving arm */}
      <g transform={`rotate(${-25 + wave} 90 -345)`}>
        <path d="M90 -345 Q155 -395 157 -475" fill="none" stroke="#f5c9a8" strokeWidth="36" strokeLinecap="round" />
        <circle cx="158" cy="-493" r="29" fill="#f5c9a8" stroke="#654d49" strokeWidth="7" />
        <path d="M145 -515 l-12 -25 M158 -520 l0 -28 M171 -515 l13 -24"
          stroke="#654d49" strokeWidth="7" strokeLinecap="round" />
      </g>

      {/* oversized chibi head */}
      <circle cx="0" cy="-500" r="190" fill="#f8d7bd" stroke="#654d49" strokeWidth="10" />
      {/* hair cap */}
      <path d="M-184 -535 Q-188 -700 -42 -690 Q35 -755 118 -675 Q206 -640 181 -520
        Q140 -560 104 -555 Q70 -590 35 -558 Q-10 -600 -52 -558 Q-115 -590 -148 -535Z"
        fill="#5b4945" stroke="#654d49" strokeWidth="9" strokeLinejoin="round" />
      <path d="M-160 -545 Q-130 -605 -90 -570 M-35 -575 Q-5 -620 30 -575 M85 -570 Q120 -610 150 -555"
        fill="none" stroke="#80645b" strokeWidth="13" strokeLinecap="round" />

      {/* face */}
      {blink ? (
        <>
          <path d="M-78 -490 q22 18 44 0 M35 -490 q22 18 44 0" fill="none" stroke="#493d3a" strokeWidth="11" strokeLinecap="round" />
        </>
      ) : (
        <>
          <ellipse cx="-57" cy="-495" rx="17" ry="24" fill="#493d3a" />
          <ellipse cx="57" cy="-495" rx="17" ry="24" fill="#493d3a" />
          <circle cx="-62" cy="-503" r="6" fill="white" />
          <circle cx="52" cy="-503" r="6" fill="white" />
        </>
      )}
      <ellipse cx="-112" cy="-445" rx="28" ry="14" fill="#f29c91" opacity="0.75" />
      <ellipse cx="112" cy="-445" rx="28" ry="14" fill="#f29c91" opacity="0.75" />
      <path d="M-28 -425 Q0 -395 28 -425" fill="none" stroke="#a85f58" strokeWidth="10" strokeLinecap="round" />
      <path d="M-8 -457 q8 8 16 0" fill="none" stroke="#d99a83" strokeWidth="6" strokeLinecap="round" />
    </g>
  );
};

export const ChibiDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const titleIn = spring({frame: frame - 12, fps, config: {damping: 14, stiffness: 110}});
  const titleY = interpolate(titleIn, [0, 1], [70, 0]);
  const sparkle = 0.55 + Math.sin(frame / 7) * 0.25;

  return (
    <AbsoluteFill style={{backgroundColor: '#f8f2e8', overflow: 'hidden'}}>
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{position: 'absolute'}}>
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f8e9dc" />
            <stop offset="100%" stopColor="#e6f1df" />
          </linearGradient>
          <radialGradient id="sun">
            <stop offset="0%" stopColor="#fff6c9" />
            <stop offset="100%" stopColor="#f6d58d" />
          </radialGradient>
        </defs>
        <rect width="1920" height="1080" fill="url(#sky)" />
        <circle cx="1550" cy="210" r="115" fill="url(#sun)" />
        <path d="M0 760 Q280 620 570 750 T1120 730 T1920 710 V1080 H0Z" fill="#c9dfbd" />
        <path d="M0 860 Q360 760 720 860 T1440 830 T1920 850 V1080 H0Z" fill="#a9cba8" />
        <g fill="#fffaf1" opacity="0.9">
          <ellipse cx="330" cy="220" rx="110" ry="36" />
          <ellipse cx="390" cy="195" rx="65" ry="48" />
          <ellipse cx="455" cy="220" rx="95" ry="32" />
          <ellipse cx="1160" cy="300" rx="90" ry="30" />
          <ellipse cx="1210" cy="275" rx="58" ry="42" />
          <ellipse cx="1270" cy="300" rx="80" ry="28" />
        </g>
        <g fill="#fff4c4" opacity={sparkle}>
          <path d="M760 190 l13 36 36 13 -36 13 -13 36 -13 -36 -36 -13 36 -13Z" />
          <path d="M1450 475 l9 25 25 9 -25 9 -9 25 -9 -25 -25 -9 25 -9Z" />
          <circle cx="600" cy="420" r="10" />
          <circle cx="1320" cy="150" r="9" />
        </g>
        <g stroke="#6f9b77" strokeWidth="10" strokeLinecap="round" fill="none">
          <path d="M180 940 q-25 -75 0 -130 M180 880 q-48 -35 -58 -70 M180 900 q50 -35 64 -78" />
          <path d="M1730 940 q-25 -75 0 -130 M1730 880 q-48 -35 -58 -70 M1730 900 q50 -35 64 -78" />
        </g>
      </svg>

      <div style={{
        position: 'absolute', top: 72, width: '100%', textAlign: 'center',
        transform: `translateY(${titleY}px) scale(${titleIn})`,
        opacity: titleIn, color: '#654d49', fontSize: 76, fontWeight: 800,
        letterSpacing: 1, fontFamily: 'Arial, sans-serif',
        textShadow: '0 5px 0 rgba(255,255,255,0.65)',
      }}>
        Xin chào, bạn ơi!
      </div>
      <div style={{
        position: 'absolute', top: 180, width: '100%', textAlign: 'center',
        color: '#8b7770', fontSize: 30, fontWeight: 600,
        fontFamily: 'Arial, sans-serif', opacity: titleIn,
      }}>
        Một thế giới chibi nhỏ xinh đang chờ bạn
      </div>

      <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{position: 'absolute'}}>
        <ChibiCharacter x={800} scale={0.88} />
        <ChibiCharacter x={1190} delay={12} scale={0.76} />
      </svg>
      <div style={{
        position: 'absolute', bottom: 48, width: '100%', textAlign: 'center',
        color: '#557d6a', fontSize: 24, fontWeight: 700,
        fontFamily: 'Arial, sans-serif', letterSpacing: 3,
      }}>
        VECTOR CHIBI · REMOTION · GITHUB ACTIONS
      </div>
    </AbsoluteFill>
  );
};
