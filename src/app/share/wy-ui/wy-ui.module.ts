import { BrowserModule } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

/**
 *  Manage the components could be used in many places
 */

import { PlayCountPipe } from "../pipes/play-count.pipe";
import { SingleSheetComponent } from "./single-sheet/single-sheet.component";
import { WyLayerModule } from "./wy-layer/wy-layer.module";
import { WyPlayerModule } from "./wy-player/wy-player.module";
import { WySearchModule } from './wy-search/wy-search.module';
import { ImgDefaultDirective } from "../directives/img-default.directive";

@NgModule({
    declarations: [PlayCountPipe, SingleSheetComponent, ImgDefaultDirective],
    imports: [
        CommonModule,
        WyLayerModule,
        WyPlayerModule,
        WySearchModule,
    ],
    exports: [
        PlayCountPipe,
        SingleSheetComponent,
        WyLayerModule,
        WyPlayerModule,
        WySearchModule,
        ImgDefaultDirective
    ],
})
export class WyUiModule {}
