import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';

// import and export public modules

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    NgZorroAntdModule,
  ],
  exports:[
    CommonModule,
    FormsModule,
    NgZorroAntdModule,
  ]
})
export class ShareModule { }