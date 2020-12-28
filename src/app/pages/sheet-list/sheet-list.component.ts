import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { BatchActionsService } from 'src/app/store/batch-actions.service';
import { SheetParams, SheetService } from 'src/app/services/sheet.service';
import { SheetList } from 'src/app/services/data-types/common.types';

@Component({
    selector: "app-sheet-list",
    templateUrl: "./sheet-list.component.html",
    styleUrls: ["./sheet-list.component.less"],
})
export class SheetListComponent implements OnInit {
    listParams: SheetParams = {
        cat: '全部', //默认值
        order: 'hot',
        offset: 1, //从第一页开始
        limit: 35,
    }

    sheets: SheetList;
    orderValue = 'hot';

    constructor(
        private route: ActivatedRoute,
        private sheetServe: SheetService,
        private batchActionsServe: BatchActionsService) {
        //这里就通过 route 来获取输入的 params的参数，
        // 注意这里的 route 应该是 rxjs 的流的形式，因为这里只是需要一个参数，
        // 所以可以用 snapshot 来快速取得这个参数， 而不需要 订阅了
        this.listParams.cat = this.route.snapshot.queryParamMap.get('cat') || '全部';
        // console.log('【sheet-list.component】- constructor - this.listParams', this.listParams);
        this.getList();
    }

    ngOnInit() {}

    private getList() {
        this.sheetServe.getSheets(this.listParams).subscribe( res => {
            // console.log('【sheet-list.component】- getList - res', res);
            this.sheets = res
        })
    }

    //这样就知道当前选中的哪一个标签
    onOrderChange(order: 'hot' | 'new') {
        // console.log('【sheet-list.component】- onOrderChange - cat - ', order);
        this.listParams.order = order;
        this.listParams.offset = 1;
        this.getList();
    }

    //只要模板里的分页页数发生变化，会触发这个方法，把页数作为参数传入进来
    onPageChange(page: number) {
        this.listParams.offset = page;
        this.getList();
    }

    onPlaySheet(id: number) {
        this.sheetServe.playSheet(id).subscribe(list => {
            this.batchActionsServe.selectPlayList({list, index: 0});
        })
    }
}
