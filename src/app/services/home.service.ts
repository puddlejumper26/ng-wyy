import { Banner } from './data-types/common.types';
import { API_CONFIG, ServicesModule } from './services.module';
import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs/internal/operators';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  // it means ServiceModule will provide with HomeService
  // same as put HomeService into the proviers inside ServiceModule
  // casuse the second method could
  // be deleted when it is not used when tree shaking
  // tree shaking is to auto delete the module or package in the APP which is imported but not used
  providedIn: ServicesModule
})
export class HomeService {

  constructor(private http: HttpClient, @Inject(API_CONFIG) private uri: string) { }

  getBanner(): Observable<Banner[]>{
    return this.http.get(this.uri + 'banner')
    // return this.http.get('http://localhost:3000/banner') 上一行就把前缀抽取出来了
                .pipe(map((res : {banners: Banner[]}) => res.banners))
    // 为什么要用map操作符，因为要返回一个Banner的数组，所以要对数据指明类型
    // banners, check localhost:3000/banner 数据是包含是 banners 数组里的
    // 需要申明一下 res 的属性，为 banners，banners的类型是 Banner[]
  }
}
