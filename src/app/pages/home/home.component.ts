import { SetPlayList, SetCurrentIndex, SetSongList } from './../../store/actions/player.actions';
import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Store } from '@ngrx/store';
import { NzCarouselComponent } from "ng-zorro-antd";
import { map } from "rxjs/internal/operators";
import { AppStoreModule } from 'src/app/store';

import {
    Banner,
    Singer,
    HotTag,
    SongSheet,
    Song,
} from "./../../services/data-types/common.types";
import { SheetService } from "./../../services/sheet.service";
import { playerReducer } from 'src/app/store/reducers/player.reducer';

@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.less"],
})
export class HomeComponent implements OnInit {
    carouselActiveIndex = 0;

    banners: Banner[];
    singers: Singer[];
    hotTags: HotTag[];
    songSheetLists: SongSheet[];
    playList: Song[];

    @ViewChild(NzCarouselComponent, { static: true })
    private nzCarousel: NzCarouselComponent;

    constructor(
        private route: ActivatedRoute,
        private sheetServe: SheetService,
        private store$: Store<AppStoreModule>, // Observable
    ) {
        //这里使用了 解构， 注意要用 ()， ([banners, hotTags, songSheetList, singers])
        this.route.data
            .pipe(map((res) => res.homeDatas))
            .subscribe(([banners, hotTags, songSheetList, singers]) => {
                this.banners = banners;
                this.singers = singers;
                this.hotTags = hotTags;
                this.songSheetLists = songSheetList;
            });
    }

    ngOnInit() {}

    onBeforeChange({ to }) {
        // 每次切换的时候，更新这个carouselActiveIndex的值
        this.carouselActiveIndex = to;
    }

    onChangeSlide(type: "pre" | "next") {
        this.nzCarousel[type]();
    }

    /**
     * This would be used in the template, therefore template would obatin a complete song information and play address
     */
    onPlaySheet(id: number) {
        // console.log(11111, id);
        this.sheetServe.playSheet(id).subscribe((list) => {
            // console.log(111, list);

            // 播放歌曲，需要执行 player.reducer.ts中的 playList, songList currentIndex
            //结束下面的三行 设定代码， 之后 reducer 里面的 那三个值就会改变， 分别会返回一个新的 state
            // 这时候刷新页面，控制台看 redux 标签，可以看见下面的状态，可以发现 state的值已经发生了改变
            // 接下来就要在 wy-player 中监听 三个值的变化

            // this.store$.dispatch(SetSongList({ list: list}));
            // this.store$.dispatch(SetPlayList({ list: list}));
            // this.store$.dispatch(SetCurrentIndex({ index: 0}));
            this.store$.dispatch(SetSongList({ songList: list}));
            this.store$.dispatch(SetPlayList({ playList: list}));
            this.store$.dispatch(SetCurrentIndex({ currentIndex: 0})); // default to play the first song
        });
    }
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
