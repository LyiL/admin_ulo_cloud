import {Component, OnInit, ViewChild} from '@angular/core';
import {BusinessDBLoad, BusinessDbService} from './business.list.db.service';
import {Column} from "../../../../common/components/table/table-extend-config";
import {ISidenavSrvice} from "../../../../common/services/isidenav.service";
import {BussinessDaySearchForm} from "../../../../common/search.form/settlement-manage/bussiness.day.search.form";
import {MdDialog, MdPupop, MdSnackBar} from "@angular/material";
import {BusinessDayListSettlebtnWinComponent} from "./business.day.list.settlebtn.win.component";
import {HelpersAbsService} from "app/common/services/helpers.abs.service";
import {MdTableExtend} from "../../../../common/components/table/table-extend";
import {HttpService} from "../../../../common/services/impl/http.service";
import {
  CommonDBService, LoadAgentDBService,
  LoadBankOrgDBService, LoadCompanionForBank, LoadMerchantDBService,
  LoadPayCenterDBService, LoadServiceProviderDBService
} from "../../../../common/db-service/common.db.service";
import {InputSearchDatasource} from "../../../../common/services/impl/input.search.datasource";

@Component({
  selector: 'app-business-day',
  templateUrl: './business.day.list.component.html',
  providers: [BusinessDbService, LoadMerchantDBService, LoadBankOrgDBService, LoadPayCenterDBService, CommonDBService, LoadAgentDBService, LoadCompanionForBank, BusinessDBLoad, LoadServiceProviderDBService]
})
export class BusinessDayListComponent implements OnInit {
  /**
   *时间控件配置
   */
  public dateOpts:any = {
    format:'yyyy-MM-dd',
    limit:30
  };
  /**
   * 查询类型
   */
  public queryTypes:Array<any> = [];
  /**
   * 付款状态
   */
  public accountStatus:Array<any> = [];
  /**
   * 结算周期
   */
  public accountCycles:Array<any> = [];
  /**
   * 商户信息配置
   */
  public merchantFilterFields: Array<string>= ["merchantNo","name"];
  public merchantDataSource: InputSearchDatasource;//获取商户信息数据源
  /**
   * 所属机构配置
   */
  public businessBnakFilterFields:Array<string>= ["orgNo","name"];
  public businessBankDataSource: InputSearchDatasource;//机构控件数据源
  /**
   * 支付中心配置
   */
  public payCenterFilterFields:Array<string>= ["name"];
  public payCenterDataSource: InputSearchDatasource;//支付中心数据源
  /**
   * 支付类型配置
   */
  public payTypes:Array<string>= [];
  /**
   * 渠道信息配置
   */
  public chanelAgentFilterFields:Array<string>= ["chanCode","name","agentno"];
  public chanelAgentDataSource: InputSearchDatasource;//渠道数据源
  /**
   * 服务商信息配置
   */
  public providerFilterFields:Array<string>= ["chanCode","name","agentno"];
  public providerDataSource: InputSearchDatasource;//服务商数据源
  /**
   * 结算账户配置
   */
  public cashCompanionFilterFields:Array<string>= ["companion","companionName"];
  public cashCompanionDataSource: InputSearchDatasource;//结算账户控件数据源
  /**
   * 查询表单
   * @type {BussinessDaySearchForm}
   */
  public form: BussinessDaySearchForm = new BussinessDaySearchForm();
  @ViewChild('serviceBusinessListTable') serviceBusinessListTable: MdTableExtend;

