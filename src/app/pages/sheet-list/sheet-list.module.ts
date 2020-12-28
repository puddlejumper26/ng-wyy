import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShareModule } from 'src/app/share/share.module';
import { SheetListComponent } from './sheet-list.component';
import { SheetListRoutingModule } from './sheet-list-routing.module';


@NgModule({
    declarations: [SheetListComponent],
    imports: [ShareModule, SheetListRoutingModule],
})
export class SheetListModule {}
