import { Inject, Injectable } from "@angular/core";

import { AnyJson } from './data-types/member.type';
import { ServicesModule, WINDOW } from "./services.module";

/**
 *         localStorage 的方法封装
 *
 *         也支持  sessionStorage   两者的API 都是一样的
 */

@Injectable({
    providedIn: ServicesModule,
})
export class StorageService {
    constructor(@Inject(WINDOW) private win: Window) {

    }

    // type 是指 localStroage 还是 sessionStorage
    getStorage(key: string, type = 'local'): string {
        return this.win[type + 'Storage'].getItem(key);
    }

    // 下面的params 支持传一个对象或者数组， 所以可以同时设置多个 values
    setStorage(params: AnyJson | AnyJson[], type = 'local') {
        // 首先判断是否是数组，如果不是就放到数组里面
        const kv = Array.isArray(params) ? params : [params];
        // 因为 AnyJson的格式一定是 key value形式，所以下面可以用 结构的方式进行一个遍历
        for(const {key, value} of kv) {
            this.win[type + 'Storage'].setItem(key, value.toString());
        }
    }

    // 和上面的类似
    removeStorage(params: string | string[], type = 'local') {
        const kv = Array.isArray(params) ? params : [params];
        for(const key of kv) {
            this.win[type + 'Storage'].removeItem(key);
        }
    }
}
