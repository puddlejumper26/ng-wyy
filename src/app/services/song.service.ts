import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs/internal/operators';
import { Observable } from 'rxjs';

import { API_CONFIG, ServicesModule } from './services.module';
import { SongUrl } from './data-types/common.types';

    /**
     *    This should be used together with
     *                                  sheet.service.ts
     */

@Injectable({
  providedIn: ServicesModule
})
export class SongService {

  constructor(private http: HttpClient, @Inject(API_CONFIG) private uri: string) { }

  //根据 网易云的API， 接口可以同时获取多个歌曲的播放地址，所以这里接受的是一个 string
  getSongUrl(ids: string): Observable<SongUrl[]>{
    const params = new HttpParams().set('id', ids);
    return this.http.get(this.uri + 'song/url', { params })
                .pipe(map((res : {data: SongUrl[]}) => res.data))
  }
}