import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { HomeModule } from "./home/home.module";
import { MemberModule } from "./member/member.module";
import { SheetInfoModule } from "./sheet-info/sheet-info.module";
import { SheetListModule } from "./sheet-list/sheet-list.module";
import { SingerModule } from "./singer/singer.module";
import { SongInfoModule } from './song-info/song-info.module';

@NgModule({
    declarations: [],
    imports: [CommonModule, HomeModule, MemberModule, SheetInfoModule, SheetListModule, SingerModule, SongInfoModule],
    exports: [HomeModule, SheetInfoModule, SheetListModule, MemberModule, SingerModule, SongInfoModule],
})
export class PagesModule {}
