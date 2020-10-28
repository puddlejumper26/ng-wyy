import { Component, OnInit } from '@angular/core';
import { HomeService } from 'src/app/services/home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

  banners = [];

  constructor(private homeServer: HomeService) {
    this.homeServer.getBanner().subscribe(banners => {
      // console.log('Banners', banners);
      // here must the data is obtained, then we could use this data for the Carousel
      this.banners = banners;
    })
   }

  ngOnInit() {
  }

}
