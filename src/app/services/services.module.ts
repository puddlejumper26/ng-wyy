import { InjectionToken, NgModule, PLATFORM_ID } from "@angular/core";
import { CommonModule, isPlatformBrowser } from "@angular/common";

import { httpInterceptorProvides } from './http-interceptors/index';

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

        /**
         *

         这里是 “http://localhost:3000/” 是本地，但是一般情况下， 后端的资源都是其他主机，其他地方的，那么就会涉及到 跨域的问题

         这里我们在本地建立一个新的文档 proxyconfig.json
            这样在请求的时候，就会自动加上 前面的http://localhost:3000 而变成 http://localhost:3000/api
         {
            "/api": {
                "target": "http://localhost:3000", 代理到 本地 3000 的端口，这个根据实际情况进行改写
                "secure": false,  因为本地的不是 https, 所以这里是false， 默认是true，是代理到 https
                "logLevel": "debug",  发射代理的时候需要打印出来的日志文档
                "changeOrigin": true,
                "pathRewrite": {
                    这里的情况是有的接口中间没有 api 而直接是 http://localhost:3000/city
                    那么这里重置一下 api 这一段 为空
                    "^/api": ""
                }
            }

        }

        然后到 angular.json 中进行设置
        */


        // 提供数据地址的 token 令牌
        // { provide: API_CONFIG, useValue: "http://localhost:3000/" },

        // 浏览器会自动加载本地的 localhost: ****/api
        { provide: API_CONFIG, useValue: "/api/" },

        // 封装window的token令牌 , 希望在浏览器环境下给一个window对象,在服务端的环境就不用window，只给一个空对象
        {
            provide: WINDOW,
            useFactory(platformId: Object): Window | Object{
                // 如果是浏览器环境就返回 window
                return isPlatformBrowser(platformId) ? window : {}
            },
            deps: [PLATFORM_ID], //依赖PLATFORM_ID， 是一个常量，代表平台的ID，是浏览器的还是服务端的
        },
        httpInterceptorProvides
    ],
})
export class ServicesModule {}
