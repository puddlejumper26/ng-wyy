import { ActivatedRoute } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { map, takeUntil } from 'rxjs/internal/operators';
import { Observable, Subject } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd';
import { select, Store } from '@ngrx/store';

import { AppStoreModule } from 'src/app/store';
import { BatchActionsService } from 'src/app/store/batch-actions.service';
import { findIndex } from 'src/app/utils/array';
import { getCurrentSong, getPlayer } from './../../store/selectors/player.selector';
import { SetShareInfo } from './../../store/actions/member.actions';
import { SongService } from 'src/app/services/song.service';
import { Singer, Song, SongSheet } from './../../services/data-types/common.types';
import { MemberService } from 'src/app/services/member.service';
import { ModalTypes } from 'src/app/store/reducers/member.reducer';
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
    currentIndex = -1;

    constructor(
        private route: ActivatedRoute,
        private store$: Store<AppStoreModule>,
        private songServe: SongService,
        private batchActionServe: BatchActionsService,
        private nzMessageServe: NzMessageService,
        private memberServe: MemberService,
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

    /***
     *           和 singer-detail 和 song-info 中的方法是一样的,  需要 Refractory
     */


    // 监听当前正在播放的歌曲
    // takeUntil 什么时候停止发射流
    private listenCurrent() {
        this.store$
            .pipe(select(getPlayer), select(getCurrentSong), takeUntil(this.destroy$))
            .subscribe(song =>{
                // console.log('【SheetInfoComponent】 - listenCurrent - song - ', song);
                this.currentSong = song;

                if(song) {
                    this.currentIndex = findIndex(this.sheetInfo.tracks, song);
                }else {
                    this.currentIndex = -1;
                }
            })
    }

    private alertMessage(type: string, msg: string) {
        this.nzMessageServe.create(type, msg)
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
                    this.alertMessage('warning', 'Warning：API has no url for this song，request is denied!');
                }
            })
        }
    }

    // 添加一张专辑
    onAddSongs(songs: Song[], isPlay = false) {
        this.songServe.getSongList(songs).subscribe( list => {
            if(list.length) {
                if(isPlay) {
                    // 这一步和home.component里面 点击专辑播放的icon是的功能是一样的
                    this.batchActionServe.selectPlayList({ list, index: 0 });
                }else {
                    this.batchActionServe.insertSongs(list);
                }
            }
        })
    }

    // 收藏歌曲
    onLikeSong(id: string) {
        // 要把弹窗的类型设置为like，打开visible

        // 这里直接用这个有问题，因为如果用户没有登录的情况下点击歌单里的收藏按钮，应该先出现登录界面
        // this.batchActionServe.controlModal(true, ModalTypes.Like);

        // 再加上现在已经开始需要传入歌曲的id，所以要调用  likeSong
        if(id) {
            this.batchActionServe.likeSong(id);
        }
    }

    // 收藏歌单
    onLikeSheet(id: string) {
        if(id) {
            this.memberServe.likeSheet(id).subscribe(() => {
                this.alertMessage('success', '收藏成功');
            }, error => {
                this.alertMessage('error', error.msg || '收藏失败')
            });
        }
    }

    // 分享
    shareResource(resource: Song | SongSheet, type = 'song') {
        let txt = '';
        if(type === 'playlist') {
            // 说明分享的是一个歌单
            // 注意这里要类型断言一下，不然找不到对应的属性
            txt = this.makeTxt('歌单', resource.name, (<SongSheet>resource).creator.nickname);
        }else {
            txt = this.makeTxt('歌曲', resource.name, (<Song>resource).ar);
        }

        // console.log('【SheetInfoComponent】 - shareResource - txt -', txt);

        // 这样就把这些信息加入到 store 的state 里面去了，之后就可以在 app.component 里进行watch 了
        this.store$.dispatch(SetShareInfo({ info: {id: resource.id.toString(), type, txt}}))
    }

    // 返回的是一个字符串，可以用来直接显示的, makeBy,如果是歌曲，就是歌手名字，如果是歌单，就是歌单创建者
    private makeTxt(type: string, name: string, makeBy: string | Singer[]): string {
        let makeByStr = '';
        if(Array.isArray(makeBy)) {
            makeByStr = makeBy.map(item => item.name).join('/');
        }else {
            makeByStr = makeBy;
        }

        return `${type}:${name} - ${makeByStr}`;
    }

    // 这里发射一个值，在 listenCurrent 里的 takeUntil就能够接受到并且停止
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete(); //结束
    }
}
