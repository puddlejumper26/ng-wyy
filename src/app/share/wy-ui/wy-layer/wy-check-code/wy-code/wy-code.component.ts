import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";

const CODELENGTH= 4;

@Component({
    selector: "app-wy-code",
    templateUrl: "./wy-code.component.html",
    styleUrls: ["./wy-code.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WyCodeComponent implements OnInit {
    inputArr = [];
    constructor() {
        // 用空字符串填充一个长度为4 的数组
        this.inputArr = Array(CODELENGTH).fill('');
    }

    ngOnInit() {}
}
