import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ChibiSupportingCharacter} from '../chibi/ChibiSupportingCharacter';

type SceneCastData = {
  character?:string;
  supportingCast?:string;
};

type ActorSpec = {
  id:string;
  size:'adult'|'child';
  pose:'standing'|'seated'|'turning';
  position:'left'|'center'|'right';
};

const POSITIONS:Record<ActorSpec['position'],{x:number;bottom:number}> = {
  left:{x:330,bottom:88},
  center:{x:875,bottom:88},
  right:{x:1420,bottom:88},
};

const actor = (spec:ActorSpec, frame:number) => {
  const child=spec.size==='child';
  const width=child?112:165;
  const height=child?174:250;
  const {x,bottom}=POSITIONS[spec.position];
  const facing=spec.position==='right'?'left':'right';
  const turn=spec.pose==='turning'
    ? interpolate(frame,[0,48],[0,360],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})
    : 0;
  return (
    <React.Fragment key={spec.id}>
      {spec.pose==='seated' ? <div style={{
        position:'absolute',left:x-5,bottom:bottom-5,width:width+10,height:height*.34,
        border:'12px solid #29231e',borderBottom:0,borderRadius:'16px 16px 0 0',
        opacity:.9,zIndex:3,pointerEvents:'none',
      }}/> : null}
      <div style={{
        position:'absolute',left:x,bottom,width,height,zIndex:5,pointerEvents:'none',
        transform:'rotateY('+turn+'deg)',transformStyle:'preserve-3d',
        transformOrigin:'center bottom',
        filter:'brightness(0) saturate(100%) opacity(.88) drop-shadow(0 8px 10px rgba(0,0,0,.28))',
      }}>
        <div style={{
          position:'absolute',inset:0,
          transform:spec.pose==='seated'?'translateY(12%) scaleY(.84)':'none',
          transformOrigin:'center bottom',
        }}>
          <ChibiSupportingCharacter facing={facing} variant={spec.id}/>
        </div>
      </div>
    </React.Fragment>
  );
};

export const SceneSupportingCast:React.FC<{scene:SceneCastData}> = ({scene}) => {
  const frame=useCurrentFrame();
  if (scene.character==='none' || !scene.supportingCast || scene.supportingCast==='none') return null;

  const actors=scene.supportingCast.split(',').map((value,index)=>{
    const [size,pose,position]=value.trim().split('-');
    return {
      id:'scene-cast-'+index+'-'+value.trim(),
      size:size as ActorSpec['size'],
      pose:pose as ActorSpec['pose'],
      position:position as ActorSpec['position'],
    };
  });

  return <>{actors.map((spec)=>actor(spec,frame))}</>;
};
