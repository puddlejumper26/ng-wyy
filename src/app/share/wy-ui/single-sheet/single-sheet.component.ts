import { SongSheet } from "./../../../services/data-types/common.types";
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnInit,
    Output,
    EventEmitter,
} from "@angular/core";

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

    // 这里的id就是专辑的id号
    playSheet(id: number) {
        this.onPlay.emit(id);
        // console.log('single-sheet emit id - ', id);
    }
}
