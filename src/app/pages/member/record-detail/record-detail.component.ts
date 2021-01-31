import { ActivatedRoute } from "@angular/router";
import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { map, takeUntil } from "rxjs/internal/operators";
import { NzMessageService } from "ng-zorro-antd";
import { select, Store } from "@ngrx/store";
import { Subject } from "rxjs";

import { AppStoreModule } from "src/app/store";
import { BatchActionsService } from "src/app/store/batch-actions.service";
import { findIndex } from "src/app/utils/array";
import { getCurrentSong, getPlayer } from "src/app/store/selectors/player.selector";
import { MemberService, RecordType } from "src/app/services/member.service";
import { SheetService } from 'src/app/services/sheet.service';
import { SongService } from "src/app/services/song.service";
import { Song } from "src/app/services/data-types/common.types";
import { User, RecordVal } from "src/app/services/data-types/member.type";

@Component({
    selector: "app-record-detail",
    templateUrl: "./record-detail.component.html",
    styles: [`.record-detail .page-wrap { padding: 40px; }`],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecordDetailComponent implements OnInit, OnDestroy {

/**
 *      这里的设置和 center.component.ts 中基本一致
 *
 *      这个组件的功能就是显示一个表格，所以样式也都是 inline
 *
 */

    user: User;
    userRecord: RecordVal[];
    recordType = RecordType.allData;

    private currentSong: Song;
    currentIndex = -1; //当前播放的索引

    // 用来取消下面的select中的订阅，和 sheet-info中一样的功能
    private destroy$ = new Subject();

    constructor(
        private route: ActivatedRoute,
        private sheetServe: SheetService,
        private batchActionServe: BatchActionsService,
        private memberServe: MemberService,
        private songServe: SongService,
        private nzMessageServe: NzMessageService,
        private store$: Store<AppStoreModule>,
        private cdr: ChangeDetectorRef

    ) {
        this.route.data.pipe(map(res => res.user)).subscribe(([user, userRecord]) => {
            // console.log('【RecordDetailComponent】- consctructor - user - ', user);
            // console.log('【RecordDetailComponent】- consctructor - userRecord - ', userRecord);
            this.user = user;
            this.userRecord = userRecord;
            this.listenCurrentSong();
        })
    }

    ngOnInit() {}

    // 和 center.component.ts 中是一样的
    onPlaySheet(id: number) {
        this.sheetServe.playSheet(id).subscribe((list) => {
            this.batchActionServe.selectPlayList({list, index: 0});
        });
    }

    // 和 center.component.ts中类似
    private listenCurrentSong() {
        this.store$.pipe(select(getPlayer), select(getCurrentSong), takeUntil(this.destroy$))
            .subscribe(song =>{
                // console.log('【CenterComponent】 - listenCurrent - song - ', song);
                this.currentSong = song;

                if(song) {
                    // 如果song存在，要求一下当前播放歌曲在这个列表中的索引
                    // 首先拿到列表
                    const songs = this.userRecord.map(item => item.song);
                    this.currentIndex = findIndex(songs, song);
                }else {
                    this.currentIndex = -1;
                }
                // 因为是OnPush策略
                this.cdr.markForCheck();
            })
    }

    onChangeType(type: RecordType) {
        if(this.recordType !== type) {
            // 两个值不相等的话，就要刷新数据
            this.recordType = type;
            this.memberServe.getUserRecord(this.user.profile.userId.toString(), type).subscribe(res => {
                // console.log('【CenterComponent】 - onChangeType - res -', res)
                this.userRecord = res;
                // 因为是OnPush策略
                this.cdr.markForCheck();
            })
        }
    }

    // 和 center.component.ts中一样
    // 添加一首歌曲
    onAddSong([song, isPlay]) {
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
