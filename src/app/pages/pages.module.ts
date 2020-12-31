import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { HomeModule } from "./home/home.module";
import { SheetInfoModule } from "./sheet-info/sheet-info.module";
import { SheetListModule } from "./sheet-list/sheet-list.module";
import { SongInfoModule } from './song-info/song-info.module';

@NgModule({
    declarations: [],
    imports: [CommonModule, HomeModule, SheetInfoModule, SheetListModule, SongInfoModule],
    exports: [HomeModule, SheetInfoModule, SheetListModule, SongInfoModule],
})
export class PagesModule {}
