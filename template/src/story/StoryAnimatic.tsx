import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

type Scene = {
  number: number;
  heading: string;
  setting: string;
  action: string;
  narration: string;
  audio: string;
  duration?: string;
  durationInFrames: number;
};
type Props = {
  title: string;
  mode: 'test' | 'full';
  framesPerScene: number;
  scenes: Scene[];
  source: string;
  totalScenes: number;
  totalFrames: number;
};

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

export const StoryAnimatic: React.FC<Props> = ({title, mode, framesPerScene, scenes}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sceneStarts = scenes.map((_, index) => scenes.slice(0, index).reduce((sum, item) => sum + (item.durationInFrames || framesPerScene), 0));
  const sceneIndex = Math.max(0, scenes.findIndex((scene, index) => frame < sceneStarts[index] + (scene.durationInFrames || framesPerScene)));
  const scene = scenes[sceneIndex] ?? scenes[scenes.length - 1];
  const local = frame - (sceneStarts[sceneIndex] ?? 0);
  const sceneFrames = scene.durationInFrames || framesPerScene;
  const enter = interpolate(local, [0, Math.min(18, sceneFrames / 3)], [0, 1], clamp);
  const fade = interpolate(local, [Math.max(0, sceneFrames - 12), sceneFrames], [1, 0], clamp);
  const opacity = Math.min(enter, fade);
  const seconds = Math.floor(frame / fps);
  const label = String(scene.number).padStart(2, '0');

  return (
    <AbsoluteFill style={{backgroundColor: '#101216', color: '#f4f0e8', fontFamily: 'Arial, sans-serif', padding: 84, opacity: 1}}>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 78% 20%, #33302a 0%, #17191d 42%, #101216 78%)'}} />
      <div style={{position: 'absolute', top: 56, left: 84, right: 84, display: 'flex', justifyContent: 'space-between', color: '#c4a36a', fontSize: 22, letterSpacing: 5, textTransform: 'uppercase'}}>
        <span>HỒ SƠ · STORY ANIMATIC</span>
        <span>{mode === 'test' ? 'BẢN TEST' : 'BẢN FULL'} · {label}/{String(scenes.length).padStart(2, '0')}</span>
      </div>
      <div style={{position: 'absolute', left: 84, top: 170, width: 640, height: 650, border: '1px solid #64543d', background: 'linear-gradient(145deg, rgba(205,174,117,.13), rgba(255,255,255,.015))', borderRadius: 8, overflow: 'hidden', opacity}}>
        <div style={{position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)', backgroundSize: '42px 42px'}} />
        <div style={{position: 'absolute', top: 48, left: 48, color: '#c4a36a', fontSize: 18, letterSpacing: 4}}>PHÂN CẢNH {label}</div>
        <div style={{position: 'absolute', left: 48, right: 48, top: 145, fontSize: 58, lineHeight: 1.08, fontWeight: 700}}>{scene.heading}</div>
        <div style={{position: 'absolute', left: 48, right: 48, bottom: 58, color: '#b9b3a8', fontSize: 20, lineHeight: 1.45}}>
          <div style={{color: '#c4a36a', fontSize: 14, letterSpacing: 3, marginBottom: 12}}>BỐI CẢNH</div>
          {scene.setting || 'Chưa có mô tả bối cảnh'}
        </div>
        <div style={{position: 'absolute', right: 42, top: 42, width: 90, height: 90, border: '1px solid #c4a36a', borderRadius: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c4a36a', fontSize: 28}}>{label}</div>
      </div>
      <div style={{position: 'absolute', left: 790, right: 84, top: 185, opacity}}>
        <div style={{color: '#c4a36a', fontSize: 17, letterSpacing: 4, marginBottom: 22}}>HÀNH ĐỘNG</div>
        <div style={{fontSize: 29, lineHeight: 1.35, color: '#e6e0d5', maxHeight: 190, overflow: 'hidden'}}>{scene.action || 'Chưa có mô tả hành động'}</div>
        <div style={{height: 1, background: '#5a4c39', margin: '38px 0'}} />
        <div style={{color: '#c4a36a', fontSize: 17, letterSpacing: 4, marginBottom: 22}}>LỜI DẪN</div>
        <div style={{fontSize: 34, lineHeight: 1.34, fontWeight: 600, maxHeight: 330, overflow: 'hidden'}}>{scene.narration}</div>
        {scene.audio ? <div style={{position: 'absolute', top: 570, color: '#a9a39a', fontSize: 17, lineHeight: 1.4}}>ÂM THANH / CHỮ: {scene.audio}</div> : null}
      </div>
      <div style={{position: 'absolute', bottom: 58, left: 84, right: 84, height: 3, background: '#3b3a36'}}>
        <div style={{height: 3, width: `${((sceneStarts[sceneIndex] + local) / (scenes.reduce((sum, item) => sum + (item.durationInFrames || framesPerScene), 0))) * 100}%`, background: '#c4a36a'}} />
      </div>
      <div style={{position: 'absolute', bottom: 78, left: 84, color: '#8c8982', fontSize: 16, letterSpacing: 2}}>{title}</div>
      <div style={{position: 'absolute', bottom: 78, right: 84, color: '#8c8982', fontSize: 16}}>{String(seconds).padStart(2, '0')}s</div>
    </AbsoluteFill>
  );
};

export const STORY_ANIMATIC_DEFAULTS: Props = {
  title: 'HỒ SƠ NHỮNG HỘI NHÓM BÍ ẨN',
  mode: 'test',
  framesPerScene: 150,
  scenes: [{number: 1, heading: 'Cảnh mẫu', setting: '', action: '', narration: 'Bản xem trước kịch bản.', audio: ''}],
  source: '',
  totalScenes: 1,
  totalFrames: 150,
};
