/**
 * Created by lenovo on 2017/8/1.
 */
import {AccountTaskComponent} from "./account-task-list/account.task.list.component";
import {AccountDownloadComponent} from "./account-download-list/account.download.list.component";
import {AccountSummaryComponent} from "./account-summary-list/account.summary.list.component";
import {CheckAccountComponent} from "./check-account-list/check.account.list.component";
import {BussinessAccountCheckComponent} from "./bussiness-account-check-list/bussiness.account.check.list.component";
import {AccountErrorComponent} from "./account-error-list/account.error.list.component";

import {AccountTaskDetailComponent} from "./account-task-list/account.task.detail.component";
import {CheckAccountDetailComponent} from "./check-account-list/check.account.detail.component";
import {AccountSummaryDetailComponent} from "./account-summary-list/account.summary.detail.component";
import {BussinessAccountCheckDetailComponent} from "./bussiness-account-check-list/bussiness.account.check.detail.component";
import {AccountErrorDetailComponent} from "./account-error-list/account.error.detail.component";

export const accountrouters = [
  {path: 'accounttask', component: AccountTaskComponent},
  {path: 'accountdownload', component: AccountDownloadComponent},
  {path: 'accountsummary', component: AccountSummaryComponent},
  {path: 'checkaccount', component: CheckAccountComponent},
  {path: 'bussinessaccountcheck', component: BussinessAccountCheckComponent},
  {path: 'accounterror', component: AccountErrorComponent},
  {path: 'accounttaskdetail', component: AccountTaskDetailComponent},
  {path: 'checkaccountdetail', component: CheckAccountDetailComponent},
  {path: 'accountsummarydetail', component: AccountSummaryDetailComponent},
  {path: 'bussinessaccountcheckdetail', component: BussinessAccountCheckDetailComponent},
  {path: 'accounterrordetail', component: AccountErrorDetailComponent}
];
