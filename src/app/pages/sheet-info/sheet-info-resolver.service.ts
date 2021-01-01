import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SheetService } from 'src/app/services/sheet.service';
import { SongSheet } from 'src/app/services/data-types/common.types';

@Injectable()
export class SheetInfoResolverService implements Resolve<SongSheet> {
    constructor(private sheetServe: SheetService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<SongSheet> {
        // 注意这里获取 id 的方式
        // console.log('【SheetInfoResolverService】 - resolve - route.paramMap.get("id") - ', route.paramMap.get('id'))
        // 拿到url数据中的id Number(route.paramMap.get('id')) 得到的是一个string，所以要用Number
        return this.sheetServe.getSongSheetDetail(Number(route.paramMap.get('id')));
    }
}
