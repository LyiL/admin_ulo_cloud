/**
 * Created by lenovo on 2017/8/1.
 */
import {NgModule} from "@angular/core";

import {AccountTaskComponent} from "./account-task-list/account.task.list.component";
import {AccountDownloadComponent} from "./account-download-list/account.download.list.component";
import {AccountSummaryComponent} from "./account-summary-list/account.summary.list.component";
import {CheckAccountComponent} from "./check-account-list/check.account.list.component";
import {BussinessAccountCheckComponent} from "./bussiness-account-check-list/bussiness.account.check.list.component";
import {AccountErrorComponent} from "./account-error-list/account.error.list.component";

import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {FlexLayoutModule} from "@angular/flex-layout";
import {
  MdInputModule, MdCardModule, MdButtonModule, MdAutocompleteModule, MdInputSearchModule, MdSelectModule,
  MdIconModule, MdDialogModule, MdSnackBarModule, MdInputSearch
} from "@angular/material";
import {MdTableExtendModule} from "../../../common/components/table/index";
import {ULODetailModule} from "../../../common/components/detail/index";

import {AccountTaskDetailComponent} from "./account-task-list/account.task.detail.component";
import {CheckAccountDetailComponent} from "./check-account-list/check.account.detail.component";
import {AccountSummaryDetailComponent} from "./account-summary-list/account.summary.detail.component";
import {BussinessAccountCheckDetailComponent} from "./bussiness-account-check-list/bussiness.account.check.detail.component";
import {AccountErrorDetailComponent} from "./account-error-list/account.error.detail.component";
import {AccountTaskListEditbtnWinComponent} from "./account-task-list/account.task.list.editbtn.win.component";
import {CommonDirectiveModule} from "../../../common/directives/index";



@NgModule({
  declarations: [
    AccountTaskComponent,
    AccountDownloadComponent,
    AccountSummaryComponent,
    CheckAccountComponent,
    BussinessAccountCheckComponent,
    AccountErrorComponent,
    AccountTaskDetailComponent,
    CheckAccountDetailComponent,
    AccountSummaryDetailComponent,
    BussinessAccountCheckDetailComponent,
    AccountErrorDetailComponent,
    AccountTaskListEditbtnWinComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    FlexLayoutModule,
    MdInputModule,
    MdCardModule,
    MdButtonModule,
    MdAutocompleteModule,
    MdInputSearchModule,
    MdSelectModule,
    MdIconModule,
    MdTableExtendModule,
    ULODetailModule,
    MdDialogModule,
    MdSnackBarModule,
    CommonDirectiveModule,
  ],
  entryComponents: [
    AccountTaskListEditbtnWinComponent,
  ]
})
export class AccountManageModule { }
