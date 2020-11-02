/**
 *      Resolve function
 *
 *      When browse is loading, and it would take data from server
 *      sometimes, it is finish loading before it obtains data from server
 *      then, it has blank area on the page
 *
 *      resolve is to sovle this
 *
 *      https://angular.io/guide/router-tutorial-toh#resolve-guard
 */

import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { forkJoin, Observable } from "rxjs";

import { SingerService } from "./../../services/singer.service";
import { HomeService } from "./../../services/home.service";
import {
    SongSheet,
    Singer,
    Banner,
    HotTag,
} from "./../../services/data-types/common.types";
import { first } from "rxjs/internal/operators";

//这里是一个类型的定义， 返回的数据的集合
type HomeDataType = [Banner[], HotTag[], SongSheet[], Singer[]];

@Injectable()
export class HomeResolverService implements Resolve<HomeDataType> {
    constructor(
        private homeServe: HomeService,
        private singerServe: SingerService
    ) {}
    /**
     *  forkJoin 接受一个数组，数组的每一个参数都返回一个Observable对象，
     * 会等每一个流都完成之后，把他们各自的最新值发射出去
     *
     *  first 只取发射出去的第一个值，也可以用 take(1)
     */
    resolve(): Observable<HomeDataType> {
        return forkJoin([
            this.homeServe.getBanner(),
            this.homeServe.getHotTags(),
            this.homeServe.getPersonalSheetList(),
            this.singerServe.getEnterSinger(),
        ]).pipe(first());
    }
}
