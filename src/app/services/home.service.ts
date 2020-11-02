import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { map } from "rxjs/internal/operators";
import { Observable } from "rxjs";

import { API_CONFIG, ServicesModule } from "./services.module";
import { Banner, HotTag, SongSheet } from "./data-types/common.types";

@Injectable({
    // it means ServiceModule will provide with HomeService
    // same as put HomeService into the proviers inside ServiceModule
    // casuse the second method could
    // be deleted when it is not used when tree shaking
    // tree shaking is to auto delete the module or package in the APP which is imported but not used
    providedIn: ServicesModule,
})
export class HomeService {
    constructor(
        private http: HttpClient,
        @Inject(API_CONFIG) private uri: string
    ) {}

    getBanner(): Observable<Banner[]> {
        return (
            this.http
                .get(this.uri + "banner")
                // return this.http.get('http://localhost:3000/banner') 上一行就把前缀抽取出来了
                .pipe(map((res: { banners: Banner[] }) => res.banners))
        );
        // 为什么要用map操作符，因为要返回一个Banner的数组，所以要对数据指明类型
        // banners, check localhost:3000/banner 数据是包含是 banners 数组里的
        // 需要申明一下 res 的属性，为 banners，banners的类型是 Banner[]
    }

    // 获取热门标签 这里先要给 res.tag 排序，再显示前面的5个
    getHotTags(): Observable<HotTag[]> {
        return this.http.get(this.uri + "playlist/hot").pipe(
            map((res: { tags: HotTag[] }) => {
                return res.tags
                    .sort((x: HotTag, y: HotTag) => {
                        return x.position - y.position; // 这里的position 是 HotTag自身的type
                    })
                    .slice(0, 5);
            })
        );
    }

    // 获取热门歌单, 因为主页上只显示 16个歌曲，所以这里用 slice
    getPersonalSheetList(): Observable<SongSheet[]> {
        return this.http
            .get(this.uri + "personalized")
            .pipe(
                map((res: { result: SongSheet[] }) => res.result.slice(0, 16))
            );
    }
}
