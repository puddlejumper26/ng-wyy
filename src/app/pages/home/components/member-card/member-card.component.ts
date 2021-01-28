import { NzMessageService } from 'ng-zorro-antd';
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

    constructor(
        private memberServe: MemberService,
        private nzMessageServe: NzMessageService,
        ) {}

    ngOnInit() {}

    onSignin() {
        this.memberServe.signin().subscribe( res => {
            // console.log('【MemberCardComponent】- onSignin - res - ', res);
            this.alertMessage('success', '签到成功')
            this.tipTitle = "积分" + res.point;
            this.showTip = true;
            // 1.5秒后消失
            timer(1500).subscribe(() => {
                this.showTip = false;
                this.tipTitle = '';
            });
        }, error =>{
            // console.log('【MemberCardComponent】- onSignin - error - ', error);
            // 这里的功能可以用拦截器进行简化，因为目前如果希望能够直接显示 error中的 code 和 msg 信息（看下面的注释），需要 error.error
            // 那么可以在拦截器中直接进行捕获错误
            this.alertMessage('error', error.msg || '签到失败')
        });
    }

    private alertMessage(type: string, msg: string) {
        this.nzMessageServe.create(type, msg)
    }
}


/**
 *     直接 log  error 是这样的结果，
 *
 * HttpErrorResponse {
 *     headers: HttpHeaders,
 *     status: 400,
 *     statusText: "Bad Request",
 *     url: "http://localhost:3000/daily_signin?type=1",
 *     ok: false, …}
       error: {code: -2, msg: "重复签到"}
       headers: HttpHeaders {normalizedNames: Map(0), lazyUpdate: null, lazyInit: ƒ}
       message: "Http failure response for http://localhost:3000/daily_signin?type=1: 400 Bad Request"
       name: "HttpErrorResponse"
 *
 *
 *
 *
 */
