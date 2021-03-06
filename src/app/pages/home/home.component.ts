import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NzCarouselComponent } from "ng-zorro-antd";
import { map } from "rxjs/internal/operators";
import { select, Store } from "@ngrx/store";

import { BatchActionsService } from "src/app/store/batch-actions.service";
import {
    Banner,
    Singer,
    HotTag,
    SongSheet,
    Song,
} from "./../../services/data-types/common.types";
import { getMember, getUserId } from './../../store/selectors/member.selector';
import { MemberService } from './../../services/member.service';
import { ModalTypes } from "src/app/store/reducers/member.reducer";
import { SheetService } from "./../../services/sheet.service";
import { AppStoreModule } from "src/app/store";
import { User } from "src/app/services/data-types/member.type";

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

    user: User;

    // private playerState: PlayState; //  ----- 移动到 batch-actions.service.ts

    @ViewChild(NzCarouselComponent, { static: true })
    private nzCarousel: NzCarouselComponent;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private sheetServe: SheetService,
        private store$: Store<AppStoreModule>, // Observable      //  ----- 移动到 batch-actions.service.ts
        private batchActionServe: BatchActionsService,
        private memberServe: MemberService,
    ) {
        //这里使用了 解构， 注意要用 ()， ([banners, hotTags, songSheetList, singers])
        // 并且使用了 resolve， 注意这里的 homeDatas 是从 resolve 中来的
        this.route.data
            .pipe(map((res) => res.homeDatas))
            // .subscribe(([banners, hotTags, songSheetList, singers, user]) => {
            .subscribe(([banners, hotTags, songSheetList, singers]) => {
                this.banners = banners;
                this.singers = singers;
                this.hotTags = hotTags;
                this.songSheetLists = songSheetList;
                // this.user = user;
                // console.log('【HomeComponent】- constructor - user - ', user)
            });

            // 这里通过 store 来监听 userId 的变化
            this.store$.pipe(select(getMember), select(getUserId)).subscribe( id => {
                // console.log('【HomeComponent】 - constructor - store$ - id- ', id);
                if(id) {
                    this.getUserDetail(id);
                }else {
                    // 有这一步才能够在登出之后，通过store 直接改变主页面右边中间的 用户登录 部分登出
                    this.user = null;
                }
            })

        // 这里通过select操作符，拿到 player 里state的数据,
        // 然后下面的this.playerState.playMode.type === 'random'才能够运作
        // this.store$.pipe(select(getPlayer)).subscribe(res => this.playerState = res);  //  ----- 移动到 batch-actions.service.ts
    }

    private getUserDetail(id: string) {
        this.memberServe.getUserDetail(id).subscribe(user => this.user = user);
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
        // console.log(11111, id); 这里的id 是推荐专辑的 id
        this.sheetServe.playSheet(id).subscribe((list) => {

            // 这时候得到的是当前推荐专辑的每一个歌的详细情况的一个对象

            // console.log('list', list);   看 list 的详情 ==> https://github.com/puddlejumper26/ng-wyy/issues/7

            // 播放歌曲，需要执行 player.reducer.ts中的 playList, songList currentIndex
            //结束下面的三行 设定代码， 之后 reducer 里面的 那三个值就会改变， 分别会返回一个新的 state
            // 这时候刷新页面，控制台看 redux 标签，可以看见下面的状态，可以发现 state的值已经发生了改变
            // 接下来就要在 wy-player 中监听 三个值的变化

            // this.store$.dispatch(SetSongList({ list: list}));
            // this.store$.dispatch(SetPlayList({ list: list}));
            // this.store$.dispatch(SetCurrentIndex({ index: 0}));

            //这里如果在测试的环境下，只需要歌单里面有3首歌就可以测试清除逻辑，那么可以用 slice
            // this.store$.dispatch(SetSongList({ songList: list.slice(0,3)}));
            // this.store$.dispatch(SetPlayList({ playList: list.slice(0,3)}));

            // this.store$.dispatch(SetSongList({ songList: list}));
            // this.store$.dispatch(SetPlayList({ playList: list}));
            // this.store$.dispatch(SetCurrentIndex({ currentIndex: 0})); // default to play the first song

            // this.store$.dispatch(SetSongList({ songList: list}));  //  ----- 移动到 batch-actions.service.ts

            // let trueIndex = 0;  //  ----- 移动到 batch-actions.service.ts
            // let trueList = list.slice();  //  ----- 移动到 batch-actions.service.ts
            // 问题， 接下来因为没有考虑模式的问题，就直接发送歌曲了，那么如果进入页面，先点击模式到随机
            // 然后连续点击下一曲，就会按照顺序播放，因为没有模式的限定。
            // 所以需要添加一个 if
            // if(this.playerState.playMode.type === 'random') {  //  ----- 移动到 batch-actions.service.ts
                // trueList = shuffle(list || []); // [] 兼容一下list 不存在的情况  //  ----- 移动到 batch-actions.service.ts
                // 上面打乱一下顺序，然后在新的乱掉的列表中，找到正在播放歌曲的index
                // trueIndex = findIndex(trueList, list[trueIndex]);  //  ----- 移动到 batch-actions.service.ts
            // }
            // this.store$.dispatch(SetPlayList({ playList: trueList}));  //  ----- 移动到 batch-actions.service.ts
            // this.store$.dispatch(SetCurrentIndex({ currentIndex: trueIndex}));  //  ----- 移动到 batch-actions.service.ts

            // 上面这些代码执行之后，reducer中的InitialState的值就发生了变化，这个变化在 Redux插件中可以看到

            this.batchActionServe.selectPlayList({list, index: 0});
        });
    }

    toInfo(id: number) {
        this.router.navigate(['/sheetInfo', id])
    }

    openModal() {
        this.batchActionServe.controlModal(true, ModalTypes.Default);
    }
}

/**
 *     下面这些被重新写，是因为写了 resolve  home-resolve.service.ts
 */

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
