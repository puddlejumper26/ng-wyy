import { select, Store } from '@ngrx/store';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { AppStoreModule } from './../../../../store/index';
import { getMember, getModalVisible, getModalType } from './../../../../store/selectors/member.selector';

@Component({
  selector: 'app-wy-layer-modal',
  templateUrl: './wy-layer-modal.component.html',
  styleUrls: ['./wy-layer-modal.component.less'],

//   注意这里是 OnPush的策略， 考虑到因为是登录才需要，所以其他时候不需要对这里的检测
  changeDetection: ChangeDetectionStrategy.OnPush
})

/**
 *      这里会有对ngrx member.selector, reducer and acitons 的监听，和player那里是一样的
 */

export class WyLayerModalComponent implements OnInit {

  constructor(
      private store$: Store<AppStoreModule>
  ) {
      const appStore$ = this.store$.pipe(select(getMember));
      appStore$.pipe(select(getModalVisible)).subscribe( visible => {
        //   console.log('【WyLayerModalComponent】- constructor - visible - ', visible)
      });
      appStore$.pipe(select(getModalType)).subscribe( type => {
        // console.log('【WyLayerModalComponent】- constructor - type - ', type)
    });
  }

  ngOnInit() {
  }

}
