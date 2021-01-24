// 注意这里是没有 { }的，不然会undefined
import queryString from 'query-string';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { map } from "rxjs/internal/operators";
import { Observable } from "rxjs";

import { API_CONFIG, ServicesModule } from "./services.module";
import { LoginParams } from "../share/wy-ui/wy-layer/wy-layer-login/wy-layer-login.component";
import { User } from "./data-types/member.type";

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
}
