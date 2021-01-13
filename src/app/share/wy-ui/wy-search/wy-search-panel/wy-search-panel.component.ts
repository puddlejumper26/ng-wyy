import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SearchResult } from 'src/app/services/data-types/common.types';

@Component({
    selector: "app-wy-search-panel",
    templateUrl: "./wy-search-panel.component.html",
    styleUrls: ["./wy-search-panel.component.less"],
})
export class WySearchPanelComponent implements OnInit {
    searchResult: SearchResult;

    constructor(private router: Router) {}

    ngOnInit() {}

     // 点击跳转到相关的专辑详情页面
    // 接受一个元组类型的参数
    toInfo(path: [string, number]) {                                                    // -------------------(26)
        // console.log('【WySearchPanelComponent】 - toInfo - path - ', path);
        if(path[1]) {
            this.router.navigate(path);
        }
    }
}
