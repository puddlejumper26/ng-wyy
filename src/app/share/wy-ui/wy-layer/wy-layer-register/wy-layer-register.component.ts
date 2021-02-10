import { Component, OnInit, ChangeDetectionStrategy, Input, EventEmitter, Output, ChangeDetectorRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NzMessageService } from 'ng-zorro-antd';
import { interval } from "rxjs";
import { take } from "rxjs/internal/operators";

import { MemberService } from 'src/app/services/member.service';

@Component({
    selector: "app-wy-layer-register",
    templateUrl: "./wy-layer-register.component.html",
    styleUrls: ["./wy-layer-register.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WyLayerRegisterComponent implements OnInit {

    @Input() visible = false;

    @Output() onChangeModalType = new EventEmitter<string | void>();

    formModel:FormGroup;
    timing: number;
    showCode = false; //暂时设置成 true 方便调试

    codePass = false;

    constructor(
        private fb: FormBuilder,
        private memberServe: MemberService,
        private nzMessageServe: NzMessageService,
        private cdr: ChangeDetectorRef,
    ) {
        this.formModel = this.fb.group({
            phone: ['', [Validators.required, Validators.pattern(/^1\d{10}$/)]],
            password: ['', [Validators.required, Validators.minLength(6)]],
        })
    }

    ngOnInit() {}

    onSubmit() {
        // 这里就可以拿到注册时候输入的手机号码和密码了
        // console.log('【WyLayerRegisterComponent】 - onSubmit - this.formModel -', this.formModel);
        //接下来就是倒计时 60秒，然后 验证码
        if(this.formModel.valid) {
            this.sendCode();
        }
    }

    sendCode() {
        this.memberServe.sendCode(this.formModel.get('phone').value).subscribe(() => {
            // 验证码发送成功之后
            this.timing = 60;
            if(!this.showCode) { this.showCode = true };
            // 接下来每一秒发送一个值，只取前面的60个，每一次都把timing 的值减一
            this.cdr.markForCheck();
            interval(1000).pipe(take(60)).subscribe(() => {
                this.timing--;
                // console.log('【WyLayerRegisterComponent】- sendCode - this.timing - ', this.timing);
                this.cdr.markForCheck();
            });

        }, error => {
            this.alertMessage('error', error.message)
        })
    }

    private alertMessage(type: string, msg: string) {
        this.nzMessageServe.create(type, msg)
    }

    // 当切换到其他的模式的时候 - onChangeModalType 发射出去不是 default 的模式的时候，就要设置 showCode = false
    changeType() {
        this.onChangeModalType.emit();
        this.showCode = false;
        this.formModel.reset();
    }

    onCheckCode(code: string) {
        this.memberServe.checkCode(this.formModel.get('phone').value, Number(code))
            // 这里用了两个，分别代表第一个参数和第二个参数
            .subscribe(
                () => this.codePass = true,   // 如果验证码返回成功
                () => this.codePass = false, // 如果验证码返回失败
                () => this.cdr.markForCheck(), //这里的第三个参数是都会执行的
            )
    }
}
