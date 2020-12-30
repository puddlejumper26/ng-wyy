import { Observable, Subject } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { map, takeUntil } from 'rxjs/internal/operators';

import { AppStoreModule } from 'src/app/store';
import { BatchActionsService } from 'src/app/store/batch-actions.service';
import { getCurrentSong, getPlayer } from './../../store/selectors/player.selector';
import { SongService } from 'src/app/services/song.service';
import { Song, SongSheet } from './../../services/data-types/common.types';
@Component({
    selector: "app-sheet-info",
    templateUrl: "./sheet-info.component.html",
    styleUrls: ["./sheet-info.component.less"],
})
export class SheetInfoComponent implements OnInit, OnDestroy {

    sheetInfo: SongSheet;

    description = {
        short: '',
        long: ''
    }

    controlDesc = {
        isExpand: false,
        label: '展开',
        iconCls: 'down'
    }

    // 用来保存store observable的对象
    private appStore$: Observable<AppStoreModule>;
    // 用来发射流，如果发射一个流，就停止监听
    private destroy$ = new Subject<void>();
    // 保存正在播放的歌曲
    currentSong: Song;

    constructor(
        private route: ActivatedRoute,
        private store$: Store<AppStoreModule>,
        private songServe: SongService,
        private batchActionServe: BatchActionsService,
    ) {
        // 这里的 data 是sheet-info-routing.module.ts 中的 data， 其中包括了title和resolve中sheetInfo的信息
        this.route.data.pipe(map((res) => res.sheetInfo)).subscribe((res) => {
            // console.log("【SheetInfoComponent】 - constructor - res - ", res);
            this.sheetInfo = res;
            if(res.description) {
                this.changeDesc(res.description);
            }
        });

        this.listenCurrent();
    }

    ngOnInit() {}

    private changeDesc(desc: string) {
        // 截取99个字符
        if(desc.length < 99) {
            this.description = {
                short: '<b>介绍： </b>' + this.replaceBr(desc),
                long:  '<b>介绍： </b>' + this.replaceBr(desc), //这样能够点击展开之后不会空白
            }
        }else {
            // 如果超过99个字符
            this.description = {
                short: '<b>介绍： </b>' + this.replaceBr(desc.slice(0,99)) + '...',
                long: '<b>介绍： </b>' + this.replaceBr(desc)
            }
        }
    }

    toggleDesc() {
        this.controlDesc.isExpand = !this.controlDesc.isExpand;
        if(this.controlDesc.isExpand) {
            this.controlDesc.iconCls = 'up';
            this.controlDesc.label = '收起';
        }else {
            this.controlDesc.iconCls = 'down';
            this.controlDesc.label = '展开';
        }
    }

    // 把desc中的换行符换成<br>标签 所以需要用正则，这里使用的是innerHTML
    private replaceBr(str: string): string {
        return str.replace(/\n/g, '<br>');
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
                    alert('Warning：API has no url，request is denied');
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
