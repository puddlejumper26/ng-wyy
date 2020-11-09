import {
    Component,
    OnInit,
    ViewEncapsulation,
    ChangeDetectionStrategy,
    ViewChild,
    ElementRef,
    AfterViewInit,
    Input,
    OnChanges,
    SimpleChanges,
    EventEmitter,
    Output,
} from "@angular/core";
import BScroll from "@better-scroll/core";
import ScrollBar from "@better-scroll/scroll-bar";
import MouseWheel from '@better-scroll/mouse-wheel';

//https://better-scroll.github.io/docs/en-US/plugins/scroll-bar.html#usage
// 在 ngAfterViewInit 中 初始化
BScroll.use(ScrollBar);

//https://better-scroll.github.io/docs/en-US/plugins/mouse-wheel.html#basic-usage
BScroll.use(MouseWheel);

@Component({
    selector: "app-wy-scroll",
    template: `
        <div class="wy-scroll" #wrap>
            <ng-content></ng-content>
        </div>
    `,
    styles: [
        `
            .wy-scroll {
                width: 100%;
                height: 100%;
                overflow: hidden;
            }
        `,
    ], //让外界去决定其宽高
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WyScrollComponent implements OnInit, AfterViewInit, OnChanges {
    @Input() data: any[];
    @Input() refreshDelay = 50; //延迟50毫秒刷新

    @Output() private onScrollEnd = new EventEmitter<number>();

    private bs: BScroll;

    @ViewChild("wrap", { static: true }) private wrapRef: ElementRef;

    constructor() {}

    ngOnInit() {}

    // 初始化插件
    ngAfterViewInit() {
        // console.log(11111, this.wrapRef.nativeElement.offsetHeight);
        this.bs = new BScroll(this.wrapRef.nativeElement, {
            //https://better-scroll.github.io/docs/en-US/plugins/scroll-bar.html#scrollbar-options
            //设置Scrollbar， 这一步在上一个commit中就做过了
            scrollbar: {
                interactive: true,
            },
            // 设置鼠标滚轮，这一步在上一个commit中就做过了， 都用默认值就好了
            mouseWheel: {},
        });
        this.bs.on("scrollEnd", ({ y }) => this.onScrollEnd.emit(y));
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes["data"]) {
            // 如果 data改变的话，就刷新一下
            this.refreshScroll();
        }
    }

    private refresh() {
        console.log("refresh");
        this.bs.refresh();
    }
    //因为上面的ngAfterViewInit代码导致我们已进入页面，就初始化了BScroll，并且高度是0，所以这个时候是没法滚动的
    // 所以在面板显示的时候要刷新BScroll插件  使用 BScroll 提供的 refresh() 方法
    // https://better-scroll.github.io/docs/en-US/guide/base-scroll-api.html#methods

    // 面板的消失隐藏，播放列表的更新等 ，都需要刷新BScroll， 但是刷新一定要在改变结束之后
    refreshScroll() {
        // 不能直接  this.bs.refresh()， 因为有一定的延迟
        setTimeout(() => {
            this.refresh();
        }, this.refreshDelay);
    }
}
