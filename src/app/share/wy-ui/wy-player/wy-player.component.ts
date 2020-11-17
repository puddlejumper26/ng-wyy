import { DOCUMENT } from "@angular/common";
import {
    Component,
    ElementRef,
    Inject,
    OnInit,
    ViewChild,
} from "@angular/core";
import { select, Store } from "@ngrx/store";
import { fromEvent, Subscription } from "rxjs";

import { AppStoreModule } from "./../../../store/index";
import {
    getPlayList,
    getCurrentIndex,
    getSongList,
    getPlayer,
    getPlayMode,
    getCurrentSong,
} from "./../../../store/selectors/player.selector";
import { PlayMode } from "./player-type";
import {
    SetCurrentIndex,
    SetPlayList,
    SetPlayMode,
} from "./../../../store/actions/player.actions";
import { Song } from "./../../../services/data-types/common.types";
import { findIndex, shuffle } from "src/app/utils/array";

const modeTypes: PlayMode[] = [
    { type: "loop", label: "循环" },
    { type: "random", label: "随机" },
    { type: "singleLoop", label: "单曲循环" },
];

@Component({
    selector: "app-wy-player",
    templateUrl: "./wy-player.component.html",
    styleUrls: ["./wy-player.component.less"],
})
export class WyPlayerComponent implements OnInit {
    percent = 0; //一开始handle 也就是圆点的位置 就是滑块一开始的位置
    bufferPercent = 0; //一开始 灰色缓冲的位置

    songList: Song[];
    playList: Song[];
    currentIndex: number;
    currentSong: Song;

    //歌曲播放总时长
    duration: number;
    //歌曲当下播放的时间
    currentTime: number;

    // 播放状态，是否在播放，默认没有  , 注意 在 reducer中还有一个 playing， 不要混淆
    playing = false;
    // 是否可以播放，默认不可以
    songReady = false;
    // volumn
    volumn = 10;
    // whether to show volumn panel
    showVolumnPanel = false;
    // 是否点击的是音量面板的本身
    selfClick = false;
    // whether to show the list panel
    showPanel = false;

    // 绑定 Window 的 click 事件的
    private winClick: Subscription;

    // 当前播放模式
    currentMode: PlayMode; //当其发生变化时， watchPlayMode
    // 点击模式图标的次数，默认一次都没点
    modeCount = 0;

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

    constructor(
        private store$: Store<AppStoreModule>,
        @Inject(DOCUMENT) private doc: Document
    ) {
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
        this.currentMode = mode;
        if (this.songList) {
            // slice()是浅复制，所以相当于是songList数组的一个副本，但是地址不同，值得改变不会影响songList数组本身
            let list = this.songList.slice(); //建立一个副本
            if (mode.type === "random") {
                list = shuffle(this.songList);
                // console.log(1111, list); //点击播放，然后点击转换就能够看出来了

                // 传入最新的 list 和 当前播放的歌曲
                this.updateCurrentIndex(list, this.currentSong);
                // 这里dispatch 改变后的list，注意这时候正在播放的歌曲不能改变，所以要在前面添加 updateCurrentIndex
                this.store$.dispatch(SetPlayList({ playList: list }));
            }
        }
    }

    private watchCurrentSong(song: Song) {
        // console.log(4444, song);   //一开始是空的 undefined，点击播放之后才会有信息
        // 先判断 song 是否存在， 不然直接写 运行时 会出现 song不存在的情况，然后报错
        if (song) {
            this.currentSong = song;
            this.duration = song.dt / 1000; //dt 就是播放的时长，毫秒/1000 换算成秒，可以通过 log song 来看
        }
    }

    // 当顺序打乱之后，要拿到当前播放的歌曲，在新的数组里面的索引
    private updateCurrentIndex(list: Song[], currentSong: Song) {
        const newIndex = findIndex(list,currentSong);
        this.store$.dispatch(SetCurrentIndex({ currentIndex: newIndex }));
    }

    // 改变状态
    changeMode() {
        const temp = modeTypes[++this.modeCount % 3];
        // console.log(1111, temp);
        // 这里set之后，在这里的watchPlayMode中就能监听的到, 然后其中的 the.currentMode = mode, 就会跟着改变
        // 之后 html中的[ngClass]="currentMode.type" [title]="currentMode.label" 就会跟着改变
        this.store$.dispatch(SetPlayMode({ playMode: temp }));
    }

    onPercentChange(per: number) {
        // console.log(1111, per);
        // this.audioEl.currentTime = this.duration * (per / 100);
        if (this.currentSong) {
            // 没有这里的判断，就会出现一拖动滑块，console里面会报错，因为currentTime 没有
            const currentTime = this.duration * (per / 100);
            this.audioEl.currentTime = currentTime;
        }
    }

    // 实时改变音量的大小
    onVolumnChange(per: number) {
        this.audioEl.volume = per / 100;
    }

