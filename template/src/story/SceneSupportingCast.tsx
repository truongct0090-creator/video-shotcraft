import React from 'react';
import {MainBoy} from '../chibi/MainBoy';

type SceneCastData = {setting:string;action:string;heading:string;props?:string;character?:string;world?:string};

const sceneKind = (scene:SceneCastData) => {
  const text=[scene.setting,scene.action,scene.heading,scene.props,scene.world].join(' ').toLowerCase();
  if (/phòng họp|phòng sinh hoạt|buổi họp|phòng hội nghị|cuộc họp|hội trường/.test(text)) return 'meeting';
  if (/quán trà|ấm trà|chén trà|người hoa/.test(text)) return 'teahouse';
  if (/ruộng|đồng|làng quê|nông dân|người dân|sưu thuế/.test(text)) return 'countryside';
  if (/xưởng in|máy in|tiệm sách|nhà in/.test(text)) return 'printing';
  if (/cộng đồng|sinh hoạt|gia đình|nhóm|thành viên/.test(text)) return 'community';
  return 'general';
};

const silhouette = (key:string, x:number, bottom:number, hair:'short'|'long', seated=false, dress=false, width=165) => (
  <div key={key} style={{position:'absolute',left:x,bottom,width,height:seated?220:250,zIndex:5,pointerEvents:'none',filter:'drop-shadow(0 9px 11px rgba(0,0,0,.25))'}}>
    <MainBoy facing={key.endsWith('L')?'left':'right'} silhouette silhouetteHair={hair} silhouetteDress={dress} silhouettePose={seated?'seated':'standing'} expression="neutral" mouth="closed" gesture="rest"/>
  </div>
);

export const SceneSupportingCast:React.FC<{scene:SceneCastData}> = ({scene}) => {
  if (scene.character === 'none') return null;
  const kind=sceneKind(scene);
  if (kind==='meeting') {
    return (
      <>
        <div style={{position:'absolute',left:575,bottom:125,width:650,height:230,zIndex:3,pointerEvents:'none',background:'linear-gradient(180deg,#896747 0%,#60452f 100%)',border:'10px solid #493729',borderRadius:'48% 48% 35% 35%',boxShadow:'0 20px 26px rgba(0,0,0,.3)'}}/>
        {silhouette('meeting-aL',430,180,'short',true,false,165)}
        {silhouette('meeting-bR',610,180,'long',true,true,165)}
        {silhouette('meeting-cL',930,180,'short',true,false,165)}
        {silhouette('meeting-dR',1110,180,'long',true,true,165)}
      </>
    );
  }
  if (kind==='teahouse') return (
    <>
      {silhouette('tea-aR',500,118,'short',false,false,175)}
      {silhouette('tea-bL',690,118,'long',false,true,175)}
      {silhouette('tea-cR',900,118,'short',false,false,175)}
    </>
  );
  if (kind==='countryside') return (
    <>
      {silhouette('field-aR',470,112,'short',false,false,175)}
      {silhouette('field-bL',665,112,'long',false,true,175)}
      {silhouette('field-cR',860,112,'short',false,false,175)}
    </>
  );
  if (kind==='printing') return (
    <>
      {silhouette('print-aR',450,112,'short',false,false,175)}
      {silhouette('print-bL',645,112,'long',false,true,175)}
      {silhouette('print-cR',840,112,'short',false,false,175)}
    </>
  );
  if (kind==='community') return (
    <>
      {silhouette('community-aR',460,112,'short',false,false,175)}
      {silhouette('community-bL',655,112,'long',false,true,175)}
      {silhouette('community-cR',850,112,'short',false,false,175)}
      {silhouette('community-dL',1045,112,'long',false,true,175)}
    </>
  );
  return null;
};
