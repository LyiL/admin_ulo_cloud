import {Component, ViewChild, ChangeDetectorRef, OnInit, AfterViewInit} from "@angular/core";
import {Column} from "../../../../common/components/table/table-extend-config";
import {ISidenavSrvice} from "../../../../common/services/isidenav.service";
import {MdTableExtend} from "../../../../common/components/table/table-extend";
import {MdSnackBar} from "@angular/material";
import {TradeOrderQueryForm} from "app/common/search.form/trade-manage.form/trade.orderquery.form";
import {TradeBatchQueryForm} from "../../../../common/search.form/trade-manage.form/trade.batchquery.form";
import {HelpersAbsService} from "../../../../common/services/helpers.abs.service";
import {TradeQueryBatchListDBService} from "./trade.query.batch.db.service";
import {TradeQueryDbService, TradeQueryOrderListDBService} from "./trade.query.order.db.service";
import {
  CommonDBService, LoadAgentAndSPDBService,
  LoadBankOrgDBService,
  LoadMerchantDBService,
  LoadPayCenterDBService,
  LoadStoreBService
} from "../../../../common/db-service/common.db.service";
import {InputSearchDatasource} from "../../../../common/services/impl/input.search.datasource";


@Component({
  selector:"trade-query-list-list",
  templateUrl:"./trade.query.list.component.html",
  providers:[TradeQueryBatchListDBService,TradeQueryDbService,TradeQueryOrderListDBService,LoadMerchantDBService,LoadAgentAndSPDBService,LoadBankOrgDBService,CommonDBService,LoadPayCenterDBService,LoadStoreBService]
})
export class TradeQueryComponent implements OnInit{
  public formOrder:TradeOrderQueryForm = new TradeOrderQueryForm();
  public formBtach:TradeBatchQueryForm = new TradeBatchQueryForm();
  public seniorSearchDisplay:string = 'none';
  @ViewChild('tradeQueryBatchTable') tradeQueryBatchTable:MdTableExtend;
  @ViewChild('tradeQueryOrderTable') tradeQueryOrderTable:MdTableExtend;

  /**
   * 所属机构配置
   */
  public mchBnakFilterFields:Array<string>= ["orgNo","name"];
  /**
   * 所属渠道配置
   */
  public mchAgentFilterFields:Array<string>= ["chanCode","name","agentno"];
  /**
   * 商户信息配置
   */
  public merchantFilterFields:Array<string>= ["merchantNo","name"];
  /**
   * 支付中心配置
   */
  public mchCenterFilterFields:Array<string>= ["name"];
  /**
   * 下属门店配置
   */
  public LoadStoreFilterFields:Array<string>= ["name"];
  public mchBankDataSource:InputSearchDatasource;//机构控件数据源
  public mchAgentDataSource:InputSearchDatasource;//受理机构数据源
  public merchantDataSource:InputSearchDatasource;//获取商户信息数据源
  public mchCenterDataSource:InputSearchDatasource;//支付中心信息数据源
  public LoadStoreDataSource:InputSearchDatasource;//下属门店信息数据源

  /**
   * 交易状态数据
   */
  public tradeState:Array<any> = [];
  /**
   * 交易查询列表例名
   * @type {[{name: string; title: string},{name: string; title: string},{name: string; title: string},{name: string; title: string},{name: string; title: string},{name: string; title: string},{name: string; title: string}]}
   */
  /**
   * 支付类型配置
   */
  public tradeTypes:Array<string>= [];

  public dateOpts:any = {//交易时间配置
      limit:7
  };


  public tradeQueryColumns:Array<Column>=
    [
      {
      name:"tradeTime",
      title:"交易时间",
      xtype:"datetime"
    },{
      name:"outTradeNo/orderNo",  //根据接收参数
      title:"商户单号/平台单号",
      width: '20px',
      render:((row:any,fieldName:string,cell?:any) => {
        return (row['outTradeNo']? row['outTradeNo']: '/') + '<br/>'+ (row['orderNo']? row['orderNo']: '/');
      })
    },{
      name:"merchantName",
      title:"商户名称"
    },{
      name:"transType",
      title:"支付类型"
    },{
      name:"tradeState",
      title:"交易状态",
      render:(function(row:any,name:string, cell?: any){
        let _name = row[name];
        if (_name == 3) {
          cell.color = 'danger-font';
        }else if (_name == 2) {
          cell.color = 'success-font';
        }
        return this.helper.isEmpty(_name) ? '/' : this.helper.dictTrans('TRADE_STATUS', _name);
      }).bind(this)
    },{
      name:"tradeMoney",
      title:"交易金额（元）",
      xtype:'price'
    },{
      name:"refundMoney",
      title:"退款金额（元）",
      xtype:'price'
    }];

