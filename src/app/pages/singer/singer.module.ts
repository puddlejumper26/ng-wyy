import { NgModule } from '@angular/core';

import { SingerDetailComponent } from './singer-detail/singer-detail.component';
import { SingerRoutingModule } from './singer-routing.module';
import { ShareModule } from 'src/app/share/share.module';


@NgModule({
  declarations: [SingerDetailComponent],
  imports: [
    ShareModule,
    SingerRoutingModule
  ]
})
export class SingerModule { }
