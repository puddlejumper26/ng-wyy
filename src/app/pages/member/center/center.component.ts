import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { map } from 'rxjs/internal/operators/map';
import { recordVal, User, UserSheet } from 'src/app/services/data-types/member.type';

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
        private route: ActivatedRoute
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
}
