///<reference path="trade-refund-list/trade.refund.detail.component.ts"/>
/**
 * Created by Administrator on 2017/8/11.
 */
import { NgModule } from '@angular/core';
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {
  TradeNoticeComponent
} from "./trade-notice-list/trade.notice.list.component";
import {TradeQueryComponent} from "./trade-query-list/trade.query.list.component";
import {TradeRankingComponent} from "./trade-ranking-list/trade.ranking.list.component";
import {TradeRatioComponent} from "./trade-ratio-list/trade.ratio.list.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {
  MdButtonModule, MdCardModule, MdInputModule, MdInputSearchModule, MdOptionModule, MdSelectModule, MdTabsModule,
  MdDialogModule, MdDatepickerModule, MdNativeDateModule
} from "@angular/material";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MdTableExtendModule} from "../../../common/components/table/index";
import {TradeQueryDetailComponent} from "./trade-query-list/trade.query.detail.component";
import {ULODetailModule} from "../../../common/components/detail/index";
import {TradeNoticeDetailComponent} from "./trade-notice-list/trade.notice.detail.component";
import { TradeRefundListComponent} from "./trade-refund-list/trade.refund.list.component";
import {TradeNoticeBatchnoticeComponent} from "./trade-notice-list/trade.notice.batchnotice.win.component";
import {TradeNoticeBatchsyncComponent} from "app/modules/bsmodules/trade-manage/trade-notice-list/trade.notice.batchsync.win.component";
import {TradeApplyRefundComponent} from "./trade-refund-list/trade.applyrefund.win.component";
import {CommonDirectiveModule} from "../../../common/directives/index";
import {ChartsModule} from "../../../common/components/charts/index";
import {TradeSuccessRatioComponent} from "./trade-ratio-list/trade.success.ratio.component";
import {TradeSuccessRatioHourComponent} from "./trade-ratio-list/charts/trade.success.ratio.hour.component";
import {TradeSuccessRatioChartDayComponent} from "./trade-ratio-list/charts/trade.success.ratio.day.component";
import {TradeBlackuserListComponent} from "./trade-blackuser-list/trade.blackuser.list.component";
import {TradeBlackuserAddWinComponent} from "./trade-blackuser-list/trade.blackuser.add.win.component";
import {TradeBlackuserImportWinComponent} from "./trade-blackuser-list/trade.blackuser.import.win.component";
import {UloFileUploaderModule} from "../../../common/components/file-update/index";
import {TradeRefundDetailComponent} from "./trade-refund-list/trade.refund.detail.component";


@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
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
    UloFileUploaderModule,
    ReactiveFormsModule,
    MdDatepickerModule,
    MdNativeDateModule,
    CommonDirectiveModule,
    ChartsModule
  ],
  declarations: [
    TradeQueryComponent,
    TradeQueryDetailComponent,
    TradeNoticeComponent,
    TradeNoticeDetailComponent,
    TradeRankingComponent,
    TradeRatioComponent,
    TradeSuccessRatioChartDayComponent,
    TradeNoticeBatchnoticeComponent,
    TradeNoticeBatchsyncComponent,
    TradeRefundListComponent,
    TradeRefundDetailComponent,
    TradeApplyRefundComponent,
    TradeSuccessRatioComponent,
    TradeSuccessRatioHourComponent,
    TradeBlackuserListComponent,
    TradeBlackuserAddWinComponent,
    TradeBlackuserImportWinComponent
  ],
  entryComponents: [
    TradeNoticeBatchnoticeComponent,
    TradeNoticeBatchsyncComponent,
    TradeApplyRefundComponent,
    TradeSuccessRatioHourComponent,
    TradeSuccessRatioChartDayComponent,
    TradeBlackuserAddWinComponent,
    TradeBlackuserImportWinComponent
  ]
})
export class TradeManageModule { }
