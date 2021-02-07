import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ChangeDetectionStrategy, Input } from "@angular/core";

import { ShareInfo } from './../../../../store/reducers/member.reducer';

@Component({
    selector: "app-wy-layer-share",
    templateUrl: "./wy-layer-share.component.html",
    styleUrls: ["./wy-layer-share.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WyLayerShareComponent implements OnInit {

    @Input() shareInfo: ShareInfo;
    formModel: FormGroup

    constructor(
        private fb: FormBuilder,
    ) {
        // console.log('【WyLayerShareComponent】- constructor - this.shareInfo -', this.shareInfo)
        this.formModel = this.fb.group({
            msg:['', Validators.maxLength(140)]
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

    }
}
