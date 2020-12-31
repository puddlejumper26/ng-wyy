import { NgModule } from '@angular/core';

import { SongInfoComponent } from './song-info.component';
import { SongInfoRoutingModule } from './song-info-routing.module';
import { ShareModule } from 'src/app/share/share.module';

@NgModule({
  declarations: [SongInfoComponent],
  imports: [ShareModule, SongInfoRoutingModule]
})
export class SongInfoModule { }
