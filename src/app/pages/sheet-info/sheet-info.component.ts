import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/internal/operators';

import { SongSheet } from './../../services/data-types/common.types';
@Component({
    selector: "app-sheet-info",
    templateUrl: "./sheet-info.component.html",
    styleUrls: ["./sheet-info.component.less"],
})
export class SheetInfoComponent implements OnInit {

    sheetInfo: SongSheet;

    description = {
        short: '',
        long: ''
    }

    controlDesc = {
        isExpand: false,
        label: '展开',
        iconCls: 'down'
    }

    constructor(private route: ActivatedRoute) {
        // 这里的 data 是sheet-info-routing.module.ts 中的 data， 其中包括了title和resolve中sheetInfo的信息
        this.route.data.pipe(map((res) => res.sheetInfo)).subscribe((res) => {
            // console.log("【SheetInfoComponent】 - constructor - res - ", res);
            this.sheetInfo = res;
            if(res.description) {
                this.changeDesc(res.description);
            }
        });
    }

    ngOnInit() {}

    private changeDesc(desc: string) {
        // 截取99个字符
        if(desc.length < 99) {
            this.description = {
                short: '<b>介绍： </b>' + this.replaceBr(desc),
                long:  '<b>介绍： </b>' + this.replaceBr(desc), //这样能够点击展开之后不会空白
            }
        }else {
            // 如果超过99个字符
            this.description = {
                short: '<b>介绍： </b>' + this.replaceBr(desc.slice(0,99)) + '...',
                long: '<b>介绍： </b>' + this.replaceBr(desc)
            }
        }
    }

    toggleDesc() {
        this.controlDesc.isExpand = !this.controlDesc.isExpand;
        if(this.controlDesc.isExpand) {
            this.controlDesc.iconCls = 'up';
            this.controlDesc.label = '收起';
        }else {
            this.controlDesc.iconCls = 'down';
            this.controlDesc.label = '展开';
        }
    }

    // 把desc中的换行符换成<br>标签 所以需要用正则，这里使用的是innerHTML
    private replaceBr(str: string): string {
        return str.replace(/\n/g, '<br>');
    }
}
