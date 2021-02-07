import { Component, OnInit, ChangeDetectionStrategy, Input } from "@angular/core";

import { ShareInfo } from './../../../../store/reducers/member.reducer';

@Component({
    selector: "app-wy-layer-share",
    templateUrl: "./wy-layer-share.component.html",
    styleUrls: ["./wy-layer-share.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WyLayerShareComponent implements OnInit {

    @Input() shareInfo: ShareInfo;

    constructor() {
        console.log('【WyLayerShareComponent】- constructor - this.shareInfo -', this.shareInfo)
    }

    ngOnInit() {}
}
