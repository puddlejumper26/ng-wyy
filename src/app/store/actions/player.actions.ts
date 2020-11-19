import { createAction, props } from '@ngrx/store';

import { PlayMode } from './../../share/wy-ui/wy-player/player-type';
import { Song } from './../../services/data-types/common.types';

// 定义播放器的动作, 设置好之后要注册到 player.reducer.ts，通过on来注册
// https://next.ngrx.io/guide/store/
// 第一个参数是一个标识符，用来语义化这个是在干什么
//在player模块下设置播放状态

// props 用来接收一个对象 是一个 {key:values}的对象  key 是string， values 是 any，根据情况设定， 后面有()，是调用

// export const SetPlaying = createAction('[player] Set playing', props<{ playing: boolean}>());
// export const SetPlayList = createAction('[player] Set playList', props<{ list: Song[]}>());
// export const SetSongList = createAction('[player] Set songList', props<{ list: Song[]}>());
// export const SetPlayMode = createAction('[player] Set playMode', props<{ mode: PlayMode}>());
// export const SetCurrentIndex = createAction('[player] Set currentIndex', props<{ index: number}>());

// [player]意思是在player模块下，Set Playing 意思是设置播放状态 key是playing，值是boolean类型
// 在 Redux的插件中如果进行使用，就可以看见这个[player] Set playing 信息的展示
export const SetPlaying = createAction('[player] Set playing', props<{ playing: boolean}>());
export const SetPlayList = createAction('[player] Set playList', props<{ playList: Song[]}>());
export const SetSongList = createAction('[player] Set songList', props<{ songList: Song[]}>());
export const SetPlayMode = createAction('[player] Set playMode', props<{ playMode: PlayMode}>());
export const SetCurrentIndex = createAction('[player] Set currentIndex', props<{ currentIndex: number}>());