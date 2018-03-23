import {ChangeDetectorRef, Component, ElementRef, ViewChild,OnInit} from "@angular/core";
import {Column} from "../../../../common/components/table/table-extend-config";
import {ISidenavSrvice} from "../../../../common/services/isidenav.service";
import {TradeRefundDBService, TradeRefundListDbService} from "./trade.refund.list.db.service";
import {TradeRefundForm} from "../../../../common/search.form/trade-manage.form/trade.refund.form";
import {Confirm, MdPupop, MdSnackBar} from "@angular/material";
import {MdTableExtend} from "../../../../common/components/table/table-extend";
import {HelpersAbsService} from "../../../../common/services/helpers.abs.service";
import {CommonDBService, LoadMerchantDBService} from "../../../../common/db-service/common.db.service";
import {InputSearchDatasource} from "../../../../common/services/impl/input.search.datasource";
import {TradeApplyRefundComponent} from "./trade.applyrefund.win.component";
import {TradeRefundOrderListDbService} from "app/modules/bsmodules/trade-manage/trade-refund-list/trade.refund.order.db.service";
import {TradeOrderQueryForm} from "../../../../common/search.form/trade-manage.form/trade.orderquery.form";

@Component({
  selector: 'app-trade-refund',
  templateUrl: './trade.refund.list.component.html',
  styles: [``],
  providers: [TradeRefundListDbService,TradeRefundOrderListDbService,CommonDBService,LoadMerchantDBService,TradeRefundDBService]
})
export class TradeRefundListComponent implements OnInit{
  public form :TradeRefundForm = new TradeRefundForm();              // 批量查询
  public formOrder :TradeOrderQueryForm = new TradeOrderQueryForm(); // 订单号查询
  @ViewChild('TradeRefundTable') TradeRefundTable:MdTableExtend;
  @ViewChild('tradeRefundOrderTable') tradeRefundOrderTable:MdTableExtend;
  /**
   * 商户审核
   */
  public merchantExam:Array<any> = [];
  /**
   *  平台审核
   */
  public daemonAudit:Array<any> = [];
  /**
   * 退款状态
   */
  public refundState:Array<any> = [];
  /**
   * 退款来源
   */
  public refundSource:Array<any> = [];
  /**
   * 风控状态
   */
  public riskCtr:Array<any> = [];
  /**
   * 支付类型配置
   */
  public tradeTypes:Array<string>= [];
  /**
   * 商户信息配置
   */
  public merchantFilterFields:Array<string>= ["merchantNo","name"];
  public merchantDataSource:InputSearchDatasource;//获取商户信息数据源

  /**
   * 批量查询表格配置
   * @type {[{name: string; title: string; xtype: string} , {name: string; title: string; width: string; render: ((row: any, fieldName: string, cell?: any) => string)} , {name: string; title: string} , {name: string; title: string; xtype: string} , {name: string; title: string} , {name: string; title: string; render: any} , {name: string; title: string; render: any} , {name: string; title: string; render: any} , {name: string; title: string; render: any}]}
   */
  public serviceTradeRefundListColumns: Array<Column> = [
    {
      name: "addTime",
      title: "申请时间",
      xtype:"datetime",
      width: '40px'
    },{
      name: "refundNo/orderNo",
      title: "退款单号/平台单号",
      width: '90px',
      render:((row:any,fieldName:string,cell?:any) => {
        return (row['refundNo']? row['refundNo']: '/') + '<br/>'+ (row['orderNo']? row['orderNo']: '/');
      })
    },{
      name: "merchantName",
      title: "商户名称"
    },{
      name: "refundFee",
      title: "退款金额(元)",
      xtype:'price'
    },{
      name: "transType",
      title: "支付类型"
    },{
      name: "merchantExam",
      title: "商户审核",
      render:(function(row:any,name:string){
        return this.helper.dictTrans('REFUND_MCH_AUDIT_STATUS',row[name]);
      }).bind(this)
    },{
      name: "daemonAudit",
      title: "平台审核",
      render:(function(row:any,name:string){
        return this.helper.dictTrans('REFUND_DAEMON_AUDIT',row[name]);
      }).bind(this)
    },{
      name: "refundState",
      title: "退款状态",
      render:(function(row:any,name:string){
        return this.helper.dictTrans('REFUND_STATUS',row[name]);
      }).bind(this)
    },{
      name: "riskCtr",
      title: "风控状态",
      render:(function(row:any,name:string){
        return this.helper.dictTrans('RISK_CTR_STATU',row[name]);
      }).bind(this)
    }
  ]


