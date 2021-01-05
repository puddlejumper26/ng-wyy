import { Component } from "@angular/core";

import { SearchResult } from "./services/data-types/common.types";
import { SearchService } from './services/search.service';

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.less"],
})
export class AppComponent {
    title = "ng-wyy";
    menu = [
        {
            label: "发现",
            path: "/home",
        },
        {
            label: "歌单",
            path: "/sheet",
        },
    ];

    searchResult: SearchResult;

    constructor(private searchServe: SearchService) {}

    onSearch(keywords: string) {
        // console.log('【AppComponent】 - onSearch - keywords -', keywords);
        // 因为如果是空的话，会报错
        if(keywords) {
            this.searchServe.search(keywords)
                .subscribe( res => {
                    // console.log('【AppComponent】 - onSearch - res', res)
                    this.searchResult = res;
                })
        }else {
            this.searchResult = {};
        }
    }
}
