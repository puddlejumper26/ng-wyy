import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { map } from 'rxjs/internal/operators/map';
import { recordVal, User, UserSheet } from 'src/app/services/data-types/member.type';
import { SheetService } from 'src/app/services/sheet.service';
import { BatchActionsService } from 'src/app/store/batch-actions.service';

@Component({
    selector: "app-center",
    templateUrl: "./center.component.html",
    styleUrls: ["./center.component.less"],
})
export class CenterComponent implements OnInit {

    user: User;
    userRecord: recordVal[];
    userSheet: UserSheet;

    constructor(
        private route: ActivatedRoute,
        private sheetServe: SheetService,
        private batchActionServe: BatchActionsService,
    ) {
        // console.log('【CenterComponent】- consctructor');
        // 这里的subscribe可看成解构赋值
        this.route.data.pipe(map(res => res.user)).subscribe(([ user, userRecord, userSheet]) => {
            // console.log('【CenterComponent】- consctructor - user - ', user);
            // console.log('【CenterComponent】- consctructor - userRecord - ', userRecord);
            // console.log('【CenterComponent】- consctructor - userSheet - ', userSheet);
            this.user = user;
            this.userRecord = userRecord;
            this.userSheet = userSheet;
        })
    }

    ngOnInit() {}

    // 和 home.component.ts 中是一样的
    onPlaySheet(id: number) {
        this.sheetServe.playSheet(id).subscribe((list) => {
            this.batchActionServe.selectPlayList({list, index: 0});
        });
    }
}
