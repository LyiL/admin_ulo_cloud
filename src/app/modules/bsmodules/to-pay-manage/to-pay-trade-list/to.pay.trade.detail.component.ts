import {Component, OnInit} from "@angular/core";
import {DetailField} from "../../../../common/components/detail/detail";
import {Column} from "../../../../common/components/table/table-extend-config";
import {Router} from "@angular/router";
import {ISidenavSrvice} from "../../../../common/services/isidenav.service";
import {HelpersAbsService} from "../../../../common/services/helpers.abs.service";


@Component({
  selector:"to-pay-trade-detail",
  templateUrl:"to.pay.trade.detail.component.html",
  providers: []
})

export class ToPayTradeDetailComponent implements OnInit {
  /**
   * 交易状态
   */
  public tradeStates:Array<any> = [];
  /**
   * 账户类型
   */
  public accountTypes:Array<any> = [];
  public toPayTradeDetailReqParam: any;
  public ToPayTradeDetailFields:Array<DetailField> = [{
      title:'代付单号：',
      field:'transNo'
    },{
      title:'商户单号：',
      field:'outTradeNo'
    },{
      title:'商户号：',
      field:'mchNo'
    },{
      title:'商户名：',
      field:'mchName'
    },{
      title:'电子账户编号：',
      field:'accountNo'
    },{
      title:'电子账户编号名称：',
      field:'accountName'
    },{
      title:'资金池账户号：',
      field:'cashpoolNo'
    },{
      title:'资金池账户名：',
      field:'cashpollName'
    },{
      title:'交易状态：',
      field:'tradeState',
      render:(function(row:any,field:DetailField){
        let _state = row[field.field];
        if(this.helper.isEmpty(_state)){
          return '/';
        }else{
          return this.helper.dictTrans('CASH_ORDER_STATUS',_state);
        }
      }).bind(this),
    },{
      title:'处理描述：',
      field:'tradeStateDesc'
    },{
      title:'交易时间：',
      field:'tradeTime',
      type:"datetime"
    },{
      title:'代付金额（元）：',
      field:'totalFee',
      type:"price"
    },{
      title:'手续费（元）：',
      field:'procsFee',
      type:"price"
    },{
      title:'代付总额（元）：',
      field:'totalAmount',
      type:"price"
    },{
      title:'上游手续费（元）：',
      field:'transProcsFee',
      type:"price"
    },{
      title:'上游出款单号：',
      field:'transactionId'
    },{
      title:'账户类型：',
      field:'payType',
      render:(function(row:any,field:DetailField){
        if(this.helper.isEmpty(row[field.field])){
          return '/';
        }else{
          return this.helper.dictTrans('CASH_ACCOUNT_TYPE',row[field.field]);
        }
      }).bind(this)
    },{
      title:'入账账户名：',
      field:'payName'
    },{
      title:'入账账户卡号：',
      field:'payCardNo'
    },{
      title:'联行号：',
      field:'bankUnionNo'
    },{
      title:'代付备注：',
      field:'body'
  }];
  constructor(public sidenavService: ISidenavSrvice, protected helper: HelpersAbsService,){
    let params = this.sidenavService.getPageParams();
    //代付交易详情信息
    this.toPayTradeDetailReqParam = {
      url: '/cashTrans/detail',
      params: params
    };
  }
  ngOnInit(){
    this.tradeStates = this.helper.getDictByKey('CASH_ORDER_STATUS');
    this.accountTypes = this.helper.getDictByKey('CASH_ACCOUNT_TYPE');
  }
  backToList(){
    this.sidenavService.onNavigate('/admin/topaytradelist', '代付交易', [], true);
  }
}





