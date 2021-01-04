import { HttpClient, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { map } from "rxjs/internal/operators";
import { Observable } from "rxjs";
import queryString from "query-string";

import { API_CONFIG, ServicesModule } from "./services.module";
import { Singer, SingerDetail } from "./data-types/common.types";

type SingerParams = {
    offset: number; //分页
    limit: number; // 每页的条数
    area?: number;
};

// 写一个默认的参数，作为首页的列表的默认值
// 这里仅仅是设定一个默认值，那么每次打开都是这个值
const defaultParams: SingerParams = {
    offset: 0,
    limit: 9,
    area: 96, //这里设定 5001 是因为 网易云API的设定, 数字带来的具体细节不同，看 ISSUE 5
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

    // 入驻歌手
    getEnterSinger(args: SingerParams = defaultParams): Observable<Singer[]> {
        // HttpParams Angular Client 模块的传参模式
        // console.log(111111);
        // 因为这里 fromString 是 一个 string 模式， 而 args 是一个 SingerParams对象
        // 所以这里用 queryString.stringify 来转换 args 序列化 Object Serialization 对象序列化
        // http://nodejs.cn/api/querystring.html#querystring_querystring_stringify_obj_sep_eq_options
            // querystring.stringify({ foo: 'bar', baz: ['qux', 'quux'], corge: '' });
            // 返回 'foo=bar&baz=qux&baz=quux&corge='
        const params = new HttpParams({
            fromString: queryString.stringify(args),
        });

        // console.log('params', params);
        // console.log('this.uri + "artist/list", { params } --- ', (this.uri + "artist/list"));

        // get 的一个参数必须是 HttpParams 类型的  params?: HttpParams | {[param: string]: string | string[];};

        return this.http
            // .get(this.uri + "artist/list?offset=0&limit=9&cat=5002")
            .get(this.uri + 'artist/list', { params })
            .pipe(map((res: { artists: Singer[] }) => res.artists));
    }

    // 获取歌手详情和热门歌曲
    getSingerDetail(id: string): Observable<SingerDetail> {
        const params = new HttpParams().set('id', id);
        return this.http
            .get(this.uri + 'artists', {params})
            .pipe(map(res => res as SingerDetail));
    }

    // 获取相似歌手
    getSimiSinger(id: string): Observable<Singer[]> {
        const params = new HttpParams().set('id', id);
        return this.http
            .get(this.uri + 'simi/artist', {params})
            // 注意这里的 artists 是根据 localhost:3000/ 中的 JSON 数据接口中有 data 属性，所以这样定义才能接受到数据
            .pipe(map( (res: { artists: Singer[] }) => res.artists ));
    }
}
