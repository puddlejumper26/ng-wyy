import { Component, OnInit, ChangeDetectionStrategy, Input } from "@angular/core";

import { RecordVal } from "src/app/services/data-types/member.type";
import { RecordType } from './../../../../services/member.service';

@Component({
    selector: "app-records",
    templateUrl: "./records.component.html",
    styleUrls: ["./records.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecordsComponent implements OnInit {

    @Input() records: RecordVal[];
    @Input() recordType = RecordType.allData;
    @Input() listenSongs = 0;

    constructor() {
        // console.log('【RecordsComponent】- this.records - ', this.records);
        // console.log('【RecordsComponent】- this.listenSongs - ', this.listenSongs);
    }

    ngOnInit() {}
}
