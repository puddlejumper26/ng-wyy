import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { WySliderStyle } from './wy-slider-types';

@Component({
  selector: 'app-wy-slider-handle',
  template: `<div class="wy-slider-handle" [ngStyle]="style"></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WySliderHandleComponent implements OnInit, OnChanges{

  /**
   * Horizontal
   *      track: width    -> to display
   *      handle: left    ->  to move
   *
   * Vertical
   *      track: height
   *      handle: bottom
   */

  @Input() wyVertical = false; // whether it is vertial, default is horizontal, so here is false
  @Input() wyOffset: number;  // slider move distance

  style: WySliderStyle = {};

  constructor() { }

  ngOnInit() {
  }

  //  monitor whether the wyOffset is changed
  ngOnChanges(changes: SimpleChanges) {
    if(changes['wyOffset']){
      this.style[ this.wyVertical ? 'bottom' : 'left'] = this.wyOffset + '%';
    }
  }
}
