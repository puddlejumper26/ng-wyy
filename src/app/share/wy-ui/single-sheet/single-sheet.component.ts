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

    // 这里使用 stopPropagation ， 否则点击 home 页面的专辑上的播放按钮，就会直接跳转到专辑的详情页面（也会执行相应功能）
    // 也就是说这个 点击 click 的功能 被 冒泡到 这个组件的最外层， 也就是下面这个 click 上了，所以要阻止
    //                       <app-single-sheet
    //                             class="sheet-item"
    //                             *ngFor="let item of songSheetLists"
    //                             [sheet]="item"
    //                             (onPlay)="onPlaySheet($event)"
    //                             (click)="toInfo(item.id)"
    //                         ></app-single-sheet>
    playSheet(evt: MouseEvent, id: number) {
        evt.stopPropagation();
        this.onPlay.emit(id);
        // console.log('single-sheet emit id - ', id);
    }

    // get 这个看上像一个函数，但是可以像变量一样使用就好了
    // 这里还是为了兼容两种不同的类型
    get coverImg(): string {
        return this.sheet.picUrl || this.sheet.coverImgUrl;
    }
}
