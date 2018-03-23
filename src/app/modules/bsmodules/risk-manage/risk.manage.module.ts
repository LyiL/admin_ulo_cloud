import { NgModule } from '@angular/core';
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {
  MdButtonModule, MdCardModule, MdInputModule, MdInputSearchModule, MdOptionModule, MdSelectModule, MdTabsModule,
  MdDialogModule, MdCheckboxModule, MdTreeModule, MdDatepickerModule, MdNativeDateModule
} from "@angular/material";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MdTableExtendModule} from "../../../common/components/table/index";
import {ULODetailModule} from "../../../common/components/detail/index";
import {CommonDirectiveModule} from "../../../common/directives/index";
import {UloFileUploaderModule} from "../../../common/components/file-update/index";
import {RiskMchListComponent} from "./risk-mch-list/risk.mch.list.component";

/**
 * 风险管理模块
 */
@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    MdInputModule,
    MdCardModule,
    FlexLayoutModule,
    MdTableExtendModule,
    MdInputSearchModule,
    MdSelectModule,
    MdOptionModule,
    MdButtonModule,
    ULODetailModule,
    MdTabsModule,
    MdDialogModule,
    MdCheckboxModule,
    CommonDirectiveModule,
    MdTreeModule,
    UloFileUploaderModule,
    MdDatepickerModule,
    MdNativeDateModule
  ],
  declarations: [
    RiskMchListComponent
  ],
  entryComponents: [

  ]

})
export class RiskManangeModule { }
