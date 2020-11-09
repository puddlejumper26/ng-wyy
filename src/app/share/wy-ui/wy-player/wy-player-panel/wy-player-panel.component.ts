import { getCurrentIndex } from './../../../../store/selectors/player.selector';
import {
    Component,
  EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
} from "@angular/core";
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

    constructor() {}

    ngOnInit() {}

    //监听变化
    ngOnChanges(changes: SimpleChanges): void {
        if (changes["songList"]) {
            console.log(11111, this.songList);
        }
        if (changes["currentSong"]) {
          console.log(22222, this.currentSong);
      }
    }

}
