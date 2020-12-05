import { SongSheet } from './../../../../services/data-types/common.types';
import {
    Component,
    ElementRef,
    EventEmitter,
    Inject,
    Input,
    OnChanges,
    OnInit,
    Output,
    QueryList,
    SimpleChanges,
    ViewChildren,
} from "@angular/core";

import { WyScrollComponent } from "./../wy-scroll/wy-scroll.component";
import { Song } from "src/app/services/data-types/common.types";
import { findIndex } from 'src/app/utils/array';
import { timer } from 'rxjs';
import { WINDOW } from 'src/app/services/services.module';
import { SongService } from 'src/app/services/song.service';
import { BaseLyricLine, WyLyric } from './wy-lyric';

@Component({
    selector: "app-wy-player-panel",
    templateUrl: "./wy-player-panel.component.html",
    styleUrls: ["./wy-player-panel.component.less"],
})
export class WyPlayerPanelComponent implements OnInit, OnChanges {
    // 需要监听这两个值得变化， 从 wy-player.component 中
    @Input() songList: Song[];
    @Input() currentSong: Song;
    @Input() show: boolean; //通过父级的组件来进行控制的
    @Input() playing: boolean;

    /**
     * 因为这里从 wy-player.component.html中传入的值，<app-wy-player-panel>
     * 同时涉及到了 songList和playList，
     *  在 wy-player component中 都是喝 playList相关，
     * 但是在现在 的
     * 所以现在出现的问题是 切换到随机播放模式，连续点击下一首之后，打开 播放面板，上面显示的歌曲不是 滑块上面显示的歌曲
     */

    // 这里的关闭的事件要发送给父级 (onClose)="showPanel=false"，这样点击close之后就会关闭面板
    @Output() onClose = new EventEmitter<void>();                              // -------------------(1)
    @Output() onChangeSong = new EventEmitter<Song>();                             // -------------------(2)

    //因为播放列表和歌词部分都需要用到，所以这里用 ViewChildren
    // @ViewChildren(WyScrollComponent) private wyScroll: QueryList<WyScrollComponent>;
    @ViewChildren(WyScrollComponent) private wyScroll: QueryList<WyScrollComponent>;

    // 应该到 if(changes['currentSong'])中变化时，求出在songList中的一个索引
    // 中间的媒介就是现在正在播放的歌曲， currentSong
    currentIndex: number;                                                     // -------------------(6)
    // @Input() currentIndex: number;

    currentLyric: BaseLyricLine[]; //是一个数组
    currentLineNum: number; // 用来控制歌词的高亮, 和模板中的样式[class.current]进行绑定
    scrollY = 0;

    private lyric: WyLyric;
    /**
     * NodeList 不是一个数组，是一个类似数组的对象(Like Array Object)。
     * 虽然 NodeList 不是一个数组，但是可以使用 forEach() 来迭代。
     * 你还可以使用 Array.from() 将其转换为数组。
     *
     *  如果文档中的节点树发生变化，NodeList 也会随之变化。 https://developer.mozilla.org/zh-CN/docs/Web/API/NodeList
     *  在其他情况下，NodeList 是一个静态集合，也就意味着随后对文档对象模型的任何改动都不会影响集合的内容。
     *    document.querySelectorAll 就会返回一个静态 NodeList。
     */
    private lyricRefs: NodeList;

    // 这时候再使用 win 就可以 不用 timer ， 而是 this.win.setTimeout
    constructor(
        @Inject(WINDOW) private win: Window,
        private songServe: SongService
        ) {}

    ngOnInit() {}

