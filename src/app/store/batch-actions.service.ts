import { SetModalType, SetModalVisible, SetLikeId } from './actions/member.actions';
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { timer } from 'rxjs';

import { AppStoreModule } from '.';
import { CurrentActions, PlayState } from 'src/app/store/reducers/player.reducer';
import { findIndex } from 'src/app/utils/array';
import { getMember } from './selectors/member.selector';
import { getPlayer } from 'src/app/store/selectors/player.selector';
import { MemberState, ModalTypes } from './reducers/member.reducer';
import { SetCurrentIndex, SetPlayList, SetSongList, SetCurrentAction } from './actions/player.actions';
import { shuffle } from 'src/app/utils/array';
import { Song } from '../services/data-types/common.types';

@Injectable({
    providedIn: AppStoreModule,
})
export class BatchActionsService {

    private playerState: PlayState;
    private memberState: MemberState

    constructor( private store$: Store<AppStoreModule>) {
        this.store$.pipe(select(getPlayer)).subscribe(res => this.playerState = res);
        this.store$.pipe(select(getMember)).subscribe(res => this.memberState = res);
    }

    //  播放列表 home.component
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
            this.store$.dispatch(SetCurrentAction({ currentAction: CurrentActions.Play }))
    }

    // 删除歌曲
    // wy-player.component.ts
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
            // console.log('【wy-player.component】 or 【BatchActionsService】 - deleteSong - currentIndex', currentIndex);
        }

        // 发送值给store
        this.store$.dispatch(SetSongList({ songList: songList }));
        this.store$.dispatch(SetPlayList({ playList: playList }));
        this.store$.dispatch(SetCurrentIndex({ currentIndex: currentIndex }));
        this.store$.dispatch(SetCurrentAction({ currentAction: CurrentActions.Delete }));
    }

    // 清除歌曲
    clearSong(){
        this.store$.dispatch(SetSongList({ songList: [] }));
        this.store$.dispatch(SetPlayList({ playList: [] }));
        this.store$.dispatch(SetCurrentIndex({ currentIndex: -1 }));
        this.store$.dispatch(SetCurrentAction({ currentAction: CurrentActions.Clear }));
    }

    // 添加歌曲
    insertSong(song: Song, isPlay: boolean) {
        // 因为要添加到playlist 和 songlist 中去
        const songList = this.playerState.songList.slice();
        let playList = this.playerState.playList.slice();
        // 需要知道这首歌曲插入进去的位置
        let insertIndex = this.playerState.currentIndex;
        // 看我们插入的歌曲是否在playlist里面
        const pIndex = findIndex(playList, song);

        if (pIndex > -1) {
            // 说明歌曲存在
            if (isPlay) {
                // 如果正在播放，说明currentIndex 是需要改变的变成 pIndex
                insertIndex = pIndex;
            }
        }else {
            songList.push(song);
            // playList.push(song);
            if (isPlay) {
                // 变成最后一周歌曲index
                insertIndex = songList.length - 1;
            }

            if(this.playerState.playMode.type === 'random') {
                playList = shuffle(songList);
            }else {
                playList.push(song);
            }

            this.store$.dispatch(SetSongList({ songList: songList }));
            this.store$.dispatch(SetPlayList({ playList: playList }));
        }

        // 这里要改变currenIndex, 因为在前面的if(isPlay)条件下，insertIndex的值就被改变了
        if (insertIndex !== this.playerState.currentIndex) {
            this.store$.dispatch(SetCurrentIndex({ currentIndex: insertIndex }));
            this.store$.dispatch(SetCurrentAction({ currentAction: CurrentActions.Play }));
        }else {
            // 只添加不播放
            this.store$.dispatch(SetCurrentAction({ currentAction: CurrentActions.Add }));
        }
    }

    // 添加专辑 多首歌曲
    insertSongs(songs: Song[]) {
        // 因为要添加到playlist 和 songlist 中去
        let songList = this.playerState.songList.slice();
        let playList = this.playerState.playList.slice();
        // 取出当前列表里没有的歌曲
        let validSongs = songs.filter(item => findIndex(playList, item) === -1);
        if(validSongs.length) {
            songList = songList.concat(validSongs);

            let songPlayList = validSongs.slice();
            if(this.playerState.playMode.type === 'random') {
                songPlayList = shuffle(songList);
            }
            playList = playList.concat(songPlayList);

            this.store$.dispatch(SetSongList({ songList: songList }));
            this.store$.dispatch(SetPlayList({ playList: playList }));
        }


        // 因为这里仅仅是把歌曲直接添加进songList和playList，所以如果这时候模式是random就无法体现
        // 因为不确定现在的songs中的歌曲是否已经存在songList和playList中
        // songs.forEach( item => {
        //     const pIndex = findIndex(playList, item);
        //     if(pIndex === -1) {
        //         songList.push(item);
        //         playList.push(item);
        //     }
        // })

        // this.store$.dispatch(SetSongList({ songList: songList }));
        // this.store$.dispatch(SetPlayList({ playList: playList }));
        this.store$.dispatch(SetCurrentAction({ currentAction: CurrentActions.Add }));
    }

    // 会员弹窗 显示 隐藏、类型
    // 下面重新设置，这样当页面在登录页面时，关闭窗口，就不会先跳转到Default的界面再关闭掉
    // controlModal(modalVisible = true, modalType = ModalTypes.Default) {
    controlModal(modalVisible = true, modalType?: ModalTypes) {
        if (modalType) {
            this.store$.dispatch(SetModalType({ modalType: modalType}))
        }
        this.store$.dispatch(SetModalVisible({ modalVisible: modalVisible}))
        if(!modalVisible) {
            timer(500).subscribe(() => this.store$.dispatch(SetModalType({ modalType: ModalTypes.Default})));
        }
    }

    //收藏歌曲
    likeSong(id: string) {
        // 先改掉弹窗类型
        this.store$.dispatch(SetModalType({ modalType: ModalTypes.Like }))
        // 这样登录之后，每次点击不同的收藏，才都会有窗口弹出
        // this.store$.dispatch(SetModalVisible({ modalVisible: true}))
        // 之后在wy-layer-modal.component.ts中的watchModal中就能watch到type了

        // 这里还要传入歌曲的ID，这样在 wy-layer-like 组件中就能监听到 id 的变化
        this.store$.dispatch(SetLikeId({ id }))
    }
}
