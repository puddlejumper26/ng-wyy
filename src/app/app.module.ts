import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { CoreModule } from "./core/core.module";

@NgModule({
    declarations: [AppComponent],
    imports: [CoreModule],
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
