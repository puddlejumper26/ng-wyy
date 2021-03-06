import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
} from "@angular/core";

import { WySliderStyle } from "./wy-slider-types";

@Component({
    selector: "app-wy-slider-track",
    template: `<div class="wy-slider-track" [class.buffer]="wyBuffer" [ngStyle]="style"></div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WySliderTrackComponent implements OnInit, OnChanges {
    /**
     * Horizontal
     *      track: width    -> to display
     *      handle: left    ->  to move
     *
     * Vertical
     *      track: height
     *      handle: bottom
     */

    @Input() wyVertical = false;
    @Input() wyLength: number;  //滑块要移动的距离 和 slider-handle 中wyOffset一样
    // 这里才有， slider-handle 中就没有 从 slider.component.html中获得，
    // 和模板中的[class.buffer]="wyBuffer"进行绑定，就能显示缓冲条了
    // 这里的wyBuffer和slider.component.html 中的 [wyBuffer]="true" 控制是否显示 缓冲条
    //  具体缓冲条的位置计算 要在 wy-player.component中 onTimeUpdate 中进行计算
    @Input() wyBuffer = false;
    // 通过 angular自身的 [ngStyle] 来将这个变化传给组件，
    // 这里需要定义WySliderStyle，不然下面的赋值会出错
    style: WySliderStyle = {};

    constructor() {}

    ngOnInit() {}

    // 这里的意思就是如果滑块的wyLength发生变化，
    // 垂直
    // 就改变这个组件 height 的值，并且把另外left和width设为null ==>避免切换时发生问题
    // 水平
    // 就改变这个组件width的值，并且把另外的bottom和height设为null
    ngOnChanges(changes: SimpleChanges): void {
        if (changes["wyLength"]) {
            if (this.wyVertical) {
                this.style.height = this.wyLength + "%";
                this.style.left = null;
                this.style.width = null;
            } else {
                this.style.width = this.wyLength + "%";
                this.style.bottom = null;
                this.style.height = null;
            }
        }
    }
}
