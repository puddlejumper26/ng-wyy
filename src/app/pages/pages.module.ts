import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { HomeModule } from "./home/home.module";
import { SheetListModule } from "./sheet-list/sheet-list.module";

@NgModule({
    declarations: [],
    imports: [CommonModule, HomeModule, SheetListModule],
    exports: [HomeModule, SheetListModule],
})
export class PagesModule {}