  /**
   * 操作
   * @type {{actions: [{btnName: string; hide: boolean},{btnName: string; hide: boolean},{btnDisplay: string; click: any},{btnDisplay: string; click: any}]}}
   */
    public tableActionCfg: any = {
      actions: [{
        btnName: "edit",
        hide: true
      },{
        btnName: "del",
        hide: true
      },{
          btnDisplay: "详情",
        hide:(()=>{
          if(this.helper.btnRole('REFUNDDETAIL')){
            return false;
          }
          return true;
        }).bind(this),
          click:this.onDetailHendler.bind(this)
        },{
        btnDisplay: "重新发起",
        hide:((row:any)=>{
          if(!this.helper.btnRole('REFUNDRENEW')){
            return true;
          }
            if(row['refundState'] == 0 && (row['daemonAudit'] == 3 || row['daemonAudit'] == 2 || row['refundState'] == 2)){
              return false;
            }else {
              return  true;
            }

          }),
          click:this.onReNew.bind(this)

      },{
        btnDisplay: "自动通过",
        hide:(row:any)=>{
          if(row['daemonAudit'] == 3){
            return false;
          }else {
            return  true;
          }
        },
        disabled:true
      },{
        btnDisplay:"审核通过",
        hide:(row:any)=>{
          if(!this.helper.btnRole('REFUNDEXAMINE')){
            return true;
          }
          if(row['daemonAudit'] == 0){
            return false;
          }else {
            return  true;
          }
        },
        click:this.onRefundBnt.bind(this)
      },{
        btnDisplay:"退回",
        hide:(row:any)=>{
          if(!this.helper.btnRole('REFUNDBACK')){
            return true;
          }
          if(row['daemonAudit'] == 0){
            return false;
          }else {
            return  true;
          }
        },
        click:this.onRefBackBnt.bind(this)
      }
        ]
    };

  public count:any={};
  constructor(public TradeRefundDB: TradeRefundListDbService,
              public TradeRefundOrderListDb: TradeRefundOrderListDbService,
              public sidenavService: ISidenavSrvice,
              public pupop:MdPupop,public snackBar: MdSnackBar,
              public helper:HelpersAbsService,
              public CommonDB:CommonDBService ,
              public  TradeRefundDb:TradeRefundDBService
  ,public merchantOrganDb:LoadMerchantDBService,
              private changeDetectorRef:ChangeDetectorRef
  ){
    this.CommonDB.loadTransApi({transId:""}).subscribe(res =>{
      this.tradeTypes = res
    })
    ;
    this.merchantDataSource = new InputSearchDatasource(merchantOrganDb);
    let params = this.sidenavService.getPageParams();


  }
  ngOnInit(){
    this.merchantExam = this.helper.getDictByKey('REFUND_MCH_AUDIT_STATUS');
    this.daemonAudit = this.helper.getDictByKey('REFUND_DAEMON_AUDIT');
    this.refundState = this.helper.getDictByKey('REFUND_STATUS');
    this.refundSource = this.helper.getDictByKey('REFUND_REFUNDSOURCE');
    this.riskCtr = this.helper.getDictByKey('RISK_CTR_STATU');
    this.changeDetectorRef.detectChanges();

    let params = this.sidenavService.getPageParams();

    //判断是否从详情里回到列表,如果是，清空表单
    if(params && params['detail']){
      let _params = {
        orderNo:null,
        refundNo:null,
        transactionId:null};
      let _form = _.extend(this.form,_params);
      this.TradeRefundDB.params = _form;
      //重置路由参数
      this.sidenavService.resetPageParams({});
    }else {
      this.TradeRefundDB.params = this.form;
    }

    this.refundCount();
    this.changeDetectorRef.detectChanges();
  }

  public tradeTimeOpts:any = {//时间配置
    limit:30
  };
  /**
   * 退款信息汇总
   */

  public refundCount(){
    this.TradeRefundDb.loadRefundCount(this.form).subscribe(res=>{
      if(res && res['status'] == 200){
        this.count = res.data
      }
    });
  }

  /**
   * 批量查询事件
   * @returns {boolean}
   */
  public onSearch(){
    if(this.form['_refundTimeStart'] < this.form['_tradeTimeStart'] && this.form['_refundTimeEnd'] < this.form['_tradeTimeEnd']){
      this.snackBar.alert('退款时间超出申请时间范围！');
      return false;
    }
    if(this.helper.isEmpty(this.form['_tradeTimeEnd'])) {
      this.snackBar.alert('请选择结束日期!') ;
    }else{
        this.form.doSearch(this.TradeRefundDB);
        this.TradeRefundTable.refresh();
        this.count ={}; //清空面板数据
        this.refundCount();
    }
  }


