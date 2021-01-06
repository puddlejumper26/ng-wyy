import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WySearchComponent } from './wy-search.component';
import { NzIconModule, NzInputModule } from 'ng-zorro-antd';
import { WySearchPanelComponent } from './wy-search-panel/wy-search-panel.component';

@NgModule({
    declarations: [WySearchComponent, WySearchPanelComponent],
    imports: [CommonModule, NzIconModule, NzInputModule],
    exports: [WySearchComponent]
})
export class WySearchModule {}
