import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from "@angular/core";
import { fromEvent } from "rxjs";
import { debounceTime, distinctUntilChanged, pluck } from 'rxjs/internal/operators';

import { isEmptyObject } from "src/app/utils/tools";
import { SearchResult } from './../../../services/data-types/common.types';

@Component({
    selector: "app-wy-search",
    templateUrl: "./wy-search.component.html",
    styleUrls: ["./wy-search.component.less"],
})
export class WySearchComponent implements OnInit, AfterViewInit, OnChanges {

    @Output() onSearch = new EventEmitter<string>()
    @Input() searchResult: SearchResult;
    @Input() customView: TemplateRef<any>;
    @ViewChild('nzInput', {static: false}) private nzInput: ElementRef;

    constructor() {}

    // 使用这个钩子，来控制面板是如何显示的
    ngOnChanges(changes: SimpleChanges): void {
        if(changes['searchResult'] && !changes['searchResult'].firstChange) {
            // 根据searchResult是否有值来控制下拉的面板
            // 这里判断是否是一个空对象 因为在 app.component.ts中 onSearch 方法中可能会是空
            if(isEmptyObject(this.searchResult)) {
                this.hideOverlayPanel();
            }else {
                this.showOverlayPanel();
            }
        }
    }

    ngOnInit() {}

    // 不在dom上直接绑定的原因是需要用 rxjs 操作符 做一定的节流，不然调用接口的次数会非常频繁
    ngAfterViewInit(): void {
        // console.log('【WySearchComponent】 - ngAfterViewInit - this.nzInput.nativeElement', this.nzInput.nativeElement);
        // 这里可以开始绑定事件
        // debounceTime(300) 300毫秒内的请求都会被忽视掉
        // distinctUntilChanged() 两次发射的内容是一样的话，也不会触发
        fromEvent(this.nzInput.nativeElement, 'input')
            .pipe(debounceTime(300), distinctUntilChanged(), pluck('target', 'value'))
            .subscribe((value: string) => {
                // 这里value 就是user输入的值
                // console.log('【WySearchComponent】 - ngAfterViewInit - value', value)
                // 当这个value改变的时候就应该调用接口
                // 这个时候需要能够发射这个value
                this.onSearch.emit(value);
            })
    }

    private hideOverlayPanel() {

    }

    private showOverlayPanel() {

    }
}
