import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { fromEvent } from 'rxjs';
import { filter } from 'rxjs/internal/operators';

  // PC上要绑定的事件
const mouse = {
  start: 'mousedown',
  move: 'mousemove',
  end: 'mouseup',
  filter: (e: MouseEvent) => e instanceof MouseEvent,
}

//手机上绑定的事件
const touch = {
  start: 'touchstart',
  move: 'touchmove',
  end: 'touchend',
  filter: (e: TouchEvent) => e instanceof TouchEvent,
}

@Component({
  selector: 'app-wy-slider',
  templateUrl: './wy-slider.component.html',
  styleUrls: ['./wy-slider.component.less'],
  // make the style could be used into the children components, work as globle style rules
  // https://angular.cn/guide/component-styles#view-encapsulation
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WySliderComponent implements OnInit {

/**
 *  Here we need to control the slider handle and check the slider track
 *  therefore we need to monitor the template
 *
 *  method 1  inject  -> private el: ElementRef  inside the constructor
 *
 *  method 2  inside template <#wySlider>
 *             inside ts
 *                      @ViewChild('wySlider') private wySlider: ElementRef
 */

  // https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLDivElement
  // 提供了一些特殊属性（它也继承了通常的 HTMLElement 接口）来操作 <div> 元素。
  private sliderDom: HTMLDivElement;

 @ViewChild('wySlider', { static: true }) private wySlider: ElementRef;

  constructor() {
   }

  ngOnInit() {
    // console.log(1111, this.wySlider.nativeElement);
    this.sliderDom = this.wySlider.nativeElement;
    this.createDraggingObservables();
  }

/**
 *  pc: mousedown mousemove mouseup  - MouseEvent
 *      obtain mouse position
 *        event.pageX || event.pageY
 *
 *  mobile: touchestart touchmove touchend  - TouchEvent
 *      obtain touch position
 *          event.touchs[0].pageX || event.touchs[0].pageY
 */


 private createDraggingObservables() {

   [mouse, touch].forEach(source => {
     //取出 mouse 和 touch 的属性
      const { start, move, end, filter } = source;
      // fromEvent 第一个参数是传一个容器， start 是事件
      fromEvent(this.sliderDom, start).pipe(filter(filter))
   });

 }

}