  /**
   * 订单号查询事件
   */
  public onSearchOrder(){
    if(!this.formOrder.orderNo && !this.formOrder.transactionId && !this.formOrder.refundNo){
      this.snackBar.alert("至少输入一个单号");
      return false;
    }else {
      // this.tradeQueryOrderDB.params = this.formOrder;
      this.formOrder.doSearch(this.TradeRefundOrderListDb);
      this.tradeRefundOrderTable.refresh();
    }
  }

  /**
   * 详情按钮事件
   * @param row
   * @param e
   */
  public onDetailHendler(row:any,e:MouseEvent):void{
    this.sidenavService.onNavigate('/admin/traderefunddetail','详情',{refundNo:row['refundNo']});
  }

  /**
   * 重新发起事件
   * @param row
   * @param e
   */
  public onReNew(row:any):void{
  let _confirm = this.pupop.confirm({
      message: "【"+row['refundNo']+"】" +"这笔退款未确认，你确定需要重新发起吗？",
      confirmBtn: "确认",
      cancelBtn: "取消",
      width:"580px"
    });
    _confirm.afterClosed().subscribe((res) =>{
      if(res == Confirm.YES ){
        this.TradeRefundDb.loadRefundNotsure({refundNo:row['refundNo'],refundUser:row['refundUser'],mchRefuseReason:row["mchRefuseReason"]}).subscribe(_res=>{
          if(_res && _res['status'] == 200){
            this.snackBar.alert("已重新发起");
            this.TradeRefundTable.refresh(this.form.page);
          }else {
            this.snackBar.alert(_res.message);
          }
        });
      }
    })
  }
  /**
   * 审核通过按钮事件
   * @param row
   * @param e
   */
  public onRefundBnt(row:any):void{
    let _confirm = this.pupop.confirm({
      message: "您确认要审核当前退款订单吗？",
      confirmBtn: "确认",
      cancelBtn: "取消"
    });
    _confirm.afterClosed().subscribe((res) =>{
      if(res == Confirm.YES ){
        this.TradeRefundDb.loadRefundPass({refundNo:row['refundNo'],refuseReason:row['refuseReason']}).subscribe(_res=>{
          if(_res && _res['status'] == 200){
            this.snackBar.alert("已审核通过");
            // row['daemonAudit'] == 2
            this.TradeRefundTable.refresh(this.form.page);
          }else {
            this.snackBar.alert(_res.message);
          }
        });
      }
    })
  }

  /**
   * 退回按钮事件
   * @param row
   * @param e
   */
  public onRefBackBnt(row:any):void{
    let _confirm = this.pupop.confirm({
      message: "您确认要退回当前退款订单吗？",
      confirmBtn: "确认",
      cancelBtn: "取消"
    });
    _confirm.afterClosed().subscribe((res) =>{
      if(res == Confirm.YES ){
        this.TradeRefundDb.loadRefundBack({refundNo:row['refundNo'],refuseReason:row['refuseReason']}).subscribe(_res=>{
          if(_res && _res['status'] == 200){
            this.snackBar.alert("已退回");
            // row['daemonAudit'] == 1
            this.TradeRefundTable.refresh(this.form.page);
          }else {
            this.snackBar.alert(_res.message)
          }
        });
      }
    })
  }

  /**
   * 申请退款弹窗
   * @param row
   * @param e
   */

  public ApplyRefund (e:MouseEvent){
   let refundWin = this.pupop.openWin(TradeApplyRefundComponent,{title:'申请退款',width:'550px',height:'480px'});
    refundWin.afterClosed().subscribe(result => {
      this.TradeRefundTable.refresh(this.form.page);
    });


  }



  /**
   * 商户名称控件显示函数
   */
  public merchantDisplayFn(value: any):string{
    if(!this.helper.isEmpty(this.form._merchantNoName)){
      return this.form._merchantNoName;
    }
    let name = value && value['name'];
    if(name){
      this.form._merchantNoName = name;
    }
    return name;
  }

  public merchantSelected(res) {
    if(res) {
      this.form["_merchantNoName"] = res["value"]["name"];
    }
  }

  /**
   * 商户名称控件选项显示函数
   */
  public merchantOptionDisplayFn(value:any):string{
    return value && value['name'] +'('+value['merchantNo']+')';
  }

  public merchantBeforClickFunc(value:any):boolean{
    let flag: boolean = true;
    if(this.helper.isEmpty(value)){
      this.snackBar.alert('请先输入过滤值！');
      flag = false;
    }
    this.merchantOrganDb.params = {name:value};
    return flag;
  }
}
