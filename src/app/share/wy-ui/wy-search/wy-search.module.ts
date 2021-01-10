import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzIconModule, NzInputModule } from 'ng-zorro-antd';
import { OverlayModule } from '@angular/cdk/overlay';

import { WySearchComponent } from './wy-search.component';
import { WySearchPanelComponent } from './wy-search-panel/wy-search-panel.component';

@NgModule({
    declarations: [WySearchComponent, WySearchPanelComponent],
    imports: [CommonModule, NzIconModule, NzInputModule, OverlayModule],
    // https://material.angular.cn/cdk/portal/overview
    // 用于从某个组件类创建门户。当使用门户动态创建组件时，必须把该组件包含在 NgModule 的 entryComponents 中。
    entryComponents: [WySearchPanelComponent],
    exports: [WySearchComponent]
})
export class WySearchModule {}
