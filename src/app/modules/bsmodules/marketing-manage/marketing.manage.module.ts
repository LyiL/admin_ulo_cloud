///<reference path="luoluo-application-list/luoluo.application.list.component.ts"/>
/**
 * Created by lenovo on 2017/8/1.
 */
import {NgModule} from "@angular/core";


import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {FlexLayoutModule} from "@angular/flex-layout";
import {
  MdInputModule, MdCardModule, MdButtonModule, MdAutocompleteModule, MdInputSearchModule, MdSelectModule,
  MdIconModule, MdDialogModule, MdSnackBarModule, MdInputSearch, MdTabsModule, MdCheckboxModule, MdDatepickerModule,
  MdNativeDateModule, MdPupopModule
} from "@angular/material";
import {MdTableExtendModule} from "../../../common/components/table/index";
import {ULODetailModule} from "../../../common/components/detail/index";

import {CommonDirectiveModule} from "../../../common/directives/index";
import {LuoApplicationComponent} from "./luoluo-application-list/luoluo.application.list.component";
import {LuoApplicationAddComponent} from "./luoluo-application-list/luoluo.application.add.component";
import {LuoApplicationDetailComponent} from "./luoluo-application-list/luoluo.application.detail.component";
import {UloFileUploaderModule} from "../../../common/components/file-update/index";



@NgModule({
  declarations: [
    LuoApplicationComponent,
    LuoApplicationAddComponent,
    LuoApplicationDetailComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    MdInputModule,
    MdInputSearchModule,
    MdCardModule,
    FlexLayoutModule,
    MdTableExtendModule,
    MdTabsModule,
    MdButtonModule,
    ULODetailModule,
    MdDialogModule,
    MdSelectModule,
    MdCheckboxModule,
    CommonDirectiveModule,
    ReactiveFormsModule,
    MdDatepickerModule,
    MdNativeDateModule,
    MdPupopModule,
    UloFileUploaderModule
  ],
  entryComponents: [

  ]
})
export class MarketingManageModule { }

