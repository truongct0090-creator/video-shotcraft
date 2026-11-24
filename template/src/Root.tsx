import { Composition } from 'remotion';
import { AIFL_TOTAL } from './aifl/Main';
import { ThemedFilm } from './themes/ThemedFilm';
import { ChibiDemo } from './chibi/ChibiDemo';
import { MainBoyDemo } from './chibi/MainBoyDemo';
import { StoryAnimatic, STORY_ANIMATIC_DEFAULTS } from './story/StoryAnimatic';

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="AiflPromo"
        component={ThemedFilm}
        defaultProps={{theme: 'ink-press'}}
        durationInFrames={AIFL_TOTAL}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="StoryAnimatic"
        component={StoryAnimatic}
        defaultProps={STORY_ANIMATIC_DEFAULTS}
        durationInFrames={150}
        calculateMetadata={({props}) => ({durationInFrames: props.scenes.length * props.framesPerScene})}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="MainBoyDemo"
        component={MainBoyDemo}
        defaultProps={{}}
        durationInFrames={220}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="ChibiDemo"
        component={ChibiDemo}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
