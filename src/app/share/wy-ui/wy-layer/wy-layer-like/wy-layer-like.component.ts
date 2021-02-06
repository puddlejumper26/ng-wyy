import { Component, OnInit, ChangeDetectionStrategy, Input, OnChanges, SimpleChanges } from "@angular/core";
import { MemberService } from 'src/app/services/member.service';
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

    onLike(id: string) {
        // this.memberServe.likeSong(id);
    }
}
