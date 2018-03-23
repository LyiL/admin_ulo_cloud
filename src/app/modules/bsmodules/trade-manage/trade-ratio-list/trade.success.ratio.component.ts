import {Component, ViewChild, ChangeDetectorRef, AfterViewInit} from "@angular/core";
import {ULODetailContainer} from "../../../../common/components/detail/detail-container";
import {TradeSuccessRatioChartDayComponent} from "./charts/trade.success.ratio.day.component";
import {TradeSuccessRatioHourComponent} from "./charts/trade.success.ratio.hour.component";
@Component({
  selector:'trade-success-ratio-ctr',
  templateUrl:'./trade.success.ratio.component.html'
})
export class TradeSuccessRatioComponent implements AfterViewInit{
  @ViewChild('tradeSuccessRatioCtr') tradeSuccessRatioCtr:ULODetailContainer;

  tabs:Array<any> = [
    {label: '日成功比例', content: TradeSuccessRatioChartDayComponent},
    {label: '每小时成功比例', content: TradeSuccessRatioHourComponent}];

  constructor(public changeDetectorRef: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.tradeSuccessRatioCtr.selectedIndex = 0;
    this.changeDetectorRef.detectChanges();
  }
}
