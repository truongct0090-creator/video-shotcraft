import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {MainBoy, BoyExpression, BoyGesture, BoyMouth} from './MainBoy';

const beats: {from: number; expression: BoyExpression; mouth: BoyMouth; gesture: BoyGesture; caption: string}[] = [
  {from: 0, expression: 'happy', mouth: 'smile', gesture: 'wave', caption: 'Xin chào các bạn!'},
  {from: 55, expression: 'surprised', mouth: 'small-o', gesture: 'rest', caption: 'Ồ! Điều gì đang xảy ra vậy?'},
  {from: 110, expression: 'worried', mouth: 'open', gesture: 'point', caption: 'Chúng ta cùng khám phá nhé!'},
  {from: 165, expression: 'happy', mouth: 'wide', gesture: 'wave', caption: 'Bắt đầu thôi nào!'},
];

export const MainBoyDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const beat = [...beats].reverse().find((item) => frame >= item.from) ?? beats[0];
  const blink = frame % 92 > 84 && frame % 92 < 89;
  const entranceY = interpolate(frame, [0, 24], [36, 0], {extrapolateRight: 'clamp'});
  const entranceOpacity = interpolate(frame, [0, 18], [0, 1], {extrapolateRight: 'clamp'});
  const captionIn = interpolate(frame % 55, [0, 8], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{backgroundColor: '#F8F2E9', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>
      <div style={{position: 'absolute', top: 65, fontSize: 54, fontWeight: 800, color: '#294665', fontFamily: 'Arial'}}>NHÂN VẬT CHÍNH · THIẾT KẾ LẠI</div>
      <div style={{position: 'absolute', top: 135, fontSize: 25, color: '#7B7770', fontFamily: 'Arial'}}>Tóc đỏ đầu đinh · cổ nối đúng vai · tỷ lệ cân đối</div>
      <div style={{height: 700, width: 525, marginTop: 125, opacity: entranceOpacity, transform: `translateY(${entranceY}px)`}}>
        <MainBoy expression={beat.expression} mouth={beat.mouth} gesture={beat.gesture} blink={blink} speaking={frame % 12 < 7}/>
      </div>
      <div style={{position: 'absolute', bottom: 54, padding: '16px 34px', borderRadius: 24, backgroundColor: 'rgba(255,255,255,.82)', color: '#294665', fontSize: 34, fontWeight: 700, fontFamily: 'Arial', opacity: captionIn}}>
        {beat.caption}
      </div>
    </AbsoluteFill>
  );
};
