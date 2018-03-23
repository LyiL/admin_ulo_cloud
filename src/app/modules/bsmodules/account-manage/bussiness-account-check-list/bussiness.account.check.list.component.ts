/**
 * Created by lenovo on 2017/8/1.
 */
import {Component, ViewChild, OnInit} from "@angular/core";
import {Column} from '../../../../common/components/table/table-extend-config';
import {BussinessAccountCheckService} from './bussiness.account.check.list.db.service'
import {ISidenavSrvice} from "../../../../common/services/isidenav.service";
import {BussinessAccountCheckSearchForm} from "../../../../common/search.form/account-manage/bussiness.account.check.search.form";
import {HelpersAbsService} from "../../../../common/services/helpers.abs.service";
import {MdTableExtend} from "../../../../common/components/table/table-extend";
import {
  CommonDBService, LoadBankOrgDBService, LoadCompanionForBank,
  LoadMerchantDBService, LoadPayCenterDBService, LoadStoreBService
} from "../../../../common/db-service/common.db.service";
import {InputSearchDatasource} from "../../../../common/services/impl/input.search.datasource";
import {MdSnackBar} from "@angular/material";

@Component({
  selector: "bussiness-account-check",
  templateUrl: "bussiness.account.check.list.component.html",
  providers: [BussinessAccountCheckService, LoadBankOrgDBService, LoadMerchantDBService, CommonDBService, LoadPayCenterDBService, LoadCompanionForBank, LoadStoreBService]
})
export class BussinessAccountCheckComponent implements OnInit {
  /**
   * 对账状态
   */
  public checkStates:Array<any> = [];

  /**
   *时间配置
   */
  public dateOpts:any = {
    format:'yyyy-MM-dd',
    limit:30
  };
  /**
   * 受理机构配置
   */
  public accountBnakFilterFields:Array<string>= ["orgNo","name"];
  public accountBankDataSource: InputSearchDatasource;//机构控件数据源
  /**
   * 商户信息配置
   */
  public merchantFilterFields: Array<string>= ["merchantNo","name"];
  public merchantDataSource: InputSearchDatasource;//获取商户信息数据源
  /**
   * 支付类型配置
   */
  public payTypes:Array<string>= [];
  /**
   * 支付中心配置
   */
  public payCenterFilterFields:Array<string>= ["name"];
  public payCenterDataSource: InputSearchDatasource;//支付中心数据源
  /**
   * 结算账户配置
   */
  public cashCompanionFilterFields:Array<string>= ["companion","companionName"];
  public cashCompanionDataSource: InputSearchDatasource;//结算账户控件数据源
  /**
   * 下属门店配置
   */
  public accountStoreFilterFields:Array<string>= ["merchantNo","name"];
  public accountStoreDataSource: InputSearchDatasource;//下属门店控件数据源
  /**
   * 查询表单
   */
  public form: BussinessAccountCheckSearchForm = new BussinessAccountCheckSearchForm();
  @ViewChild('bussinessAccountCheckListTable') bussinessAccountCheckListTable: MdTableExtend;

