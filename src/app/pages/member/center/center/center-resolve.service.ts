import { Injectable } from '@angular/core';
import { first } from 'rxjs/internal/operators';
import { Observable, forkJoin } from 'rxjs';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';

import { RecordVal, User, UserSheet } from './../../../../services/data-types/member.type';
import { MemberService } from 'src/app/services/member.service';

type CenterDataType = [User, RecordVal[], UserSheet];

@Injectable()
export class CenterResolveService implements Resolve<CenterDataType> {
    constructor(
        private memeberServe: MemberService,
        private router: Router,
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<CenterDataType> {
        // 参数是一个 路由快照ActivatedRouteSnapshot，可以拿到uid
        const uid = route.paramMap.get('id');
        if(uid) {
            return forkJoin([
                this.memeberServe.getUserDetail(uid),
                this.memeberServe.getUserRecord(uid),
                this.memeberServe.getUserSheets(uid),
            ]).pipe(first());
        }else {
            // 否则就导航到首页
            this.router.navigate(['/home']);
        }
    }
}
