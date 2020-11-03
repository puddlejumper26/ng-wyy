import { DOCUMENT } from "@angular/common";
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Inject,
    Input,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from "@angular/core";
import { fromEvent, merge, Observable } from "rxjs";
import {
    distinctUntilChanged,
    filter,
    map,
    pluck,
    takeUntil,
    tap,
} from "rxjs/internal/operators";
import { SliderValue } from "src/app/services/data-types/common.types";
import { inArray } from "src/app/utils/array";
import { getPercent, limitNumberInRange } from "src/app/utils/number";
import { getElementOffset, sliderEvent } from "./wy-slider-helper";
import { SliderEventObserverConfig } from "./wy-slider-types";

@Component({
    selector: "app-wy-slider",
    templateUrl: "./wy-slider.component.html",
    styleUrls: ["./wy-slider.component.less"],
    // make the style could be used into the children components, work as globle style rules
    // https://angular.cn/guide/component-styles#view-encapsulation
    encapsulation: ViewEncapsulation.None,
    //如果下面的 @Input 属性不发生变化，那么就不会检测更新，所以这里的部分代码需要手动检测
    //拖动滑块时， 下面定义的value 值是不会变化的
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WySliderComponent implements OnInit {
    /**
     *  Here we need to control the slider handle and check the slider track
     *  therefore we need to monitor the template, obtain the dom of this template
     *
     *  method 1  inject  -> private el: ElementRef  inside the constructor
     *  method 2  inside template <#wySlider>
     *
     *             inside ts
     *                      @ViewChild('wySlider') private wySlider: ElementRef
     */

    // https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLDivElement
    // 提供了一些特殊属性（它也继承了通常的 HTMLElement 接口）来操作 <div> 元素。
    private sliderDom: HTMLDivElement;
    private isDragging = false;

    offset: SliderValue = null;
    value: SliderValue = null;

    private dragStart$: Observable<number>;
    private dragMove$: Observable<number>;
    private dragEnd$: Observable<Event>;

    @Input() wyVertical = false; // default is horizontal direction
    @Input() wyMin = 0;
    @Input() wyMax = 100;

    @ViewChild("wySlider", { static: true }) private wySlider: ElementRef;

    constructor(
        @Inject(DOCUMENT) private doc: Document,
        private cdr: ChangeDetectorRef // 进行手动 更新检测 这里的 ChangeDetectorRef 是一个类，下面使用其的 markForCheck()
    ) {}

    ngOnInit() {
        // console.log(1111, this.wySlider.nativeElement);
        this.sliderDom = this.wySlider.nativeElement;
        this.createDraggingObservables();
        // 订阅 start 事件
        this.subscribeDrag(["start"]);
    }

    /**
     *  pc: mousedown mousemove mouseup  - MouseEvent
     *      obtain mouse position
     *        event.pageX || event.pageY
     *
     *  mobile: touchestart touchmove touchend  - TouchEvent
     *      obtain touch position
     *          event.touches[0].pageX || event.touches[0].pageY
     */

    private createDraggingObservables() {
        /**
         *  The MouseEvent interface represents events that occur due to the user interacting
         *  with a pointing device (such as a mouse).
         *   Common events using this interface include click, dblclick, mouseup, mousedown.
         *
         *    MouseEvent and TouchEvent  are Interfaces inside Web APIs
         *
         *    mouseup, mousedown, mousemove, touchstart, touchmove, touchend are comment events using that interfaces
         */

        const orientField = this.wyVertical ? "pageY" : "pageX";

        // PC上要绑定的事件
        const mouse: SliderEventObserverConfig = {
            start: "mousedown",
            move: "mousemove",
            end: "mouseup",
            filterEvent: (e: MouseEvent) => e instanceof MouseEvent,
            pluckKey: [orientField],
        };

        //手机上绑定的事件
        const touch: SliderEventObserverConfig = {
            start: "touchstart",
            move: "touchmove",
            end: "touchend",
            filterEvent: (e: TouchEvent) => e instanceof TouchEvent,
            pluckKey: ["touches", "0", orientField],
        };

        [mouse, touch].forEach((source) => {
            // 取出 mouse 和 touch 的属性
            // Destructuring of JSON data, 这里使用了 对 JSON数据 的 解构
            const { start, move, end, filterEvent, pluckKey } = source;
            /**
             *   fromEvent is turn an event into an observable
             *       fromEvent(target: EventTargetLike, eventName: string, selector: function): Observable
             *       https://rxjs-cn.github.io/learn-rxjs-operators/operators/creation/fromevent.html
             *       fromEvent 第一个参数是传一个容器， start 是事件
             *
             *   tap
             *     tap(nextOrObserver: function, error: function, complete: function): Observable
             */
            // filter 先筛选出事件对象，如果是 PC 的话， 筛选出 MouseEvent 对象
            // tap 和 console.log类似，可以做一个中间的调试， 这里是阻止冒泡和默认事件
            // pluck 来获取按下的位置
            source.startPlucked$ = fromEvent(this.sliderDom, start).pipe(
                filter(filterEvent),
                tap(sliderEvent),
                pluck(...pluckKey), //展开运算符， 展开这个数组， 这步之后就 取到了当前鼠标或者touch的位置
                map((position: number) => this.findClosestValue(position)) //这时候已经拿到了 位置，是一个 Number， 这时候要根据 位置算出值，所以要做 位置和值的转换
            );

            // 这里有原生的 document  属性， angular已经有一个已经 依赖注入过的 document 对象
            // https://angular.io/api/common/DOCUMENT
            // 避免是用原生的浏览器的对象，因为后期渲染的时候会出问题。  解释看下面
            //
            source.end$ = fromEvent(this.doc, end);
            // check constructor for the DOCUMENT
            source.moveResolved$ = fromEvent(this.doc, move).pipe(
                filter(filterEvent),
                tap(sliderEvent),
                pluck(...pluckKey),
                distinctUntilChanged(), // 当值发生了改变， 就继续向后发射这个流，如果值不变，就不会发射
                map((position: number) => this.findClosestValue(position)),
                takeUntil(source.end$) // 这里意思是当 source.end$ 流出现的时候， 就停止发射这里的 move 的流
            );
        });

        // 上述的表达如果直接订阅，就会需要订阅多次，非常麻烦，所以这里使用 merge 来合并成对的操作符
        this.dragStart$ = merge(mouse.startPlucked$, touch.startPlucked$);
        this.dragMove$ = merge(mouse.moveResolved$, touch.moveResolved$);
        this.dragEnd$ = merge(mouse.end$, touch.end$);
        //  接下来就是订阅这三个事件
    } // end of function createDraggingObservables

    //参数为数组，是因为需要能够同时订阅多个事件
    private subscribeDrag(events: string[]) {
        // if(events.indexOf('start') !== -1 && this.dragStart$){
        //   this.dragStart$.subscribe(this.onDragStart.bind(this));
        // };
        if ((inArray(events, "start"), this.dragStart$)) {
            this.dragStart$.subscribe(this.onDragStart.bind(this));
        }
        if ((inArray(events, "move"), this.dragMove$)) {
            this.dragMove$.subscribe(this.onDragMove.bind(this));
        }
        if ((inArray(events, "end"), this.dragEnd$)) {
            this.dragEnd$.subscribe(this.onDragEnd.bind(this));
        }
    }

    // 参数是 number， 是因为拿到的是一个位置
    private onDragStart(value: number) {
        console.log(111111, value);
        //需要绑定 move 和 end 事件
        this.toggleDragMoving(true);
        this.setValue(value); // 这样鼠标点击到进度条的任何一点， handle都会移动过去
    }
    private onDragMove(value: number) {
        if (this.isDragging) {
            this.setValue(value); //传入 value
            //手动更新检测 When a view uses the OnPush (checkOnce) change detection strategy, explicitly marks the view as changed so that it can be checked again.
            this.cdr.markForCheck();
        }
    }
    private onDragEnd() {
        this.toggleDragMoving(false);
        this.cdr.markForCheck(); //手动变更检测
    }

    // to save the value
    private setValue(value: SliderValue) {
        this.value = value;
        //保存好还要更新 dom， 就是 滑块和 进度条的位置
        this.updateTrackAndHandles();
    }

    // 通过value 值 来改变 dom上的变化
    // 主要就是改变 wy-slider-track 中的 wyLength属性
    //          和 wy-slider-handle 中的 wyOffset 属性
    // 这两个属性也是绑定在 wy-slider.component.html中的
    private updateTrackAndHandles() {
        // offset 就是 把 value的值转换成 dom 所需要的百分比
        this.offset = this.getValueToOffset(this.value);
        // 这里dom 发生变化 还是要手动检测
        this.cdr.markForCheck();
    }

    // 转换 value  to offset 根据传入的值 求出 dom 上 移动所需要的百分比
    private getValueToOffset(value: SliderValue): SliderValue {
        return getPercent(this.wyMin, this.wyMax, value);
    }

    //如果正在移动，用一个变量标识一下
    private toggleDragMoving(movable: boolean) {
        this.isDragging = movable;
        if (movable) {
            this.subscribeDrag(["move", "end"]); //绑定 move 和 end 事件
        } else {
            this.unSubscribeDrag(["move", "end"]); //如果没有移动，就解绑
        }
    }

    private unSubscribeDrag(event: string[]) {}

    // position / slider component length = (val - min)/(max-min)
    // 滑块当前位置 / 滑块组件总长 === (val - 最小值) / (值得范围) 以此来求得 val
    // min and max are the @Input wyMin and wyMax above, for the user to set
    // slider component length is based on the dom of this component, wySlider
    private findClosestValue(position: number): number {
        // obtain slider length
        const sliderLength = this.getSliderLength();

        // obtain slider (left, top) position 滑块(左,上）端点位置
        const sliderStart = this.getSliderStartPosition();

        // obtain position / slider component length 但是下面这一行没法用在垂直情况下
        // 查看 https://github.com/puddlejumper26/ng-wyy/issues/8
        // 因为这个时候的 sliderStart 是从 A点开始，而垂直的状况下，这个是顶点，而实际需要的应该是这个时候的B点
        // 所以这时候的 公式 求出来的就是   CA/BA 而我们需要的是 BC/BA
        // 因为这里的ratio 的值得范围就是 位于 0-1 之间，所以可以引用 limitNumberInRange
        const ratio = limitNumberInRange(
            (position - sliderStart) / sliderLength,
            0,
            1
        );
        // 所以这里调整一下
        const ratioTrue = this.wyVertical ? 1 - ratio : ratio;

        // val === ratio * (max-min) + min
        return ratio * (this.wyMax - this.wyMin) + this.wyMin;
    }

    private getSliderLength() {
        return this.wyVertical
            ? this.sliderDom.clientHeight
            : this.sliderDom.clientWidth;
    }

    private getSliderStartPosition(): number {
        const offset = getElementOffset(this.sliderDom);
        return this.wyVertical ? offset.top : offset.left;
    }
}

/**
 *   浏览器对象
 *
 *    window 对象是最顶层的对象；
 *    window 对象有6大属性，包括：document、frames、history、location、navigator、screen，这6大属性本身也是对象；
 *    window 对象下的 document 属性也是对象，并且 document 下也有5大属性（anchors、forms、images、links、location）也是对象。
 */