  public UloCode:any;
  public serviceBusinessColumns: Array<Column>= [
    {
      name:"reconDay",
      title:"交易日期",
      xtype:"datetime",
      format: 'YYYY-MM-DD'
    }, {
      name:"merchantNo",
      title:"商户编号"
    }, {
      name:"merchantName",
      title:"商户名称"
    }, {
      name:"transName",
      title: "支付方式"
    }, {
      name:"totalQua",
      // name:"totalQua/refundQua",
      title:"交易笔数（笔）<br/>退款笔数（笔）",
      render:((row:any,fieldName:string,cell?:any) => {
        return row[fieldName] + '<br/>'+ row['refundQua'];
      })
    }, {
      name:"totalFee",
      // name:"totalFee/refundFee",
      title:"交易金额（元）<br/>退款金额（元）",
      render:((row:any,fieldName:string,cell?:any) => {
        let price1:string = this.helper.priceFormat(row[fieldName]);
        let price2:string = this.helper.priceFormat(row['refundFee']);
        return  price1 + '<br/>' + price2;
      }).bind(this)
    },{
      name:"c",
      title:"手续费成本（元）<br/>手续费收入（元）",
      render:((row:any,fieldName:string,cell?:any) => {
        let trdPodg = row['trdPodg'] || 0;
        let trdRefundPodg = row['trdRefundPodg'] || 0;
        let poundage2 = row['poundage2'] || 0;
        let refundPodg2 = row['refundPodg2'] || 0;
        let price1:string = this.helper.priceFormat(trdPodg - trdRefundPodg);
        let price2:string = this.helper.priceFormat(poundage2 - refundPodg2);
        return  price1 + '<br/>' + price2;
      }).bind(this)
    },{
      name:"trdSettleRate",
      // name:"trdSettleRate/settleRate",
      title:"成本费率（‰）<br/>商户费率（‰）",
      render:((row:any,fieldName:string,cell?:any) => {
        let costRate = row[fieldName] || 0;
        let settleRate = row['settleRate'] || 0;
        return (costRate * 1000).toFixed(2) + '<br/>'+ (settleRate * 1000).toFixed(2);
      })
    },{
      name:"cashTotalFee",
      title:"商户净额（元）",
      // xtype:"price"
    },{
      name:"settleCycle",
      title:"周期",
      render:(function(row:any,name:string){
        if(this.helper.isEmpty(row[name])){
          return '/';
        }else{
          return this.helper.dictTrans('BALANCE_DATE',row[name]);
        }
      }).bind(this)
    },{
      name:"cashState",
      title:"状态",
      render:(function(row:any,name:string){
        if(this.helper.isEmpty(row[name])){
          return '/';
        }else{
          return this.helper.dictTrans('CASH_STATUS',row[name]);
        }
      }).bind(this)
    }
  ];
  public bussinessDayActionCfg: any = {
    hide: true
  };

  public tableActionCfg: any = {
    actions: [{
      btnName: "edit",
      hide: true
    },
      {
       btnName: "del",
       hide: true
     }]
  };

  public summaryCount: any = {};
  constructor(
    public businessDayDB: BusinessDbService,
    public sidenavService: ISidenavSrvice,
    public dialog: MdDialog,
    public snackBar: MdSnackBar,
    public helper: HelpersAbsService,
    public http: HttpService,
    public pupop: MdPupop,
    protected merchantOrganDb: LoadMerchantDBService,
    protected businessBankOrganDb: LoadBankOrgDBService,
    protected payCenterOrganDb: LoadPayCenterDBService,
    protected CommonDB: CommonDBService,
    protected chanelAgentOrganDb: LoadAgentDBService,
    protected cashCompanionOrganDb: LoadCompanionForBank,
    public businessDBLoad:BusinessDBLoad,
    protected providerOrganDb: LoadServiceProviderDBService,
  ){
    this.merchantDataSource = new InputSearchDatasource(merchantOrganDb);//商户信息
    this.businessBankDataSource = new InputSearchDatasource(businessBankOrganDb);//受理机构
    this.payCenterDataSource = new InputSearchDatasource(payCenterOrganDb);//支付中心
    this.CommonDB.loadTransApi({transId:""}).subscribe(res =>{
      this.payTypes = res;
    });//支付类型
    this.chanelAgentDataSource = new InputSearchDatasource(chanelAgentOrganDb);//渠道信息
    this.cashCompanionDataSource = new InputSearchDatasource(cashCompanionOrganDb);//结算账户
    this.providerDataSource = new InputSearchDatasource(providerOrganDb);//服务商
  }

