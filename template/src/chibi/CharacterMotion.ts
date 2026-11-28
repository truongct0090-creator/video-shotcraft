import type {CharacterRigPose} from './CharacterRig';

const clamp=(v:number,min=0,max=1)=>Math.max(min,Math.min(max,v));
const smooth=(v:number)=>{const t=clamp(v);return t*t*(3-2*t);};
const pulse=(t:number,center:number,width:number)=>{const d=Math.abs(t-center)/width;return d>=1?0:1-smooth(d);};
const wave=(frame:number,fps:number,rate:number,phase=0)=>Math.sin((frame/fps)*Math.PI*2*rate+phase);

/** Speech-aware, deterministic motion: each gesture has an anticipation, action and recovery. */
export const buildMainBoyPerformance=(args:{
 frame:number; fps:number; durationInFrames:number; action:string; narration:string; heading:string; speakingLevel?:number;
}):CharacterRigPose=>{
 const {frame,fps,durationInFrames}=args;
 const t=clamp(frame/Math.max(1,durationInFrames));
 const words=(args.action+' '+args.narration+' '+args.heading).toLocaleLowerCase('vi-VN');
 const ask=/\?|vì sao|tại sao|điều gì|liệu|có phải|bạn có|ai đã|bao nhiêu|như thế nào|câu hỏi|thắc mắc/.test(words);
 const point=/chỉ|trỏ|hướng tới|đánh dấu|gạch chân|đưa ra/.test(args.action.toLocaleLowerCase('vi-VN'));
 const emphasize=/nhấn mạnh|đặc biệt|quan trọng|cần nhớ|điều đáng nói|sự thật|kết luận|tóm lại|không thể/.test(words);
 const contrast=/so sánh|một mặt|mặt khác|trong khi|ngược lại|đối lập/.test(words);
 const explain=/giải thích|diễn giải|phân tích|lý do|bởi vì|nghĩa là|cụ thể|ví dụ|cho thấy|chứng minh/.test(words);
 const shrug=/không rõ|không biết|khó hiểu|vô lý|trớ trêu|mỉa mai|châm biếm/.test(words);
 const listen=/lắng nghe|nghe lời|chú ý|theo dõi/.test(words);
 const idle=wave(frame,fps,.22);
 const breathe=wave(frame,fps,.28,.6);
 // Two restrained gesture beats keep longer narration from becoming a static pose.
 const beatA=pulse(t,.27,.20),beatB=pulse(t,.68,.19);
 const voice=args.speakingLevel===undefined?1:clamp((args.speakingLevel-.08)/.52);\n const beat=Math.max(beatA,beatB)*voice;
 const phase=wave(frame,fps,.72);
 let left=idle*1.8,right=-idle*1.8,el=0,er=0,torso=breathe*.8,head=wave(frame,fps,.34)*1.2;
 if(ask){left+=-30*beat;right+=-24*beat;el+=-12*beat;er+=14*beat;head+=-5*beat;torso+=-1.8*beat;}
 else if(point){right+=-52*beat;er+=-20*beat;head+=-4*beat;torso+=-2*beat;}
 else if(emphasize){right+=-40*beat;left+=-14*beat;er+=-24*beat;torso+=-3*beat;}
 else if(shrug){left+=-34*beat;right+=-34*beat;el+=-28*beat;er+=28*beat;head+=5*beat;}
 else if(contrast){left+=-34*beatA;right+=-34*beatB;el+=-10*beatA;er+=10*beatB;torso+=2*(beatA-beatB);}
 else if(explain){left+=-26*beat*(.65+.35*Math.sin(frame/fps*2.4));right+=-34*beat*(.65+.35*Math.sin(frame/fps*2.4+1.2));el+=-12*beat;er+=-16*beat;torso+=-1.2*beat;}
 else if(listen){head+=4*beat;left+=8*beat;right+=8*beat;torso+=-1.5*beat;}
 // Tiny asymmetric weight shift and recovery prevent a mechanically mirrored pose.
 const shift=wave(frame,fps,.42,1.1)*1.7;
 return {
  torso:torso+shift*.35,head,
  leftShoulder:left+shift,rightShoulder:right-shift,
  leftElbow:el,rightElbow:er,
  leftHip:shift*.45,rightHip:-shift*.45,
  leftKnee:Math.max(0,phase)*.8,rightKnee:Math.max(0,-phase)*.8,
 };
};

export type SupportingMotion='still'|'walking'|'jumping'|'kneeling'|'bowing';
export const inferSupportingMotion=(text:string):SupportingMotion=>{
 const s=text.toLocaleLowerCase('vi-VN');
 if(/quỳ|quỳ gối|lạy|cúi đầu sát|phủ phục/.test(s)) return 'kneeling';
 if(/cúi chào|cúi mình|vái|chắp tay/.test(s)) return 'bowing';
 if(/nhảy|nhảy lên|nhảy nhót|bật lên/.test(s)) return 'jumping';
 if(/đi lại|đi qua|bước tới|bước đi|rời đi|tiến đến|đi bộ|bỏ đi/.test(s)) return 'walking';
 return 'still';
};

export const buildSupportingPose=(frame:number,fps:number,index:number,motion:SupportingMotion):CharacterRigPose=>{
 const phase=(frame/Math.max(1,fps))*Math.PI*2*1.35+index*.8;
 const s=Math.sin(phase),a=Math.sin(phase+Math.PI/2);
 if(motion==='walking') return {
  rootX:Math.sin(frame/Math.max(1,fps)*.55+index)*14,
  leftHip:s*20,rightHip:-s*20,leftKnee:Math.max(0,-s)*32,rightKnee:Math.max(0,s)*32,
  leftShoulder:-s*15,rightShoulder:s*15,leftElbow:8,rightElbow:8,torso:a*1.4,head:-a*.8,
 };
 if(motion==='jumping'){
  const jump=Math.max(0,Math.sin(phase*.5));
  return {rootY:-jump*52,leftHip:-s*10-8,rightHip:s*10-8,leftKnee:jump*18,rightKnee:jump*18,
   leftShoulder:-28*jump,rightShoulder:-28*jump,leftElbow:-12*jump,rightElbow:12*jump,torso:-2*jump,head:2*jump};
 }
 if(motion==='kneeling'){\n  const bow=Math.max(0,Math.sin(phase*.42));\n  return {rootY:0,torso:8+10*bow,head:8+15*bow,leftHip:0,rightHip:0,leftKnee:0,rightKnee:0,leftShoulder:-18-8*bow,rightShoulder:-18-8*bow,leftElbow:20+8*bow,rightElbow:-20-8*bow};\n }
 if(motion==='bowing') return {torso:10+Math.max(0,Math.sin(phase*.35))*10,head:12,leftShoulder:-18,rightShoulder:-18,leftElbow:26,rightElbow:-26};
 return {torso:Math.sin(phase*.35)*.5,head:Math.sin(phase*.28)*.7};
};
