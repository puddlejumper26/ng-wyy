import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { first } from 'rxjs/internal/operators';

import { Singer } from 'src/app/services/data-types/common.types';
import { SingerDetail } from '../../../services/data-types/common.types';
import { SingerService } from '../../../services/singer.service';

type SingerDetailDataModel = SingerDetail; // 为Singer[]需要登录才能用的上，目前我们先用一个就好

// 因为这个页面需要两个接口，所以这里的类型是一个组合的类型

// 和home的守卫是一样的

@Injectable()
export class SingerResolverService implements Resolve<SingerDetailDataModel> {
    constructor(private singerServe: SingerService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<SingerDetailDataModel> {
        // 注意这里获取 id 的方式
        // console.log('【SingerResolverService】 - resolve - route.paramMap.get("id") - ', route.paramMap.get('id'))
        // 拿到url数据中的id, route.paramMap.get('id') 得到的是一个string，所以要用Number
        const id = route.paramMap.get('id');
        // return forkJoin([
        //     this.singerServe.getSingerDetail(id),
        //     this.singerServe.getSimiSinger(id),
        // ]).pipe(first());
        return this.singerServe.getSingerDetail(id);
    }
}
