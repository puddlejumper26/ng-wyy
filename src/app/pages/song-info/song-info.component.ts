import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/internal/operators';

import { BaseLyricLine } from 'src/app/share/wy-ui/wy-player/wy-player-panel/wy-lyric';
import { Song } from 'src/app/services/data-types/common.types';
import { WyLyric } from './../../share/wy-ui/wy-player/wy-player-panel/wy-lyric';

@Component({
    selector: "app-song-info",
    templateUrl: "./song-info.component.html",
    styleUrls: ["./song-info.component.less"],
})
export class SongInfoComponent implements OnInit {

    song: Song;
    lyric: BaseLyricLine[];

    controlLyric = {
        isExpand: false,
        label: '展开',
        iconCls: 'down'
    }

    constructor(private route: ActivatedRoute) {
        this.route.data
            .pipe(map((res) => res.songInfo))
            .subscribe(([song, lyric]) => {
                this.song = song;
                // this.lyric = lyric;
                this.lyric = new WyLyric(lyric).lines;
                // console.log('【SongInfoComponent】- constructor - song', song);
                // console.log('【SongInfoComponent】- constructor - lyric', this.lyric);
            });
    }

    ngOnInit() {}

    toggleLyric() {
        this.controlLyric.isExpand = !this.controlLyric.isExpand;
        if(this.controlLyric.isExpand) {
            this.controlLyric.iconCls = 'up';
            this.controlLyric.label = '收起';
        }else {
            this.controlLyric.iconCls = 'down';
            this.controlLyric.label = '展开';
        }
    }
}
