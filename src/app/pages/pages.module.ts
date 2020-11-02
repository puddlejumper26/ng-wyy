import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { HomeModule } from "./home/home.module";

@NgModule({
    declarations: [],
    imports: [CommonModule, HomeModule],
    exports: [HomeModule],
})
export class PagesModule {}
