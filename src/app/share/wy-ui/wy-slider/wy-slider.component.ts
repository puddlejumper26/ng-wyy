import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';

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

  constructor() { }

  ngOnInit() {
  }

}
