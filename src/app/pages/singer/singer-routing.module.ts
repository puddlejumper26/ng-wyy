import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SingerDetailComponent } from './singer-detail/singer-detail.component';


const routes: Routes = [{
    path: 'singer/:id', component: SingerDetailComponent, data: { title: '歌手详情' }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SingerRoutingModule { }
