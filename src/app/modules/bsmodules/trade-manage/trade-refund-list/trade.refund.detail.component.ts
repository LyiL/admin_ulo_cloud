import {Component} from "@angular/core";
import {DetailField} from "../../../../common/components/detail/detail";
import {ISidenavSrvice} from "../../../../common/services/isidenav.service";
import {HelpersAbsService} from "../../../../common/services/helpers.abs.service";

@Component({
  selector:"trade-refund-detail",
  templateUrl:"./trade.refund.detail.component.html"
})
export class TradeRefundDetailComponent{
  public TradeRefundDetailReqParam:any;
  public TradeRefundDetailFields:Array<DetailField> =
    [
      {
      title:'退款单号：',
      field:'refundNo'
    },{
      title:'商户单号：',
      field:'outTradeNo'
    },{
      title:'平台订单号：',
      field:'orderNo'
    },{
      title:'第三方退款单号：',
      field:'refundid'
    },{
      title:'第三方订单号：',
      field:'transactionId'
    },{
      title:'商户退款单号：',
      field:'outRefundNo'
    },{
      title:'退款渠道：',
      field:'refundChannel'
    },{
      title:'商户编号：',
      field:'merchantNo'
    },{
      title:'商户名称：',
      field:'merchantName'
    },{
      title:'支付类型：',
      field:'transType'
    },{
      title:'订单总额(元)：',
      field:'totalFee',
      type:'price'
    },{
      title:'退款金额(元)：',
      field:'refundFee',
      type:'price'
    },{
      title:'币种：',
      field:'currency',
      render:(function(data:any,field:DetailField){
        if(data && data[field.field] !== undefined){
          return this.helper.dictTrans('FEETYPE',data[field.field]);
        }else {
          return "/"
        }
      }).bind(this)
    },{
      title:'退款申请时间：',
      field:'addTime',
      type:"datetime"
    },{
      title:'商户审核状态：',
      field:'merchantExam',
      render:(function(data:any,field:DetailField){
        if(data && data[field.field] !== undefined){
          return this.helper.dictTrans('REFUND_MCH_AUDIT_STATUS',data[field.field]);
        }
      }).bind(this)
    },{
      title:'订单状态：',
      field:'orderState',
      render:(function(data:any,field:DetailField){
        if(data && data[field.field] !== undefined){
          return this.helper.dictTrans('TRADE_STATUS',data[field.field]);
        }
      }).bind(this)
    },{
      title:'审核用户：',
      field:'merchantExamUser'
    },{
      title:'商户审核时间：',
      field:'mchReviewTime',
      type:"datetime"
    },{
      title:'商户退回原因：',
      field:'mchRefuseReason'
    },{
      title:'平台审核状态：',
      field:'daemonAudit',
      render:(function(data:any,field:DetailField){
        if(data && data[field.field] !== undefined){
          return this.helper.dictTrans('TRADE_STATUS',data[field.field]);
        }
      }).bind(this)
    },{
      title:'平台审核时间：',
      field:'ptReviewTime',
      type:"datetime"
    },{
      title:'支付退回原因：',
      field:'refuseReason'
    },{
      title:'退款状态：',
      field:'refundState',
      render:(function(data:any,field:DetailField){
        if(data && data[field.field] !== undefined){
          return this.helper.dictTrans('REFUND_STATUS',data[field.field]);
        }
      }).bind(this)
    },{
      title:'退款审核时间：',
      field:'refundTime',
      type:"datetime"
    },{
      title:'风控状态：',
      field:'riskCtr',
      render:(function(data:any,field:DetailField){
        if(data && data[field.field] !== undefined){
          return this.helper.dictTrans('RISK_CTR_STATU',data[field.field]);
        }
      }).bind(this)
    },{
      title:'风控信息描述：',
      field:'riskInfo'
    },{
      title:'退款用户：',
      field:'refundUser'
    },{
      title:'退款来源：',
      field:'refundSource',
      render:(function(data:any,field:DetailField){
        if(data && data[field.field] !== undefined){
          return this.helper.dictTrans('REFUND_REFUNDSOURCE',data[field.field]);
        }
      }).bind(this)
    },{
      title:'银行编码：',
      field:'bankNo'
    },{
      title:'组编码：',
      field:'groupno'
    },{
      title:'代理商树编号：',
      field:'agentno'
    },{
      title:'门店部门编号：',
      field:'deparno'
    },{
      title:'终端类型：',
      field:'termtype'
    },{
      title:'终端编号：',
      field:'termno'
    },{
      title:'操作员编号：',
      field:'operno'
    }, {
    title: '操作门店编号：',
    field: 'storeno'
  }];

  constructor(public sidenavService:ISidenavSrvice,public helper:HelpersAbsService){
    let params = this.sidenavService.getPageParams();
    //查询退款详情信息
    this.TradeRefundDetailReqParam = {
      url:'/refund/findById',
      params:params
    };
  }
  back():void{
    this.sidenavService.onNavigate('/admin/traderefund','退款审核',{detail: 'detail'},true);
  }
}





