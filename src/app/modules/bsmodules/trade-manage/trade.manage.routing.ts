import {TradeNoticeComponent} from "./trade-notice-list/trade.notice.list.component";
import {TradeQueryComponent} from "./trade-query-list/trade.query.list.component";
import {TradeRankingComponent} from "./trade-ranking-list/trade.ranking.list.component";
import {TradeRatioComponent} from "./trade-ratio-list/trade.ratio.list.component";
import {TradeQueryDetailComponent} from "./trade-query-list/trade.query.detail.component";
import {TradeNoticeDetailComponent} from "./trade-notice-list/trade.notice.detail.component";
import {TradeRefundListComponent} from "./trade-refund-list/trade.refund.list.component";
import {TradeSuccessRatioComponent} from "./trade-ratio-list/trade.success.ratio.component";
import {TradeBlackuserListComponent} from "./trade-blackuser-list/trade.blackuser.list.component";
import {TradeRefundDetailComponent} from "./trade-refund-list/trade.refund.detail.component";
export const trademanagerouters = [
  {path: 'tradequery', component: TradeQueryComponent},
  {path: 'tradenotice', component: TradeNoticeComponent},
  {path: 'traderanking', component:TradeRankingComponent},
  {path: 'traderatio', component:TradeRatioComponent},
  {path: 'tradequerydetail', component: TradeQueryDetailComponent},
  {path: 'tradenoticedetail', component: TradeNoticeDetailComponent},
  {path: 'traderefund', component: TradeRefundListComponent},
  {path: 'traderefunddetail', component: TradeRefundDetailComponent},
  {path: 'tradesuccessratiochart', component: TradeSuccessRatioComponent},
  {path: 'tradeblackuser', component: TradeBlackuserListComponent}
  ];


