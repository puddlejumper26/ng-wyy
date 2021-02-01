import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgModule } from '@angular/core';
import { NzAlertModule, NzButtonModule, NzCheckboxModule, NzFormModule, NzIconModule, NzInputModule, NzListModule, NzSpinModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { WyLayerModalComponent } from './wy-layer-modal/wy-layer-modal.component';
import { WyLayerDefaultComponent } from './wy-layer-default/wy-layer-default.component';
import { WyLayerLoginComponent } from './wy-layer-login/wy-layer-login.component';
import { WyLayerLikeComponent } from './wy-layer-like/wy-layer-like.component';

@NgModule({
    declarations: [WyLayerModalComponent, WyLayerDefaultComponent, WyLayerLoginComponent, WyLayerLikeComponent],
    // angular cdk 的拖拽功能 https://material.angular.io/cdk/drag-drop/api
    imports: [
        CommonModule,
        DragDropModule,
        NzButtonModule,
        ReactiveFormsModule,
        FormsModule,
        NzInputModule,
        NzCheckboxModule,
        NzSpinModule,
        NzAlertModule,
        NzListModule,
        NzIconModule,
        NzFormModule
    ],
    exports: [WyLayerModalComponent, WyLayerDefaultComponent, WyLayerLoginComponent, WyLayerLikeComponent]
})
export class WyLayerModule {}