  public tableActionCfg: any = {
    width:'150px',
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
          if(this.helper.btnRole('TRADEQUERYDETAIL')){
            return false;
          }
          return true;
        }).bind(this),
        click:this.onDetailHendler.bind(this)
      }
    ]
  };
  public tableActionOrderCfg: any = {
    width:'150px',
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
          if(this.helper.btnRole('TRADEQUERYDETAIL')){
            return false;
          }
          return true;
        }).bind(this),
        click:this.onDetailHendler.bind(this)
      }
    ]
  };
    public count:any ={};
  public UloCode:any; //优络编码
  constructor(public tradeQueryOrderDB:TradeQueryOrderListDBService ,
              public tradeQueryBatchDB:TradeQueryBatchListDBService ,
              public helper:HelpersAbsService,
              public sidenavService:ISidenavSrvice ,
              public TradeQueryDb:TradeQueryDbService,
              public mckBankOrganDb:LoadBankOrgDBService,
              public merchantOrganDb:LoadMerchantDBService,
              public mckAgentOrganDb:LoadAgentAndSPDBService,
              public CenterDb:LoadPayCenterDBService,
              public CommonDB:CommonDBService,
              public storeDB:LoadStoreBService,
              public snackBar: MdSnackBar,
              private changeDetectorRef:ChangeDetectorRef){
    this.mchBankDataSource = new InputSearchDatasource(mckBankOrganDb);
    this.mchAgentDataSource = new InputSearchDatasource(mckAgentOrganDb);
    this.merchantDataSource = new InputSearchDatasource(merchantOrganDb);
    this.mchCenterDataSource = new  InputSearchDatasource(CenterDb);
    this.LoadStoreDataSource = new  InputSearchDatasource(storeDB);
    this.CommonDB.loadTransApi({transId:""}).subscribe(res =>{
      this.tradeTypes = res
    });
  }
  public tradeFlag:boolean;
  ngOnInit(){
    let params = this.sidenavService.getPageParams();
    // console.log('params',params);
    //判断是否从详情里回到列表，是的话默认查询，不是的话不去默认查询
    if(params && params['detail']){
      this.tradeFlag = true;
      let orderParams = {
        orderNo:null,
        outTradeNo:null,
        transactionId:null,
        bankTypeNo:null};
      let _formBtach = _.extend(this.formBtach,orderParams);
      this.tradeQueryBatchDB.params =_formBtach;
      this.loadTradeCount();
      //重置路由参数
      this.sidenavService.resetPageParams({});
    }else{
      this.tradeFlag = false;
    }
    this.tradeState = this.helper.getDictByKey('TRADE_STATUS');
    this.UloCode = this.helper.getDictByKey('CLOUD_ULO_BANK_NO');

    this.changeDetectorRef.detectChanges();

  }
  /**
   * 详情事件
   * @param row
   * @param e
   */
  onDetailHendler(row:any,e:MouseEvent):void{
    this.sidenavService.onNavigate('/admin/tradequerydetail','详情',{orderNo:row['orderNo']});
  }
  /**
   * 高级查询
   */
  onSeniorQuery(event){
    if(this.seniorSearchDisplay == 'none'){
      this.seniorSearchDisplay = 'block';
      event.target.innerHTML = '隐藏高级查询';
    }else{
      this.seniorSearchDisplay = 'none';
      event.target.innerHTML = '显示高级查询';
    }
  }

  public onSearchOrder(){
    if(!this.formOrder.orderNo && !this.formOrder.outTradeNo && !this.formOrder.transactionId && !this.formOrder.bankTypeNo){
      this.snackBar.alert("至少输入一个单号");
      return false;
    }else {
      // this.tradeQueryOrderDB.params = this.formOrder;
      this.formOrder.doSearch(this.tradeQueryOrderDB);
      this.tradeQueryOrderTable.refresh();
    }
  }
  public onSearch(){
    if (this.helper.isEmpty(this.formBtach.tradeTimeEnd)) {
      this.snackBar.alert('结束时间不能为空');
    }else {
      this.formBtach.doSearch(this.tradeQueryBatchDB);
      this.tradeQueryBatchTable.refresh();
      this.count ={}; //清空面板数据
      this.loadTradeCount();
    }

  }

  public loadTradeCount(){
    if(this.formBtach.isDataEmpty()){
      return;
    }
    this.TradeQueryDb.loadTradeCount(_.clone(this.formBtach)).subscribe(res=>{
      if(res && res['status'] == 200){
        this.count = res.data
      }else {
        this.snackBar.alert(res['message'])
      }
    });
  }


  /**
   * 机构控件显示函数
   */
  public mchBankdisplayFn(value: any):string{
    if(!this.helper.isEmpty(this.formBtach._bankNoName)){
      return this.formBtach._bankNoName;
    }
    let name = value && value['name'];
    if(name){
      this.formBtach._bankNoName = name;
    }
    return name;
  }

  public bankSelected(res) {
    if(res) {
      this.formBtach["_bankNoName"] = res["value"]["name"];
    }
    this.mckAgentOrganDb.params = {};
    this.mckAgentOrganDb.refreshChange.next(true);
    this.merchantOrganDb.params = {};
    this.merchantOrganDb.refreshChange.next(true);

  }

  /**
   * 机构控件选项显示函数
   */
  public mchBankOptionDisplayFn(value:any):string{
    return value && value['name'] +'('+value['orgNo']+')';
  }

  public mchBankbeforClickFunc(value:any):boolean{
    let flag: boolean = true;
    if(this.helper.isEmpty(value)){
      this.snackBar.alert('请先输入过滤值！');
      flag = false;
    }
    this.mckBankOrganDb.params = {name:value};
    return flag;
  }
  /**
   * 商户名称控件显示函数
   */
  public merchantDisplayFn(value: any):string{
    if(!this.helper.isEmpty(this.formBtach._merchantNoName)){
      return this.formBtach._merchantNoName;
    }
    let name = value && value['name'];
    if(name){
      this.formBtach._merchantNoName = name;
    }
    return name;
  }

  public merchantSelected(res) {
    if(res) {
      this.formBtach["_merchantNoName"] = res["value"]["name"];
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
      flag =  false;
    }
    if(this.formBtach.bankNo){
      this.merchantOrganDb.params = {name:value,bankNo:this.formBtach.bankNo};
    }else {
      this.merchantOrganDb.params = {name:value,bankNo:this.UloCode};
    }

    return flag;
  }


  /**
   * 支付中心控件显示函数
   */
  public mchCenterdisplayFn(value: any):string{
    if(!this.helper.isEmpty(this.formBtach._centerName)){
      return this.formBtach._centerName;
    }
    let name = value && value['name'];
    if(name){
      this.formBtach._centerName = name;
    }
    return name;
  }

  public centerSelected(res) {
    if(res) {
      this.formBtach["_centerName"] = res["value"]["name"];
    }
  }

  /**
   * 支付中心控件选项显示函数
   */
  public mchCenterOptionDisplayFn(value:any):string{
    return value && value['name'] ;
  }

  public mchCenterbeforClickFunc(value:any):boolean{
    let flag: boolean = true;
    if(this.helper.isEmpty(value)){
      this.snackBar.alert('请先输入过滤值！');
      flag = false;
    }
    // if(!this.formBtach.transId){
    //   this.snackBar.alert("请先选择支付类型！")
    //   return false;
    // }
    this.CenterDb.params = {name:value};
    return flag;
    // this.CenterDb.params = {name:value,transId:this.formBtach.transId};
  }


  /**
   * 下属门店控件显示函数
   */
  public LoadStoreDisplayFn(value: any):string{
    if(!this.helper.isEmpty(this.formBtach._secondMchNoName)){
      return this.formBtach._secondMchNoName;
    }
    let name = value && value['name'];
    if(name){
      this.formBtach._secondMchNoName = name;
    }
    return name;
  }

  public secondMchSelected(res) {
    if(res) {
      this.formBtach["_secondMchNoName"] = res["value"]["name"];
    }
  }

  /**
   * 下属门店控件选项显示函数
   */
  public LoadStoreOptionDisplayFn(value:any):string{
    return value && value['name'] ;
  }

  public LoadStoreBeforClickFunc(value:any):boolean{
    let flag: boolean = true;
    if(this.helper.isEmpty(value)){
      this.snackBar.alert('请先输入过滤值！');
      flag =  false;
    }
    this.storeDB.params = {name:value};
    return flag;
  }

  /**
   *所属渠道控件显示函数
   */
  public mchAgentDisplayFn(value: any):string{
    if(!this.helper.isEmpty(this.formBtach._agentnoName)){
      return this.formBtach._agentnoName;
    }
    let name = value && value['name'];
    if(name){
      this.formBtach._agentnoName = name;
    }
    return name;
  }

  public agentSelected(res) {
    if(res) {
      this.formBtach["_agentnoName"] = res["value"]["name"];
    }
  }

  /**
   * 所属渠道控件选项显示函数
   */
  public mchAgentOptionDisplayFn(value:any):string{
    return value && value['name'] +'('+value['chanCode']+')';
  }

  public mchAgentBeforClickFunc(value:any):boolean{
    let flag: boolean = true;
    if(this.helper.isEmpty(value)){
      this.snackBar.alert('请先输入过滤值！');
      flag = false;
    }

    if(this.formBtach.bankNo){
      this.mckAgentOrganDb.params = {name:value,bankCode:this.formBtach.bankNo};
    }else {
      this.mckAgentOrganDb.params = {name:value,bankCode:this.UloCode};
    }

    return flag;
  }


}

