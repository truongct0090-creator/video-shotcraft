import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {SceneStage, type FilmSceneData} from './SceneStage';

type Props={title:string;mode:'test'|'full';framesPerScene:number;scenes:FilmSceneData[];source:string;totalScenes:number;totalFrames:number;voiceover?:string;music?:string;};
const SceneWithTransition:React.FC<{scene:FilmSceneData;title:string}> = ({scene,title}) => {
 const frame=useCurrentFrame();
 const duration=scene.durationInFrames;
 const opacity=interpolate(frame,[0,12,Math.max(13,duration-12),duration],[0,1,1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 const transitionSound=scene.number%2===0?'audio/transition-snap.mp3':'audio/transition-soft.mp3';
 return <AbsoluteFill style={{opacity}}><Audio src={staticFile(transitionSound)} volume={0.14}/><SceneStage scene={scene}/><div style={{position:'absolute',left:70,bottom:18,color:'rgba(255,255,255,.55)',fontSize:14,letterSpacing:2}}>{title}</div></AbsoluteFill>;
};
export const IllustratedStoryFilm:React.FC<Props> = ({title,scenes,voiceover,music}) => {
 let cursor=0;
 const sequences=scenes.map((scene)=>{const from=cursor;cursor+=scene.durationInFrames;return <Sequence key={scene.number} from={from} durationInFrames={scene.durationInFrames}><SceneWithTransition scene={scene} title={title}/></Sequence>;});
 return <AbsoluteFill style={{backgroundColor:'#15191e'}}>
  {sequences}
  {voiceover?<Audio src={staticFile(voiceover)} volume={1}/>:null}
  {music?<Audio src={staticFile(music)} volume={0.16}/>:null}
 </AbsoluteFill>;
};
