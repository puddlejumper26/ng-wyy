import { Component, OnInit, ChangeDetectionStrategy, Input, OnChanges, SimpleChanges, Output, EventEmitter } from "@angular/core";

import { LikeSongParams, MemberService } from 'src/app/services/member.service';
import { SongSheet } from "src/app/services/data-types/common.types";

@Component({
    selector: "app-wy-layer-like",
    templateUrl: "./wy-layer-like.component.html",
    styleUrls: ["./wy-layer-like.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WyLayerLikeComponent implements OnInit, OnChanges {

    @Input() likeId: string;
    @Input() mySheets: SongSheet[];
    @Output() onLikeSong = new EventEmitter<LikeSongParams>();

    // 是否是正在创建，用这个属性来控制显示哪一个面板
    creating = false;

    constructor(
        private memberServe: MemberService,
    ) {
        // 从parent 直接传入进来会更好，更加方便管理, 也就是 app.component.ts - listenStates()
        // this.store$.pipe(select(getMember), select(getLikeId)).subscribe( id => {
        //     console.log('【WyLayerLikeComponent】- constructor - store$ - id -', id);
        //     this.likeId = id;
        // })

        // console.log('【WyLayerLikeComponent】- constructor - likeId - ', this.likeId);
    }

    ngOnChanges(changes: SimpleChanges): void {
        // console.log('【WyLayerLikeComponent】- ngOnChanges - changes["mySheets"].currentValue - ', changes["mySheets"].currentValue);
        if(changes["likeId"]){
            console.log('【WyLayerLikeComponent】- ngOnChanges - changes["likeId"].currentValue - ', changes["likeId"].currentValue);
        }
    }

    ngOnInit() {}

    onLike(pid: string) {
        this.onLikeSong.emit({pid, tracks: this.likeId });
        // 接下来就可以在app.component.ts中接受到这两个参数了
    }
}
