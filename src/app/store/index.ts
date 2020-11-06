import { environment } from './../../environments/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { playerReducer, PlayState } from './reducers/player.reducer';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    //https://next.ngrx.io/guide/store/configuration/runtime-checks#configuring-runtime-checks
    StoreModule.forRoot({ play: playerReducer}, {
      //检测这些操作是否合法
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
        strictStateSerializability: true,
        strictActionSerializability: true,
      },
    }),
    // 这个是 安装的  ng add @ngrx/store-devtools
    StoreDevtoolsModule.instrument({
      maxAge: 20,   //最多纪录20条
      logOnly: environment.production      //在生产的环境下生效，开发的环境下需要更多的功能
    })
  ]
})
export class AppStoreModule { }


/**
 @NgModule({
  imports: [
    StoreModule.forRoot(reducers, {
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
        strictStateSerializability: true,
        strictActionSerializability: true,
        strictActionWithinNgZone: true,
        strictActionTypeUniqueness: true,
      },
    }),
  ],
})
export class AppModule {}
 */