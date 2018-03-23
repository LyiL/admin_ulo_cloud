import {BusinessDayListComponent} from "./business-day-list/business.day.list.component";
import {HitMoneyListComponent} from "./hit-money-list/hit.money.list.component";
import {ChannelDayListComponent} from "./channelday-list/channelday.list.component";

export const settlementRouter = [
  {path: 'settlement/businessday', component: BusinessDayListComponent},
  {path: 'settlement/hitmoney', component: HitMoneyListComponent},
  {path: 'settlement/channelday', component: ChannelDayListComponent}
];
