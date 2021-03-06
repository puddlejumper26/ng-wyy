import { HttpClient, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { map, mergeMap, pluck, switchMap } from "rxjs/internal/operators";
import { Observable } from "rxjs";
import queryString from 'query-string';

import { API_CONFIG, ServicesModule } from "./services.module";
import { SheetList, Song, SongSheet } from "./data-types/common.types";
import { SongService } from "./song.service";

/**
 *    This service could not obtain the tracks play address播放地址,
 *     therefore it has to be used together with
 *                                  song.service.ts
 */

// 为何如此定义可以看这里
// https://binaryify.github.io/NeteaseCloudMusicApi/#/?id=%e6%ad%8c%e5%8d%95-%e7%bd%91%e5%8f%8b%e7%b2%be%e9%80%89%e7%a2%9f-
export type SheetParams = {
    cat: string;
    order: 'new' | 'hot';
    offset: number;
    limit: number;
}

@Injectable({
    // it means ServiceModule will provide with HomeService
    // same as put HomeService into the proviers inside ServiceModule
    // casuse the second method could
    // be deleted when it is not used when tree shaking
    // tree shaking is to auto delete the module or package in the APP which is imported but not used
    providedIn: ServicesModule,
})
export class SheetService {
    constructor(
        private http: HttpClient,
        @Inject(API_CONFIG) private uri: string,
        private songServe: SongService
    ) {}


    // 获取歌单详情
    // 因为不能调用歌曲的地址，所以如果 home.component.ts里直接对这个方法进行调用是没有用的， 应该调用下面的palySheet的方法
    getSongSheetDetail(id: number): Observable<SongSheet> {

        // const params = new HttpParams({fromString : queryString.stringify(id)});

        // because here is a single variable, here is the alternative

        const params = new HttpParams().set("id", id.toString());
        return this.http
            .get(this.uri + "playlist/detail", { params })  // e.g. http://localhost:3000/playlist/detail?id=2829821753
            .pipe(map((res: { playlist: SongSheet }) => res.playlist));
    }

    // this.getSongSheetDetail(id) 是得到了playlist, 但是playlist中我们只需要tracks下面的信息
    // 还需要继续请求每一首歌的url, 使用 pluck()来筛选出来 tracks的属性
    // 然后用 switchMap 来 请求每一个 track 的播放地址
    // 播放地址的方法是在song.service.ts

    // 这里的 id 是 推荐专辑的 id 号
    playSheet(id: number): Observable<Song[]> {
        return this.getSongSheetDetail(id).pipe(
            pluck("tracks"),
            switchMap((tracks) => this.songServe.getSongList(tracks))
        );
    }

    // 获取歌单列表sheet list, 参考 singer.service.ts 中的设定
    getSheets(args: SheetParams): Observable<SheetList> {
        const params = new HttpParams({ fromString: queryString.stringify(args)});
        return this.http
                .get(this.uri + 'top/playlist', {params})
                // 这里用 map 来指明类型
                .pipe(map(res => res as SheetList));
    }
}

/**
 *   pluck()
 *
 *  // RxJS v6+
    import { from } from 'rxjs';
    import { pluck } from 'rxjs/operators';

    const source = from([{ name: 'Joe', age: 30 }, { name: 'Sarah', age: 35 }]);
    // 提取 name 属性
    const example = source.pipe(pluck('name'));
    // 输出: "Joe", "Sarah"
    const subscribe = example.subscribe(val => console.log(val));
 *
 */

 /**
  *   switchMap()   mergeMap()
  *
  *    https://rxjs-cn.github.io/learn-rxjs-operators/operators/transformation/switchmap.html
  *
  *    映射成 observable，完成前一个内部 observable，发出值。
  *    在每次发出时，会取消前一个内部 observable (你所提供函数的结果) 的订阅，
  *   然后订阅一个新的 observable 。你可以通过短语切换成一个新的 observable来记忆它。
  *
  */
