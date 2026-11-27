import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ChibiSupportingCharacter} from '../chibi/ChibiSupportingCharacter';
type SceneCastData={character?:string;supportingCast?:string};
type ActorSpec={id:string;size:'adult'|'child';pose:'standing'|'seated'|'turning';position:'left'|'center'|'right'};
const POSITIONS:Record<ActorSpec['position'],{x:number;bottom:number}>={left:{x:330,bottom:88},center:{x:875,bottom:88},right:{x:1420,bottom:88}};
const actor=(spec:ActorSpec,frame:number)=>{
 const child=spec.size==='child',width=child?112:165,height=child?174:250;
 const {x,bottom}=POSITIONS[spec.position],facing=spec.position==='right'?'left':'right';
 const turn=spec.pose==='turning'?interpolate(frame,[0,180],[0,360],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}):0;
 return <React.Fragment key={spec.id}>
  {spec.pose==='seated'?<svg viewBox="0 0 220 150" style={{position:'absolute',left:x-20,bottom:bottom-4,width:width+40,height:height*.62,zIndex:3,pointerEvents:'none',overflow:'visible'}}>
   <path d="M35 140V28Q35 12 52 12H168Q185 12 185 28V140M22 82H198M48 82V145M172 82V145" fill="none" stroke="#25211e" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round"/>
   <path d="M42 82H178" stroke="#514238" strokeWidth="20" strokeLinecap="round"/>
  </svg>:null}
  <div style={{position:'absolute',left:x,bottom,width,height,zIndex:5,pointerEvents:'none',transform:spec.pose==='turning'?'perspective(600px) rotateY('+turn+'deg)':'none',transformOrigin:'center bottom',filter:'brightness(0) saturate(100%) opacity(.88) drop-shadow(0 8px 10px rgba(0,0,0,.28))'}}>
   <ChibiSupportingCharacter facing={facing} variant={spec.id} pose={spec.pose}/>
  </div>
 </React.Fragment>;
};
export const SceneSupportingCast:React.FC<{scene:SceneCastData}>=({scene})=>{
 const frame=useCurrentFrame();
 if(scene.character==='none'||!scene.supportingCast||scene.supportingCast==='none') return null;
 const actors=scene.supportingCast.split(',').map((value,index)=>{const [size,pose,position]=value.trim().split('-');return {id:'scene-cast-'+index+'-'+value.trim(),size:size as ActorSpec['size'],pose:pose as ActorSpec['pose'],position:position as ActorSpec['position']};});
 return <>{actors.map(spec=>actor(spec,frame))}</>;
};
