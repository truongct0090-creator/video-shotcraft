import React from 'react';
import {ChibiSupportingCharacter} from '../chibi/ChibiSupportingCharacter';

type SceneCastData = {setting:string;action:string;heading:string;props?:string;character?:string;world?:string};
type CastKind = 'courtroom'|'meeting'|'teahouse'|'countryside'|'printing'|'community'|'family'|'general';

const sceneKind = (scene:SceneCastData):CastKind => {
  const text=[scene.setting,scene.action,scene.heading,scene.props].join(' ').toLowerCase();
  const world=(scene.world||'').toLowerCase();
  if (/courtroom|tòa án|phòng xử|xét xử|thẩm phán|bị cáo|luật sư|phiên tòa/.test(text+' '+world)) return 'courtroom';
  if (/phòng họp|phòng sinh hoạt|buổi họp|phòng hội nghị|cuộc họp|hội trường|ngồi quanh bàn|người tham dự|các thành viên|thảo luận|họp mặt|đang họp/.test(text)) return 'meeting';
  if (/gia đình|người thân|bữa cơm|bàn ăn|trẻ em|cha mẹ|con cái|hai chiếc ghế/.test(text)) return 'family';
  if (/quán trà|ấm trà|chén trà|rót trà|ngồi uống trà|tiếp khách/.test(text)) return 'teahouse';
  if (/ruộng|đồng|làng quê|nông dân|người dân|sưu thuế|thu thuế|làm ruộng/.test(text)) return 'countryside';
  if (/xưởng in|máy in|tiệm sách|nhà in|thợ in|in ấn/.test(text)) return 'printing';
  if (/đám đông|buổi sinh hoạt cộng đồng|các gia đình|nhóm thành viên|nhiều thành viên|người xem|mạng xã hội|bình luận|buôn làng|bản làng|người mông|cộng đồng/.test(text)) return 'community';
  return 'general';
};

type Actor = {id:string;x:number;bottom:number;size?:'child';pose?:'seated'|'standing';facing?:'left'|'right';angle?:number};
const actor = ({id,x,bottom,size,pose='standing',facing,angle=0}:Actor) => {
  const child=size==='child';
  const width=child?112:165;
  const height=child?174:250;
  return <div key={id} style={{position:'absolute',left:x,bottom,width,height,zIndex:5,pointerEvents:'none',transform:'rotate('+angle+'deg)',transformOrigin:'center bottom',filter:'brightness(0) saturate(100%) opacity(.88) drop-shadow(0 8px 10px rgba(0,0,0,.28))'}}>
    {pose==='seated'?<div style={{position:'absolute',left:'8%',right:'8%',bottom:'0%',height:height*.36,border:'12px solid #171717',borderBottom:0,borderRadius:'18px 18px 0 0',opacity:.82}}/>:null}
    <div style={{position:'absolute',inset:0,transform:pose==='seated'?'translateY(12%) scaleY(.84)':'none',transformOrigin:'center bottom'}}>
      <ChibiSupportingCharacter facing={facing||((id.charCodeAt(id.length-1)%2)?'left':'right')} variant={id}/>
    </div>
  </div>;
};
const seat = (x:number,bottom:number,rotate=0) => <div style={{position:'absolute',left:x,bottom,width:160,height:105,border:'13px solid #29231e',borderTopWidth:18,borderRadius:'16px 16px 7px 7px',transform:'rotate('+rotate+'deg)',opacity:.9,zIndex:3,pointerEvents:'none'}}/>;

