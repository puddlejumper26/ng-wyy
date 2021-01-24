import { Component, OnInit, ChangeDetectionStrategy, EventEmitter, Output } from "@angular/core";

@Component({
    selector: "app-wy-layer-login",
    templateUrl: "./wy-layer-login.component.html",
    styleUrls: ["./wy-layer-login.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WyLayerLoginComponent implements OnInit {
    // 和wy-layer-default.component.ts中的设定是一样的
    @Output() onChangeModalType = new EventEmitter<string | void>();
    constructor() {}

    ngOnInit() {}
}
