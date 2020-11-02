import { NgModule, Optional, SkipSelf } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { registerLocaleData } from "@angular/common";
import zh from "@angular/common/locales/zh";
import { NZ_I18N, zh_CN } from "ng-zorro-antd";

import { AppRoutingModule } from "../app-routing.module";
import { PagesModule } from "../pages/pages.module";
import { ServicesModule } from "./../services/services.module";
import { ShareModule } from "../share/share.module";

registerLocaleData(zh);

@NgModule({
    declarations: [],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        HttpClientModule,
        PagesModule,
        ServicesModule,
        ShareModule,
        AppRoutingModule /*put at the end in order for the app running*/,
    ],
    exports: [ShareModule, AppRoutingModule],
    providers: [{ provide: NZ_I18N, useValue: zh_CN }],
})
export class CoreModule {
    // this is to ensure CoreModule only imported by AppModule
    // Here only AppModule imported this CoreModule, therefore when the code is running,
    // all the codes here would be run through, due to the parentModule does not exist
    // therefore here would throw no error
    // if by mistake other module imports CoreModule beside AppModule. Then when the code
    // is running to the extra module, it would call CoreModule through AppModule, then
    // the parentModule would exist as type in CoreModule, therefore here would throw an error

    // ONE problem is : it would run forever cause it injected self
    // with @SkipSelf(), when searching parentModule, skip CoreModule , only searching in other modules
    // but it would make mistake cause for the first time running, 在第一次注入的时候，there is no CoreMudle
    // then Angular would throw an error, so we need the second decorator
    //@Optional()
    constructor(@SkipSelf() @Optional() parentModule: CoreModule) {
        if (parentModule) {
            throw new Error("CoreModule should only be imported by AppModule");
        }
    }
}
