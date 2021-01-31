import { Injectable } from '@angular/core';
import { first } from 'rxjs/internal/operators';
import { Observable, forkJoin } from 'rxjs';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';

import { MemberService } from 'src/app/services/member.service';
import { RecordVal, User } from 'src/app/services/data-types/member.type';

type CenterDataType = [User, RecordVal[]];

/**
 *    和 center-resolve 是一样的，不重复在 member-routing中进行使用的原因是，
 *    会多发一次请求， 可以看一下member-routing中的comment
 */

@Injectable()
export class RecordResolveService implements Resolve<CenterDataType> {
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
            ]).pipe(first());
        }else {
            // 否则就导航到首页
            this.router.navigate(['/home']);
        }
    }
}
