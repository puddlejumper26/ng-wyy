import { ActivatedRoute } from "@angular/router";
import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { map } from "rxjs/internal/operators";
import { NzMessageService } from "ng-zorro-antd";
import { Store } from "@ngrx/store";

import { AppStoreModule } from "src/app/store";
import { BatchActionsService } from "src/app/store/batch-actions.service";
import { MemberService } from "src/app/services/member.service";
import { SheetService } from "src/app/services/sheet.service";
import { SongService } from "src/app/services/song.service";

@Component({
    selector: "app-record-detail",
    templateUrl: "./record-detail.component.html",
    styles: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecordDetailComponent implements OnInit {
    constructor(
        private route: ActivatedRoute,
        private sheetServe: SheetService,
        private batchActionServe: BatchActionsService,
        private memberServe: MemberService,
        private songServe: SongService,
        private nzMessageServe: NzMessageService,
        private store$: Store<AppStoreModule>,

    ) {
        this.route.data.pipe(map(res => res.user)).subscribe(([user, userRecord]) => {
            console.log('【RecordDetailComponent】- consctructor - user - ', user);
            console.log('【RecordDetailComponent】- consctructor - userRecord - ', userRecord);
        })
    }

    ngOnInit() {}
}
