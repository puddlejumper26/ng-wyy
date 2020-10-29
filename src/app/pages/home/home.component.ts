import { Component, OnInit, ViewChild } from '@angular/core';
import { NzCarouselComponent } from 'ng-zorro-antd';
import { HomeService } from 'src/app/services/home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

  carouselActiveIndex = 0;
  banners = [];
  sheets = [];
  tags = [];

  @ViewChild(NzCarouselComponent, {static: true}) private nzCarousel: NzCarouselComponent;

  constructor(private homeServer: HomeService) {
    this.getBanners();
    this.getHotTags();
  }

  ngOnInit() {
  }

  // running the Carousel
  private getBanners(){
    this.homeServer.getBanner().subscribe(banners => {
      // console.log('Banners', banners);
      // here must the data is obtained, then we could use this data for the Carousel
      this.banners = banners;
    })
  }

  //Obtain the Hottags
  private getHotTags(){
    this.homeServer.getHotTags().subscribe(tags => {
      this.tags = tags;
    })
  }

  // Obtain Personalized Sheet List
  private getPersonalizedSheetList(){
    this.homeServer.getPersonalSheetList().subscribe(sheets => {
      this.sheets = sheets;
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
