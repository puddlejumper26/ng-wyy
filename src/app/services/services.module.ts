import { InjectionToken, NgModule, PLATFORM_ID } from "@angular/core";
import { CommonModule, isPlatformBrowser } from "@angular/common";

// 这里的ApiConfigToken是 任意的一个 参数， 作为这个 token 的标识
// 这里的Token 的作用
// Angular自身提供的服务，都有一个 token， 以及这个token 对应的值 (useValue)
// 这个值可能是字符串，也可能是一个类
// token也可以直接写成一个 字符串， 但是可读性不是很高， 比如直接 provide: ApiConfigToken
// 所以一般用 new InjectionToken 来生成一个 token
// 其他文件使用的时候需要再 constructor 中 @Inject
export const API_CONFIG = new InjectionToken("ApiConfigToken");

export const WINDOW = new InjectionToken("WindowToken");

@NgModule({
    declarations: [],
    imports: [CommonModule],
    providers: [

        // 提供数据地址的 token 令牌
        { provide: API_CONFIG, useValue: "http://localhost:3000/" },

        // 封装window的token令牌 , 希望在浏览器环境下给一个window对象,在服务端的环境就不用window，只给一个空对象
        {
            provide: WINDOW,
            useFactory(platformId: Object): Window | Object{
                // 如果是浏览器环境就返回 window
                return isPlatformBrowser(platformId) ? window : {}
            },
            deps: [PLATFORM_ID], //依赖PLATFORM_ID， 是一个常量，代表平台的ID，是浏览器的还是服务端的
        }
    ],
})
export class ServicesModule {}
