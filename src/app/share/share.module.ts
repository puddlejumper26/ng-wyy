import { WyUiModule } from './wy-ui/wy-ui.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';

// import and export public modules

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgZorroAntdModule,
    WyUiModule,
  ],
  exports:[
    CommonModule,
    FormsModule,
    NgZorroAntdModule,
    WyUiModule,
  ]
})
export class ShareModule { }