import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild, ViewContainerRef } from "@angular/core";
import { fromEvent } from "rxjs";
import { debounceTime, distinctUntilChanged, pluck } from 'rxjs/internal/operators';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

import { isEmptyObject } from "src/app/utils/tools";
import { SearchResult } from './../../../services/data-types/common.types';
import { WySearchPanelComponent } from './wy-search-panel/wy-search-panel.component';

@Component({
    selector: "app-wy-search",
    templateUrl: "./wy-search.component.html",
    styleUrls: ["./wy-search.component.less"],
})
export class WySearchComponent implements OnInit, AfterViewInit, OnChanges {

    @Output() onSearch = new EventEmitter<string>()
    @Input() searchResult: SearchResult;
    @Input() customView: TemplateRef<any>;
    @Input() connectedRef: ElementRef;
    @ViewChild('nzInput', {static: false}) private nzInput: ElementRef;
    @ViewChild('search', {static: false}) private defaultRef: ElementRef;

    private overlayRef: OverlayRef;

    constructor(
        private overlay: Overlay,
        private viewContainerRef: ViewContainerRef,
    ) {}

    // 使用这个钩子，来控制面板是如何显示的
    ngOnChanges(changes: SimpleChanges): void {
        if(changes['searchResult'] && !changes['searchResult'].firstChange) {
            // 这里的 hideOverlayPanel()可以直接在 showOverlayPanel()第一行进行调用，这里删除就好了
            this.hideOverlayPanel();
            // 根据searchResult是否有值来控制下拉的面板
            // 这里判断是否是一个空对象 因为在 app.component.ts中 onSearch 方法中可能会是空
            if(!isEmptyObject(this.searchResult)) {
                // console.log('【WySearchComponent】 - ngOnChanges');
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
        // hasAttached 就是指 overlay 上有内容，是显示的
        if(this.overlayRef && this.overlayRef.hasAttached()){
            // dispose 就是消失的方法
            this.overlayRef.dispose();
        }
    }

    private showOverlayPanel() {
        // console.log('【WySearchComponent】 - hideOverlayPanel');
        // 下面可以通过连续的 . 进行连续调用，是因为这些方法返回的都是 this
        const positionStrategy = this.overlay.position()
                                    // this.connectedRef 是可以从parent component上通过输入进行控制
                                    .flexibleConnectedTo(this.connectedRef || this.defaultRef)  //这个浮层就会根据defaultRef来进行定位
                                    // 下面的四个参数是必选的. originX, originY 是相对dom的一个点
                                    // originX: 'start',originY: 'bottom',是指主页面搜索框的左边底部左下角的那个点
                                    // overlayX: 'start',overlayY: 'top' 是指overlay 左上角的那个点，和上面的点对应
                                    // 这样就能确定overlay的出现的位置了
                                    .withPositions([{
                                        originX: 'start',
                                        originY: 'bottom',
                                        overlayX: 'start',
                                        overlayY: 'top'
                                    }])
                                    // 和下面的scrollStrategy合用
                                    // 把出现的overlay锁定在初始化的地方，不会随着鼠标的滚动而变化
                                    .withLockedPosition(true);

        // 和上面的.withLockedPosition合用，进行锁定
        const scrollStrategy = this.overlay.scrollStrategies.reposition();

        this.overlayRef = this.overlay.create({
            hasBackdrop: true,  // 这个属性会在 搜索框内输入搜索内容之后，除了显示Overlay Panel，还会出现一个笼罩整个UI的隐身的div
            positionStrategy: positionStrategy,
            scrollStrategy: scrollStrategy,
        });
        // 这里依赖的数组是viewContainerRef类型，是当前WySearchComponent
        // 也就是WySearchPanelComponent需要依附于this.viewContainerRef
        const panelPortal = new ComponentPortal(WySearchPanelComponent, this.viewContainerRef);
        const panelRef = this.overlayRef.attach(panelPortal);
        // console.log('【WySearchComponent】- showOverlayPanel - panelRef', panelRef);
        // 这里的panelRef是componentRef类型，下面有一个instance的属性,打开就是WySearchPanelComponent所以可以
        // 等号前面的searchResult是WySearchPanelCompopnent中定义的， 这样就把这里的searchResult中的结果赋值到WySearchPanelComponent中去了
        panelRef.instance.searchResult = this.searchResult;

        // 注意下面的是一个 Observable， 就是监听是否点击到了Overlay panel 以外的页面，并且这个时候浮层把下面的内容都遮挡住了，没有任何的交互结果
        this.overlayRef.backdropClick().subscribe((res) => {
            //  console.log('【WySearchComponent】- showOverlayPanel - this.overlayRef.backgropClick()', res); //这一步在鼠标点击页面时候会打印出来一个MouseEvent
            // 所以在这里调用 下面的方法就能够在点击Overlay Panel以外的页面时候隐藏这个页面
            this.hideOverlayPanel();
        })
    }

    onFocus() {
        console.log('【WySearchComponent】- onFocus()');
        if(this.searchResult && !isEmptyObject(this.searchResult)) {
            this.showOverlayPanel();
        }
    }

    // 当搜索面板渲染好之后，点击搜索出来的内容，跳转到相应的页面，需要自动隐藏搜索面板
    onBlur() {
        console.log('【WySearchComponent】- onBlur()');
        this.hideOverlayPanel();
    }
}
