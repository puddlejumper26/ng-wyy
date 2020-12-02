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
import { getCurrentIndex } from "./../../../../store/selectors/player.selector";
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

    // 应该到 if(changes['currentSong'])中变化时，求出在songList中的一个索引
    // 中间的媒介就是现在正在播放的歌曲， currentSong
    currentIndex: number;                                                     // -------------------(6)
    // @Input() currentIndex: number;

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

    scrollY = 0;

    currentLyric: BaseLyricLine[]; //是一个数组

    // 这时候再使用 win 就可以 不用 timer ， 而是 this.win.setTimeout
    constructor(
        @Inject(WINDOW) private win: Window,
        private songServe: SongService
        ) {}

    ngOnInit() {}

    //监听变化
    ngOnChanges(changes: SimpleChanges): void {
        if (changes.songList) {                                               // -------------------(2)
            // console.log(11111, this.songList);
            // 这里是 切换歌单，比如点击另外一个专辑的播放按钮
            this.currentIndex = 0; //默认从第一首开始播放
        }


        if (changes.currentSong) {                                             // -------------------(4)
            // console.log(22222, this.currentSong);
            if (this.currentSong) {
                this.currentIndex = findIndex(this.songList, this.currentSong);    // -------------------(6)

                //同时 这个时候要请求歌词
                this.updateLyrics();

                if (this.show) {
                    this.scrollToCurrent();                                     // -------------------(5)
                }
            }
        }
        if (changes["show"]) {                                                 // -------------------(3)
            //如果不是第一次变化,因为页面一进来就有了第一次变化，这里就需要屏蔽掉, 这时候就刷新 BScroll 组件
            // if(!changes.show.firstChange && this.show){
            //     console.log('wyScroll', this.wyScroll);
            //     this.wyScroll.first.refreshScroll(); // first 是在有多个 BScroll 组件的情况下，采用第一个，还有 .last
            //    这里的first 是指歌曲列表里的，last是指歌词面板里的
            //     this.wyScroll.last.refreshScroll();
            // }
            if (!changes.show.firstChange && this.show) {
                // console.log("wyScroll", this.wyScroll);
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
        // console.log('song', song.id)
        this.onChangeSong.emit(song);
    }

    private updateLyrics() {                                                      // -------------------(7)
        // console.log('updateLyrics');
        if(this.currentSong){
            // console.log('updateLyrics --->', this.currentSong.id);
            this.songServe.getLyric(this.currentSong.id).subscribe(res => {
                // console.log('updateLyrics --->', res);
                // 这里是用WyLyric来解析res, 把得到的所有的歌词的信息传入到WyLyric的 constructor中进行解析
                const lyric = new WyLyric(res);

                this.currentLyric = lyric.lines; // lines 是WyLyric 类中的属性
                 // 这里就得到了一个类型是BaseLyricLine的数组，然后可以模板上进行显示了
                // console.log('updateLyrics - currentLyrics--', this.currentLyric);
                //   正确的情况下是这样的
                //   2: {txt: "I'm lovin' how I'm floating next to you", txtCn: "我爱我沉浸在你周身的感觉", time: 6270}

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
        // console.log('songListRefs', songListRefs);
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

            // console.log('offsetTop', offsetTop);
            // console.log('offsetHeight',offsetHeight);
            // console.log('scrollY', this.scrollY);

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
}
