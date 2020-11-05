import { Component, OnInit } from "@angular/core";

@Component({
    selector: "app-wy-player",
    templateUrl: "./wy-player.component.html",
    styleUrls: ["./wy-player.component.less"],
})
export class WyPlayerComponent implements OnInit {

    sliderValue = 35; //一开始handle 也就是圆点的位置
    bufferOffset = 70;  //一开始 灰色缓冲的位置

    constructor() {}

    ngOnInit() {}
}
