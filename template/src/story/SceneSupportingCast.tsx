import React from 'react';
import {ChibiSupportingCharacter} from '../chibi/ChibiSupportingCharacter';

type SceneCastData = {setting:string;action:string;heading:string;props?:string;character?:string;world?:string};

const sceneKind = (scene:SceneCastData) => {
  const shot=[scene.action,scene.heading,scene.props].join(' ').toLowerCase();
  const world=(scene.world||'').toLowerCase();
  if (/phòng họp|phòng sinh hoạt|buổi họp|phòng hội nghị|cuộc họp|hội trường/.test(shot) ||
      (world==='meeting' && /ngồi quanh bàn|người tham dự|các thành viên|thảo luận|họp mặt|đang họp/.test(shot))) return 'meeting';
  if (/quán trà|ấm trà|chén trà|rót trà|ngồi uống trà|tiếp khách/.test(shot)) return 'teahouse';
  if (/ruộng|đồng|làng quê|nông dân|người dân|sưu thuế|thu thuế|làm ruộng/.test(shot)) return 'countryside';
  if (/xưởng in|máy in|tiệm sách|nhà in|thợ in|in ấn/.test(shot)) return 'printing';
  if (/đám đông|buổi sinh hoạt cộng đồng|các gia đình|nhóm thành viên|nhiều thành viên/.test(shot)) return 'community';
  return 'general';
};

const character = (key:string,x:number,bottom:number,width=165) => (
  <div key={key} style={{position:'absolute',left:x,bottom,width,height:250,zIndex:5,pointerEvents:'none',filter:'drop-shadow(0 9px 11px rgba(0,0,0,.2))'}}>
    <ChibiSupportingCharacter facing={key.endsWith('L')?'left':'right'} variant={key}/>
  </div>
);

export const SceneSupportingCast:React.FC<{scene:SceneCastData}> = ({scene}) => {
  if (scene.character === 'none') return null;
  const kind=sceneKind(scene);
  if (kind==='meeting') return (
    <>
      <div style={{position:'absolute',left:575,bottom:125,width:650,height:110,zIndex:6,pointerEvents:'none',background:'linear-gradient(180deg,#896747 0%,#60452f 100%)',border:'10px solid #493729',borderRadius:'48% 48% 35% 35%',boxShadow:'0 20px 26px rgba(0,0,0,.3)'}}/>
      {character('meeting-aL',455,245,165)}
      {character('meeting-bR',650,245,165)}
      {character('meeting-cL',900,245,165)}
      {character('meeting-dR',1110,245,165)}
    </>
  );
  if (kind==='teahouse') return <>{character('tea-aR',500,118,175)}{character('tea-bL',690,118,175)}{character('tea-cR',900,118,175)}</>;
  if (kind==='countryside') return <>{character('field-aR',470,112,175)}{character('field-bL',665,112,175)}{character('field-cR',860,112,175)}</>;
  if (kind==='printing') return <>{character('print-aR',450,112,175)}{character('print-bL',645,112,175)}{character('print-cR',840,112,175)}</>;
  if (kind==='community') return <>{character('community-aR',460,112,175)}{character('community-bL',655,112,175)}{character('community-cR',850,112,175)}{character('community-dL',1045,112,175)}</>;
  return null;
};
