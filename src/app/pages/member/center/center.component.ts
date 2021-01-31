import { select, Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/internal/operators';
import { map } from 'rxjs/internal/operators/map';

import { MemberService } from 'src/app/services/member.service';
import { RecordVal, User, UserSheet } from 'src/app/services/data-types/member.type';
import { RecordType } from './../../../services/member.service';
import { SheetService } from 'src/app/services/sheet.service';
import { BatchActionsService } from 'src/app/store/batch-actions.service';
import { SongService } from 'src/app/services/song.service';
import { Song } from 'src/app/services/data-types/common.types';
import { AppStoreModule } from 'src/app/store';
import { getCurrentSong, getPlayer } from 'src/app/store/selectors/player.selector';
import { findIndex } from 'src/app/utils/array';

@Component({
    selector: "app-center",
    templateUrl: "./center.component.html",
    styleUrls: ["./center.component.less"],
})
export class CenterComponent implements OnInit, OnDestroy {

    user: User;
    userRecord: RecordVal[];
    userSheet: UserSheet;
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
    ) {
        // console.log('【CenterComponent】- consctructor');
        // 这里的subscribe可看成解构赋值
        this.route.data.pipe(map(res => res.user)).subscribe(([ user, userRecord, userSheet]) => {
            // console.log('【CenterComponent】- consctructor - user - ', user);
            // console.log('【CenterComponent】- consctructor - userRecord - ', userRecord);
            // console.log('【CenterComponent】- consctructor - userSheet - ', userSheet);
            this.user = user;
            this.userRecord = userRecord.slice(0,10);
            this.userSheet = userSheet;
            this.listenCurrentSong();
        });
    }

    ngOnInit() {}

    // 和 sheet-info.component.ts中类似
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
            })
    }

    // 和 home.component.ts 中是一样的
    onPlaySheet(id: number) {
        this.sheetServe.playSheet(id).subscribe((list) => {
            this.batchActionServe.selectPlayList({list, index: 0});
        });
    }

    onChangeType(type: RecordType) {
        if(this.recordType !== type) {
            // 两个值不相等的话，就要刷新数据
            this.recordType = type;
            this.memberServe.getUserRecord(this.user.profile.userId.toString(), type).subscribe(res => {
                // console.log('【CenterComponent】 - onChangeType - res -', res)
                this.userRecord = res.slice(0,10);
            })
        }
    }

    // 和 sheet-info.component.ts中一样
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
