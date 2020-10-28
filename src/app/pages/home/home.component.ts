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

  @ViewChild(NzCarouselComponent, {static: true}) private nzCarousel: NzCarouselComponent;

  constructor(private homeServer: HomeService) {
    this.homeServer.getBanner().subscribe(banners => {
      // console.log('Banners', banners);
      // here must the data is obtained, then we could use this data for the Carousel
      this.banners = banners;
    })
   }

  ngOnInit() {
  }

  onBeforeChange({to}){
    // 每次切换的时候，更新这个carouselActiveIndex的值
    this.carouselActiveIndex = to;
  }

  onChangeSlide(type: "pre"|"next"){
    this.nzCarousel[type]();
  }
}
