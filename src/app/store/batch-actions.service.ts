import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { AppStoreModule } from '.';
import { Song } from '../services/data-types/common.types';
import { playerReducer, PlayState } from 'src/app/store/reducers/player.reducer';
import { getPlayer } from 'src/app/store/selectors/player.selector';
import { SetCurrentIndex, SetPlayList, SetSongList } from './actions/player.actions';
import { findIndex } from 'src/app/utils/array';
import { shuffle } from 'src/app/utils/array';

@Injectable({
    providedIn: AppStoreModule,
})
export class BatchActionsService {

    private playerState: PlayState;

    constructor( private store$: Store<AppStoreModule>) {
        this.store$.pipe(select(getPlayer)).subscribe(res => this.playerState = res);
    }

    //   播放列表 home.component
    selectPlayList({list, index}: {list: Song[], index: number}) {
        this.store$.dispatch(SetSongList({ songList: list}));

            let trueIndex = index;
            let trueList = list.slice();
            if(this.playerState.playMode.type === 'random') {
                trueList = shuffle(list || []); // [] 兼容一下list 不存在的情况
                trueIndex = findIndex(trueList, list[trueIndex]);
            }
            this.store$.dispatch(SetPlayList({ playList: trueList}));
            this.store$.dispatch(SetCurrentIndex({ currentIndex: trueIndex}));
    }

    // wy-playerReducer.component.ts
    deleteSong(song: Song){
        const songList = this.playerState.songList.slice();
        const playList = this.playerState.playList.slice();
        let currentIndex = this.playerState.currentIndex; //前面watchCurrentIndex已经赋过值了

        // 找到传入的歌在songList和playList中的索引，然后删除掉
        const sIndex = findIndex(songList, song);
        // console.log('wy-player.component - onDeleteSong - sIndex', sIndex);
        // 从songList中删除这首歌
        songList.splice(sIndex, 1);
        const pIndex = findIndex(playList, song);
        // console.log('wy-player.component - onDeleteSong - pIndex', pIndex);
        playList.splice(pIndex, 1);

        // 如果 现在播放的歌曲的索引大于要删除歌曲的索引|| 现在播放的歌曲是最后一首歌
        if(currentIndex > pIndex || currentIndex === playList.length) {
            currentIndex--; //上述两种情况都需要减一
            console.log('wy-player.component - onDeleteSong - currentIndex', currentIndex);
        }

        // 发送值给store
        this.store$.dispatch(SetSongList({ songList: songList }));
        this.store$.dispatch(SetPlayList({ playList: playList }));
        this.store$.dispatch(SetCurrentIndex({ currentIndex: currentIndex }));
    }

    clearSong(){
        this.store$.dispatch(SetSongList({ songList: [] }));
        this.store$.dispatch(SetPlayList({ playList: [] }));
        this.store$.dispatch(SetCurrentIndex({ currentIndex: -1 }));
    }
}


