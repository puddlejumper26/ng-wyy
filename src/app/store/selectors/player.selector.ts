import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PlayState } from '../reducers/player.reducer';


// 首先要拿到 state 里的所有的数据
const selectPlayerStates = (state: PlayState) => state;

// 使用这个方法来拿到 'player' 是因为@ngrx/store-devtool@8.6.0
//  注意 这里的 'player' 要和 index.ts 中的 StoreModule.forRoot({ player: playerReducer} 中的参数保持一致
export const getPlayer = createFeatureSelector<PlayState>('player');

// 第二个参数是一个函数，获取playing数据的selector
export const getPlaying = createSelector(selectPlayerStates, (state: PlayState) => state.playing);
export const getPlayList = createSelector(selectPlayerStates, (state: PlayState) => state.playList);
export const getSongList = createSelector(selectPlayerStates, (state: PlayState) => state.songList);
export const getPlayMode = createSelector(selectPlayerStates, (state: PlayState) => state.playMode);
export const getCurrentIndex = createSelector(selectPlayerStates, (state: PlayState) => state.currentIndex);
//最后再定义一个正在播放的歌曲，因为这个才能够在程序里面进行使用，可以用 getPlayList和 getCurrentIndex来获取
//这样就拿到正在播放的歌曲
export const getCurrentSong = createSelector(selectPlayerStates, ({playList, currentIndex}: PlayState) => playList[currentIndex]);

/**
 *    上面的这些导出的元素会被用在 最后需要展示数据的组件里，这里是 wy-player，也就是播放器组件
 *
 *      appStore$
            .pipe(select(getSongList))
            .subscribe((list) => this.watchList(list, "songList"));
        appStore$
            .pipe(select(getPlayList))
            .subscribe((list) => this.watchList(list, "playList"));
        appStore$
            .pipe(select(getCurrentIndex))
            .subscribe((index) => this.watchCurrentIndex(index));
        appStore$
            .pipe(select(getPlayMode))
            .subscribe((mode) => this.watchPlayMode(mode));
        appStore$
            .pipe(select(getCurrentSong))
            .subscribe((song) => this.watchCurrentSong(song));
 */