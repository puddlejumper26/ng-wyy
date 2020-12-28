import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { HomeModule } from "./home/home.module";
import { SheetInfoModule } from "./sheet-info/sheet-info.module";
import { SheetListModule } from "./sheet-list/sheet-list.module";

@NgModule({
    declarations: [],
    imports: [CommonModule, HomeModule, SheetInfoModule, SheetListModule],
    exports: [HomeModule, SheetInfoModule, SheetListModule],
})
export class PagesModule {}
