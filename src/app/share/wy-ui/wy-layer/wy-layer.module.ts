import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgModule } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd';

import { WyLayerModalComponent } from './wy-layer-modal/wy-layer-modal.component';
import { WyLayerDefaultComponent } from './wy-layer-default/wy-layer-default.component';
import { WyLayerLoginComponent } from './wy-layer-login/wy-layer-login.component';

@NgModule({
    declarations: [WyLayerModalComponent, WyLayerDefaultComponent, WyLayerLoginComponent],
    // angular cdk 的拖拽功能 https://material.angular.io/cdk/drag-drop/api
    imports: [CommonModule, DragDropModule, NzButtonModule],
    exports: [WyLayerModalComponent, WyLayerDefaultComponent, WyLayerLoginComponent]
})
export class WyLayerModule {}
