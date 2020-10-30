import { Component, OnInit, ViewChild } from '@angular/core';
import { NzCarouselComponent } from 'ng-zorro-antd';

import { Banner, Singer, HotTag, SongSheet } from './../../services/data-types/common.types';
import { HomeService } from './../../services/home.service';
import { SingerService } from './../../services/singer.service';

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

  constructor(private HomeServe: HomeService, private singerServe: SingerService) {
    this.getBanners();
    this.getHotTags();
    this.getPersonalizedSheetList();
    this.getEnterSingers();
  }

  ngOnInit() {
  }

  // running the Carousel
  private getBanners(){
    this.HomeServe.getBanner().subscribe(banners => {
      // console.log('Banners', banners);
      // here must the data is obtained, then we could use this data for the Carousel
      this.banners = banners;
    })
  }

  //Obtain enter singers
  private getEnterSingers(){
    this.singerServe.getEnterSinger().subscribe(singers => {
      // console.log(111111, singers);
      this.singers = singers
    })
  }

  //Obtain the Hottags
  private getHotTags(){
    this.HomeServe.getHotTags().subscribe(tags => {
      this.hotTags = tags;
    })
  }

  // Obtain Personalized Sheet List
  private getPersonalizedSheetList(){
    this.HomeServe.getPersonalSheetList().subscribe(sheets => {
      this.songSheetLists = sheets;
    })
  }

  onBeforeChange({to}){
    // 每次切换的时候，更新这个carouselActiveIndex的值
    this.carouselActiveIndex = to;
  }

  onChangeSlide(type: "pre"|"next"){
    this.nzCarousel[type]();
  }
}
