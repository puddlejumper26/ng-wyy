import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CenterComponent } from './center/center.component';
import { CenterResolveService } from './center/center/center-resolve.service';
import { RecordDetailComponent } from './record-detail/record-detail.component';
import { RecordResolveService } from './record-detail/record-resolve.service';

const routes: Routes = [
    { path: 'member/:id', component: CenterComponent, data: { title: '个人中心' }, resolve: { user: CenterResolveService} },
    // 下面这个如果还用CenterResolveService的话，那么当点击查看更多链接的时候，在 network中就会多发一次请求
    // { path: 'records/:id', component: RecordDetailComponent, data: { title: '听歌记录' }, resolve: { user: CenterResolveService} },
    { path: 'records/:id', component: RecordDetailComponent, data: { title: '听歌记录' }, resolve: { user: RecordResolveService} },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [ CenterResolveService, RecordResolveService ],
})
export class MemberRoutingModule { }
