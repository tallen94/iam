import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http"; 
import { RouterModule, Routes } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { AceEditorModule } from "ng2-ace-editor";
import { NgxMdModule } from 'ngx-md';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ɵROUTER_PROVIDERS } from '@angular/router';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';


import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { Iam } from "./iam/iam";
import { TimeoutInterceptor } from "./iam/timeout-interceptor";
import { EditorComponent } from "./editor/editor.component";
import { HomeComponent } from './home/home.component';
import { RunComponent } from './run/run.component';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { MarketplaceComponent } from './marketplace/marketplace.component';
import { NestedInputComponent } from './nested-input/nested-input.component';
import { GraphComponent } from './graph/graph.component';
import { HeaderComponent } from './header/header.component';
import { HiddenHeaderComponent } from './hidden-header/hidden-header.component';
import { NewExecutableComponent } from './new-executable/new-executable.component';
import { SettingsComponent } from './settings/settings.component';
import { UserTokenModalComponent } from './user-token-modal/user-token-modal.component';

const appRoutes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "home", component: HomeComponent },
  { path: "admin", component: AdminComponent },
  { path: "settings", component: SettingsComponent },
  { path: "graph", component: GraphComponent },
  { path: "editor/:username/:exe/:name", component: EditorComponent },
  { path: "marketplace", component: MarketplaceComponent },
  { path: "", redirectTo: "/login", pathMatch: "full" }
];

@NgModule({
  declarations: [
    AppComponent,
    EditorComponent,
    HomeComponent,
    RunComponent,
    AdminComponent,
    SettingsComponent,
    LoginComponent,
    MarketplaceComponent,
    NestedInputComponent,
    GraphComponent,
    HeaderComponent,
    HiddenHeaderComponent,
    NewExecutableComponent,
    SettingsComponent,
    UserTokenModalComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes,{ enableTracing: true }),
    BrowserModule, 
    BrowserAnimationsModule,
    HttpClientModule,
    AceEditorModule,
    NgxMdModule,
    NgxGraphModule,
    NgxChartsModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [
    Iam,
    [{ provide: "HTTP_INTERCEPTORS", useClass: TimeoutInterceptor, multi: true }],
    [{ provide: "DEFAULT_TIMEOUT", useValue: 9999999 }],
    [{provide: LocationStrategy, useClass: HashLocationStrategy}],
    ɵROUTER_PROVIDERS,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