export const SceneSupportingCast:React.FC<{scene:SceneCastData}> = ({scene}) => {
  if (scene.character === 'none') return null;
  const kind=sceneKind(scene);
  const text=[scene.setting,scene.action,scene.heading,scene.props].join(' ').toLowerCase();
  const hasChildren=/trẻ em|em nhỏ|thiếu nhi|học sinh|các bé|đứa trẻ/.test(text);
  if (kind==='courtroom') return <>
    <div style={{position:'absolute',left:760,bottom:330,width:400,height:170,background:'linear-gradient(180deg,#795638,#493324)',border:'12px solid #30251e',borderRadius:'14px 14px 4px 4px',zIndex:3,boxShadow:'0 14px 22px #0005'}}/>
    {actor({id:'judge-a',x:875,bottom:390})}
    {seat(400,95,-3)}{seat(1360,95,3)}
    {actor({id:'lawyer-a',x:405,bottom:105,pose:'seated',facing:'right'})}
    {actor({id:'lawyer-b',x:1370,bottom:105,pose:'seated',facing:'left'})}
    {actor({id:'defendant-a',x:930,bottom:105,pose:'seated',facing:'left'})}
    {hasChildren?actor({id:'child-court-a',x:1120,bottom:95,size:'child',pose:'seated',facing:'left'}):null}
  </>;
  if (kind==='meeting') return <>
    <div style={{position:'absolute',left:650,bottom:145,width:620,height:105,zIndex:3,pointerEvents:'none',background:'linear-gradient(180deg,#896747,#60452f)',border:'10px solid #493729',borderRadius:'50%',boxShadow:'0 18px 24px #0005'}}/>
    {seat(430,90,-5)}{seat(690,90,0)}{seat(1060,90,4)}{seat(1320,90,7)}
    {actor({id:'meeting-a',x:435,bottom:100,pose:'seated'})}{actor({id:'meeting-b',x:700,bottom:100,pose:'seated',facing:'left'})}
    {actor({id:'meeting-c',x:1070,bottom:100,pose:'seated'})}{actor({id:'meeting-d',x:1325,bottom:100,pose:'seated',facing:'left'})}
    {hasChildren?actor({id:'meeting-child',x:920,bottom:88,size:'child',pose:'seated'}):null}
  </>;
  if (kind==='family') return <>
    {seat(390,95,-8)}{seat(880,95,8)}
    {actor({id:'family-parent-a',x:390,bottom:100,pose:'seated'})}
    {actor({id:'family-parent-b',x:890,bottom:100,pose:'seated',facing:'left'})}
    {actor({id:'family-child-a',x:680,bottom:90,size:'child',pose:'seated',facing:'right'})}
    {hasChildren?actor({id:'family-child-b',x:1120,bottom:90,size:'child',pose:'seated'}):null}
  </>;
  if (kind==='teahouse') return <>
    {seat(470,100,-8)}{seat(1160,100,8)}
    {actor({id:'tea-host-a',x:470,bottom:105,pose:'seated'})}
    {actor({id:'tea-guest-b',x:1170,bottom:105,pose:'seated',facing:'left'})}
    {actor({id:'tea-server-c',x:820,bottom:85,size:'child',facing:'right'})}
  </>;
  if (kind==='countryside') return <>
    {actor({id:'field-worker-a',x:390,bottom:65,angle:-8})}
    {actor({id:'field-worker-b',x:810,bottom:75,angle:7})}
    {actor({id:'field-child-c',x:1180,bottom:55,size:'child',angle:-5})}
  </>;
  if (kind==='printing') return <>
    {actor({id:'printer-a',x:420,bottom:95,angle:-5})}
    {actor({id:'printer-b',x:1060,bottom:90,angle:4,facing:'left'})}
  </>;
  if (kind==='community') return <>
    {actor({id:'community-a',x:350,bottom:85,angle:-8})}
    {actor({id:'community-b',x:720,bottom:180,angle:5,facing:'left'})}
    {actor({id:'community-c',x:1120,bottom:80,angle:-3})}
    {actor({id:'community-d',x:1450,bottom:190,angle:7,facing:'left'})}
    {hasChildren?actor({id:'community-child',x:910,bottom:55,size:'child'}):null}
  </>;
  return null;
};
