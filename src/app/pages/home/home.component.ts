import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzCarouselComponent } from 'ng-zorro-antd';
import { map } from 'rxjs/internal/operators';

import { Banner, Singer, HotTag, SongSheet } from './../../services/data-types/common.types';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

  carouselActiveIndex = 0;

  banners: Banner[];
  singers: Singer []
  hotTags: HotTag [];
  songSheetLists: SongSheet [];

  @ViewChild(NzCarouselComponent, {static: true}) private nzCarousel: NzCarouselComponent;

  constructor( private route: ActivatedRoute ){
    //这里使用了 解构， 注意要用 ()， ([banners, hotTags, songSheetList, singers])
    this.route.data.pipe(map(res => res.homeDatas)).subscribe(
      ([banners, hotTags, songSheetList, singers])=> {
        this.banners = banners;
        this.singers = singers;
        this.hotTags = hotTags;
        this.songSheetLists = songSheetList;
      }
    )
  }

  // constructor(
  //   private HomeServe: HomeService,
  //   private singerServe: SingerService,) {
  //     this.getBanners();
  //     this.getHotTags();
  //     this.getPersonalizedSheetList();
  //     this.getEnterSingers();
  // }

  // // running the Carousel
  // private getBanners(){
  //   this.HomeServe.getBanner().subscribe(banners => {
  //     // console.log('Banners', banners);
  //     // here must the data is obtained, then we could use this data for the Carousel
  //     this.banners = banners;
  //   })
  // }

  // //Obtain enter singers
  // private getEnterSingers(){
  //   this.singerServe.getEnterSinger().subscribe(singers => {
  //     // console.log(111111, singers);
  //     this.singers = singers
  //   })
  // }

  // //Obtain the Hottags
  // private getHotTags(){
  //   this.HomeServe.getHotTags().subscribe(tags => {
  //     this.hotTags = tags;
  //   })
  // }

  // // Obtain Personalized Sheet List
  // private getPersonalizedSheetList(){
  //   this.HomeServe.getPersonalSheetList().subscribe(sheets => {
  //     this.songSheetLists = sheets;
  //   })
  // }

  ngOnInit(){}

  onBeforeChange({to}){
    // 每次切换的时候，更新这个carouselActiveIndex的值
    this.carouselActiveIndex = to;
  }

  onChangeSlide(type: "pre"|"next"){
    this.nzCarousel[type]();
  }
}
