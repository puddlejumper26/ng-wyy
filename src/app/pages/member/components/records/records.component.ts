import { NzMessageService } from 'ng-zorro-antd';
import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from "@angular/core";

import { BatchActionsService } from "src/app/store/batch-actions.service";
import { RecordVal } from "src/app/services/data-types/member.type";
import { RecordType } from './../../../../services/member.service';
import { Song } from "src/app/services/data-types/common.types";
import { SongService } from 'src/app/services/song.service';

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
    @Input() currentIndex = -1; //默认值是-1

    @Output() onChangeType = new EventEmitter<RecordType>();
    // 这里的[Song, boolean]是一个元组类型
    @Output() onAddSong = new EventEmitter<[Song, boolean]>();

    constructor() {
        // console.log('【RecordsComponent】- this.records - ', this.records);
        // console.log('【RecordsComponent】- this.listenSongs - ', this.listenSongs);
    }

    ngOnInit() {}
}
