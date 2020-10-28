import { InjectionToken, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

export const API_CONFIG = new InjectionToken('ApiConfigToken');
// 这里的ApiConfigToken是 任意的一个 参数， 作为这个 token 的标识
// 这里的Token 的作用
// Angular自身提供的服务，都有一个 token， 以及这个token 对应的值 (useValue)
// 这个值可能是字符串，也可能是一个类
// token也可以直接写成一个 字符串， 但是可读性不是很高， 比如直接 provide: ApiConfigToken
// 所以一般用 new InjectionToken 来生成一个 token
// 其他文件使用的时候需要再 constructor 中 @Inject

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    { provide: API_CONFIG, useValue: 'http://localhost:3000/' }
  ]
})
export class ServicesModule { }