    //监听变化
    ngOnChanges(changes: SimpleChanges): void {
        // 这里是以防万一，以免 updateLyric方法是比 playing状态改变要快的话
        if(changes.playing){                                               //---------------------- (10)
            // if(!changes.playing.firstChange && this.playing){   //如果不是第一次改变
            //     this.lyric.play();
            // }
            if(!changes.playing.isFirstChange()){   //如果不是第一次改变
                this.lyric && this.lyric.togglePlay(this.playing);
            }
        }


        if (changes.songList) {                                               // -------------------(2)
            // console.log('【wy-player-panel】 - ngOnChanges - songList', this.songList);
            // 这里是 切换歌单，比如点击另外一个专辑的播放按钮
            this.currentIndex = 0; //默认从第一首开始播放
        }

        if (changes.currentSong) {                                             // -------------------(4)
            // console.log('【wy-player-panel】 - ngOnChanges - currentSong', this.currentSong);
            if (this.currentSong) {
                this.currentIndex = findIndex(this.songList, this.currentSong);    // -------------------(6)

                //同时 这个时候要请求歌词
                this.updateLyrics();

                if (this.show) {
                    this.scrollToCurrent();                                     // -------------------(5)
                }
            }else {
                this.resetLyric();
            }
        }

        if (changes["show"]) {                                                 // -------------------(3)
            //如果不是第一次变化,因为页面一进来就有了第一次变化，这里就需要屏蔽掉, 这时候就刷新 BScroll 组件
            // if(!changes.show.firstChange && this.show){
            //     console.log('【wy-player-panel】 - ngOnChange - show - wyScroll', this.wyScroll);
            //     this.wyScroll.first.refreshScroll(); // first 是在有多个 BScroll 组件的情况下，采用第一个，还有 .last
            //    这里的first 是指歌曲列表里的，last是指歌词面板里的
            //     this.wyScroll.last.refreshScroll();
            // }
            if (!changes.show.firstChange && this.show) {
                // console.log("【wy-player-panel】 - ngOnChange - show - wyScroll", this.wyScroll);
                this.wyScroll.first.refreshScroll();
                this.wyScroll.last.refreshScroll();                          // -------------------(8)

                // 下面这步不加的话，会出现播放模式随机，播放歌曲，打开播放面板，发现正在播放的歌曲不在可视区内
                // 同时因为 refreshScroll（）方法中 等了 50毫秒，所以这里等待 80 毫秒

                //setTimeout(()=>{
                // if (this.currentSong) {
                //     this.scrollToCurrent(0); //这里设置成0，那么点击随机，点击歌曲下一首，点击播放面板，打开之后不会有一个歌曲列表跳转的动作
                // }
                //}, 80)

               /**
                * 如果无法避免要使用window上的其他对象，除了setTimeout和setInterval之外的对象或者属性
                *  可以在 constructor 中 注入 DOCUMENT 的令牌 constructor(@Inject(DOCUMENT ))
                *   是angular自带的一个令牌
                *   查看 services.moduel.ts
                */

                /**  替换方法（一）
                 * 可以用 timer 来替代下面的setTimeout
                 *  timer(1000, 2000)  一秒之后发出一个流，然后每隔两秒再发射一个流，相当于是一个setInterval的功能
                 *  timer(1000) 一秒之后发出一个流，然后就结束了
                 */

                timer(80).subscribe(() => {                                             // -------------------(6)
                    if (this.currentSong) {
                        this.scrollToCurrent(0); //这里设置成0，那么点击随机，点击歌曲下一首，点击播放面板，打开之后不会有一个歌曲列表跳转的动作
                    }
                })

                /**  替换方法（二）
                 */

                // this.win.setTimeout(() => {
                    // if (this.currentSong) {
                        // this.scrollToCurrent(0);
                    // }
                // }, 80);
            }
        }
    }

    sentChangeSong(song: Song){             // -------------------(2)
        // console.log('【wy-player-panel】 - sentChangeSong - song', song.id)
        this.onChangeSong.emit(song);
    }

    private updateLyrics() {                                                      // -------------------(7)
        // console.log('【wy-player-panel】 - updateLyrics');
        if(this.currentSong){
            // 这里首先需要重置一下歌词，不然切换到下面一首歌词的时候，实例化的其实还是第一首的歌词
            this.resetLyric();                                                  // -------------------(11)

            // console.log('【wy-player-panel】 - updateLyrics - this.currentSong.id', this.currentSong.id);
            this.songServe.getLyric(this.currentSong.id).subscribe(res => {
                // console.log('【wy-player-panel】 - updateLyrics - res', res);
                // 这里是用WyLyric来解析res, 把得到的所有的歌词的信息传入到WyLyric的 constructor中进行解析
                this.lyric = new WyLyric(res);

                this.currentLyric = this.lyric.lines; // lines 是WyLyric 类中的属性
                 // 这里就得到了一个类型是BaseLyricLine的数组，然后可以模板上进行显示了
                // console.log('【wy-player-panel】 - updateLyrics - currentLyrics -', this.currentLyric);
                //   正确的情况下是这样的
                //   2: {txt: "I'm lovin' how I'm floating next to you", txtCn: "我爱我沉浸在你周身的感觉", time: 6270}

                const aa = res.tlyric ? 1 : 2;
                this.handleLyric(aa);                                                 // -------------------(10)

                // 每一次切一首新歌，都需要导入歌词，并且在面板上自动先滚动到歌词的顶端
                this.wyScroll.last.scrollTo(0,0);                                   // -------------------(8)

                // 如果歌曲正在播放，那么歌词也要播放
                if(this.playing){                                                   // -------------------(9)
                    this.lyric.play();
                }

            });
        }
    }

