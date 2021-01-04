import { HttpClient, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { map } from "rxjs/internal/operators";
import { Observable, Observer } from "rxjs";

import { API_CONFIG, ServicesModule } from "./services.module";
import { Lyric, Song, SongUrl } from "./data-types/common.types";

/**
 *    This should be used together with
 *                                  sheet.service.ts
 *
 *              这个service的主要作用就是 通过 传进来一个（多个） 歌曲的 id
 *              来得到这些歌曲的 播放地址 url
 */

@Injectable({
    providedIn: ServicesModule,
})
export class SongService {
    constructor(
        private http: HttpClient,
        @Inject(API_CONFIG) private uri: string
    ) {}

    // parameter could be one single sone, could a songs array
    // 参数是 单个的一首歌，也可以是歌曲组成的数组, 因为可以播放一个歌单，也可能是播放一首歌
    getSongList(songs: Song | Song[]): Observable<Song[]> {
        //  先不管传入是什么格式，都转换成数组
        // slice() 避免引用的问题,
        // slice()是浅复制，所以相当于是songs数组的一个副本，但是地址不同，值的改变不会影响songs数组本身
        // console.log('songs', songs);
        const songArr = Array.isArray(songs) ? songs.slice() : [songs];
        // console.log('songArr', songArr);

        // 需要把songs的每一个id 组成一个 字符串
        //这里把这个songArr数组中每个元素里的id属性的值练成了一个整体，
        const ids = songArr.map((item) => item.id).join(",");
        // console.log('ids', ids );  看下面的解释
        //  console.log('this.getSongUrl(ids)', this.getSongUrl(ids));

        // new Observable可以创造一个流
        // return new Observable((observer: Observer<any>) => {
        //     // 这一步调用出来就是  data : [{id:  , url: , br: , .....}] https://github.com/puddlejumper26/ng-wyy/issues/7
        //     this.getSongUrl(ids).subscribe((urls) => {
        //         // observer.next
        //         // next 方式 是让订阅的地方能够拿到这个流
        //         observer.next(this.generateSongList(songArr, urls));
        //     });
        // });

        //         Here is the simplied method, without creating a flow
        // 这里是简化的方法，不用创建流

        return this.getSongUrl(ids).pipe(
            map((urls) => this.generateSongList(songArr, urls))
        );
    }

    //根据 网易云的API， 接口可以同时获取多个歌曲的播放地址，所以这里接受的是一个 string
    getSongUrl(ids: string): Observable<SongUrl[]> {
        const params = new HttpParams().set("id", ids);
        return this.http
            .get(this.uri + "song/url", { params })
            // 注意这里的 data 是根据 localhost:3000/ 中的 JSON 数据接口中有 data 属性，所以这样定义才能接受到数据
            .pipe(map((res: { data: SongUrl[] }) => res.data));
    }

    // 拼接的方法 ， 注意这里返回的是普通的 一个 Song[]， 而getSongList 返回的是一个 Observable
    // 拼接 歌单详情 和 URL 两个在一起
    private generateSongList(songs: Song[], urls: SongUrl[]): Song[] {
        const result = [];
        songs.forEach((song) => {
            // console.log('【SongService】- generateSongList - urls -', urls);
            const url = urls.find((url) => url.id === song.id).url; //根据ID能找到每一首歌的url
            if (url) {
                // console.log('【SongService】- generateSongList - ...song', song);
                // console.log('【SongService】- generateSongList - url-', url);
                result.push({ ...song, url }); //这里的result就是 两个拼接的结果，并且类型是 Song[]
            }
        });
        // console.log('result', result);  // 看下面的解释
        return result;
    }

    //获取歌词的接口
    getLyric(id: number): Observable<Lyric> {
        const params = new HttpParams().set("id", id.toString());
        // console.log('getLyric---params', params);
        return this.http
            .get(this.uri + "lyric", { params })
            // .pipe(map((res) => <Lyric>res));// 这里是全部都返回，是不准确的
            .pipe(map( (res: { [key: string]: { lyric: string}}) => {
                try{
                    return {
                        lyric: res.lrc.lyric,
                        tlyric: res.tlyric.lyric,
                    }
                } catch (error){
                    return {
                        lyric: '',
                        tlyric: '',
                    }
                }
            }))
    }

    // 获取歌曲详情
    getSongDetail(ids: string): Observable<Song> {
        const params = new HttpParams().set('ids', ids);
        return this.http
            .get(this.uri + 'song/detail', { params })
            .pipe(map((res: { songs: Song }) => res.songs[0]))
    }
}


/**
 *    上面的 result的 结果
 *      注意 id 的值
 *    e.g.
 *   [
 *    0: {name: "Españoleta", id: 565094501, pst: 0, t: 0, ar: Array(2), …}
      1: {name: "Ordinary Pleasure", id: 1340006976, pst: 0, t: 0, ar: Array(1), …}
      2: {name: "Brahms : Wiegenlied In E Flat Major Op.49-4 (브람스 : 자장가 내림 마장조 작품번호 49-4)(Sea Ver.) ", id: 481849109, pst: 0, t: 0, ar: Array(1), …}
      3: {name: "Goldberg Variations, BWV 988: Variation 2", id: 342049, pst: 0, t: 0, ar: Array(1), …}
      4: {name: "Sixteen Waltzes, Op. 39: Waltz No. 15 in A Major", id: 564964631, pst: 0, t: 0, ar: Array(2), …}
      5: {name: "Les débutants 2", id: 19077239, pst: 0, t: 0, ar: Array(1), …}
      6: {name: "2M1", id: 1083043, pst: 0, t: 0, ar: Array(1), …}
    ]
 */

 /**
  *    上面的 songArr 的结果  和 songs 的结果相同
  *      注意 id 的值
  *    e.g.
  *   [
  *    0: {name: "Españoleta", id: 565094501, pst: 0, t: 0, ar: Array(2), …}
      1: {name: "Ordinary Pleasure", id: 1340006976, pst: 0, t: 0, ar: Array(1), …}
      2: {name: "Brahms : Wiegenlied In E Flat Major Op.49-4 (브람스 : 자장가 내림 마장조 작품번호 49-4)(Sea Ver.) ", id: 481849109, pst: 0, t: 0, ar: Array(1), …}
      3: {name: "Irene's Theme", id: 1235602, pst: 0, t: 0, ar: Array(2), …}
      4: {name: "Goldberg Variations, BWV 988: Variation 2", id: 342049, pst: 0, t: 0, ar: Array(1), …}
      5: {name: "Sixteen Waltzes, Op. 39: Waltz No. 15 in A Major", id: 564964631, pst: 0, t: 0, ar: Array(2), …}
      6: {name: "Les débutants 2", id: 19077239, pst: 0, t: 0, ar: Array(1), …}
      7: {name: "2M1", id: 1083043, pst: 0, t: 0, ar: Array(1), …}
      8: {name: "Afterword", id: 32337030, pst: 0, t: 0, ar: Array(1), …}
      9: {name: "ユーフォリア", id: 26212410, pst: 0, t: 0, ar: Array(1), …}
    ]
  */

  /**
   *   上面 ids
   *        注意 id 的值
   *
   *   ids 565094501,1340006976,481849109,1235602,342049,564964631,19077239,1083043,32337030,26212410
   *
   */

   /**
    *   urls   &&    url
    *
    *   注意这里的每个元素的展开的 是 /song/url 中的类型，
    *
    *    通过urls.find((url) => url.id === song.id).url 来获得这首歌的 url
    *
    *    7,8，9 的url是空的，所以在下面的 if(url) 就被删除掉了
    *
    * [
    *  0: {id: 1083043, url: "http://m7.music.126.net/20201116070520/7ce61ba4e3f…47/7f55/f4af/e080388f998d6a9c55541842bb3e0c98.mp3", br: 192000, size: 1402505, md5: "e080388f998d6a9c55541842bb3e0c98", …}
      1: {id: 342049, url: "http://m7.music.126.net/20201116070520/95789ab6ca8…00/9280/d666/3e3e4439e6d815b913233c49fe7d83ce.mp3", br: 320000, size: 3234020, md5: "3e3e4439e6d815b913233c49fe7d83ce", …}
      2: {id: 19077239, url: "http://m7.music.126.net/20201116070520/9cccc373db9…cb/d2dd/3b3a/fae169b58797e515bed291e953da4d4f.mp3", br: 320000, size: 3059702, md5: "fae169b58797e515bed291e953da4d4f", …}
      3: {id: 565094501, url: "http://m7.music.126.net/20201116070520/96c6f19f620…67/5117/b9b0/f5752629966868fa84c7afa2d76c2566.mp3", br: 128000, size: 1329572, md5: "f5752629966868fa84c7afa2d76c2566", …}
      4: {id: 564964631, url: "http://m8.music.126.net/20201116070520/5bf53225275…4d/4117/0c41/d9c35cb5eb74f94ab1e7c06a2452590b.mp3", br: 128000, size: 1207528, md5: "d9c35cb5eb74f94ab1e7c06a2452590b", …}
      5: {id: 481849109, url: "http://m8.music.126.net/20201116070520/a6bde5634a8…usic/ts/free/483024ef6334f1465f292443bdf36093.mp3", br: 128012, size: 481115, md5: "483024ef6334f1465f292443bdf36093", …}
      6: {id: 1340006976, url: "http://m8.music.126.net/20201116070520/1bbf60c2d93…usic/ts/free/c73f357d0beb04b669c2f249f4bb91b0.mp3", br: 128012, size: 481115, md5: "c73f357d0beb04b669c2f249f4bb91b0", …}
      7: {id: 1235602, url: null, br: 0, size: 0, md5: null, …}
      8: {id: 26212410, url: null, br: 0, size: 0, md5: null, …}
      9: {id: 32337030, url: null, br: 0, size: 0, md5: null, …}
     ]
    *
    */

    /**
     *     ...song   &&    url
     *
     *     是数组中每一首歌的  /playlist/detail 中的数据
     *
     *      通过 push({ ...song, url }) 来把上面获得的 url 添加到 这首歌的 数据属性中
     *
     *
     */
