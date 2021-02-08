import { Component, OnInit, ChangeDetectionStrategy, EventEmitter, Output, Input, OnChanges, SimpleChanges } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { codeJson } from "src/app/utils/base64";

export type LoginParams = {
    phone: string;
    password: string;
    remember: boolean;
}

@Component({
    selector: "app-wy-layer-login",
    templateUrl: "./wy-layer-login.component.html",
    styleUrls: ["./wy-layer-login.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WyLayerLoginComponent implements OnInit, OnChanges {
    // 这个值要在app.component.ts的constructor中进行解析
    @Input() wyRememberLogin: LoginParams;

    @Input() visible = false;

    // 和wy-layer-default.component.ts中的设定是一样的
    @Output() onChangeModalType = new EventEmitter<string | void>();
    // 这里login 的逻辑也是发到外面，不在这里做
    @Output() onLogin = new EventEmitter<LoginParams>();

    formModel: FormGroup;

    constructor(
        private fb: FormBuilder,
    ) {
        // 注意这一步把默认的手机和密码改成空白 因为之前这么设置是为了方便登录，进行代码的查看，
        // 正常情况应该是空的，并且主要看下面的改写的结构的内容

        // this.formModel = this.fb.group({
        //     // 这里的 key 的 值一定要和  html 中 formControlName保持一致
        //     // 这里给出的是默认值 和 验证规则
        //     phone: ['', [Validators.required, Validators.pattern(/^1\d{10}$/)]],//15079010174
        //     password: ['', [Validators.required, Validators.minLength(6)]], //LYC6809915TC
        //     remember: [false]
        // })
    }

    // 这里监听属性的变化
    ngOnChanges(changes: SimpleChanges): void {
        const userLoginParams = changes['wyRememberLogin'];
        const visible = changes['visible'];
        if(userLoginParams) {
            let phone = '';
            let password = '';
            let remember = false;
            // 下面的就可以达到一个回写的效果
            if(userLoginParams.currentValue) {
                // 首先需要解码，不然不能直接回写
                const value = codeJson(userLoginParams.currentValue, 'decode');
                phone = value.phone;
                password = value.password;
                remember = value.remember;
            }
            // 下面传入刚刚获得的参数
            this.setModel({phone, password, remember});
        }

        if(visible && !visible.firstChange) {
            this.formModel.markAllAsTouched();
        }
    }

    // 下面通过结构来获得数据, 这样就可以做到回写的效果了，也就是登录一次之后，登出，然后然刷新页面，点击登录，里面的信息是上次登录的信息
    private setModel({phone, password, remember}) {
        // 注意constructor中注释掉的内容
        this.formModel = this.fb.group({
            phone: [phone, [Validators.required, Validators.pattern(/^1\d{10}$/)]],//15079010174
            password: [password, [Validators.required, Validators.minLength(6)]], //LYC6809915TC
            remember: [remember]
        })
    }

    ngOnInit() {}

    onSubmit() {
        // 这里的 点击button和回车都可以打印出来，因为html中的button默认 type是submit，如果改成type="button"就不行了
        // console.log('【WyLayerLoginComponent】 - onSubmit - this.formModel.value -', this.formModel.value);

        const model = this.formModel;
        if(model.valid) {
            // console.log('【WyLayerLoginComponent】 - onSubmit - model.value - ', model.value);
            // 这样在外面一层就能够接受到这个onLogin 事件
            this.onLogin.emit(model.value);
        }
    }
}
