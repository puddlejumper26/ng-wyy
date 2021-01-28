import { HTTP_INTERCEPTORS } from "@angular/common/http";

import { CommonInterceptor } from './common.interceptor';

// 这个拦截器可以直接导入到 service.module.ts 中的 provide中去

//  因为下面的 multi 是 true ，所以如果需要添加其他的拦截器，只需要这里进行改动，而不需要再对 service.module中进行修改了

// https://angular.cn/guide/http#intercepting-requests-and-responses
//  所以这个文件的作用是 一个  barrel文件，把所有的拦截器都收集起来。 如果你提供拦截器的顺序是先 A，再 B，再 C，那么请求阶段的执行顺序就是 A->B->C，而响应阶段的执行顺序则是 C->B->A


export const httpInterceptorProvides = [
    // useClass就是要用的哪一个拦截器
    // multi true 是这个服务可以有多个依赖的，可以设置多个拦截器
    { provide: HTTP_INTERCEPTORS, useClass: CommonInterceptor, multi: true }
];
