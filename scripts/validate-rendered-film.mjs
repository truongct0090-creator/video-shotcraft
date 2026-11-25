#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync, spawnSync} from 'node:child_process';

const args=Object.fromEntries(process.argv.slice(2).map((arg)=>{const i=arg.indexOf('=');return i<0?[arg.replace(/^--/,''),'true']:[arg.slice(2,i),arg.slice(i+1)];}));
const file=path.resolve(args.file??'template/out/story-film.mp4');
const propsPath=path.resolve(args.props??'template/out/story-props.json');
const output=path.resolve(args.output??'template/out/story-film-qa.json');
if(!fs.existsSync(file)) throw new Error('Rendered MP4 not found: '+file);
if(!fs.existsSync(propsPath)) throw new Error('Story props not found: '+propsPath);
const availability=spawnSync('ffprobe',['-version'],{encoding:'utf8'});
if(availability.error?.code==='ENOENT'||availability.status!==0) {
  throw new Error('ffprobe is required for MP4 validation but is unavailable. Install FFmpeg and ensure ffprobe is on PATH before rendering.');
}
const props=JSON.parse(fs.readFileSync(propsPath,'utf8'));
const probe=JSON.parse(execFileSync('ffprobe',['-v','error','-show_entries','stream=codec_type,codec_name,width,height,avg_frame_rate','-show_entries','format=duration,size','-of','json',file],{encoding:'utf8'}));
const video=probe.streams?.find((s)=>s.codec_type==='video');
const audioCount=probe.streams?.filter((s)=>s.codec_type==='audio').length??0;
if(!video) throw new Error('MP4 contains no video stream.');
if(video.codec_name!=='h264') throw new Error('Expected H.264, got '+video.codec_name);
if(video.width!==1920||video.height!==1080) throw new Error('Expected 1920x1080, got '+video.width+'x'+video.height);
const [num,den]=String(video.avg_frame_rate).split('/').map(Number);
const fps=den?num/den:num;
if(Math.abs(fps-30)>0.01) throw new Error('Expected 30fps, got '+fps);
const blackScan=spawnSync('ffmpeg',['-hide_banner','-i',file,'-vf','blackdetect=d=0.001:pix_th=0.10:pic_th=0.98','-an','-f','null','-'],{encoding:'utf8'});
if(blackScan.error?.code==='ENOENT'||blackScan.status!==0) throw new Error('ffmpeg is required for black-frame validation.');
const blackMatches=[...(blackScan.stderr??'').matchAll(/black_start:([0-9.]+) black_end:([0-9.]+) black_duration:([0-9.]+)/g)];
if(blackMatches.length) throw new Error('Detected '+blackMatches.length+' full-black frame(s); first at '+blackMatches[0][1]+'s. Scene transitions must not expose blank frames.');
const duration=Number(probe.format?.duration??0);
const expected=Number(props.totalFrames??0)/30;
if(!(duration>0)) throw new Error('MP4 duration is empty.');
if(expected>0&&Math.abs(duration-expected)>1.5) throw new Error('Rendered duration '+duration+'s differs from expected '+expected+'s.');
const report={file:path.relative(process.cwd(),file),codec:video.codec_name,width:video.width,height:video.height,fps,durationSeconds:duration,expectedDurationSeconds:expected,audioStreams:audioCount,sizeBytes:Number(probe.format?.size??fs.statSync(file).size),sceneCount:props.scenes?.length??0,passed:true};
fs.mkdirSync(path.dirname(output),{recursive:true});
fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
