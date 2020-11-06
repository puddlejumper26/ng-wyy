import { createAction, props } from '@ngrx/store';

import { PlayMode } from './../../share/wy-ui/wy-player/player-type';
import { Song } from './../../services/data-types/common.types';

// 定义播放器的动作, 设置好之后要注册到 player.reducer.ts
// https://next.ngrx.io/guide/store/
// 第一个参数是一个标识符，用来语义化这个是在干什么
//在player模块下设置播放状态
// props 用来接收一个对象 是一个 key string ，values any的对象
export const SetPlaying = createAction('[player] Set playing', props<{ playing: boolean}>());
export const SetPlayList = createAction('[player] Set playList', props<{ list: Song[]}>());
export const SetSongList = createAction('[player] Set songList', props<{ list: Song[]}>());
export const SetPlayMode = createAction('[player] Set playMode', props<{ mode: PlayMode}>());
export const SetCurrentIndex = createAction('[player] Set currentIndex', props<{ index: number}>());
