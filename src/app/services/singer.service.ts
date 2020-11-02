import { HttpClient, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { map } from "rxjs/internal/operators";
import { Observable } from "rxjs";
import queryString from "query-string";

import { API_CONFIG, ServicesModule } from "./services.module";
import { Singer } from "./data-types/common.types";

type SingerParams = {
    offset: number; //分页
    limit: number; // 每页的条数
    cat?: string;
};

// 写一个默认的参数，作为首页的列表的默认值
const defaultParams: SingerParams = {
    offset: 0,
    limit: 9,
    cat: "5001",
};

@Injectable({
    // it means ServiceModule will provide with HomeService
    // same as put HomeService into the proviers inside ServiceModule
    // casuse the second method could
    // be deleted when it is not used when tree shaking
    // tree shaking is to auto delete the module or package in the APP which is imported but not used
    providedIn: ServicesModule,
})
export class SingerService {
    constructor(
        private http: HttpClient,
        @Inject(API_CONFIG) private uri: string
    ) {}

    getEnterSinger(args: SingerParams = defaultParams): Observable<Singer[]> {
        // HttpParams Angular Client 模块的传参模式
        // 因为这里 fromString 是 一个 string 模式， 而 args 是一个 SingerParams对象
        // 所以这里用 queryStringstringify 来转换 args 序列化 Object Serialization 对象序列化
        // http://nodejs.cn/api/querystring.html#querystring_querystring_stringify_obj_sep_eq_options
        const params = new HttpParams({
            fromString: queryString.stringify(args),
        });
        return this.http
            .get(this.uri + "artist/list", { params })
            .pipe(map((res: { artists: Singer[] }) => res.artists));
    }
}
