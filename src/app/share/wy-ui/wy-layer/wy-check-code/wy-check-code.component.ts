import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
    selector: "app-wy-check-code",
    templateUrl: "./wy-check-code.component.html",
    styleUrls: ["./wy-check-code.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WyCheckCodeComponent implements OnInit {
    private phoneHideStr = '';

    formModel: FormGroup;

    @Input() codePass = false;
    //注意这里是用 Input 和 set 合用
    @Input()
    set phone(phone: string) { // 用set 赋值器来修饰 phone
        const arr = phone.split('');
        // 接下来用 splice来把电话号码分成一个数组中的11个元素，其中4个用信号隐藏
        arr.splice(3,4,'****');
        // 接下来再转回字符串
        this.phoneHideStr = arr.join('');
    }

    @Output() onCheckCode = new EventEmitter<string>();

    // 用 get 来取值
    get phone() {
        return this.phoneHideStr;
    }

    constructor(
        private fb: FormBuilder,
    ) {
        this.formModel = this.fb.group({
            code: ['', [Validators.required, Validators.pattern(/\d{4}/)]], //4位数字
        })
    }

    ngOnInit() {}

    onSubmit() {
        // console.log('【WyCheckCodeComponent】- onSubmit - this.formModel - ', this.formModel);
        // console.log('【WyCheckCodeComponent】- onSubmit - this.formModel.valid - ', this.formModel.valid);
        if(this.formModel.valid) {
            // 把这个发射到外面进行验证 - 验证码是否正确
            this.onCheckCode.emit(this.formModel.value.code);
        }
    }
}
