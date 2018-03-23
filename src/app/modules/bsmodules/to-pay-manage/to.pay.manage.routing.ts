import {CashManageListComponent} from "./cash-manage-list/cash.manage.list.component";
import {CashManageDetailComponent} from "./cash-manage-list/cash.manage.detail.component";
import {ElectronicAccountListComponent} from "./electronic-account-list/electronic.account.list.component";
import {ElectronicAccountDetailComponent} from "./electronic-account-list/electronic.account.detail.component";
import {ToPayTradeListComponent} from "./to-pay-trade-list/to.pay.trade.list.component";
import {ToPayTradeDetailComponent} from "./to-pay-trade-list/to.pay.trade.detail.component";
import {CashManageAccountdetailComponent} from "./cash-manage-list/cash.manage.accountdetail.component";
import {ElectronicAccountAccountdetailComponent} from "./electronic-account-list/electronic.account.accountdetail.component";

export const topayrouters = [
  {path: 'cashmanagelist', component: CashManageListComponent},
  {path: 'cashmanagedetail', component: CashManageDetailComponent},
  {path: 'electronicaccountlist', component: ElectronicAccountListComponent},
  {path: 'electronicaccountdetail', component: ElectronicAccountDetailComponent},
  {path: 'topaytradelist', component: ToPayTradeListComponent},
  {path: 'topaytradedetail', component: ToPayTradeDetailComponent},
  {path: 'cashmanageaccountdetail', component: CashManageAccountdetailComponent},
  {path: 'electronicaccountaccountdetail', component: ElectronicAccountAccountdetailComponent}
];
