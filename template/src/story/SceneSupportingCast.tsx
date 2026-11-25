import React from 'react';
import {MainBoy} from '../chibi/MainBoy';

const hasSupportingCast = (scene: {setting:string; action:string; heading:string; props?:string}) => {
  const text = [scene.setting,scene.action,scene.heading,scene.props].join(' ').toLowerCase();
  return /quán trà|ấm trà|chén trà|người hoa|ruộng|đồng|làng quê|nông dân|người dân|sưu thuế|phòng họp|sinh hoạt|cuộc họp|cộng đồng|hội trường|xưởng in|máy in|tiệm sách|nhà in/.test(text);
};

export const SceneSupportingCast: React.FC<{scene:{setting:string;action:string;heading:string;props?:string;character?:string}}> = ({scene}) => {
  if (scene.character === 'none' || !hasSupportingCast(scene)) return null;
  return (
    <>
      <div style={{position:'absolute',left:105,bottom:118,width:205,height:274,zIndex:5,pointerEvents:'none',filter:'drop-shadow(0 10px 13px rgba(0,0,0,.28))'}}>
        <MainBoy facing="right" silhouette silhouetteHair="short" expression="neutral" mouth="closed" gesture="rest"/>
      </div>
      <div style={{position:'absolute',right:105,bottom:118,width:205,height:274,zIndex:5,pointerEvents:'none',filter:'drop-shadow(0 10px 13px rgba(0,0,0,.28))'}}>
        <MainBoy facing="left" silhouette silhouetteHair="long" silhouetteDress expression="neutral" mouth="closed" gesture="rest"/>
      </div>
    </>
  );
};
