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

@NgModule({
    declarations: [PlayCountPipe, SingleSheetComponent],
    imports: [
        BrowserModule,
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
    ],
})
export class WyUiModule {}
