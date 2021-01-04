import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/internal/operators';

import { Singer, Song } from 'src/app/services/data-types/common.types';

@Component({
    selector: "app-singer-detail",
    templateUrl: "./singer-detail.component.html",
    styleUrls: ["./singer-detail.component.less"],
})
export class SingerDetailComponent implements OnInit {

    // singerDetail: SingerDetail;
    singer: Singer;
    hotSongs: Song[];

    constructor(
        private route: ActivatedRoute,
        ) {
            this.route.data
              .pipe(map(res => res.singerDetail))
              .subscribe(detail => {
                //   这么写不起作用，所以只能用下面的写法
                //   this.singerDetail = detail;
                  this.singer = detail.artist;
                  this.hotSongs = detail.hotSongs;
              })
        }

    ngOnInit() {}
}
