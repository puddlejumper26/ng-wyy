import { Component } from "@angular/core";

import { isEmptyObject } from "./utils/tools";
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
                    this.searchResult = this.highlightKeyWords(keywords, res);
                    console.log('【AppComponent】 - onSearch - searchResult', this.searchResult)
                })
        }else {
            this.searchResult = {};
        }
    }

    private highlightKeyWords(keywords: string, result: SearchResult): SearchResult {
        if(!isEmptyObject(result)) {
            // 需要全局匹配 RegExp g 修饰符全局匹配, i 大小写不敏感
            const reg = new RegExp(keywords, 'ig');
            ['albums','songs', 'artists'].forEach(type => {
                console.log('【AppComponent】- highlightKeyWords - type - ', type);
                if(result[type]){
                    result[type].forEach(item => {
                        // console.log('【AppComponent】- highlightKeyWords - item - ', item);
                        // 这里使用 $& 是能够直接显示keywords， 注意和 wy-search-panel.component.html中的 [innerHTML]的关系
                        // $& https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace
                        // str.replace(regexp|substr, newSubStr|function)
                        item.name = item.name.replace(reg, '<span class="highlight">$&</span>')
                    })
                }
            })
        }
        return result;
    }
}
