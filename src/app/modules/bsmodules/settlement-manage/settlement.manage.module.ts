import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {HttpModule} from "@angular/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms"

import {FlexLayoutModule} from "@angular/flex-layout";
import {
  MdCardModule, MdSelectModule, MdInputModule, MdInputSearchModule, MdButtonModule, MdTableModule,
  MdDialogModule, MdTabsModule, MdSnackBarModule, MdDatepickerModule, MdDatepickerToggle, MdNativeDateModule, MdSuffix
} from '@angular/material';
import {MdTableExtendModule} from "../../../common/components/table/index";

import {BusinessDayListComponent} from './business-day-list/business.day.list.component';
import {HitMoneyListComponent} from './hit-money-list/hit.money.list.component';

import {BusinessDayListSettlebtnWinComponent} from "./business-day-list/business.day.list.settlebtn.win.component";
import {ChannelDayListComponent} from "./channelday-list/channelday.list.component";
import {CommonDirectiveModule} from "../../../common/directives/index";
import {settlePayWinComponent} from "./channelday-list/settlepay.win.component";

@NgModule({
  declarations: [
    BusinessDayListComponent,
    HitMoneyListComponent,
    ChannelDayListComponent,
    BusinessDayListSettlebtnWinComponent,
    settlePayWinComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    FlexLayoutModule,
    MdCardModule,
    MdSelectModule,
    MdInputModule,
    MdInputSearchModule,
    MdButtonModule,
    ReactiveFormsModule,
    MdTableModule,
    MdTableExtendModule,
    MdDialogModule,
    MdTabsModule,
    MdSnackBarModule,
    CommonDirectiveModule,
    MdDatepickerModule,
    MdNativeDateModule,
  ],
  entryComponents: [
    BusinessDayListSettlebtnWinComponent,
    settlePayWinComponent
  ]
})
export class SettlementManageModule { }
