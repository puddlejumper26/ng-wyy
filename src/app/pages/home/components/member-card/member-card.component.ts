import { timer } from 'rxjs';
import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";

import { MemberService } from './../../../../services/member.service';
import { User } from "src/app/services/data-types/member.type";

@Component({
    selector: "app-member-card",
    templateUrl: "./member-card.component.html",
    styleUrls: ["./member-card.component.less"],
})
export class MemberCardComponent implements OnInit {

    tipTitle = '';
    showTip = false;

    @Input() user: User;
    @Output() openModal = new EventEmitter<void>()

    constructor(private memberServe: MemberService) {}

    ngOnInit() {}

    onSignin() {
        this.memberServe.signin().subscribe( res => {
            // console.log('【MemberCardComponent】- onSignin - res - ', res);
            this.tipTitle = "积分" + res.point;
            this.showTip = true;
            // 1.5秒后消失
            timer(1500).subscribe(() => {
                this.showTip = false;
                this.tipTitle = '';
            });
        }, error =>{
            console.log('【MemberCardComponent】- onSignin - error - ', error);
        });
    }
}
