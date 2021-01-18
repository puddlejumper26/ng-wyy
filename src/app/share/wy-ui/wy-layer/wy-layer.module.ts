import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd';

import { WyLayerModalComponent } from './wy-layer-modal/wy-layer-modal.component';
import { WyLayerDefaultComponent } from './wy-layer-default/wy-layer-default.component';

@NgModule({
    declarations: [WyLayerModalComponent, WyLayerDefaultComponent],
    imports: [CommonModule, NzButtonModule],
    exports: [WyLayerModalComponent, WyLayerDefaultComponent]
})
export class WyLayerModule {}
