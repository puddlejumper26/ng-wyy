import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    QueryList,
    SimpleChanges,
    ViewChildren,
} from "@angular/core";

import { WyScrollComponent } from './../wy-scroll/wy-scroll.component';
import { getCurrentIndex } from './../../../../store/selectors/player.selector';
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
    @Input() show: boolean;  //通过父级的组件来进行控制的

    @Output() onClose = new EventEmitter<void>();
    @Output() onChangeSong = new EventEmitter<Song>();

    //因为播放列表和歌词部分都需要用到，所以这里用 ViewChildren
    // @ViewChildren(WyScrollComponent) private wyScroll: QueryList<WyScrollComponent>;
    @ViewChildren(WyScrollComponent) private wyScroll: QueryList<WyScrollComponent>;

    constructor() {}

    ngOnInit() {}

    //监听变化
    ngOnChanges(changes: SimpleChanges): void {
        if (changes.songList) {
            // console.log(11111, this.songList);
        }
        if (changes.currentSong) {
          // console.log(22222, this.currentSong);
        }
        if(changes["show"]){
            //如果不是第一次变化,因为页面一进来就有了第一次变化，这里就需要屏蔽掉, 这时候就刷新 BScroll 组件
            // if(!changes.show.firstChange && this.show){
            //     console.log('wyScroll', this.wyScroll);
            //     this.wyScroll.first.refreshScroll(); // first 是在有多个 BScroll 组件的情况下，采用第一个，还有 .last
            //     this.wyScroll.last.refreshScroll();
            // }
            if (!changes.show.firstChange && this.show) {
                console.log('wyScroll', this.wyScroll);
                this.wyScroll.first.refreshScroll();
                this.wyScroll.last.refreshScroll();
            }
        }
    }

}
