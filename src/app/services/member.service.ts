// 注意这里是没有 { }的，不然会undefined
import queryString from 'query-string';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { map } from "rxjs/internal/operators";
import { Observable } from "rxjs";

import { API_CONFIG, ServicesModule } from "./services.module";
import { LoginParams } from "../share/wy-ui/wy-layer/wy-layer-login/wy-layer-login.component";
import { RecordVal, SampleBack, Signin, User, UserRecord, UserSheet } from "./data-types/member.type";
import { SongSheet } from './data-types/common.types';

export enum RecordType {
    allData,
    weekData,
};

export type LikeSongParams = {
    pid: string;
    tracks: string;
}

// const records = ['allData', 'weekData'];
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

    // 签到
    signin(): Observable<Signin> {
        // 这里暂时用 type: 1 是PC的签到
        const params = new HttpParams({ fromString: queryString.stringify({ type: 1})})
        return this.http.get(this.uri + 'daily_signin', { params })
            .pipe(map(res => res as Signin))
    }

    // 听歌记录， 放在个人主页上的
    //  type 因为 分为 一周的还有所有时间, 默认是一周的
    // 这里用 allData， 因为使用的模拟账户很可能在一周内没有听歌记录
    getUserRecord(uid: string, type = RecordType.allData): Observable<RecordVal[]> {
        const params = new HttpParams({ fromString: queryString.stringify({ uid, type })});
        return this.http.get(this.uri + "user/record", { params })
            .pipe(map((res: UserRecord) => res[RecordType[type]]))
    }

    // 用户歌单
    getUserSheets(uid: string): Observable<UserSheet> {
        const params = new HttpParams({ fromString: queryString.stringify({ uid })});
        return this.http.get(this.uri + "user/playlist", { params })
            .pipe(map((res: { playlist: SongSheet[]}) => {
                const list = res.playlist;
                return {
                    self: list.filter(item => !item.subscribed),
                    subscribed: list.filter(item => item.subscribed)
                };
            }))
    }

    // 收藏歌曲的接口 playlist/tracks
    likeSong({pid, tracks}: LikeSongParams): Observable<number> {
        const params = new HttpParams({ fromString: queryString.stringify({ pid, tracks, op: 'add' })});
        return this.http.get(this.uri + "playlist/tracks", { params })
            .pipe(map((res: SampleBack) => res.code))
    }

    // 新建歌单
    createSheet(name: String): Observable<string> {
        const params = new HttpParams({ fromString: queryString.stringify({ name })});
        return this.http.get(this.uri + "playlist/create", { params })
            .pipe(map((res: SampleBack) => res.id.toString()))
    }
}
