/**
 * Created by lenovo on 2017/8/4.
 */
import {NgModule} from "@angular/core";

import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {FlexLayoutModule} from "@angular/flex-layout";
import {
  MdInputModule, MdCardModule, MdButtonModule, MdAutocompleteModule, MdInputSearchModule, MdSelectModule,
  MdIconModule, MdDialogModule, MdSnackBarModule, MdTabsModule, MdDatepickerModule, MdNativeDateModule
} from "@angular/material";
import {MdTableExtendModule} from "../../../common/components/table/index";
import {ULODetailModule} from "../../../common/components/detail/index";

import {CashManageListComponent} from "./cash-manage-list/cash.manage.list.component";
import {CashManageDetailComponent} from "./cash-manage-list/cash.manage.detail.component";
import {ElectronicAccountListComponent} from "./electronic-account-list/electronic.account.list.component";
import {ElectronicAccountDetailComponent} from "./electronic-account-list/electronic.account.detail.component";
import {ToPayTradeListComponent} from "./to-pay-trade-list/to.pay.trade.list.component";
import {CashManagelistAddbtnWinComponent} from "./cash-manage-list/cash.manage.list.addbtn.win.component";
import {CashManagelistEditbtnWinComponent} from "./cash-manage-list/cash.manage.list.editbtn.win.component";
import {ElectronicAccountListAddbtnWinComponent} from "./electronic-account-list/electronic.account.list.addbtn.win.component";
import {ElectronicAccountListEditbtnWinComponent} from "./electronic-account-list/electronic.account.list.editbtn.win.component";
import {ToPayTradeDetailComponent} from "./to-pay-trade-list/to.pay.trade.detail.component";
import {ElectronicAccountListTakecashbtnWinComponent} from "./electronic-account-list/electronic.account.list.takecashbtn.win.component";
import {CashManageAccountdetailComponent} from "./cash-manage-list/cash.manage.accountdetail.component";
import {ElectronicAccountAccountdetailComponent} from "./electronic-account-list/electronic.account.accountdetail.component";
import {ElectronicAccountListDistributionWinComponent} from "./electronic-account-list/electronic.account.list.distribution.win.component";
import {CommonDirectiveModule} from "../../../common/directives/index";


@NgModule({
  declarations: [
    CashManageListComponent,
    CashManageDetailComponent,
    ElectronicAccountListComponent,
    ElectronicAccountDetailComponent,
    ToPayTradeListComponent,
    CashManagelistAddbtnWinComponent,
    CashManagelistEditbtnWinComponent,
    ElectronicAccountListAddbtnWinComponent,
    ElectronicAccountListEditbtnWinComponent,
    ToPayTradeDetailComponent,
    ElectronicAccountListTakecashbtnWinComponent,
    CashManageAccountdetailComponent,
    ElectronicAccountAccountdetailComponent,
    ElectronicAccountListDistributionWinComponent
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
    MdTabsModule,
    CommonDirectiveModule,
    MdDatepickerModule,
    MdNativeDateModule,
  ],
  entryComponents: [
    CashManagelistAddbtnWinComponent,
    CashManagelistEditbtnWinComponent,
    ElectronicAccountListAddbtnWinComponent,
    ElectronicAccountListEditbtnWinComponent,
    ElectronicAccountListTakecashbtnWinComponent,
    ElectronicAccountListDistributionWinComponent
  ]
})
export class ToPayManageModule { }
