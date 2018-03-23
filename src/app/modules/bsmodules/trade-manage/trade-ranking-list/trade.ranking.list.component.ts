import {Component, ViewChild,OnInit} from "@angular/core";
import {Column} from "../../../../common/components/table/table-extend-config";
import {TradeRankingListDBService} from "./trade.ranking.list.db.service";
import {TradeRankingForm} from "../../../../common/search.form/trade-manage.form/trade.ranking.form";
import {MdTableExtend} from "../../../../common/components/table/table-extend";
import {HelpersAbsService} from "app/common/services/helpers.abs.service";

@Component({
  selector:"trade-ranking-list",
  templateUrl:"trade.ranking.list.component.html",
  providers:[TradeRankingListDBService]
})
export class TradeRankingComponent implements OnInit{
  /**
   * 商户排名列表列名
   * @type {[{name: string; title: string},{name: string; title: string},{name: string; title: string},{name: string; title: string},{name: string; title: string},{name: string; title: string},{name: string; title: string}]}
   */
  public form :TradeRankingForm = new TradeRankingForm();//form
  @ViewChild('TradeRankingTable') TradeRankingTable:MdTableExtend;
  public TradeRankingColumns:Array<Column>=[
    {
    name:"billTime",
    title:"日结时间",
    xtype:"datetime",
    format:"YYYY-MM-DD"
  },{
    name:"mchName",
    title:"商户名称"
  },{
    name:"totalCount",
    title:"成功笔数（笔）"
  },{
    name:"totalFee",
    title:"交易金额（元）",
    // xtype:'price'
  },{
    name:"avgFee",
    title:"平均数（元）"
  },{
    name:"thiTotalCountRatio",
    title:"交易量比率（%）",
    render:((row:any,fieldName:string,cell?:any) => {
      let _thiTotalCountRatio = row['thiTotalCountRatio'] || 0;
      if(_thiTotalCountRatio == 0){
        return "0";
      }else {
        return (_thiTotalCountRatio * 100).toFixed(2)
      }
    })
  }
    ,{
      name:"y",
      title:"对比昨日金额（元）",
      // xtype:'price',
      render:(row:any,fieldName:string,cell?:any) => {
        // if(row['totalFee'] && row['yestodayFee']){
          let _totalFee = row['totalFee'] || 0;
          let _yestodayFee = row['yestodayFee'] || 0;
          let price = _totalFee-_yestodayFee;
          if(price > 0 ){
            cell.color="success-font";
          }
          if(price<0){
            cell.color="danger-font";
          }
          if(price == 0){
            return "0";
          }
          return  this.helper.priceFormat(price);
        // }
      }
    }
  ];
  public tableActionCfg: any = {
   hide:true
  };

  constructor(public TradeRankingDB:TradeRankingListDBService,public helper: HelpersAbsService){
    // this.TradeRankingDB.params = this.form;
  }
  ngOnInit(){
    this.TradeRankingDB.params = this.form;
  }
  public onSearch(){
    this.form.doSearch(this.TradeRankingDB);
    this.TradeRankingTable.refresh();
  }
  onChangeTime(result: any){
    this.form.billTime = result.value;
  }
}
