import { PlayCountPipe } from "./../play-count.pipe";
import { BrowserModule } from "@angular/platform-browser";
/**
 *  Manage the components could be used in many places
 */

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SingleSheetComponent } from "./single-sheet/single-sheet.component";
import { WyPlayerModule } from "./wy-player/wy-player.module";

@NgModule({
    declarations: [PlayCountPipe, SingleSheetComponent],
    imports: [BrowserModule, CommonModule, WyPlayerModule],
    exports: [PlayCountPipe, SingleSheetComponent, WyPlayerModule],
})
export class WyUiModule {}