    // 点击播放器外部，隐藏音量控制， 点击播放器，不隐藏
    toggleVolPanel() {
        // evt.stopPropagation(); // stop bubbling
        this.togglePanel("showVolumnPanel");
    }

    // 控制歌词面板是否显示
    toggleListPanel() {
        if (this.songList.length) {
            // evt.stopPropagation(); // stop bubbling
            this.togglePanel("showPanel");
            // this.toggleListDisplayPanel()
        }
    }

    togglePanel(type: string) {
        this[type] = !this[type];
        // this.showVolumnPanel = !this.showVolumnPanel; // click the 音量按钮 - 显示、隐藏
        if (this.showVolumnPanel || this.showPanel) {
            this.bindDocumentClickListener();
        } else {
            this.unbindDocumentClickListener();
        }
    }

    toggleListDisplayPanel() {
        this.showPanel = !this.showPanel
        if (this.showPanel) {
            this.bindDocumentClickListener();
        } else {
            this.unbindDocumentClickListener();
        }
    }

    //如果音量面板存在, 就绑定一个全局的click事件，在事件内部，判断selfClick是否存在
    private bindDocumentClickListener() {
        if (!this.winClick) {
            //赋值，在document 上绑定一个 click事件
            this.winClick = fromEvent(this.doc, "click").subscribe(() => {
                if (!this.selfClick) {
                    //说明点击了播放器以外的部分
                    this.showVolumnPanel = false;
                    this.showPanel = false;
                    this.unbindDocumentClickListener();
                }
                this.selfClick = false;
            });
        }
    }

    //否则就解绑这个事件
    private unbindDocumentClickListener() {
        if (this.winClick) {
            this.winClick.unsubscribe();
            this.winClick = null;
        }
    }

    onCanPlay() {
        this.songReady = true; // means now song could be played
        this.play(); // then play
    }

    // 在播放列表里通过点击来改变播放的歌曲
    onChangeSong(song: Song){
        this.updateCurrentIndex(this.playList, song);
    }

    // Play or Pause music
    onToggle() {
        // home.component.ts中set list，但是并不是现在就播放 ,
        if (!this.currentSong) {
            if (this.playList.length) {
                // 并且播放列表不为空
                // this.store$.dispatch(SetCurrentIndex({ currentIndex: 0 })); //播放第一首歌
                // this.songReady = false;
                this.updateIndex(0); //播放第一首歌
            }
        } else {
            // home.component.ts中set list 并且播放
            if (this.songReady) {
                this.playing = !this.playing;
                if (this.playing) {
                    this.audioEl.play();
                } else {
                    this.audioEl.pause();
                }
            }
        }
    }

    // play previous song
    onPrev(index: number) {
        if (!this.songReady) return;
        if (this.playList.length === 1) {
            this.loop();
        } else {
            // 如果小于等于0，就播放播放列表中的最后一首
            const newIndex = index <= 0 ? this.playList.length - 1 : index;
            this.updateIndex(newIndex);
        }
    }

    // play next song
    onNext(index: number) {
        if (!this.songReady) return;
        if (this.playList.length === 1) {
            this.loop();
        } else {
            // 如果大于播放列表，就播放第一首歌曲
            const newIndex = index >= this.playList.length ? 0 : index;
            this.updateIndex(newIndex);
        }
    }

    // When the song plays to the end, what next
    onEnded() {
        this.playing = false;
        if (this.currentMode.type === "singleLoop") {
            this.loop();
        } else {
            this.onNext(this.currentIndex + 1);
        }
    }

    // loop the song
    private loop() {
        this.audioEl.currentTime = 0;
        this.play();
    }

    private updateIndex(index: number) {
        // 更新索引
        this.store$.dispatch(SetCurrentIndex({ currentIndex: index })); //播放第index首歌
        this.songReady = false;
    }

    private play() {
        this.audioEl.play();
        this.playing = true; // means now is playing, is a status
    }

    // 取值器
    get picUrl(): string {
        return this.currentSong
            ? this.currentSong.al.picUrl
            : "//s4.music.126.net/style/web2/img/default/default_album.jpg";
    }

    onTimeUpdate(e: Event) {
        // console.log(11111, (<HTMLAudioElement>e.target).currentTime); //这地方需要进行断言，不然 currentTime属性不存在
        this.currentTime = (<HTMLAudioElement>e.target).currentTime; // 这里取到的时间是 秒 ，注意和总时长 毫秒之间的统一
        this.percent = (this.currentTime / this.duration) * 100; //move the slider according to the play time

        const buffered = this.audioEl.buffered; //buffered 返回一个 timeRanges Gets a collection of buffered time ranges.
        // buffered.end(0); // 缓冲区域结束的位置，也是一个时间

        if (buffered.length && this.bufferPercent < 100) {
            this.bufferPercent = (buffered.end(0) / this.duration) * 100;
        }
    }
}
