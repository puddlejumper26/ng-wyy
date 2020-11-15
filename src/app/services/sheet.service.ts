import { SongService } from "./song.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { map, mergeMap, pluck, switchMap } from "rxjs/internal/operators";
import { Observable } from "rxjs";

import { API_CONFIG, ServicesModule } from "./services.module";
import { Song, SongSheet } from "./data-types/common.types";

/**
 *    This service could not obtain the tracks play address播放地址,
 *     therefore it has to be used together with
 *                                  song.service.ts
 */

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


    // 因为不能调用歌曲的地址，所以如果 home.component.ts里直接对这个方法进行调用是没有用的， 应该调用下面的palySheet的方法
    getSongSheetDetail(id: number): Observable<SongSheet> {

        // const params = new HttpParams({fromString : queryString.stringify(id)});

        // because here is a single variable, here is the alternative

        const params = new HttpParams().set("id", id.toString());
        return this.http
            .get(this.uri + "playlist/detail", { params })
            .pipe(map((res: { playlist: SongSheet }) => res.playlist));
    }

    // this.getSongSheetDetail(id) 是得到了playlist, 但是playlist中我们只需要tracks下面的信息
    // 还需要继续请求每一首歌的url, 使用 pluck()来筛选出来 tracks的属性
    // 然后用 switchMap 来 请求每一个 track 的播放地址
    // 播放地址的方法是在song.service.ts
    playSheet(id: number): Observable<Song[]> {
        return this.getSongSheetDetail(id).pipe(
            pluck("tracks"),
            switchMap((tracks) => this.songServe.getSongList(tracks))
        );
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