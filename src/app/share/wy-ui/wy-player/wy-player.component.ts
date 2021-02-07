import { animate, state, style, transition, trigger, AnimationEvent } from "@angular/animations";
import { DOCUMENT } from "@angular/common";
import {
    Component,
    ElementRef,
    Inject,
    OnInit,
    ViewChild,
} from "@angular/core";
import { fromEvent, Subscription, timer } from "rxjs";
import { NzModalService } from "ng-zorro-antd";
import { Router } from "@angular/router";
import { select, Store } from "@ngrx/store";

import { AppStoreModule } from "./../../../store/index";
import {
    getPlayList,
    getCurrentIndex,
    getSongList,
    getPlayer,
    getPlayMode,
    getCurrentSong,
    getCurrentAction,
} from "./../../../store/selectors/player.selector";
import { CurrentActions } from './../../../store/reducers/player.reducer';
import { PlayMode } from "./player-type";
import {
    SetCurrentAction,
    SetCurrentIndex,
    SetPlayList,
    SetPlayMode,
    SetSongList,
} from "./../../../store/actions/player.actions";
import { Singer, Song, SongSheet } from "./../../../services/data-types/common.types";
import { findIndex, shuffle } from "src/app/utils/array";
import { WyPlayerPanelComponent } from './wy-player-panel/wy-player-panel.component';
import { BatchActionsService } from "src/app/store/batch-actions.service";
import { SetShareInfo } from 'src/app/store/actions/member.actions';

const modeTypes: PlayMode[] = [
    { type: "loop", label: "循环" },
    { type: "random", label: "随机" },
    { type: "singleLoop", label: "单曲循环" },
];

// Title label 的提示                                          // -------------------29
enum TipTitles {
    Add = '已添加到列表',
    Play = '已开始播放'
}

