import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { first } from 'rxjs/internal/operators';

import { Lyric, Song } from './../../services/data-types/common.types';
import { SongService } from 'src/app/services/song.service';

type SongDataModel = [Song, Lyric];

// 因为这个页面需要两个接口，所以这里的类型是一个组合的类型

// 和home的守卫是一样的

@Injectable()
export class SongInfoResolverService implements Resolve<SongDataModel> {
    constructor(private songServe: SongService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<SongDataModel> {
        // 注意这里获取 id 的方式
        // console.log('【SongInfoResolverService】 - resolve - route.paramMap.get("id") - ', route.paramMap.get('id'))
        // 拿到url数据中的id, route.paramMap.get('id') 得到的是一个string，所以要用Number
        const id = route.paramMap.get('id');
        return forkJoin([
            this.songServe.getSongDetail(id),
            this.songServe.getLyric(Number(id))
        ]).pipe(first());
    }
}
