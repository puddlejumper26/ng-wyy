import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnInit,
    Output,
    EventEmitter,
} from "@angular/core";

import { SongSheet } from "./../../../services/data-types/common.types";

@Component({
    selector: "app-single-sheet",
    templateUrl: "./single-sheet.component.html",
    styleUrls: ["./single-sheet.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SingleSheetComponent implements OnInit {
    @Input() sheet: SongSheet;
    @Output() onPlay = new EventEmitter<number>();

    constructor() {}

    ngOnInit() {}

    // 这里的id就是播放列表的id号
    playSheet(id: number) {
        this.onPlay.emit(id);
        // console.log('single-sheet emit id - ', id);
    }

    // get 这个看上像一个函数，但是可以像变量一样使用就好了
    // 这里还是为了兼容两种不同的类型
    get coverImg(): string {
        return this.sheet.picUrl || this.sheet.coverImgUrl;
    }
}
