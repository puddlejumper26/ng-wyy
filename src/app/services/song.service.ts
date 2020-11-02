import { HttpClient, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { map } from "rxjs/internal/operators";
import { Observable, Observer } from "rxjs";

import { API_CONFIG, ServicesModule } from "./services.module";
import { Song, SongUrl } from "./data-types/common.types";

/**
 *    This should be used together with
 *                                  sheet.service.ts
 */

@Injectable({
    providedIn: ServicesModule,
})
export class SongService {
    constructor(
        private http: HttpClient,
        @Inject(API_CONFIG) private uri: string
    ) {}

    //根据 网易云的API， 接口可以同时获取多个歌曲的播放地址，所以这里接受的是一个 string
    getSongUrl(ids: string): Observable<SongUrl[]> {
        const params = new HttpParams().set("id", ids);
        return this.http
            .get(this.uri + "song/url", { params })
            .pipe(map((res: { data: SongUrl[] }) => res.data));
    }

    // parameter could be one single sone, could a songs array
    // 参数是 单个的一首歌，也可以是歌曲组成的数组, 因为可以播放一个歌单，也可能是播放一首歌
    getSongList(songs: Song | Song[]): Observable<Song[]> {
        //  先不管传入是什么格式，都转换成数组
        // slice() 避免引用的问题
        const songArr = Array.isArray(songs) ? songs.slice() : [songs];
        // 需要把songs的每一个id 组成一个 字符串
        const ids = songArr.map((item) => item.id).join(",");
        // new Observable可以创造一个流
        return new Observable((observer: Observer<any>) => {
            // 这一步调用出来就是  data : [{id:  , url: , br: , .....}] https://github.com/puddlejumper26/ng-wyy/issues/7
            this.getSongUrl(ids).subscribe((urls) => {
                // next 方式 是让订阅的地方能够拿到这个流
                observer.next(this.generateSongList(songArr, urls));
            });
        });

        // Here is the simplied method, without creating a flow
        // 这里是简化的方法，不用创建流
        // return this.getSongUrl(ids).pipe(map(urls => this.generateSongList(songArr, urls)))
    }

    // 拼接的方法 ， 注意这里返回的是普通的 一个 Song[]， 而getSongList 返回的是一个 Observable
    // 拼接 歌单详情 和 URL 两个在一起
    private generateSongList(songs: Song[], urls: SongUrl[]): Song[] {
        const result = [];
        songs.forEach((song) => {
            const url = urls.find((url) => url.id === song.id).url; //根据ID能找到每一首歌的url
            if (url) {
                result.push({ ...song, url }); //这里的result就是 两个拼接的结果，并且类型是 Song[]
            }
        });
        return result;
    }
}
