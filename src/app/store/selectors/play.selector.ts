import { createSelector } from '@ngrx/store';
import { PlayState } from './../reducers/player.reducer';


// 首先要拿到 state 里的所有的数据
const selectPlayerStates = (state: PlayState) => state;
// 第二个参数是一个函数，获取playing数据的selector
export const getPlaying = createSelector(selectPlayerStates, (state: PlayState) => state.playing);
export const getPlayList = createSelector(selectPlayerStates, (state: PlayState) => state.playList);
export const getSongList = createSelector(selectPlayerStates, (state: PlayState) => state.songList);
export const getPlayMode = createSelector(selectPlayerStates, (state: PlayState) => state.playMode);
export const getCurrentIndex = createSelector(selectPlayerStates, (state: PlayState) => state.currentIndex);
//最后再定义一个正在播放的歌曲，因为这个才能够在程序里面进行使用，可以用 getPlayList和 getCurrentIndex来获取
//这样就拿到正在播放的歌曲
export const getCurrentSong = createSelector(selectPlayerStates, ({playList, currentIndex}: PlayState) => playList[currentIndex]);