  public bussinessAccountCheckColumns:Array<Column>=[{
    name:"reconDay",
    title:"对账日期/结算账户",
    render:((row:any,fieldName:string,cell?:any) => {
      return (this.helper.isEmpty(row[fieldName])?'/':this.helper.format(row[fieldName], 'yyyy-MM-dd')) + '<br/>'+ (this.helper.isEmpty(row['ally']) ? '/' : row['ally']);
    })
  },{
    name:"merchantNo",
    title:"商户编号",
  },{
    name:"merchantName",
    title:"商户名称",
  },{
    name:"transName",
    title:"支付类型",
  },{
    name:"totalFee",
    title:"交易金额（元）<br/>退款金额（元）",
    render:((row:any,fieldName:string,cell?:any) => {
      let price1 = row[fieldName] || 0;
      let price2 = row['refundFee'] || 0;
      return  this.helper.priceFormat(price1) + '<br/>' + this.helper.priceFormat(price2);
    }).bind(this)
  },{
    name:"totalQua",
    title:"交易笔数（笔）<br/>退款笔数（笔）",
    render:((row:any,fieldName:string,cell?:any) => {
      let count1 = row[fieldName] || 0;
      let count2 = row['refundQua'] || 0;
      return count1 + '<br/>'+ count2;
    })
  },{
    name:"eqTotalFee",
    title:"平账交易金额（元）<br/>平账退款金额（元）",
    render:((row:any,fieldName:string,cell?:any) => {
      let price1 = row[fieldName] || 0;
      let price2 = row['eqRefundFee'] || 0;
      return  this.helper.priceFormat(price1) + '<br/>' + this.helper.priceFormat(price2);
    }).bind(this)
  },{
    name:"poundage2",
    title:"手续费（元）<br/>退款手续费（元）",
    render:((row:any,fieldName:string,cell?:any) => {
      let price1 = row[fieldName] || 0;
      let price2 = row['refundPodg2'] || 0;
      return  this.helper.priceFormat(price1) + '<br/>' + this.helper.priceFormat(price2);
    }).bind(this)
  },{
    name:"trdPodg",
    title:"第三方手续费（元）<br/>第三方退款手续费（元）",
    width: '20px',
    render:((row:any,fieldName:string,cell?:any) => {
      let price1 = row[fieldName] || 0;
      let price2 = row['trdRefundPodg'] || 0;
      return  this.helper.priceFormat(price1) + '<br/>' + this.helper.priceFormat(price2);
    }).bind(this)
  },{
    name:"reconState",
    title:"对账状态",
    render:this.onTreatState.bind(this)
  }];
  public tableActionCfg: any = {
    hide:(()=>{
      if(this.helper.btnRole('CHECKMCHINFO')){
        return false;
      }
      return true;
    }).bind(this),
    width:"30px",
    actions:[{
      btnName:"del",
      hide:true
    },{
      btnName:"edit",
      hide:true
    }, {
      btnDisplay:"详情",
      click:this.onDetailHendler.bind(this)
    }]
  };
  constructor(
    public bussinessAccountCheckDB: BussinessAccountCheckService,
    public sidenavService:ISidenavSrvice,
    public helper: HelpersAbsService,
    protected accountBankOrganDb: LoadBankOrgDBService,
    protected merchantOrganDb: LoadMerchantDBService,
    public snackBar: MdSnackBar,
    protected CommonDB: CommonDBService,
    protected payCenterOrganDb: LoadPayCenterDBService,
    protected cashCompanionOrganDb: LoadCompanionForBank,
    protected accountStoreOrganDb: LoadStoreBService,
  ) {
    this.accountBankDataSource = new InputSearchDatasource(accountBankOrganDb);//受理机构
    this.merchantDataSource = new InputSearchDatasource(merchantOrganDb);//商户信息
    this.CommonDB.loadTransApi({transId:""}).subscribe(res =>{
      this.payTypes = res
    });//支付类型
    this.payCenterDataSource = new InputSearchDatasource(payCenterOrganDb);//支付中心
    this.cashCompanionDataSource = new InputSearchDatasource(cashCompanionOrganDb);//结算账户
    this.accountStoreDataSource = new InputSearchDatasource(accountStoreOrganDb);//下属门店

  }
  ngOnInit() {
    this.checkStates = this.helper.getDictByKey('PARTNER_PRCSTATUS');
    this.bussinessAccountCheckDB.params = this.form;
  }
  /**
   * 对账状态
   * @author lyl
   */
  onTreatState(row:any,name:string,cell:any,cellEl:any) {
    if(this.helper.isEmpty(row[name])){
      cell.bgColor = '';
      return '/';
    }else{
      let _status = row[name];
      switch(_status){
        case 1:
          cell.bgColor = 'danger-bg';
          break;
        case 0:
          cell.bgColor = 'success-bg';
          break;
      }
      return this.helper.dictTrans('PARTNER_PRCSTATUS',_status);
    }
  }
  /**
   * 机构控件显示函数
   */
  public accountBankdisplayFn(value: any):string{
    // return value && value['name'];
    if (!this.helper.isEmpty(this.form._agencyName)) {
      return this.form._agencyName;
    }
    let name = value && value['name'];
    if (name) {
      this.form._agencyName = name;
    }
    return name;
  }
  /**
   * 机构控件选项显示函数
   */
  public accountBankOptionDisplayFn(value:any):string{
    return value && value['name'] +'('+value['orgNo']+')';
  }