    // 将滚动到当前歌曲的位置，并且有深色的显示条, 也就是播放的时候，保持当前的歌曲是可见的
    // 所以需要知道当前正在播放歌曲的 offsetTop， 以及 BScroll 当前列表滚动的位置
    private scrollToCurrent(speed = 300) {                                                  // -------------------(5)

        // this.wyScroll.first可以拿到scroll组件的一个实例
        // el.nativeElement拿到组件下面的dom
        // 首先获得列表每一行的元素，就是所有的 li 标签
        // 因为 wyScroll 是 WyScrollComponent，  所以 这里的 el 需要被定义在 WyScrollComponent的constructor中
        const songListRefs = this.wyScroll.first.el.nativeElement.querySelectorAll('ul li');
        // console.log('【wy-player-panel】 - songListRefs', songListRefs);
        if(songListRefs.length){
            // 这里需要定义下 HTMLElement 类型， 这样下面的currentLi才能取到 offsetTop
            // 找到当前正在播放的 li
            const currentLi = <HTMLElement>songListRefs[this.currentIndex || 0];

            // 这里需要在 wy-scroll.component中this.bs.on("scrollEnd", ({ y }) => this.onScrollEnd.emit(y));
            // 然后在本组件的模板中(onScrollEnd)="scrollY = $event"
            // 下面这两个就是用来判断播放歌曲是否超出可视区的
            // offsetTop - |scrollY| > 一个特定值，就说明超过可视区  (这是向下播放的情况)
            // offsetTop < |scrollY|  (这是向上播放的情况)
            // 这两个都是通过log在浏览器中慢慢测出来的
            // 这个特定的值就是播放列表打开之后实际的高度，可以直接在浏览器中测出来，大概 5个歌曲名字的高度

            const offsetTop = currentLi.offsetTop;
            const offsetHeight = currentLi.offsetHeight;
            const scrollYValue = Math.abs(this.scrollY);

            // console.log('【wy-player-panel】 - offsetTop', offsetTop);
            // console.log('【wy-player-panel】 - offsetHeight',offsetHeight);
            // console.log('【wy-player-panel】 - scrollY', this.scrollY);

            // if(offsetTop - Math.abs(this.scrollY) > offsetHeight * 5 ){
            if (
                offsetTop - scrollYValue > offsetHeight * 5 ||
                offsetTop < scrollYValue
            ) {
                //(第一个是目标 DOM 对象, 300 是速度)
                this.wyScroll.first.scrollToElement(   //这个方法被定义在 wy scroll 组件中，最后仍旧使用了 BS 中的API
                    currentLi,
                    speed,
                    false,
                    false
                );
            }
        }

    }

    // 这里选择2是反复调试出来的，但是 如果有中外文对应的就需要重新考虑
    private handleLyric(startLine: number = 2) {                                    // -------------------(10)
        this.lyric.handler.subscribe(({lineNum}) => {
            if(!this.lyricRefs) {
                // console.log('【wy-player-panel】 - handleLyric - lineNum', lineNum);
                // 拿到这一行的 ul-li 标签, 并且只能触发一次
                this.lyricRefs = this.wyScroll.last.el.nativeElement.querySelectorAll('ul li');
                console.log('wy-player-panel】 - handleLyric - this.lyricRefs -', this.lyricRefs);
            }

            // 如果里面已经有dom了
            if(this.lyricRefs.length) {
                this.currentLineNum = lineNum;

                // 要知道从第几行开始滚动
                if(lineNum > startLine) {
                    // 滚动到当前这个 li
                    const targetLine = this.lyricRefs[lineNum - startLine];
                    if(targetLine) {
                        this.wyScroll.last.scrollToElement(targetLine, 300, false, false);
                    }
                }else {
                    // 保持在最顶端
                    this.wyScroll.last.scrollTo(0, 0);
                }
            }
        });
    }

    // 重置清空歌词
    private resetLyric() {                               // -------------------(11)
        if(this.lyric) {
            this.lyric.stop();
            this.lyric = null;
            this.currentLyric = [];
            this.currentLineNum = 0;
            this.lyricRefs = null;
        }
    }
}
