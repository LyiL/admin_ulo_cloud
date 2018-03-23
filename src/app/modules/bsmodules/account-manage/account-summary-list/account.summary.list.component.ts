/**
 * Created by lenovo on 2017/8/1.
 */
import {Component, ViewChild, OnInit} from "@angular/core";
import {Column} from '../../../../common/components/table/table-extend-config';
import {AccountSummaryDBLoad, AccountSummaryService} from './account.summary.list.db.service'
import {ISidenavSrvice} from "../../../../common/services/isidenav.service";
import {AccountSummarySearchForm} from "../../../../common/search.form/account-manage/account.summary.search.form";
import {HelpersAbsService} from "../../../../common/services/helpers.abs.service";
import {MdTableExtend} from "../../../../common/components/table/table-extend";
import {HttpService} from "../../../../common/services/impl/http.service";
import {
  CommonDBService, LoadBankOrgDBService, LoadCompanionForBank, LoadMerchantDBService,
  LoadPayCenterDBService
} from "../../../../common/db-service/common.db.service";
import {InputSearchDatasource} from "../../../../common/services/impl/input.search.datasource";
import {MdPupop, MdSnackBar} from "@angular/material";

@Component({
  selector: "account-summary",
  templateUrl: "account.summary.list.component.html",
  providers: [AccountSummaryService, LoadBankOrgDBService, CommonDBService, LoadPayCenterDBService, LoadCompanionForBank,AccountSummaryDBLoad]
})
export class AccountSummaryComponent implements OnInit {
  /**
   * 对账状态
   */
  public checkStates:Array<any> = [];
  /**
   * 受理机构配置
   */
  public accountBnakFilterFields:Array<string>= ["orgNo","name"];
  public accountBankDataSource: InputSearchDatasource;//机构控件数据源
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
   * 查询表单
   */
  public form: AccountSummarySearchForm = new AccountSummarySearchForm();
  @ViewChild('accountSummaryListTable') accountSummaryListTable: MdTableExtend;

  /**
   *时间配置
   */
  public dateOpts:any = {
    format:'yyyy-MM-dd',
    limit:30
  };

  public accountSummaryColumns:Array<Column>=[{
    name:"reconDay",
    title:"对账日期/结算账户",
    render:((row:any,fieldName:string,cell?:any) => {
      return (this.helper.isEmpty(row[fieldName])?'/':this.helper.format(row[fieldName], 'yyyy-MM-dd')) + '<br/>'+ (this.helper.isEmpty(row['ally']) ? '/' : row['ally']);
    })
  },{
    name:"totalFee",
    title:"交易金额（元）<br/>退款金额（元）",
    render:((row:any,fieldName:string,cell?:any) => {
      let price1 = row[fieldName] || 0;
      let price2 = row['refundFee'] || 0;
      return  this.helper.priceFormat(price1) + '<br/>' + this.helper.priceFormat(price2);
    }).bind(this)
  },{
    name:"eqTotalFee",
    title:"平账交易金额（元）<br/>平账退款金额（元）",
    render:((row:any,fieldName:string,cell?:any) => {
      let price1 = row[fieldName] || 0;
      let price2 = row['eqRefundFee'] || 0;
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
    name:"errTotalQua",
    title:"异常笔数（笔）<br/>异常金额（元）",
    render:((row:any,fieldName:string,cell?:any) => {
      let _count1 = row[fieldName] || 0;
      let _count2 = row['errRefundQua'] || 0;
      let _price1 = row['errTotalFee'] || 0;
      let _price2 = row['errRefundFee'] || 0;
      let count = _count1 + _count2;//异常笔数加上异常退款笔数
      let price = _price1 + _price2;//异常金额加上异常退款金额
      return count + '<br/>'+ this.helper.priceFormat(price);
    })
  },{
    name:"transName",
    title:"支付类型"
  },{
    name:"reconState",
    title:"对账状态",
    render:this.onTreatState.bind(this)
  }];
  public tableActionCfg: any = {
    hide:(()=>{
      if(this.helper.btnRole('CHECKOUTLINEINFO')){
        return false;
      }
      return true;
    }).bind(this),
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
  public summaryCount: any = {};
  constructor(
    public accountSummaryDB: AccountSummaryService,
    public sidenavService:ISidenavSrvice,
    public helper: HelpersAbsService,
    public http: HttpService,
    protected accountBankOrganDb: LoadBankOrgDBService,
    public snackBar: MdSnackBar,
    public pupop: MdPupop,
    protected CommonDB: CommonDBService,
    protected payCenterOrganDb: LoadPayCenterDBService,
    protected cashCompanionOrganDb: LoadCompanionForBank,
    public accountSummaryDBLoad:AccountSummaryDBLoad
  ) {
    this.accountBankDataSource = new InputSearchDatasource(accountBankOrganDb);//受理机构
    this.CommonDB.loadTransApi({transId:""}).subscribe(res =>{
      this.payTypes = res
    });//支付类型
    this.payCenterDataSource = new InputSearchDatasource(payCenterOrganDb);//支付中心
    this.cashCompanionDataSource = new InputSearchDatasource(cashCompanionOrganDb);//结算账户
  }
  ngOnInit() {
    this.checkStates = this.helper.getDictByKey('PARTNER_PRCSTATUS');
    this.accountSummaryDB.params = this.form;
    this.loadSummaryAccount();
  }
  /**
   * 对账概要统计面板
   */
  public loadSummaryAccount(){
    if(this.form.isDataEmpty()){
      return;
    }
    this.accountSummaryDBLoad.loadCount(_.clone(this.form)).subscribe(res=>{
      if(res && res['status'] == 200){
        this.summaryCount = res.data;
      }else {
        this.snackBar.alert(res['message']);
      }
    });
  }
  /**
   * 对账状态
   * @author lyl
   */
  public onTreatState(row:any,name:string,cell:any,cellEl:any) {
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
    this.accountBankOrganDb.params = {name: value};
    return flag;
  }

  public agencyCodeSelected(res) {
    if (res) {
      this.form._agencyName = res['value']['name'];
    }
  }
  /**
   * 支付中心控件显示函数
   */
  public payCenterdisplayFn(value: any): string {
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
   * 获取支付中心名称
   */
  public centerIdSelected(res) {
    if (res) {
      this.form._centerName = res['value']['name'];
    }
  }
  /**
   * 结算账户控件显示函数
   */
  public cashCompaniondisplayFn(value: any): string{
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
   *对账概要详情
   */
  onDetailHendler(row:any,e:MouseEvent):void{
    this.sidenavService.onNavigate('/admin/accountsummarydetail','详情-对账概要', {id: row['id']});
  }

  /**
   * 查询按钮
   */
  onSearch() {
    if(this.helper.isEmpty(this.form['_billTimeEnd'])) {
      this.snackBar.alert('请选择结束日期!')
    } else {
      this.form.doSearch(this.accountSummaryDB);
      this.accountSummaryListTable.refresh();
      this.summaryCount = {};//清空统计面板数据
      this.loadSummaryAccount();
    }
  }

}
