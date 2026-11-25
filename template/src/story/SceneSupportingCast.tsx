import React from 'react';
import {MainBoy} from '../chibi/MainBoy';

type CastStyle = {
  hair: string;
  shirt: string;
  shorts: string;
  shoes: string;
  skin: string;
};

const palettes: Record<string, [CastStyle, CastStyle]> = {
  teahouse: [
    {hair:'#342A25',shirt:'#6F7E75',shorts:'#E7D9C5',shoes:'#F4EDE2',skin:'#D7A98E'},
    {hair:'#594235',shirt:'#9A6D4E',shorts:'#D7C5A9',shoes:'#EDE7DC',skin:'#E2B99C'},
  ],
  countryside: [
    {hair:'#302B25',shirt:'#71805A',shorts:'#D9D0B7',shoes:'#E9E2D3',skin:'#B98262'},
    {hair:'#49352B',shirt:'#92734F',shorts:'#E5D7BC',shoes:'#F0E8D9',skin:'#C99475'},
  ],
  meeting: [
    {hair:'#3C302A',shirt:'#71818A',shorts:'#D8D4C8',shoes:'#F4F0E8',skin:'#D5A88D'},
    {hair:'#332B27',shirt:'#9B755C',shorts:'#E3D8C8',shoes:'#F4EFE5',skin:'#D7A98E'},
  ],
  printing: [
    {hair:'#332A25',shirt:'#6D7B83',shorts:'#D7D0C3',shoes:'#F1ECE2',skin:'#C99576'},
    {hair:'#43362E',shirt:'#A37A54',shorts:'#E1D4BE',shoes:'#F4EDE2',skin:'#D7AA8F'},
  ],
};

const castFor = (scene: {setting:string; action:string; heading:string; props?:string}) => {
  const text = [scene.setting,scene.action,scene.heading,scene.props].join(' ').toLowerCase();
  if (/quán trà|ấm trà|chén trà|người hoa/.test(text)) return palettes.teahouse;
  if (/ruộng|đồng|làng quê|nông dân|người dân|sưu thuế/.test(text)) return palettes.countryside;
  if (/phòng họp|sinh hoạt|cuộc họp|cộng đồng|hội trường/.test(text)) return palettes.meeting;
  if (/xưởng in|máy in|tiệm sách|nhà in/.test(text)) return palettes.printing;
  return null;
};

export const SceneSupportingCast: React.FC<{scene:{setting:string;action:string;heading:string;props?:string;character?:string}}> = ({scene}) => {
  if (scene.character === 'none') return null;
  const cast = castFor(scene);
  if (!cast) return null;
  return (
    <>
      <div style={{position:'absolute',left:300,bottom:154,width:230,height:307,zIndex:5,pointerEvents:'none',filter:'drop-shadow(0 12px 15px rgba(0,0,0,.28))'}}>
        <MainBoy facing="right" expression="neutral" mouth="closed" gesture="rest"
          hairColor={cast[0].hair} shirtColor={cast[0].shirt} shortsColor={cast[0].shorts}
          shoeColor={cast[0].shoes} skinColor={cast[0].skin}/>
      </div>
      <div style={{position:'absolute',right:300,bottom:154,width:230,height:307,zIndex:5,pointerEvents:'none',filter:'drop-shadow(0 12px 15px rgba(0,0,0,.28))'}}>
        <MainBoy facing="left" expression="happy" mouth="smile" gesture="rest"
          hairColor={cast[1].hair} shirtColor={cast[1].shirt} shortsColor={cast[1].shorts}
          shoeColor={cast[1].shoes} skinColor={cast[1].skin}/>
      </div>
    </>
  );
};
