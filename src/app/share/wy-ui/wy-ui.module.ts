import { BrowserModule } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
/**
 *  Manage the components could be used in many places
 */

import { SingleSheetComponent } from "./single-sheet/single-sheet.component";
import { WyPlayerModule } from "./wy-player/wy-player.module";
import { PlayCountPipe } from "../pipes/play-count.pipe";

@NgModule({
    declarations: [PlayCountPipe, SingleSheetComponent],
    imports: [BrowserModule, CommonModule, WyPlayerModule],
    exports: [PlayCountPipe, SingleSheetComponent, WyPlayerModule],
})
export class WyUiModule {}
