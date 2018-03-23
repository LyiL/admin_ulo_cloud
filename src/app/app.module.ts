import {BrowserModule} from "@angular/platform-browser";
import {NgModule, LOCALE_ID} from "@angular/core";
import {AppComponent} from "./app.component";
import {MaterialModule, MdSnackBarModule} from "@angular/material";
import {FlexLayoutModule} from "@angular/flex-layout";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AppRoutingModule} from "./app.routing.module";
import {AdminComponent} from "./modules/admin/admin.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {SidenavModule} from "./modules/sidenav/sidenav.module";
import {SidenavService} from "./common/services/impl/sidenav.service";
import {ISidenavSrvice} from "./common/services/isidenav.service";
import {LoginComponent} from "./modules/login/login.component";
import {HeaderComponent} from "./modules/header/header.component";
import {BS_MODULES_IMPORT} from "./modules/bsmodules/bs.modules.imports";
import {HttpService} from "./common/services/impl/http.service";
import {ULOImageModule} from "./common/components/image-preview/index";
import {AuthAbsService} from "./common/services/auth.abs.service";
import {AuthService} from "./common/services/impl/auth.service";
import {InitDataAbsService} from "./common/services/init.data.abs.service";
import {InitDataService} from "./common/services/impl/init.data.service";
import {HelpersAbsService} from "./common/services/helpers.abs.service";
import {HelpersService} from "./common/services/impl/helpers.service";
import {RouterInterceptService} from "./common/services/impl/router.intercept.service";
import {CommonDirectiveModule} from "./common/directives/index";
import {HttpClientModule, HTTP_INTERCEPTORS} from "@angular/common/http";
import {UHttpInterceptor} from "./common/services/impl/http.interceptor";
import {EditPwdComponent} from "./modules/header/edit.pwd.component";
import {ULOLoadingModule} from "./common/components/loading/index";

export function HELPERS_FACTORY (initData:InitDataAbsService,_locale: string){
  return new HelpersService(initData,_locale);
};

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    LoginComponent,
    HeaderComponent,
    EditPwdComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FlexLayoutModule,
    AppRoutingModule,
    MaterialModule,
    SidenavModule,
    ULOImageModule,
    BS_MODULES_IMPORT,
    MdSnackBarModule,
    CommonDirectiveModule,
    ULOLoadingModule
  ],
  entryComponents:[EditPwdComponent],
  providers: [
    HttpService,
    RouterInterceptService,
    {provide:LOCALE_ID,useValue:"zh-CN"},
    {provide:ISidenavSrvice, useClass:SidenavService},
    {provide:AuthAbsService, useClass:AuthService},
    {provide:InitDataAbsService, useClass:InitDataService},
    {provide:HelpersAbsService,useFactory:HELPERS_FACTORY,deps:[InitDataAbsService,LOCALE_ID]},
    {provide:HTTP_INTERCEPTORS,useClass:UHttpInterceptor,multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
