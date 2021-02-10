import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppComponent } from "./app.component";
import { CoreModule } from "./core/core.module";

@NgModule({
    declarations: [AppComponent],
    imports: [CoreModule, BrowserAnimationsModule, BrowserModule],
    exports: [BrowserAnimationsModule, BrowserModule],
    // imports: [CoreModule, StoreModule.forRoot(reducers, {
    //   metaReducers,
    //   runtimeChecks: {
    //     strictStateImmutability: true,
    //     strictActionImmutability: true
    //   }
    // }), StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production })],
    bootstrap: [AppComponent],
})
export class AppModule {}
