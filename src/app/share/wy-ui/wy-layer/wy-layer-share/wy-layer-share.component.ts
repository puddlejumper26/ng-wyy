import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from "@angular/core";

import { ShareInfo } from './../../../../store/reducers/member.reducer';
import { ShareParams } from 'src/app/services/member.service';

const MAX_MSG = 140;

@Component({
    selector: "app-wy-layer-share",
    templateUrl: "./wy-layer-share.component.html",
    styleUrls: ["./wy-layer-share.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WyLayerShareComponent implements OnInit {

    @Input() shareInfo: ShareInfo;

    @Output() onCancel = new EventEmitter<void>();
    @Output() onShare = new EventEmitter<ShareParams>();

    formModel: FormGroup;
    surplusMsgCount = MAX_MSG;

    constructor(
        private fb: FormBuilder,
    ) {
        // console.log('【WyLayerShareComponent】- constructor - this.shareInfo -', this.shareInfo)
        this.formModel = this.fb.group({
            msg:['', Validators.maxLength(MAX_MSG)]
        });

        // 下面的 valueChanges 就是当值改变时，会发射出一个流
        this.formModel.get('msg').valueChanges.subscribe( msg => {
            // console.log('【WyLayerShareComponent】 - constructor - msg -', msg);

            this.surplusMsgCount = MAX_MSG - msg.length;
        })

        /**
         *   上面的可以直接不同注入 FormBuilder 直接写
         *
         *      this.formModel = new FormGroup({
         *          msg: new FormControl('', Validators.maxLength(140));
         *      })
         */
    }

    ngOnInit() {}

    // 注意这里和模板结合
    onSubmit() {
        console.log('【WyLayerShareComponent】- onSubmit - this.formModel -', this.formModel);
        if(this.formModel.valid) {
            // console.log('【WyLayerShareComponent】- onSubmit - this.shareInfo.id -', this.shareInfo.id);
            // console.log('【WyLayerShareComponent】- onSubmit - this.formModel.get("msg").value -', this.formModel.get('msg').value);
            // console.log('【WyLayerShareComponent】- onSubmit - this.shareInfo.type -', this.shareInfo.type);
            this.onShare.emit({
                id: this.shareInfo.id,
                type: this.shareInfo.type,
                msg: this.formModel.get('msg').value,
            })
        }
    }
}
