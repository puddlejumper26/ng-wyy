import {
    Component,
    ElementRef,
    EventEmitter,
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

@Component({
    selector: "app-wy-player-panel",
    templateUrl: "./wy-player-panel.component.html",
    styleUrls: ["./wy-player-panel.component.less"],
})
export class WyPlayerPanelComponent implements OnInit, OnChanges {
    // 需要监听这两个值得变化， 从 wy-player.component 中
    @Input() songList: Song[];
    @Input() currentSong: Song;
    @Input() currentIndex: number;
    @Input() show: boolean; //通过父级的组件来进行控制的

    @Output() onClose = new EventEmitter<void>();
    @Output() onChangeSong = new EventEmitter<Song>();

    //因为播放列表和歌词部分都需要用到，所以这里用 ViewChildren
    // @ViewChildren(WyScrollComponent) private wyScroll: QueryList<WyScrollComponent>;
    @ViewChildren(WyScrollComponent) private wyScroll: QueryList<WyScrollComponent>;

    scrollY = 0;

    constructor() {}

    ngOnInit() {}

    //监听变化
    ngOnChanges(changes: SimpleChanges): void {
        if (changes.songList) {
            // console.log(11111, this.songList);
        }
        if (changes.currentSong) {
            // console.log(22222, this.currentSong);
            if (this.currentSong) {
                if (this.show) {
                    this.scrollToCurrent();
                }
            }
        }
        if (changes["show"]) {
            //如果不是第一次变化,因为页面一进来就有了第一次变化，这里就需要屏蔽掉, 这时候就刷新 BScroll 组件
            // if(!changes.show.firstChange && this.show){
            //     console.log('wyScroll', this.wyScroll);
            //     this.wyScroll.first.refreshScroll(); // first 是在有多个 BScroll 组件的情况下，采用第一个，还有 .last
            //     this.wyScroll.last.refreshScroll();
            // }
            if (!changes.show.firstChange && this.show) {
                console.log("wyScroll", this.wyScroll);
                this.wyScroll.first.refreshScroll();
                this.wyScroll.last.refreshScroll();
                // 下面这步不加的话，会出现播放模式随机，播放歌曲，打开播放面板，发现正在播放的歌曲不在可视区内
                // 同时因为 refreshScroll（）方法中 等了 50毫秒，所以这里等待 80 毫秒
               setTimeout(()=>{
                if (this.currentSong) {
                    this.scrollToCurrent();
                }
               }, 80)
            }
        }
    }

    // 将滚动到当前歌曲的位置，并且有深色的显示条, 也就是播放的时候，保持当前的歌曲是可见的
    // 所以需要知道当前正在播放歌曲的 offsetTop， 以及 BScroll 当前列表滚动的位置
    private scrollToCurrent() {
        // 首先获得列表每一行的元素，就是所有的 li 标签
        // 因为 wyScroll 是 WyScrollComponent，  所以 这里的 el 需要被定义在 WyScrollComponent的constructor中
        const songListRefs = this.wyScroll.first.el.nativeElement.querySelectorAll('ul li');
        // console.log('songListRefs', songListRefs);
        if(songListRefs.length){
            // 这里需要定义下 HTMLElement 类型， 这样下面的currentLi才能取到 offsetTop
            const currentLi = <HTMLElement>songListRefs[this.currentIndex || 0];

            // 下面这两个就是用来判断播放歌曲是否超出可视区的
            // offsetTop - |scrollY| > 一个特定值，就说明超过可视区  (这是向下播放的情况)
            // offsetTop < |scrollY|  (这是向上播放的情况)
            // 这两个都是通过log在浏览器中慢慢测出来的
            // 这个特定的值就是播放列表打开之后实际的高度，可以直接在浏览器中测出来，大概 5个歌曲名字的高度
            const offsetTop = currentLi.offsetTop;
            const offsetHeight = currentLi.offsetHeight;
            const scrollYValue = Math.abs(this.scrollY);

            console.log('offsetTop', offsetTop);
            console.log('offsetHeight',offsetHeight);
            console.log('scrollY', this.scrollY);

            // if(offsetTop - Math.abs(this.scrollY) > offsetHeight * 5 ){
            if (
                offsetTop - scrollYValue > offsetHeight * 5 ||
                offsetTop < scrollYValue
            ) {
                //(第一个是目标 DOM 对象, 300 是速度)
                this.wyScroll.first.scrollToElement(
                    currentLi,
                    300,
                    false,
                    false
                );
            }
        }

    }
}