  public accountBankbeforClickFunc(value:any):boolean{
    let flag: boolean = true;
    if(this.helper.isEmpty(value)){
      this.snackBar.alert('请先输入过滤值！');
      flag = false;
    }
    this.accountBankOrganDb.params = {name:value};
    return flag;
  }

  public agencyCodeSelected(res) {
    if (res) {
      this.form._agencyName = res['value']['name'];
    }
  }
  /**
   * 商户名称控件显示函数
   */
  public merchantDisplayFn(value: any):string{
    // return value && value['name'];
    if (!this.helper.isEmpty(this.form._merchantName)) {
      return this.form._merchantName;
    }
    let name = value && value['name'];
    if (name) {
      this.form._merchantName = name;
    }
    return name;
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
    this.merchantOrganDb.params = {name: value};
    return flag;
  }

  public merchantNoSelected(res) {
    if (res) {
      this.form._merchantName = res['value']['name'];
    }
  }
  /**
   * 支付中心控件显示函数
   */
  public payCenterdisplayFn(value: any):string{
    // return value && value['name'];
    if (!this.helper.isEmpty(this.form._centerName)) {
      return this.form._centerName;
    }
    let name = value && value['name'];
    if (name) {
      this.form._centerName = name;
    }
    return name;
  }
  /**
   * 支付中心控件选项显示函数
   */
  public payCenterOptionDisplayFn(value:any):string{
    // return value && value['name'] +'('+value['id']+')';
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

  public centerIdSelected(res) {
    if (res) {
      this.form._centerName = res['value']['name'];
    }
  }
  /**
   * 结算账户控件显示函数
   */
  public cashCompaniondisplayFn(value: any):string{
    // return value && value['companionName'];
    if (!this.helper.isEmpty(this.form._allyName)) {
      return this.form._allyName;
    }
    let name = value && value['companionName'];
    if (name) {
      this.form._allyName = name;
    }
    return name;
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

  public allySelected(res) {
    if (res) {
      this.form._allyName = res['value']['companionName'];
    }
  }
  /**
   * 下属门店控件显示函数
   */
  public accountStoredisplayFn(value: any):string {
    // return value && value['name'];
    if (!this.helper.isEmpty(this.form._secondMchName)) {
      return this.form._secondMchName;
    }
    let name = value && value['name'];
    if (name) {
      this.form._secondMchName = name;
    }
    return name;
  }
  /**
   * 下属门店控件选项显示函数
   */
  public accountStoreOptionDisplayFn(value:any):string{
    return value && value['name']+'('+value['merchantNo']+')';
  }

  public accountStorebeforClickFunc(value:any):boolean{
    let flag: boolean = true;
    if(this.helper.isEmpty(value)){
      this.snackBar.alert('请先输入过滤值！');
      flag = false;
    }
    this.accountStoreOrganDb.params = {name:value};
    return flag;
  }

  public secondMchNoSelected(res) {
    if (res) {
      this.form._secondMchName = res['value']['name'];
    }
  }
  /**
   *商户对账详情
   */
  onDetailHendler(row:any,e:MouseEvent):void{
    this.sidenavService.onNavigate('/admin/bussinessaccountcheckdetail', '详情-商户对账', {id: row['id']});
  }

  /**
   * 查询按钮
   */
  onSearch() {
    if(this.helper.isEmpty(this.form['_finishAt'])) {
      this.snackBar.alert('请选择结束日期!')
    } else {
    this.form.doSearch(this.bussinessAccountCheckDB);
    this.bussinessAccountCheckListTable.refresh();
    }
  }

}
