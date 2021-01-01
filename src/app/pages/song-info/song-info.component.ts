import { ActivatedRoute } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { map, takeUntil } from 'rxjs/internal/operators';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs/internal/Subject';

import { AppStoreModule } from 'src/app/store';
import { BaseLyricLine } from 'src/app/share/wy-ui/wy-player/wy-player-panel/wy-lyric';
import { BatchActionsService } from 'src/app/store/batch-actions.service';
import { findIndex } from 'src/app/utils/array';
import { getCurrentSong, getPlayer } from 'src/app/store/selectors/player.selector';
import { Song } from 'src/app/services/data-types/common.types';
import { SongService } from 'src/app/services/song.service';
import { WyLyric } from './../../share/wy-ui/wy-player/wy-player-panel/wy-lyric';
import { NzMessageService } from 'ng-zorro-antd';


/**
 *               和 sheet-info component 非常类似
 */
@Component({
    selector: "app-song-info",
    templateUrl: "./song-info.component.html",
    styleUrls: ["./song-info.component.less"],
})
export class SongInfoComponent implements OnInit, OnDestroy{

    song: Song;
    lyric: BaseLyricLine[];

    controlLyric = {
        isExpand: false,
        label: '展开',
        iconCls: 'down'
    }

    // 用来发射流，如果发射一个流，就停止监听
    private destroy$ = new Subject<void>();
    // 保存正在播放的歌曲
    currentSong: Song;
    currentIndex = -1;

    constructor(
        private route: ActivatedRoute,
        private store$: Store<AppStoreModule>,
        private songServe: SongService,
        private batchActionServe: BatchActionsService,
        private nzMessageServe: NzMessageService,
        ) {
        this.route.data
            .pipe(map((res) => res.songInfo))
            .subscribe(([song, lyric]) => {
                this.song = song;
                // this.lyric = lyric;
                this.lyric = new WyLyric(lyric).lines;
                // console.log('【SongInfoComponent】- constructor - song', song);
                // console.log('【SongInfoComponent】- constructor - lyric', this.lyric);
                this.listenCurrent();
            });
    }

    ngOnInit() {}

    toggleLyric() {
        this.controlLyric.isExpand = !this.controlLyric.isExpand;
        if(this.controlLyric.isExpand) {
            this.controlLyric.iconCls = 'up';
            this.controlLyric.label = '收起';
        }else {
            this.controlLyric.iconCls = 'down';
            this.controlLyric.label = '展开';
        }
    }

     // 监听当前正在播放的歌曲
    // takeUntil 什么时候停止发射流
    private listenCurrent() {
        this.store$
            .pipe(select(getPlayer), select(getCurrentSong), takeUntil(this.destroy$))
            .subscribe(song =>{
                // console.log('【SheetInfoComponent】 - listenCurrent - song - ', song);
                this.currentSong = song;
            })
    }

    // 添加一首歌曲
    onAddSong(song: Song, isPlay = false) {
        // 首先判断是否是正在播放的歌曲
        if (!this.currentSong || this.currentSong.id !== song.id) {
            // 这里需要通过getSongList来获得歌曲的播放url,这个返回的是一个歌曲数组
            // 因为就添加一首歌，所以这一取 [0]
            this.songServe.getSongList(song).subscribe(list => {
                // console.log('【SheetInfoComponent】- onAddSong - list -', list)
                if (list.length) {
                    this.batchActionServe.insertSong(list[0], isPlay);
                }else {
                    this.nzMessageServe.create('warning', 'Warning：API has no url for this song，request is denied!');
                }
            })
        }
    }

     // 这里发射一个值，在 listenCurrent 里的 takeUntil就能够接受到并且停止
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete(); //结束
    }
}