  ngOnInit() {
    this.businessDayDB.params = this.form;
    this.loadBusinessdayCount();
    this.queryTypes = this.helper.getDictByKey('MCH_BILL_SEARCH_TYPE');  //查询类型
    this.accountStatus = this.helper.getDictByKey('CASH_STATUS');
    this.accountCycles = this.helper.getDictByKey('BALANCE_DATE');
    this.UloCode = this.helper.getDictByKey('CLOUD_ULO_BANK_NO');
  }
  /**
   * 商户日结统计面板
   */
  public loadBusinessdayCount(){
    if(this.form.isDataEmpty()){
      return;
    }
    this.businessDBLoad.loadCount(_.clone(this.form)).subscribe(res=>{
      if(res && res['status'] == 200){
        this.summaryCount = res.data
      }else{
        this.snackBar.alert(res['message']);
      }
    });
  }
  /**
   * 商户名称控件显示函数
   */
  public merchantDisplayFn(value: any):string{
    if (!this.helper.isEmpty(this.form._merchantName)) {
      return this.form._merchantName;
    }
    let name = value && value['name'];
    if (name) {
      this.form._merchantName = name;
    }
    return name;
  }

  public merchantSelected(res){
    if(res) {
      this.form._merchantName = res['value']['name'];
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
    if(this.form.agencyCode){
      this.merchantOrganDb.params = {name:value,bankNo:this.form.agencyCode};
    }else {
      this.merchantOrganDb.params = {name:value,bankNo:this.UloCode};
    }
    // this.merchantOrganDb.params = {name: value};
    return flag;
  }
  /**
   * 机构控件显示函数
   */
  public businessBankdisplayFn(value: any):string{
    if (!this.helper.isEmpty(this.form._agencyName)) {
      return this.form._agencyName;
    }
    let name = value && value['name'];
    if (name) {
      this.form._agencyName = name;
    }
    return name;
  }

  public bankSelected(res){
    if(res) {
      this.form._agencyName = res['value']['name'];
    }
    //在选择所属机构时，把渠道名称、服务商名称、商户名称控件中的值清空
    this.chanelAgentOrganDb.params = {};
    this.chanelAgentOrganDb.refreshChange.next(true);
    this.providerOrganDb.params = {};
    this.providerOrganDb.refreshChange.next(true);
    this.merchantOrganDb.params = {};
    this.merchantOrganDb.refreshChange.next(true);
  }
  /**
   * 机构控件选项显示函数
   */
  public businessBankOptionDisplayFn(value:any):string{
    return value && value['name'] +'('+value['orgNo']+')';
  }

  public businessBankbeforClickFunc(value:any):boolean{
    let flag: boolean = true;
    if(this.helper.isEmpty(value)){
      this.snackBar.alert('请先输入过滤值！');
      flag = false;
    }
    this.businessBankOrganDb.params = {name:value};
    return flag;
  }
  /**
   * 支付中心控件显示函数
   */
  public payCenterdisplayFn(value: any):string{
    if (!this.helper.isEmpty(this.form._centerName)) {
      return this.form._centerName;
    }
    let name = value && value['name'];
    if (name) {
      this.form._centerName = name;
    }
    return name;
  }

  public payCenterSelected(res){
    if(res) {
      this.form._centerName = res['value']['name'];
    }
  }
  /**
   * 支付中心控件选项显示函数
   */
  public payCenterOptionDisplayFn(value:any):string{
    return value && value['name'];
  }

  public payCenterbeforClickFunc(value:any):boolean{
    let flag: boolean = true;
    if(this.helper.isEmpty(value)){
      this.snackBar.alert('请先输入过滤值！');
      flag = false;
    }
    this.payCenterOrganDb.params = {name:value};
    return flag;
  }
  /**
   * 渠道控件显示函数
   */
  public chanelAgentdisplayFn(value: any):string{
    if (!this.helper.isEmpty(this.form._agentName)) {
      return this.form._agentName;
    }
    let name = value && value['name'];
    if (name) {
      this.form._agentName = name;
    }
    return name;
  }

  public chanelSelected(res){
    if(res) {
      this.form._agentName = res['value']['name'];
    }
  }
  /**
   * 渠道控件选项显示函数
   */
  public chanelAgentOptionDisplayFn(value:any):string{
    return value && value['name'] +'('+value['chanCode']+')';
  }

  public chanelAgentbeforClickFunc(value:any):boolean{
    let flag: boolean = true;
    if(this.helper.isEmpty(value)){
      this.snackBar.alert('请先输入过滤值！');
      flag = false;
    }
    if(this.form.agencyCode){
      this.chanelAgentOrganDb.params = {name:value,bankCode:this.form.agencyCode};
    }else {
      this.chanelAgentOrganDb.params = {name:value,bankCode:this.UloCode};
    }
    // this.chanelAgentOrganDb.params = {name:value};
    return flag;
  }
  /**
   * 服务商控件显示函数
   */
  public providerDisplayFn(value: any):string{
    if (!this.helper.isEmpty(this.form._chanProName)) {
      return this.form._chanProName;
    }
    let name = value && value['name'];
    if (name) {
      this.form._chanProName = name;
    }
    return name;
  }

  public providerSelected(res){
    if(res) {
      this.form._chanProName = res['value']['name'];
    }
  }
  /**
   * 服务商选项显示函数
   */
  public providerOptionDisplayFn(value:any):string{
    return value && value['name'] +'('+value['chanCode']+')';
  }

  public providerBeforClickFunc(value:any):boolean{
    let flag: boolean = true;
    if(this.helper.isEmpty(value)){
      this.snackBar.alert('请先输入过滤值！');
      flag = false;
    }
    if(this.form.agencyCode){
      this.providerOrganDb.params = {name:value,bankCode:this.form.agencyCode};
    }else {
      this.providerOrganDb.params = {name:value,bankCode:this.UloCode};
    }
    // this.providerOrganDb.params = {name:value};
    return flag;
  }
  /**
   * 结算账户控件显示函数
   */
  public cashCompaniondisplayFn(value: any):string{
    if (!this.helper.isEmpty(this.form._allyName)) {
      return this.form._allyName;
    }
    let name = value && value['companionName'];
    if (name) {
      this.form._allyName = name;
    }
    return name;
  }

  public cashCompaniondSelected(res){
    if(res) {
      this.form._allyName = res['value']['companionName'];
    }
  }
  /**
   * 结算账户控件选项显示函数
   */
  public cashCompanionOptionDisplayFn(value:any):string{
    return value && value['companionName'] +'('+value['companion']+')';
  }

  public cashCompanionbeforClickFunc(value:any):boolean{
    let flag: boolean = true;
    if(this.helper.isEmpty(value)){
      this.snackBar.alert('请先输入过滤值！');
      flag = false;
    }
    this.cashCompanionOrganDb.params = {name:value};
    return flag;
  }

  /**
   * 查询按钮
   */
  onSearch() {
    if(this.helper.isEmpty(this.form['_endTime'])) {
      this.snackBar.alert('请选择结束日期!') ;
    }else {
      this.form.doSearch(this.businessDayDB);
      this.serviceBusinessListTable.refresh();
      this.summaryCount = {};//清空统计面板数据
      this.loadBusinessdayCount();
    }
  }

  /**
   * 导出报表按钮
   * @author lyl
   */
  onExport() {
    let params = _.clone(this.form);
    this.businessDBLoad.loadExport(params).subscribe(res => {
      if(res instanceof FileReader){
        res.onloadend=(function(){
          let _res = JSON.parse(res.result);
          this.snackBar.alert(_res['message']);
        }).bind(this);
      }else{
        this.downloadFile(res.fileName, res.blob); //导出报表
      }
    });
  }
  downloadFile(fileName, content){
    var aLink = document.createElement('a');
    var blob = content;
    aLink.download = fileName;
    aLink.href = URL.createObjectURL(blob);
    aLink.click()
  }

  /**
   * 结算打款按钮
   */
  onSettleAccounts() {
    if( this.helper.isEmpty(this.form.agencyCode) ) {
      this.snackBar.alert("请选择机构");
    }else if( this.helper.isEmpty(this.form.ally) ) {
      this.snackBar.alert("请选择结算账户");
    }else{
      let settleDialog = this.pupop.openWin(BusinessDayListSettlebtnWinComponent, {
        title:'结算打款',
        width:'400px',
        height:'300px',
        data: _.clone(this.form)
      });
      settleDialog.afterClosed().subscribe(result => {
        this.serviceBusinessListTable.refresh(this.form.page);
      });
    }
  }
}
