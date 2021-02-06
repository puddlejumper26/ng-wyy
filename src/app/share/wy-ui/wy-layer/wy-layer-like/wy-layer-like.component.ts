import { Component, OnInit, ChangeDetectionStrategy, Input, OnChanges, SimpleChanges } from "@angular/core";
import { Store, select } from '@ngrx/store';

import { AppStoreModule } from "src/app/store";
import { getLikeId, getMember } from "src/app/store/selectors/member.selector";
import { SongSheet } from "src/app/services/data-types/common.types";

@Component({
    selector: "app-wy-layer-like",
    templateUrl: "./wy-layer-like.component.html",
    styleUrls: ["./wy-layer-like.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WyLayerLikeComponent implements OnInit, OnChanges {

    private likeId: string;

    @Input() mySheets: SongSheet[];

    constructor(
        private store$: Store<AppStoreModule>
    ) {
        this.store$.pipe(select(getMember), select(getLikeId)).subscribe( id => {
            console.log('【WyLayerLikeComponent】- constructor - store$ - id -', id);
            this.likeId = id;
        })
    }

    ngOnChanges(changes: SimpleChanges): void {
        // console.log('【WyLayerLikeComponent】- ngOnChanges - changes["mySheets"].currentValue - ', changes["mySheets"].currentValue);
    }

    ngOnInit() {}
}
