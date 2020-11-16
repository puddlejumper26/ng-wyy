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
    selector: "app-wy-slider-handle",
    template: `<div class="wy-slider-handle" [ngStyle]="style"></div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WySliderHandleComponent implements OnInit, OnChanges {
    /**
     * Horizontal
     *      track: width    -> to display
     *      handle: left    ->  to move
     *
     * Vertical
     *      track: height
     *      handle: bottom
     */

     // 联系到父级组件 wy-slider.component.html
    @Input() wyVertical = false; // whether it is vertial, default is horizontal, so here is false
    @Input() wyOffset: number; // slider move distance，移动的距离，和 slider-track 中的wyLength一样

    style: WySliderStyle = {}; // 通过 angular自身的 [ngStyle] 来将这个变化传给组件

    constructor() {}

    ngOnInit() {}

    //  monitor whether the wyOffset is changed
    // 这里的意思就是如果滑块的wyOffset发生变化，那么就同时改变这个组件的bottom或者left的值，根据是否垂直的情况
    ngOnChanges(changes: SimpleChanges) {
        if (changes["wyOffset"]) {
            this.style[this.wyVertical ? "bottom" : "left"] = this.wyOffset + "%";
        }
    }
}
