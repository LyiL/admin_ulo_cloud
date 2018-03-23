import {Component} from "@angular/core";
import {DetailField} from "../../../../common/components/detail/detail";
import {Column} from "../../../../common/components/table/table-extend-config";
import {Router} from "@angular/router";
import {ISidenavSrvice} from "../../../../common/services/isidenav.service";
import {HelpersAbsService} from "../../../../common/services/helpers.abs.service";

@Component({
  selector:"check-account-detail",
  templateUrl:"check.account.detail.component.html",
  providers: []
})

export class CheckAccountDetailComponent{
  public checkAccountDetailReqParam: any;
  public accountDetailFields:Array<DetailField> = [{
      title:'对账日期：',
      field:'reconDay',
      type:"datetime",
      format: 'yyyy-MM-dd'
    },{
      title:'结算账户：',
      field:'ally'
    },{
      title:'受理机构：',
      field:'agencyName'
    },{
      title: '交易金额：',
      field: 'totalQua',
      // type: "price"
    },{
      title:'退款金额：',
      field:'refundFee',
      // type: "price"
    },{
      title: '交易笔数：',
      field: 'totalQua'
    },{
      title:'退款笔数：',
      field:'refundQua'
    },{
      title: '异常笔数：',
      field: 'errTotalQua',
      render:(function(row:any,field:DetailField){
        let _count1 = row[field.field] || 0;
        let _count2 = row['errRefundQua'] || 0;
        let count = _count1 + _count2;//异常笔数加上异常退款笔数
        return count;
      }).bind(this),
    },{
      title:'异常金额：',
      field:'errTotalFee',
      render:(function(row:any,field:DetailField){
        let _price1 = row['errTotalFee'] || 0;
        let _price2 = row['errRefundFee'] || 0;
        let price = _price1 + _price2;//异常金额加上异常退款金额
        return this.helper.priceFormat(price);
      }).bind(this),
      // type: "price"
    },{
      title: '平账交易金额：',
      field: 'eqTotalFee',
      // type: "price"
    },{
      title:'平账退款金额：',
      field:'eqRefundFee',
      // type: "price"
    },{
      title: '手续费（四舍五入）：',
      field: 'poundage2',
      // type: "price"
    },{
      title:'手续费（6位小数）：',
      field:'poundage6',
      // type: "price"
    },{
      title: '退款手续费（四舍五入）：',
      field: 'refundPodg2',
      // type: "price"
    },{
      title:'退款手续费（6位小数）：',
      field:'refundPodg6',
      // type: "price"
    },{
      title:'第三方交易金额：',
      field:'trdTotalFee',
      // type: "price"
    },{
      title:'第三方退款金额：',
      field:'trdRefundFee',
      // type: "price"
    },{
      title:'第三方成功笔数：',
      field:'trdTotalQua'
    },{
      title:'第三方退款笔数：',
      field:'trdRefundQua'
    },{
      title:'第三方手续费金额：',
      field:'trdPodg',
      // type: "price"
    },{
      title:'第三方退款手续费：',
      field:'trdFavRefundFee',
      // type: "price"
    },{
      title:'第三方优惠成功总金额：',
      field:'trdRefundPodg',
      // type: "price"
    },{
      title:'第三方优惠退款金额：',
      field:'trdFavTotalFee',
      // type: "price"
    },{
      title:'对账状态：',
      field:'reconState',
      render:(function(row:any,field:DetailField){
        let _state = row[field.field];
        if(!this.helper.isEmpty(_state)){
          return this.helper.dictTrans('PARTNER_PRCSTATUS',_state);
        }
      }).bind(this),
  }];
  constructor(public sidenavService: ISidenavSrvice,public helper: HelpersAbsService){
    let params = this.sidenavService.getPageParams();
    //对账账户详情信息
    this.checkAccountDetailReqParam = {
      url: '/paymentCheckTradePartner/searchDetail',
      params: params
    };
  }
  backToList(){
    this.sidenavService.onNavigate('/admin/checkaccount', '对账账户', [], true);
  }
}





