import { Component, OnInit, ChangeDetectionStrategy, Input, OnChanges, SimpleChanges, Output, EventEmitter } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { LikeSongParams, MemberService } from 'src/app/services/member.service';
import { SongSheet } from "src/app/services/data-types/common.types";

@Component({
    selector: "app-wy-layer-like",
    templateUrl: "./wy-layer-like.component.html",
    styleUrls: ["./wy-layer-like.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WyLayerLikeComponent implements OnInit, OnChanges {

    @Input() likeId: string;
    @Input() mySheets: SongSheet[];
    @Input() visible: boolean;

    @Output() onLikeSong = new EventEmitter<LikeSongParams>();
    @Output() onCreateSheet = new EventEmitter<string>();

    // 是否是正在创建，用这个属性来控制显示哪一个面板
    creating = false;

    formModel: FormGroup; // 和wy-layer-login 中是一样的

    constructor(
        private memberServe: MemberService,
        private fb: FormBuilder,
    ) {
        // 从parent 直接传入进来会更好，更加方便管理, 也就是 app.component.ts - listenStates()
        // this.store$.pipe(select(getMember), select(getLikeId)).subscribe( id => {
        //     console.log('【WyLayerLikeComponent】- constructor - store$ - id -', id);
        //     this.likeId = id;
        // })

        // console.log('【WyLayerLikeComponent】- constructor - likeId - ', this.likeId);
        this.formModel = this.fb.group({
            sheetName: ['', [Validators.required]]
        })
    }

    ngOnChanges(changes: SimpleChanges): void {
        // console.log('【WyLayerLikeComponent】- ngOnChanges - changes["mySheets"].currentValue - ', changes["mySheets"].currentValue);
        // if(changes["likeId"]){
        //     console.log('【WyLayerLikeComponent】- ngOnChanges - changes["likeId"].currentValue - ', changes["likeId"].currentValue);
        // }
        if(changes["visible"]){
            if(!this.visible) {
                // 弹窗已经关闭的状态下
                // 这里使用formControl的reset功能来设定每次打开新建歌单的弹窗，输入框的状态都是未填写
                this.formModel.get('sheetName').reset();
                this.creating = false;
            }
        }
    }

    ngOnInit() {}

    onLike(pid: string) {
        this.onLikeSong.emit({pid, tracks: this.likeId });
        // 接下来就可以在app.component.ts中接受到这两个参数了
    }

    // 这里在template 中一定要用 onSubmit 这个方法，不然会报错
    onSubmit() {
        // 这里就打印出了 {sheetName: '输入的内容'}, 这样就可以拿到这个值，并发射出去
        // console.log('【WyLayerLikeComponent】- createSheet - this.formModel.value -', this.formModel.value);
        this.onCreateSheet.emit(this.formModel.get('sheetName').value);
    }
}
