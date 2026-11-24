import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, Sequence, continueRender, delayRender, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {SceneStage, type FilmSceneData} from './SceneStage';
import {FlashCut} from '../../../assets/lib/FlashCut';

type Props={title:string;mode:'test'|'full';framesPerScene:number;scenes:FilmSceneData[];source:string;totalScenes:number;totalFrames:number;voiceover?:string;music?:string;};
const SceneWithTransition:React.FC<{scene:FilmSceneData;title:string}> = ({scene}) => {
 const frame=useCurrentFrame();
 const duration=scene.durationInFrames;
 const enter=interpolate(frame,[0,18],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 const exit=interpolate(frame,[Math.max(0,duration-8),duration],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 const opacity=1-exit;
 const transitionSound=scene.number%2===0?'audio/transition-snap.mp3':'audio/transition-soft.mp3';
 // One transition per seam: iris, geometric wipe, whip-pan, or the repository's real FlashCut component.
 const kind=scene.number%4;
 const reveal=kind===0?{clipPath:'circle('+Math.max(0,enter)*150+'% at 52% 48%)'}:kind===1?{clipPath:'inset(0 '+((1-enter)*100)+'% 0 0)'}:kind===2?{transform:'translateX('+((1-enter)*110)+'px) scale('+(0.985+enter*0.015)+')',filter:'blur('+((1-enter)*7)+'px)'}:{};
 return <AbsoluteFill style={{opacity}}><Audio src={staticFile(transitionSound)} volume={0.10}/>{scene.voiceover?<Audio src={staticFile(scene.voiceover)} volume={1}/>:null}<AbsoluteFill style={reveal}><SceneStage scene={scene}/></AbsoluteFill>{kind===3?<FlashCut duration={8}/>:null}</AbsoluteFill>;
};
export const IllustratedStoryFilm:React.FC<Props> = ({title,scenes,voiceover,music}) => {
 const [fontHandle]=useState(()=>delayRender('Loading Be Vietnam Pro'));
 useEffect(()=>{document.fonts.load('800 54px "Be Vietnam Pro"').then(()=>document.fonts.ready).then(()=>continueRender(fontHandle)).catch(()=>continueRender(fontHandle));},[fontHandle]);
 let cursor=0;
 const sequences=scenes.map((scene)=>{const from=cursor;cursor+=scene.durationInFrames;return <Sequence key={scene.number} from={from} durationInFrames={scene.durationInFrames}><SceneWithTransition scene={scene} title={title}/></Sequence>;});
 return <AbsoluteFill style={{backgroundColor:'#15191e',fontFamily:'Be Vietnam Pro, sans-serif'}}>
  {sequences}
  {voiceover?<Audio src={staticFile(voiceover)} volume={1}/>:null}
  {music?<Audio src={staticFile(music)} volume={0.16}/>:null}
 </AbsoluteFill>;
};
