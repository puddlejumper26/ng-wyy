import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, OnChanges, SimpleChanges } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
    selector: "app-wy-check-code",
    templateUrl: "./wy-check-code.component.html",
    styleUrls: ["./wy-check-code.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WyCheckCodeComponent implements OnInit, OnChanges {
    private phoneHideStr = '';

    formModel: FormGroup;
    showRepeatBtn = false;
    showErrorTip = false;

    @Input() codePass = false;
    @Input() timing: number;
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
    @Output() onRepeatSendCode = new EventEmitter<string>();
    @Output() onCheckExist = new EventEmitter<string>();

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

        const codeControl = this.formModel.get('code');
        // 有一个statusChanges 用来监听状态变化的情况
        codeControl.statusChanges.subscribe(status => {
            if(status === 'VALID') {
                this.onCheckCode.emit(this.formModel.value.code);
            }
        })
    }

    ngOnChanges(changes: SimpleChanges): void {
        if(changes['timing']) {
            // console.log('【WyCheckCodeComponent】- ngOnChanges - this.timing - ', this.timing);
            this.showRepeatBtn = this.timing <= 0;
        }

        if(changes['codePass'] && !changes['codePass'].firstChange) {
            this.showErrorTip = !this.codePass;
        }
    }

    ngOnInit() {}

    onSubmit() {
        // console.log('【WyCheckCodeComponent】- onSubmit - this.formModel - ', this.formModel);
        // console.log('【WyCheckCodeComponent】- onSubmit - this.formModel.valid - ', this.formModel.valid);

        // 这里用了codePass需要使用自己的手机号来进行验证，才会调出验证通过的窗口
        if(this.formModel.valid && this.codePass) {
            // 把这个发射到外面进行验证 - 验证码是否正确
            // 这一步应该移到 constructor 中去, 这样对验证码的验证在四位数字输入结束就会自动开始，而不需要点击下一步或者回车触发这个onSubmit方法
            // this.onCheckCode.emit(this.formModel.value.code);

            // 检测是否已经注册
            this.onCheckExist.emit(this.phone)
        }
    }
}
