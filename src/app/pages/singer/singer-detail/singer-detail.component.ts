import { ActivatedRoute } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { map, takeUntil } from 'rxjs/internal/operators';
import { NzMessageService } from 'ng-zorro-antd/message';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs/internal/Subject';

import { AppStoreModule } from 'src/app/store';
import { BatchActionsService } from 'src/app/store/batch-actions.service';
import { Singer, Song } from 'src/app/services/data-types/common.types';
import { SongService } from 'src/app/services/song.service';
import { getCurrentSong, getPlayer } from 'src/app/store/selectors/player.selector';
import { findIndex } from 'src/app/utils/array';
import { SetShareInfo } from 'src/app/store/actions/member.actions';
import { MemberService } from 'src/app/services/member.service';

@Component({
    selector: "app-singer-detail",
    templateUrl: "./singer-detail.component.html",
    styleUrls: ["./singer-detail.component.less"],
})
export class SingerDetailComponent implements OnInit, OnDestroy {

    // singerDetail: SingerDetail;
    singer: Singer;
    hotSongs: Song[];
    simiSingers: Singer[];

    // 用来发射流，如果发射一个流，就停止监听
    private destroy$ = new Subject<void>();
    // 保存正在播放的歌曲
    currentSong: Song;
    currentIndex = -1;

    hasLiked = false;

    constructor(
        private route: ActivatedRoute,
        private store$: Store<AppStoreModule>,
        private songServe: SongService,
        private batchActionServe: BatchActionsService,
        private nzMessageServe: NzMessageService,
        private memberServe: MemberService,
        ) {
            this.route.data
              .pipe(map(res => res.singerDetail))
              .subscribe(([detail, simiSingers]) => {
                //   这么写不起作用，所以只能用下面的写法
                //   this.singerDetail = detail;
                  this.singer = detail.artist;
                  this.hotSongs = detail.hotSongs;
                  this.simiSingers = simiSingers;
                  console.log('【SingerDetailComponent】- constructor - simiSingers - ', simiSingers);
                  this.listenCurrent();
              })
        }

    ngOnInit() {}

    /***
     *           和 sheet-info 和 song-info 中的方法是一样的,  需要 Refractory
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
                    this.currentIndex = findIndex(this.hotSongs, song);
                }else {
                    this.currentIndex = -1;
                }
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
                    this.alertMessage('warning', 'Warning：API has no url for this song，request is denied!');
                }
            })
        }
    }

    // 添加一张专辑
    onAddSongs(songs: Song[], isPlay = false) {
        // console.log('【SingerDetailComponent】- onAddSongs');
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
        if(id) {
            this.batchActionServe.likeSong(id);
        }
    }

     // 批量收藏歌曲
    onLikeSongs(songs: Song[]) {
        const ids = songs.map(item => item.id).join(',');
        this.onLikeSong(ids);
    }

    // 收藏歌手
    onLikeSinger(id: string) {
        let typeInfo = {
            type: 1,
            msg: '收藏', //后面弹提示用的， 收藏成功还是取消
        };
        if(this.hasLiked) {
            typeInfo = {
                type: 2, // 这里只要不是1都可以， https://github.com/puddlejumper26/ng-wyy/issues/23#issuecomment-775183223
                msg: '取消收藏',
            }
        }

        this.memberServe.likeSinger(id, typeInfo.type).subscribe(() => {
            this.hasLiked = !this.hasLiked;
            this.alertMessage('success', typeInfo.msg + '成功');
        }, error => {
            this.alertMessage('error', error.msg || typeInfo.msg + '失败');
        })
    }

     // 分享 这里只是分享歌曲
     onShareSong(resource: Song, type = 'song') {
        const txt = this.makeTxt('歌曲', resource.name, resource.ar);
        this.store$.dispatch(SetShareInfo({ info: {id: resource.id.toString(), type, txt}}))
    }

    // 返回的是一个字符串，可以用来直接显示的, makeBy一定传入的是一个数组
    private makeTxt(type: string, name: string, makeBy: Singer[]): string {
        const makeByStr = makeBy.map(item => item.name).join('/');;

        return `${type}:${name} - ${makeByStr}`;
    }

    private alertMessage(type: string, msg: string) {
        this.nzMessageServe.create(type, msg)
    }

    // 这里发射一个值，在 listenCurrent 里的 takeUntil就能够接受到并且停止
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete(); //结束
    }

}
