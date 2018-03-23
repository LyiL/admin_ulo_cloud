import {Component} from "@angular/core";
import {DetailField} from "../../../../common/components/detail/detail";
import {Column} from "../../../../common/components/table/table-extend-config";
import {Router} from "@angular/router";
import {ISidenavSrvice} from "../../../../common/services/isidenav.service";
import {HelpersAbsService} from "../../../../common/services/helpers.abs.service";


@Component({
  selector:"account-error-detail",
  templateUrl:"account.error.detail.component.html",
  providers: []
})

export class AccountErrorDetailComponent{
  public accountErrorDetailReqParam:any;
  public accountDetailFields:Array<DetailField> = [{
      title:'差错编号：',
      field:'id'
    },{
      title:'对账日期：',
      field:'reconDay',
      type:"datetime",
      format: "yyyy-MM-dd"
    },{
      title:'结算账户：',
      field:'partner'
    },{
      title:'受理机构：',
      field:'agencyName'
    },{
      title:'平台单号：',
      field:'orderNo'
    },{
      title:'第三方订单号：',
      field:'transactionId'
    },{
      title:'退款单号：',
      field:'refundNo'
    },{
      title:'第三方退款单号：',
      field:'refundId'
    },{
      title:'交易金额：',
      field:'totalFee',
      // type: "price"
    },{
      title:'退款金额：',
      field:'refundFee',
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
      title:'第三方记录的商户费率：',
      field:'trdBillRate'
    },{
      title:'第三方手续费金额：',
      field:'trdPodg',
      // type: "price"
    },{
      title:'差错信息：',
      field:'errMsg'
    },{
      title:'处理日期：',
      field:'handleDay',
      type:"datetime",
      format: "yyyy-MM-dd"
    },{
      title:'处理备注：',
      field:'handleDesc'
    },{
      title: '处理状态：',
      field: 'handleState',
      render:(function(row:any,field:DetailField){
        let _state = row[field.field];
        return this.helper.dictTrans('CHECKERROR_PRCSTATUS',_state);
      }).bind(this),
  }];
  constructor(public sidenavService: ISidenavSrvice,public helper: HelpersAbsService){
    let params = this.sidenavService.getPageParams();
    //对账异常详情信息
    this.accountErrorDetailReqParam = {
      url: '/pctsManager/seachPctErrorById',
      params: params
    };
  }
  backToList(){
    this.sidenavService.onNavigate('/admin/accounterror', '对账异常', [], true);
  }
}





