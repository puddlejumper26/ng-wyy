import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { select, Store } from "@ngrx/store";

import { PlayMode } from "./player-type";
import { Song } from "./../../../services/data-types/common.types";
import {
    getPlayList,
    getCurrentIndex,
    getSongList,
    getPlayer,
    getPlayMode,
    getCurrentSong,
} from "./../../../store/selectors/player.selector";
import { AppStoreModule } from "./../../../store/index";

@Component({
    selector: "app-wy-player",
    templateUrl: "./wy-player.component.html",
    styleUrls: ["./wy-player.component.less"],
})
export class WyPlayerComponent implements OnInit {
    songList: Song[];
    playList: Song[];
    currentIndex: number;
    currentSong: Song;

    sliderValue = 35; //一开始handle 也就是圆点的位置
    bufferOffset = 70; //一开始 灰色缓冲的位置

    /**
     *        注意这里的绑定的方式， 只有 audioEl才能调动 play() 方法进行播放，
     *          如果把 audio 直接改成 private audio: HTMLAudioElement;
     *          然后在
     *              private play(){
                            this.audio.play();
                    }
                就会得到 WyPlayerComponent.html:63 ERROR TypeError: this.audio.play is not a function
     */
    @ViewChild("audio", { static: true }) private audio: ElementRef;
    private audioEl: HTMLAudioElement; // 原生的 DOM 对象

    constructor(private store$: Store<AppStoreModule>) {
        const appStore$ = this.store$.pipe(select(getPlayer));

        appStore$
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

        /**
         *         // following is not working under @ngrx/store-devtool@8.6.0 only for 8.3.0
         */
        // const stateArr = [
        //     {
        //         type: getSongList,
        //         cb: list => this.watchList(list, 'songList'),      //cd  callback
        //     },
        //     {
        //         type: getPlayList,
        //         cb: list => this.watchList(list, 'playList'),      //cd  callback
        //     },
        //     {
        //         type: getCurrentIndex,
        //         cb: index => this.watchCurrentIndex(index),      //cd  callback
        //     },
        // ];
        // stateArr.forEach(item => {
        //     appStore$.pipe(select(item.type)).subscribe(item.cb);
        // })
    }

    ngOnInit() {
        // console.log(11111, this.audio.nativeElement);
        this.audioEl = this.audio.nativeElement;
    }

    private watchList(list: Song[], type: string) {
        // console.log(11111, list, type);
        this[type] = list;
    }
    private watchCurrentIndex(index: number) {
        // console.log(22222, index);
        this.currentIndex = index;
    }
    private watchPlayMode(mode: PlayMode) {
        // console.log(3333, mode);
        // this.currentIndex = mode;
    }
    private watchCurrentSong(song: Song) {
        // console.log(4444, song);   //一开始是空的 undefined，点击播放之后才会有信息
        this.currentSong = song;
    }

    onCanPlay() {
        this.play();
    }

    private play() {
        this.audioEl.play();
    }

    // 取值器
    get picUrl(): string {
        return this.currentSong ? this.currentSong.al.picUrl : '//s4.music.126.net/style/web2/img/default/default_album.jpg';
    }
}
