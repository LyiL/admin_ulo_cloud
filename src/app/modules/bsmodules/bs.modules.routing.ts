import {routers} from "./user-file-manage/user.file.manage.routing";
import {trademanagerouters} from "./trade-manage/trade.manage.routing";
import {accountrouters} from "./account-manage/account.manage.routing";
import {settlementRouter} from "./settlement-manage/settlement.manage.routing";
import {systemmanagerouters} from "./system-manage/system.manage.routing";
import {topayrouters} from "./to-pay-manage/to.pay.manage.routing";
import {productCfgRouting} from "./product-cfg-manage/product.cfg.routing";
import {macketingtrouters} from "./marketing-manage/marketing.manage.routing";
import {riskmanagerouters} from "./risk-manage/risk.manage.routing";
export const BS_ROUTING = [].concat(routers)
                            .concat(accountrouters)
                            .concat(settlementRouter)
                            .concat(trademanagerouters)
                            .concat(topayrouters)
                            .concat(systemmanagerouters)
                            .concat(productCfgRouting)
                            .concat(macketingtrouters)
                            .concat(riskmanagerouters);



