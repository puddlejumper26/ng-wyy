import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Component, OnInit, ChangeDetectionStrategy, forwardRef, ViewChild, AfterViewInit, ElementRef } from "@angular/core";

const CODELENGTH= 4;

/**
 *       和滑块里面一样，使用ControlValueAccessor 和 后面的三个接口
 */

@Component({
    selector: "app-wy-code",
    templateUrl: "./wy-code.component.html",
    styleUrls: ["./wy-code.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,

    // 注入令牌
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(()=>WyCodeComponent), //forwardRef是一个函数，返回当前的组件
            multi: true, //就是令牌可以对应多个类
        }
    ]
})
export class WyCodeComponent implements OnInit, ControlValueAccessor, AfterViewInit {
    inputArr = [];
    private code: string;

    // 装4个输入框的dom
    inputEl: HTMLElement[];

    @ViewChild('codeWrap', {static: true}) private codeWrap: ElementRef; //想拿到四个输入框的dom

    constructor() {
        // 用空字符串填充一个长度为4 的数组
        this.inputArr = Array(CODELENGTH).fill('');
    }

    ngOnInit() {}

    ngAfterViewInit(): void {
        this.inputEl = this.codeWrap.nativeElement.getElementsByClassName('item') as HTMLElement[];
        console.log('【WyCodeComponent】- ngAfterViewInit - this.inputEl -', this.inputEl);
    }

    private setValue(code: string) {
        this.code = code;
    }

    private onValueChange(value: string): void {

    }

    private onTouched(): void {

    }

/**
 *       和滑块里面一样，使用ControlValueAccessor 和 后面的三个接口
 */
    // 是输入的过程
    writeValue(code: string): void {
        // 保存到本地变量
        this.setValue(code);
    }

    registerOnChange(fn: (value: string)=>void): void {
        this.onValueChange = fn;
    }

    registerOnTouched(fn: ()=>void): void {
        this.onTouched = fn;
    }
}
