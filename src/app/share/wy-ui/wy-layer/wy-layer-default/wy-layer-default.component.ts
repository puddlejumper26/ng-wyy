import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter } from "@angular/core";

@Component({
    selector: "app-wy-layer-default",
    templateUrl: "./wy-layer-default.component.html",
    styleUrls: ["./wy-layer-default.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WyLayerDefaultComponent implements OnInit {

    //  这种切换的逻辑都发送到外面，由外部统一去做，这样更加系统， 这样 在 app.component中就能监听到这个事情
    @Output() onChangeModalType = new EventEmitter<string | void>();

    constructor() {}

    ngOnInit() {}
}
