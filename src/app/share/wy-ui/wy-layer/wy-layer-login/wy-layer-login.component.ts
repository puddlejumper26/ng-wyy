import { Component, OnInit, ChangeDetectionStrategy, EventEmitter, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

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
export class WyLayerLoginComponent implements OnInit {
    // 和wy-layer-default.component.ts中的设定是一样的
    @Output() onChangeModalType = new EventEmitter<string | void>();
    // 这里login 的逻辑也是发到外面，不在这里做
    @Output() onLogin = new EventEmitter<LoginParams>();

    formModel: FormGroup;

    constructor(
        private fb: FormBuilder,
    ) {
        this.formModel = this.fb.group({
            // 这里的 key 的 值一定要和  html 中 formControlName保持一致
            // 这里给出的是默认值 和 验证规则
            phone: ['15079010174', [Validators.required, Validators.pattern(/^1\d{10}$/)]],
            password: ['LYC6809915TC', [Validators.required, Validators.minLength(6)]],
            remember: [false]
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
