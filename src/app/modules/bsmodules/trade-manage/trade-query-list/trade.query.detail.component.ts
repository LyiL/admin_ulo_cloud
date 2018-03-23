import {Component} from "@angular/core";
import {DetailField} from "../../../../common/components/detail/detail";
import {ISidenavSrvice} from "../../../../common/services/isidenav.service";
import {HelpersAbsService} from "../../../../common/services/helpers.abs.service";
@Component({
  selector:"trade-query-list-detail",
  templateUrl:"trade.query.detail.component.html"
})
export class TradeQueryDetailComponent{

  public TradeQueryDetailFields:Array<DetailField> =
    [
      {
      title:'订单号：',
      field:'orderNo'
    },{
      title:'商户单号：',
      field:'outTradeNo'//根据接收参数
    },{
      title:'支付单号：',
      field:'transactionId'//根据接收参数
    },{
      title:'APPID：',
      field:'appid'
    },{
      title:'子商户appid：',
      field:'subAppid'
    },{
      title:'商户编号：',
      field:'merchantNo'
    },{
      title:'商户名称：',
      field:'merchantName'
    },{
      title:'银行编号：',
      field:'bankNo'
    },
    //   {
    //   title:'渠道编号：',
    //   field:'chanNo'
    // },
    //   {
    //     title:'代理商编号：',
    //     field:'agentno'
    //   },
      {
      title:'代理商编号：',
      field:'chanNo'
    },{
      title:'代理商名称：',
      field:'chanName'
    },{
      title:'商户组编号：',
      field:'groupno'
    },{
      title:'门店部门编号：',
      field:'deparno'
    },{
      title:'openId：',
      field:'openid'
    },{
      title:'子商户openid：',
      field:'subOpenid'
    },{
      title:'支付类型：',
      field:'transType'
    },{
      title:'签名类型：',
      field:'signType'
    },{
      title:'请求类型：',
      field:'reqtype',
      render:(function(data:any,field:DetailField){
        if(data && data[field.field] !== undefined){
          return this.helper.dictTrans('ORDER_NOTIFY_TYPE',data[field.field]);
        }else {
          return "/"
        }
      }).bind(this)

    },{
      title:'交易状态：',
      field:'tradeState',
      render:(function(data:any,field:DetailField){
        if(data && data[field.field] !== undefined){
          return this.helper.dictTrans('TRADE_STATUS',data[field.field]);
        }else {
          return "/"
        }
      }).bind(this)
    },{
      title:'通知状态：',
      field:'notifyState',
      render:(function(data:any,field:DetailField){
        if(data && data[field.field] !== undefined){
          return this.helper.dictTrans('ORDER_NOTIFY_STATE',data[field.field]);
        }else {
          return "/"
        }
      }).bind(this)
    },{
      title:'成功通知时间：',
      field:'notifyTime',
      type:"datetime"
    },{
      title:'通知Url：',
      field:'notifyUrl'
    },{
      title:'消息编码：',
      field:'messageCharset'
    },{
      title:'交易金额(元)：',
      field:'tradeMoney',
      type:'price'
    },{
      title:'退款金额(元)：',
      field:'refundMoney',
      type:'price'
    },{
      title:'支付金额(元)：',
      field:'totalFee',
      type:'price'

    },{
      title:'收款币种：',
      field:'feeType'
    },{
      title:'现金支付币种：',
      field:'cashCurrency'
    },{
      title:'现金支付金额：',
      field:'cashFee',
      type:'price'
    },{
      title:'设备类型：',
      field:'termtype'
    },{
      title:'设备号：',
      field:'termno'
    },{
      title:'收银员：',
      field:'operno'
    },{
      title:'收银员门店编号：',
      field:'shopno'
    },{
      title:'添加时间：',
      field:'addTime',
      type:"datetime"
    },{
      title:'交易时间：',
      field:'tradeTime',
      type:"datetime"
    },{
      title:'产品名称：',
      field:'body'
    },{
      title:'付款银行：',
      field:'bankType'
    },{
      title:'付款银行编号：',
      field:'bankTypeNo'
    },{
      title:'商户附加信息：',
      field:'attach'
    },{
      title:'设备信息：',
      field:'deviceInfo'
    },{
      title:'是否关注受理商户：',
      field:'isSubscribe'
    },{
      title:'子商户是否关注：',
      field:'subIsSubscribe'
    },{
      title:'优惠券金额：',
      field:'couponFee',
      type:'price'
    },{
      title:'商户服务器的ip：',
      field:'mchCreateIp'
    },{
      title:'支付服务器的IP：',
      field:'payCreateIp'
    },{
      title:'回调url：',
      field:'return_url'
      },
      {
        title:'交易父商户号：',
        field:'companion',
      },
      {
        title:'交易商户号：',
        field:'subCompanion'
      }
    ];
  /**
   * d订单详情请求参数
   * @type {{url: string}}
   */
  public TradeQueryDetailReqParam:any;

  constructor( public sidenavService:ISidenavSrvice,public helper:HelpersAbsService){
    let params = this.sidenavService.getPageParams();
    //查询产品详情信息
    this.TradeQueryDetailReqParam = {
      url:'/tradeoffQuery/orderInfo',
      params:params
    };
  }
  public onBack(){
    this.sidenavService.onNavigate('/admin/tradequery','交易查询',{detail:'tradeDetail'},true);
  }
}





