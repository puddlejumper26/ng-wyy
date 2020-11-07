import { SetCurrentIndex, SetPlaying, SetPlayList, SetPlayMode, SetSongList } from './../actions/player.actions';
import { Action, createReducer, on } from '@ngrx/store';
import { Song } from 'src/app/services/data-types/common.types';
import { PlayMode } from 'src/app/share/wy-ui/wy-player/player-type';
import { state } from '@angular/animations';

export type PlayState = {
    //播放状态
    playing: boolean;
    //播放模式
    playMode: PlayMode;
    //歌曲列表
    songList: Song[];
    // 播放列表
    playList: Song[]
    // 当前正在播放的索引
    currentIndex: number;
}

// 定义播放器初始的状态
export const initialState: PlayState = {
    playing: false,
    songList: [],
    playList: [],
    playMode: { type: 'loop', label: '循环'},
    currentIndex: -1  //因为不知道会从哪一首开始
}


// 注册 player.actions.ts中的动作
// https://next.ngrx.io/guide/store/

const reducer = createReducer(
    initialState,
    // on是注册一系列动作的, 第二格参数是一个函数，接收一个state，返回一个新的state
    //执行 SetPlaying 这个动作之后，修改state数据，返回一个新的state状态，这样就不会和引用类型的冲突
    // on(SetPlaying, (state, {playing}) => ({ ...state, playing})),
    // on(SetPlayList, (state, {list}) => ({ ...state, playList: list})),  //值是 list
    // on(SetSongList, (state, {list}) => ({ ...state, songList: list})),
    // on(SetPlayMode, (state, {mode}) => ({ ...state, playMode: mode})),
    // on(SetCurrentIndex, (state, {index}) => ({ ...state, currentIndex: index})),
    on(SetPlaying, (state, {playing}) => ({ ...state, playing})),
    on(SetPlayList, (state, {playList}) => ({ ...state, playList})),  //值是 list
    on(SetSongList, (state, {songList}) => ({ ...state, songList})),
    on(SetPlayMode, (state, {playMode}) => ({ ...state, playMode})),
    on(SetCurrentIndex, (state, {currentIndex}) => ({ ...state, currentIndex})),
)

//https://next.ngrx.io/guide/store/
export function playerReducer(state: PlayState, action: Action){
    return  reducer(state, action);
}


/**
export const SetPlaying = createAction('[player] Set playing', props<{ playing: boolean}>());
export const SetPlayList = createAction('[player] Set playList', props<{ list: Song[]}>());
export const SetSongList = createAction('[player] Set songList', props<{ list: Song[]}>());
export const SetPlayMode = createAction('[player] Set playMode', props<{ mode: PlayMode}>());
export const SetCurrentIndex = createAction('[player] Set currentIndex', props<{ index: number}>());

 */