@Component({
    selector: "app-wy-player",
    templateUrl: "./wy-player.component.html",
    styleUrls: ["./wy-player.component.less"],
    animations: [                                          // -------------------27
        trigger('showHide', [
            state('show', style({ bottom: 0 })),
            state('hide', style({ bottom: -71 })),
            transition('show=>hide', [animate('0.3s')]),
            transition('hide=>show', [animate('0.1s')]),
            // transition('show<=>hide', [animate('0.3s')])    // 如果时间相同的话，是上面两个的简化版本
        ])
    ]
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
    volumn = 20;
    // whether to show volumn panel
    showVolumnPanel = false;
    // 是否点击的是音量面板的本身
    // selfClick = false;                                       // 因为播放器外部点击的逻辑重写而被删除
    // 是否绑定document click 事件                           // -------------------25
    bindFlag = false;
    // whether to show the list panel
    showPanel = false;

    // 定义一个变量来控制                                 // -------------------27
    showPlayer = 'hide';
    // 定义锁定的变量
    isLocked = false;
    // 定义一个防止动画抖动的变量, 表示是否正在动画
    animating = false;

    // 一个变量，下面两个属性，一个title，空的，一个show控制是否显示       // -------------------29
    controlTooltip = {
        title: '',
        show: false,
    }

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
    @ViewChild("audio", { static: true }) private audio: ElementRef; // -------------- (5)
    private audioEl: HTMLAudioElement; // 原生的 DOM 对象                                // -------------- (5)

    @ViewChild(WyPlayerPanelComponent, { static: false })
    private playerPanel: WyPlayerPanelComponent;

    constructor(
        private nzModalServe: NzModalService,
        private router: Router,
        private store$: Store<AppStoreModule>,
        @Inject(DOCUMENT) private doc: Document,
        private batchActionServe: BatchActionsService
    ) {
        const appStore$ = this.store$.pipe(select(getPlayer)); // -------------- (1)

        appStore$
            .pipe(select(getSongList))
            .subscribe((list) => this.watchList(list, "songList")); // 赋值              // -------------- (1)
        appStore$
            .pipe(select(getPlayList))
            .subscribe((list) => this.watchList(list, "playList")); // 赋值              // -------------- (1)
        appStore$
            .pipe(select(getCurrentIndex))
            .subscribe((index) => this.watchCurrentIndex(index)); // 赋值                    // -------------- (1)
        appStore$
            .pipe(select(getPlayMode))
            .subscribe((mode) => this.watchPlayMode(mode)); // 赋值                      // -------------- (1) (18)
        appStore$
            .pipe(select(getCurrentSong))
            .subscribe((song) => this.watchCurrentSong(song)); // 赋值                     // -------------- (1)
        appStore$
            .pipe(select(getCurrentAction))
            .subscribe((action) => this.watchCurrentAction(action))                        // -------------------28
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
        // console.log('wy-player.component - ngOnInit - this.audio.nativeElement', this.audio.nativeElement);
        this.audioEl = this.audio.nativeElement; // -------------- (5)
    }

    private watchList(list: Song[], type: string) {                                     // -------------- (2)
        // console.log('wy-player.component - watchList - list / type', list, type);
        // 把获得的数据保存到songList或者playList中
        this[type] = list;
    }
    private watchCurrentIndex(index: number) {                                     // -------------- (2)
        // console.log('wy-player.component - watchCurrentIndex - index', index);
        // 把获得的数据保存到currentIndex中
        this.currentIndex = index;
    }

    /**
     *     通过这个组件里的
     * <audio   [src]="currentSong?.url" (canplay)="onCanPlay()">
     *     并通过 canplay 就可以播放歌曲了
     */
    private watchCurrentSong(song: Song) {                                        // -------------- (2)
        // console.log('wy-player.component - watchCurrentSong - song', song);   //一开始是空的 undefined，点击播放之后才会有信息
        // 先判断 song 是否存在， 不然直接写 运行时 会出现 song不存在的情况，然后报错
        if (song) {                                                              // -------------- (7)
            this.currentSong = song;
            this.duration = song.dt / 1000; //dt 就是播放的时长，毫秒/1000 换算成秒，可以通过 log song 来看
        }
    }

    // [src]="currentSong?.url" 中存在的话，就可以开始播放这个地址的歌曲
    onCanPlay() {                                                            // -------------- (3)
        this.songReady = true; // means now song could be played
        this.play(); // then play                                            // -------------- (4)
    }

    private play() {                                                     // -------------- (4)
        this.audioEl.play(); // -------------- (5)
        this.playing = true; // means now is playing, is a status
    }

    // 取值器 获得图片的信息
    get picUrl(): string {                                             // -------------- (7)
        return this.currentSong //因为在watchCurrentSong中已经赋值给currentSong了
            ? this.currentSong.al.picUrl
            : "//s4.music.126.net/style/web2/img/default/default_album.jpg";
    }

    // audio标签里的 timeupdate 对 播放时间的实时监听
    // 实现 滑块跟着时间吻合移动, 缓冲条也同样
    /**
     *  这里计算的
     *    percent - 这一首歌曲播放时候 滑块和红色的 应该在的位置的比例
     *    buffered - 缓冲的时间长度
     *    bufferPercent - 缓冲结束 ， 缓冲条应该在的位置的比例
     *
     *    这些数据就更新了 模板 里<app-wy-slider>里的数值，继而改变了DOM
     */
    onTimeUpdate(e: Event) {                                                  // -------------- (8)
        // console.log('wy-player.component - onTimeUpdate', (<HTMLAudioElement>e.target).currentTime); //这地方需要进行断言，不然 currentTime属性不存在
        this.currentTime = (<HTMLAudioElement>e.target).currentTime; // 这里取到的时间是 秒 ，注意和总时长 毫秒之间的统一
        // 这里的比例非常重要，也要用在滑块等的移动上
        this.percent = (this.currentTime / this.duration) * 100; //move the slider according to the play time

        const buffered = this.audioEl.buffered; //buffered 返回一个 timeRanges Gets a collection of buffered time ranges.
        // buffered.end(0); // 缓冲区域结束的位置，也是一个时间

        if (buffered.length && this.bufferPercent < 100) {
            this.bufferPercent = (buffered.end(0) / this.duration) * 100;
        }
    }

    // Play or Pause music
    onToggle() {                                                                       // -------------- (9)
        // home.component.ts中set list，但是并不是现在就播放 ,
        // 因为在UI中点击了专辑的播放按钮之后，就触发了 home.component.ts中的onPlaySheet方法
        // 也就同时 set 出了 songList， playList 和 currentIndex
        // 但是现实情况下可能出现 setList 但是不播放，也就是currentSong 不存在的情况
        if (!this.currentSong) {
            if (this.playList.length) {
                // 并且播放列表不为空
                // this.store$.dispatch(SetCurrentIndex({ currentIndex: 0 })); //播放第一首歌
                // this.songReady = false;
                this.updateIndex(0); //播放第一首歌                                       // -------------- (10)
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

    private updateIndex(index: number) {                            // -------------- (10)
        // 更新索引
        this.store$.dispatch(SetCurrentIndex({ currentIndex: index })); //播放第index首歌
        // 这里如果使用的话，那么切换到 新的歌曲之后，要等缓冲结束，才能再切换下一首
        // 这里隐藏掉就可以飞速切换上下一首歌
        // this.songReady = false;
    }

    // play next song
    onNext(index: number) {                                      // -------------- (11)
        if (!this.songReady) return; //其实这里判断是如果不存在的话，就不用切换了
        if (
            this.playList.length === 1 ||
            this.currentMode.type === "singleLoop"
        ) {
            this.loop(); // -------------- (11.5)
        } else {
            // 如果大于播放列表，就播放第一首歌曲
            const newIndex = index >= this.playList.length ? 0 : index;
            this.updateIndex(newIndex); //播放第newIndex首歌
        }
    }

    // play previous song
    onPrev(index: number) {                                      // -------------- (11)
        if (!this.songReady) return;
        if (
            this.playList.length === 1 ||
            this.currentMode.type === "singleLoop"
        ) {
            this.loop(); // -------------- (11.5)
        } else {
            // 如果小于等于0，就播放播放列表中的最后一首
            const newIndex = index <= 0 ? this.playList.length - 1 : index;
            this.updateIndex(newIndex); //播放第newIndex首歌
        }
    }

    // loop the song
    private loop() {                                  // -------------- (11.5)
        this.audioEl.currentTime = 0;
        this.play();
        if (this.playerPanel) {                                        // -------------- (24)
            // 歌词重置， 从头开始
            this.playerPanel.seekLyric(0);
        }
    }

    // 设置歌曲的进度,但拖动滑块的时候,歌曲的进度随之改变，
    // 这里的per 是从 slider 组件中在拖动结束的时候发射出来的数字，也就是相对于原点的位置
    // 从而根据现在这首歌的总时间dt计算出来滑块缓冲条应该在的位置
    onPercentChange(per: number) {                                                // -------------- (12)
        // console.log('wy-player.component - onPercentChange - per -- ', per);
        // this.audioEl.currentTime = this.duration * (per / 100);
        if (this.currentSong) {
            // 没有这里的判断，就会出现一拖动滑块，console里面会报错，因为currentTime 没有
            const currentTime = this.duration * (per / 100);
            this.audioEl.currentTime = currentTime;
            if (this.playerPanel) {                                                // -------------- (24)
                // 这里乘以 1000 是因为需要传入一个 时间戳， 也就是毫秒数
                this.playerPanel.seekLyric(currentTime * 1000);
            }
        }
    }

    /**
     *                                      音量调节，以及音量面板隐藏
     */

    // 实时改变音量的大小
    onVolumnChange(per: number) {                                               // -------------- (13)
        // console.log('wy-player.component - onVolumnChange - per--', per);

        this.audioEl.volume = per / 100;
    }

    // 点击播放器外部，隐藏音量控制， 点击播放器，不隐藏
    toggleVolPanel() {                                                        // -------------- (14)
        // evt.stopPropagation(); // stop bubbling
        this.togglePanel("showVolumnPanel");
    }

    togglePanel(type: string) {                                                     // -------------- (15)
        this[type] = !this[type];
        // this.showVolumnPanel = !this.showVolumnPanel; // click the 音量按钮 - 显示、隐藏
        if (this.showVolumnPanel || this.showPanel) {
            // this.bindDocumentClickListener(); // -------------- (16) //因为播放器外部点击的逻辑重写
            this.bindFlag = true;
        } else {
            // this.unbindDocumentClickListener(); // -------------- (17) //因为播放器外部点击的逻辑重写
            this.bindFlag = false;
        }

        // 上面的if逻辑可以直接简写成
        // this.bindFlag = (this.showPanel || this.showVolumnPanel);

    }

    /**
     *   <div class="m-player" (click)="selfClick = true">
     *
     *    在模板中,在player也就是播放器面板最外层绑定了 (click)="selfClick = true", 那么结合下面的code
     *    如果点击了播放器面板以外的地方, selfClick就会变为false
     */
    //如果音量面板存在, 就绑定一个全局的click事件，在事件内部，判断selfClick是否存在
    private bindDocumentClickListener() {                   //因为播放器外部点击的逻辑重写 （->25）       // -------------- (16)
        // if (!this.winClick) {
            //赋值，在document 上绑定一个 click事件
            // this.winClick = fromEvent(this.doc, "click").subscribe(() => {
            //     if (!this.selfClick) {
            //         //!this.selfClick说明点击了播放器以外的部分
            //         this.showVolumnPanel = false; // 隐藏面板
            //         this.showPanel = false;
            //         this.unbindDocumentClickListener(); //解绑                              // -------------- (17)
            //     }
            //     this.selfClick = false;
            // });
        // }
    }

    //否则就解绑这个事件， 主要是为了提升性能，可能在实际中没有变化
    private unbindDocumentClickListener() {
        // -------------- (17)
        if (this.winClick) {
            this.winClick.unsubscribe();
            this.winClick = null;
        }
    }

    /**
     *                                               播放模式
     */

    // 改变播放状态,单曲循环,循环还是随机 这里发射出去之后， 就会被这里constructor中的
    // appStore$
    //         .pipe(select(getPlayMode))
    //         .subscribe((mode) => this.watchPlayMode(mode));
    // 接受， 继而触发下面的watchPlayMode方法
    changeMode() {                                                      // -------------- (18)
        // console.log('wy-player.component - changeMode - ++this.modeCount % 3', this.modeCount);
        // 这里 使用 ++ 相当于是把 this.modeCount 自身增加1 之后在 %3，每次模板被点击一次，这里的modeCount都自增1
        const temp = modeTypes[++this.modeCount % 3];
        // console.log('wy-player.component - changeMode - temp', temp);
        // 这里set之后，在这里的watchPlayMode中就能监听的到, 然后其中的 the.currentMode = mode, 就会跟着改变
        // 之后 html中的[ngClass]="currentMode.type" [title]="currentMode.label" 就会跟着改变
        this.store$.dispatch(SetPlayMode({ playMode: temp }));
    }

    // 在changeMode()被触发之后 触发
    private watchPlayMode(mode: PlayMode) {                           // -------------- (19)
        // console.log('wy-player.component - watchPlayMode - mode', mode);
        this.currentMode = mode;
        if (this.songList) {
            // slice()是浅复制，所以相当于是songList数组的一个副本，但是地址不同，值得改变不会影响songList数组本身
            let list = this.songList.slice(); //建立一个副本
            // 这里要考虑随机的播放具体的实施
            if (mode.type === "random") {
                list = shuffle(this.songList);
                // console.log('wy-player.component - watchPlayMode - list', list); //点击播放，然后点击转换就能够看出来了
            }
            // 传入最新的 list 和 当前播放的歌曲
            this.updateCurrentIndex(list, this.currentSong); // -------------- (20)
            // 更新
            // 这里dispatch 改变后的list，注意这时候正在播放的歌曲不能改变，所以要在前面添加 updateCurrentIndex
            // 发射新的歌曲列表
            this.store$.dispatch(SetPlayList({ playList: list }));
        }
    }

    // 当顺序打乱之后，要拿到当前播放的歌曲，在新的数组里面的索引
    private updateCurrentIndex(list: Song[], currentSong: Song) {
        // -------------- (20)
        const newIndex = findIndex(list, currentSong);
        // 发射出去新的索引
        this.store$.dispatch(SetCurrentIndex({ currentIndex: newIndex }));
    }

    // When the song plays to the end, what next
    onEnded() {                                               // -------------- (21)
        this.playing = false;
        if (this.currentMode.type === "singleLoop") {
            this.loop();
        } else {
            this.onNext(this.currentIndex + 1);
        }
    }

    // 模板上的按钮触发这个方法，显示或者隐藏歌词面板
    // 控制歌词面板是否显示
    // 这里的改变了showPanel的值，从而触发了 <app-wy-player-panel [show]="showPanel">
    // 中的值，并继续传递给 wy-playerpanel中的 @Input show
    // 从而最终来使得面板 隐藏或者显示

    toggleListPanel() {                                             // -------------- (22)
        if (this.songList.length) {
            // evt.stopPropagation(); // stop bubbling
            this.togglePanel("showPanel");
            // this.toggleListDisplayPanel()
        }
    }

    toggleListDisplayPanel() {
        // -------------- (22)
        this.showPanel = !this.showPanel;
        if (this.showPanel) {
            this.bindDocumentClickListener();
        } else {
            this.unbindDocumentClickListener();
        }
    }

    // 在播放列表里通过点击来改变播放的歌曲
    onChangeSong(song: Song) {
        // -------------------(23)
        this.updateCurrentIndex(this.playList, song);
    }

    // 在播放列表里删除播放的歌曲 //  ----- 移动到 batch-actions.service.ts
    onDeleteSong(song: Song) {
        // -------------------(24)
        //     const songList = this.songList.slice(); //  ----- 移动到 batch-actions.service.ts
        //     const playList = this.playList.slice(); //  ----- 移动到 batch-actions.service.ts
        //     let currentIndex = this.currentIndex; //前面watchCurrentIndex已经赋过值了

        //     // 找到传入的歌在songList和playList中的索引，然后删除掉
        //     const sIndex = findIndex(songList, song);   //  ----- 移动到 batch-actions.service.ts
        //     // console.log('wy-player.component - onDeleteSong - sIndex', sIndex);
        //     // 从songList中删除这首歌
        //     songList.splice(sIndex, 1); //  ----- 移动到 batch-actions.service.ts
        //     const pIndex = findIndex(playList, song); //  ----- 移动到 batch-actions.service.ts
        //     // console.log('wy-player.component - onDeleteSong - pIndex', pIndex);
        //     playList.splice(pIndex, 1); //  ----- 移动到 batch-actions.service.ts

        //     // 如果 现在播放的歌曲的索引大于要删除歌曲的索引|| 现在播放的歌曲是最后一首歌
        //     if(currentIndex > pIndex || currentIndex === playList.length) { //  ----- 移动到 batch-actions.service.ts
        //         currentIndex--; //上述两种情况都需要减一 //  ----- 移动到 batch-actions.service.ts
        //         console.log('wy-player.component - onDeleteSong - currentIndex', currentIndex); //  ----- 移动到 batch-actions.service.ts
        //     }

        //     // 发送值给store
        //     this.store$.dispatch(SetSongList({ songList: songList })); //  ----- 移动到 batch-actions.service.ts
        //     this.store$.dispatch(SetPlayList({ playList: playList })); //  ----- 移动到 batch-actions.service.ts
        //     this.store$.dispatch(SetCurrentIndex({ currentIndex: currentIndex })); //  ----- 移动到 batch-actions.service.ts

        this.batchActionServe.deleteSong(song);
    }

    // 清空歌曲
    onClearSong() {                                                     // -------------------(24)
        // 这里设置一个提示，防止误操作，通过 ng-ant里的NzModalService组件
        this.nzModalServe.confirm({
            nzTitle: "Confirm",
            nzOnOk: () => {
                // 发送值给store
                // this.store$.dispatch(SetSongList({ songList: [] }));  //  ----- 移动到 batch-actions.service.ts
                // this.store$.dispatch(SetPlayList({ playList: [] }));  //  ----- 移动到 batch-actions.service.ts
                // this.store$.dispatch(SetCurrentIndex({ currentIndex: -1 }));  //  ----- 移动到 batch-actions.service.ts
                this.batchActionServe.clearSong();
            },
        });
    }

    // 点击到播放器外部，那么这个方法就会触发一次
    onClickOutSide(target: HTMLElement) {                                                 // -------------------(25)
        // console.log('wy-player.component.ts - onClickOutside');

        // 使用这个if 用来解除 点击删除按钮，播放面板不见的问题
        // 这里的 haha 和 wy-player-panel.component.html中的 data-haha="delete" 保持一致就好
        // 自定义的数据属性名称是以 data- 开头的。 详细解释看最后的例子
        if(target.dataset.haha !== 'delete'){
            this.showVolumnPanel = false;
            this.showPanel = false;
            //这里也需要解绑一下
            this.bindFlag = false;
        }
    }

    // 点击跳转到相关的专辑详情页面
    // 接受一个元组类型的参数
    toInfo(path: [string, number]) {                                                    // -------------------(26)
        // console.log('【WyPlayerComponent】 - toInfo - path - ', path);
        if(path[1]) {
            this.showPanel = false;
            this.showVolumnPanel = false;
            this.router.navigate(path);
        }
    }

    togglePlayer(type: string) {                                                  // -------------------27
        if(!this.isLocked && !this.animating) {
            this.showPlayer = type;
        }
    }

    private watchCurrentAction(action: CurrentActions) {                         // -------------------28
        // console.log('【WyPlayerComponent】 - watchCurrentAction - action - ', CurrentActions[action]);

        // 通过和上面的enum的数据的转换，这样需要显示的内容就是我们需要的中文了       // -------------------29
        const title = TipTitles[CurrentActions[action]];
        if(title) {
            this.controlTooltip.title = title;

            if(this.showPlayer === 'hide') {
                this.togglePlayer('show');
            }else {
                this.showTooltip();
            }
        }

        // 一旦发生变化，这里需要重新赋值，不然如果连续添加的话，因为状态是一致的，那么就会只有第一个添加会执行
        this.store$.dispatch(SetCurrentAction({ currentAction: CurrentActions.Other }));
    }

    private showTooltip() {                                                        // -------------------29
        this.controlTooltip.show = true;

        // 设定一个重置的 timer 1.5秒后生效，就会消失。不然后面的点击添加之类的都无法显示
        timer(1500).subscribe(() => {
            this.controlTooltip = {
                title: '',
                show: false
            }
        })

    }

    onAnimateDone(event: AnimationEvent) {                                                          // -------------------29
        this.animating = false;
        if(event.toState === 'show' && this.controlTooltip.title) {
            //说明动画是从hide 到 show的过程
            // 这样就和watchCurrentAction中的逻辑合并了
            this.showTooltip();
        }
    }

     // 收藏歌曲
     onLikeSong(id: string) {
        if(id) {
            this.batchActionServe.likeSong(id);
        }
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

}



/**
 *           dataset &&  data-
 *
 *     https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/dataset
 *
<div id="user" data-id="1234567890" data-user="johndoe" data-date-of-birth>John Doe</div>

var el = document.querySelector('#user');

// el.id == 'user'
// el.dataset.id === '1234567890'
// el.dataset.user === 'johndoe'
// el.dataset.dateOfBirth === ''
 */
