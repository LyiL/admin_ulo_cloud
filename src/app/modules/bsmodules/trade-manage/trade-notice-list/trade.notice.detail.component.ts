import {Component} from "@angular/core";
import {DetailField} from "app/common/components/detail";

import {ISidenavSrvice} from "../../../../common/services/isidenav.service";
import {HelpersAbsService} from "../../../../common/services/helpers.abs.service";
import {DateFormatter} from "../../../../common/services/impl/intl";
@Component({
  selector:"trade-notice-list-detail",
  templateUrl:"trade.notice.detail.component.html"
})
export class TradeNoticeDetailComponent{
  /**
   * 通知状态
   */
  public notifyState:Array<any> = [];
  /**
   *请求类型
   */
  public reqType:Array<any> = [];

  /**
   * 交易通知详情请求参数
   * @type {{url: string}}
   */
  public TradeNoticeDetailReqParam:any;

  public TradeNoticeDetailFields:Array<DetailField> =
    [
      {
    title:'通知编号：',
    field:'id'
  },{
    title:'支付单号：',
    field:'orderNo'
  },{
    title:'平台请求：',
    field:'plantReqXml'
  },{
    title:'商户返回：',
    field:'outRspXml'
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
    title:'通知时间：',
    field:'createdTime',
      type:"datetime"
  },{
    title:'请求类型：',
    field:'reqType',
    render:(function(data:any,field:DetailField){
      if(data && data[field.field] !== undefined){
        return this.helper.dictTrans('ORDER_NOTIFY_TYPE',data[field.field]);
      }else {
        return "/"
      }
    }).bind(this)
  },{
    title:'错误信息：',
    field:'errmsg'
  }];

  constructor( public sidenavService:ISidenavSrvice,public helper:HelpersAbsService){
    let params = this.sidenavService.getPageParams();
    //查询交易通知详情信息
    this.TradeNoticeDetailReqParam = {
      url:'/orderNotify/detailOrderNotify',
      params:params
    };
  }
  ngOnInit() {

  }
  back():void{
    this.sidenavService.onNavigate('/admin/tradenotice','交易通知',[],true);
  }
}






