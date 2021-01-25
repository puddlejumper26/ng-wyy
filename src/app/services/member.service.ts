// 注意这里是没有 { }的，不然会undefined
import queryString from 'query-string';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { map } from "rxjs/internal/operators";
import { Observable } from "rxjs";

import { API_CONFIG, ServicesModule } from "./services.module";
import { LoginParams } from "../share/wy-ui/wy-layer/wy-layer-login/wy-layer-login.component";
import { SampleBack, User } from "./data-types/member.type";

@Injectable({
    // it means ServiceModule will provide with HomeService
    // same as put HomeService into the proviers inside ServiceModule
    // casuse the second method could
    // be deleted when it is not used when tree shaking
    // tree shaking is to auto delete the module or package in the APP which is imported but not used
    providedIn: ServicesModule,
})
export class MemberService {
    constructor(
        private http: HttpClient,
        @Inject(API_CONFIG) private uri: string
    ) {}

    login(formValue: LoginParams): Observable<User> {
        const params = new HttpParams({ fromString: queryString.stringify(formValue)})
        return this.http.get(this.uri + "login/cellphone", { params })
            // .pipe(map((res: { profile: User }) => res.profile))
            //  因为之后的User中可能会有除了profile以外的属性也会使用，所以这里改变一下
            .pipe(map((res) => res as User))
    }

    // 获取用户详情, 需要的是一个uid
    // https://github.com/puddlejumper26/ng-wyy/issues/19#issuecomment-766440990
    getUserDetail(uid: string): Observable<User>{
        const params = new HttpParams({ fromString: queryString.stringify({ uid })})
        return this.http.get(this.uri + "user/detail", { params })
            .pipe(map((res) => res as User))
    }

    // 退出接口
    // https://github.com/puddlejumper26/ng-wyy/issues/19#issuecomment-766449849
    // 返回的是状态码
    logout(): Observable<SampleBack> {
        return this.http.get(this.uri + "logout")
            .pipe(map(res => res as SampleBack))
    }
}
