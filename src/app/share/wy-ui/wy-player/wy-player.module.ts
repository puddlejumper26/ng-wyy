import { FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ClickoutsideDirective } from './../../directives/clickoutside.directive';
import { FormatTimePipe } from "../../pipes/format-time.pipe";
import { WySliderModule } from "../wy-slider/wy-slider.module";
import { WyPlayerComponent } from "./wy-player.component";
import { WyPlayerPanelComponent } from './wy-player-panel/wy-player-panel.component';
import { WyScrollComponent } from './wy-scroll/wy-scroll.component';

@NgModule({
    declarations: [WyPlayerComponent, FormatTimePipe, WyPlayerPanelComponent, WyScrollComponent, ClickoutsideDirective],
    imports: [CommonModule, WySliderModule, FormsModule],
    exports: [WyPlayerComponent, FormatTimePipe, ClickoutsideDirective],
})
export class WyPlayerModule {}
