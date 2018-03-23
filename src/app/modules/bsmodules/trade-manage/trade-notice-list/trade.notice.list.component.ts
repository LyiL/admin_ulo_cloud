import {Component, ViewChild,OnInit} from "@angular/core";
import {TradeNoticeDBService, TradeNoticeListDBService} from "./trade.notice.list.db.service";
import {Column} from "../../../../common/components/table/table-extend-config";
import {ISidenavSrvice} from "../../../../common/services/isidenav.service";
import {DetailField, ULODetail} from "../../../../common/components/detail/detail";
import { MdPupop, MdSnackBar} from "@angular/material";
import {TradeNoticeForm} from "../../../../common/search.form/trade-manage.form/trade.notice.form";
import {MdTableExtend} from "../../../../common/components/table/table-extend";
import {HelpersAbsService} from "../../../../common/services/helpers.abs.service";
import {TradeNoticeBatchsyncComponent} from "./trade.notice.batchsync.win.component";
import {TradeNoticeBatchnoticeComponent} from "./trade.notice.batchnotice.win.component";

@Component({
  selector:"trade-notice-list-list",
  templateUrl:"./trade.notice.list.component.html",
  providers:[TradeNoticeListDBService,TradeNoticeDBService]
})

export class TradeNoticeComponent implements OnInit{
  public form:TradeNoticeForm = new TradeNoticeForm();
  @ViewChild('TradeNoticeTable') TradeNoticeTable:MdTableExtend;
  @ViewChild('tradeOrderDetail') tradeOrderDetail:ULODetail;
  /**
   * 通知状态
   */
  public notifyState:Array<any> = [];
  /**
   *请求类型
   */
  public reqType:Array<any> = [];
  public orderDetailDisplay:string = 'none';
  public TradeNoticeColumns:Array<Column>=
    [
    {
    name:"orderNo",
    title:"平台单号"
  },{
    name:"createdTime",
    title:"时间",
      xtype:"datetime"
  },{
    name:"notifyState",
    title:"通知状态",
      render:(function(row:any,name:string){
        if(row[name]){
          return this.helper.dictTrans('ORDER_NOTIFY_STATE',row[name]);
        }
        return "/"
      }).bind(this)
  },{
    name:"reqType",
    title:"请求类型",
      render:(function(row:any,name:string){
        if(row[name]){
          return this.helper.dictTrans('ORDER_NOTIFY_TYPE',row[name]);
        }
        return "/"
      }).bind(this)
  },{
    name:"outRspXml",
    title:"通知结果"
  }
  ];
  public tableActionCfg: any = {
    actions:[
      {
      btnName:"del",
      hide:true
    },{
      btnName:"edit",
      hide:true
    },{
      btnDisplay:"详情",
        hide:(()=>{
          if(this.helper.btnRole('TRADENOTICEDETAIL')){
            return false;
          }
          return true;
        }).bind(this),
      click:this.onDetailHendler.bind(this)
    }
      ]
  };
  public TradeOrderFields:Array<DetailField> =
    [
      {
    title:'商户单号：',
    field:'outTradeNo'
  },
      {
    title:'平台单号：',
    field:'orderNo'
  },{
    title:'支付单号：',
    field:'transactionId'
  },{
    title:'APPID：',
    field:'appid'
  },{
    title:'商户名称：',
    field:'merchantName'
  },{
    title:'openId:',
    field:'openid'
  },{
    title:'支付类型：',
    field:'transType'
  },{
    title:'交易时间：',
    field:'tradeTime',
      type:"datetime"
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
    title:'交易金额(元)：',
    field:'tradeMoney',
      type:'price'
  },{
    title:'退款金额(元)：',
    field:'refundMoney',
    type:'price'
  },{
    title:'设备号：',
    field:'termno'
  },{
    title:'收银员：',
    field:'operno'
  }];

  /**
   * 订单详情请求参数
   * @type {{url: string}}
   */
  public TradeNoticeReqParam:any = {
    url:'/tradeoffQuery/orderInfo',
    params:{}
  };
  constructor(public TradeNoticeDB:TradeNoticeListDBService,public sidenavService:ISidenavSrvice,public TradeNoticeDb:TradeNoticeDBService,
             public snackBar: MdSnackBar,public helper:HelpersAbsService, public pupop:MdPupop
  ){}
  ngOnInit(){
    this.TradeNoticeDB.params = this.form;
    this.TradeNoticeReqParam['params']=this.form;
    this.notifyState = this.helper.getDictByKey('ORDER_NOTIFY_STATE');
    this.reqType = this.helper.getDictByKey('ORDER_NOTIFY_TYPE');
    this.tradeOrderDetail.detailData.subscribe(res=>{
      this.orderDetailDisplay = 'block';
    });
  }
  onDetailHendler(row:any,e:MouseEvent):void{
    this.sidenavService.onNavigate('/admin/tradenoticedetail','详情',{id:row['id']});
  }

  public onSearch(){
    if(this.form.orderNo || this.form.outTradeNo || this.form.transactionId){
      this.form.doSearch(this.TradeNoticeDB);
      this.TradeNoticeTable.refresh();
      this.TradeNoticeReqParam['params']=this.form;
      this.tradeOrderDetail.refresh();
    }else {
      this.snackBar.alert('至少输入一个单号！');
    }

  }
  /**
   * 补单
   */
  public onSupplyOrder(event) {
    this.TradeNoticeDb.loadNotify(this.form).subscribe(res=>{
      if(res && res['status'] == 200){
        this.snackBar.alert("补单成功")
      }else {
        this.snackBar.alert(res.message)
      }
    });
  }
  /**
   * 同步
   */
  public onBatch(event) {
    this.TradeNoticeDb.loadSync(this.form).subscribe(res=>{
      if(res && res['status'] == 200){
        this.snackBar.alert("同步成功");
      }else {
        this.snackBar.alert(res.message);
      }
    });
  }
  /**
   * 批量同步弹窗
   */
  public openBatchsync (){
  let batchsyncWin = this.pupop.openWin(TradeNoticeBatchsyncComponent,{title:'批量同步',width:'616px',height:'350px'});
    batchsyncWin.afterClosed().subscribe(result => {
      this.TradeNoticeTable.refresh(this.form.page);
    });
  }
  /**
   * 批量通知弹窗
   */
  public openBatchnotice (){
    let batchnoticeWin = this.pupop.openWin(TradeNoticeBatchnoticeComponent,{title:'批量通知',width:'616px',height:'350px'});
    batchnoticeWin.afterClosed().subscribe(result => {
      this.TradeNoticeTable.refresh(this.form.page);
    });
}

}




