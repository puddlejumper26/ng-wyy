import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Component, OnInit, ChangeDetectionStrategy, forwardRef, ViewChild, AfterViewInit, ElementRef, OnDestroy } from "@angular/core";
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { BACKSPACE } from '@angular/cdk/keycodes';

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
export class WyCodeComponent implements OnInit, ControlValueAccessor, AfterViewInit, OnDestroy {
    inputArr = [];
    private code: string;
    private destory$ = new Subject();

    private result: string[] = [];
    currentFocusIndex = 0;

    // 装4个输入框的dom
    inputsEl: HTMLElement[];

    @ViewChild('codeWrap', {static: true}) private codeWrap: ElementRef; //想拿到四个输入框的dom

    constructor() {
        // 用空字符串填充一个长度为4 的数组
        this.inputArr = Array(CODELENGTH).fill('');
    }

    ngOnInit() {}

    ngAfterViewInit(): void {
        this.inputsEl = this.codeWrap.nativeElement.getElementsByClassName('item') as HTMLElement[];
        // console.log('【WyCodeComponent】- ngAfterViewInit - this.inputEl -', this.inputEl);
        // 让第0个自动获取焦点
        this.inputsEl[0].focus();

        for(let a = 0; a < this.inputsEl.length; a++) {
            const item = this.inputsEl[a];
            // 给每个输入框都绑定keyup事件
            //当的story$发生的时候，整个事件也就结束了
            fromEvent(item, 'keyup').pipe(takeUntil(this.destory$)).subscribe((event: KeyboardEvent) => {
                this.listenKeyUp(event);
            })

            // 还需要监听一个 click事件
            fromEvent(item, 'click').pipe(takeUntil(this.destory$)).subscribe(() => {
                //这一步是为了，当点击一个输入框并输入之后，跳转到这个输入框后面的一个输入框，而不是跟着原来的顺序走
                this.currentFocusIndex = a;
            })
        }
    }

    private listenKeyUp(event: KeyboardEvent) {
        const target = <HTMLInputElement>event.target;
        const value = target.value;
        // 是否按的是删除退格键
        const isBackSpace = event.keyCode === BACKSPACE;

        if(value) {
            /**
             *  下面是实现焦点切换的逻辑
             */
            this.result[this.currentFocusIndex] = value;
            // 之后currentFocusIndex的值应该要+1， 但是不是无限+1， 应该 0,1,2,3 这样循环下去, 所以要用取余算法
            this.currentFocusIndex = (this.currentFocusIndex + 1) % CODELENGTH;
            // 切换焦点
            this.inputsEl[this.currentFocusIndex].focus();
        }
        console.log('【WyCodeComponent】- listenKeyUp - this.result -', this.result);
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

    ngOnDestroy(): void {
        this.destory$.next();
        this.destory$.complete();
    }
}
