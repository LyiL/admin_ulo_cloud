import {Component, OnInit, ViewChild} from '@angular/core';
import {Column} from "../../../../common/components/table/table-extend-config";
import {ISidenavSrvice} from "../../../../common/services/isidenav.service";
import {HitMoneyDBLoad, HitMoneyDbService} from "./hit.money.list.db.service";
import {HitMoneySearchForm} from "../../../../common/search.form/settlement-manage/hit.money.search.form";
import {HelpersAbsService} from "../../../../common/services/helpers.abs.service";
import {MdTableExtend} from "../../../../common/components/table/table-extend";
import {MdSnackBar} from "@angular/material";
import {HttpService} from "../../../../common/services/impl/http.service";
import {InputSearchDatasource} from "../../../../common/services/impl/input.search.datasource";
import {
  LoadBankOrgDBService, LoadCompanionForBank,
  LoadMerchantDBService
} from "../../../../common/db-service/common.db.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-hit-money',
  templateUrl: './hit.money.list.component.html',
  providers: [HitMoneyDbService, LoadMerchantDBService, LoadBankOrgDBService, LoadCompanionForBank,HitMoneyDBLoad]
})
export class HitMoneyListComponent implements OnInit {
  /**
   * 结算批次号
   */
  public batchs:Observable<any>;
  /**
   *账户类型
   */
  public accountTypes: Array<any> = [];
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
   * 结算账户配置
   */
  public cashCompanionFilterFields:Array<string>= ["companion","companionName"];
  public cashCompanionDataSource: InputSearchDatasource;//结算账户控件数据源
  /**
   * 查询表单
   * @type {HitMoneySearchForm}
   */
  public form: HitMoneySearchForm = new HitMoneySearchForm();
  @ViewChild('hitMoneyListTable') hitMoneyListTable: MdTableExtend;

  public UloCode:any;
  public serviceHitMoneyColumns: Array<Column>= [
    {
      name:"createTime",
      title:"结算日期",
      xtype:"datetime",
      format: 'YYYY-MM-DD'
    }, {
      name:"merchantName",
      title:"结算主体"
    }, {
      name:"bankBranchName",
      title:"银行名称（支行）"
    }, {
      name:"actName",
      title: "账户名"
    }, {
      name:"bankCardNo",
      title:"银行卡号"
    }, {
      name:"actType",
      title:"账户类型",
      render:(function(row:any,name:string){
        if(this.helper.isEmpty(row[name])){
          return '/';
        }else{
          return this.helper.dictTrans('ACCOUNT_TYPE',row[name]);
        }
      }).bind(this)
    },{
      name:"cashTotalFee",
      title:"出款金额（元）",
      // xtype:"price"
    }
  ]

  public hitMoneyListActionCfg: any = {
    hide: true
  };

  public summaryCount: any = {};
  constructor(
    public hitMoneyListDB: HitMoneyDbService,
    public sidenavService: ISidenavSrvice,
    public helper: HelpersAbsService,
    public snackBar: MdSnackBar,
    public http: HttpService,
    public merchantOrganDb: LoadMerchantDBService,
    public businessBankOrganDb: LoadBankOrgDBService,
    public cashCompanionOrganDb: LoadCompanionForBank,
    public hitMoneyDBLoad: HitMoneyDBLoad
  ){
    this.merchantDataSource = new InputSearchDatasource(merchantOrganDb);//商户信息
    this.businessBankDataSource = new InputSearchDatasource(businessBankOrganDb);//受理机构
    this.cashCompanionDataSource = new InputSearchDatasource(cashCompanionOrganDb);//结算账户

    this.hitMoneyListDB.loadSettleBatch({createTime: this.form.createTime}).subscribe(res =>{
      this.batchs = res;
    });//打款批次号数据
  }

  ngOnInit() {
    this.hitMoneyListDB.params = this.form;
    this.loadHitmoneyCount();
    this.accountTypes = this.helper.getDictByKey('ACCOUNT_TYPE');
    this.UloCode = this.helper.getDictByKey('CLOUD_ULO_BANK_NO');
  }
  onChangeTime(result: any){
    // console.log(result)
    this.form.createTime = result.value;
    this.hitMoneyListDB.loadSettleBatch({createTime: this.form.createTime}).subscribe(res =>{
      this.batchs = res;
    });//打款批次号数据
  }
  /**
   * 结算打款统计面板
   */
  public loadHitmoneyCount(){
    if(this.form.isDataEmpty()){
      return;
    }
    this.hitMoneyDBLoad.loadCount(_.clone(this.form)).subscribe(res=>{
      if(res && res['status'] == 200){
        this.summaryCount = res.data;
      }else{
        this.snackBar.alert(res['message']);
      }
    });
  }
  /**
   * 商户名称控件显示函数
   */
  public merchantDisplayFn(value: any):string{
    if(!this.helper.isEmpty(this.form._specName)){
      return this.form._specName;
    }
    let name = value && value['name'];
    if(name){
      this.form._specName = name;
    }
    return name;
  }
  public merchantSelected(res){
    if(res) {
      this.form._specName = res['value']['name'];
    }
  }
  /**
   * 商户名称控件选项显示函数
   */
  public merchantOptionDisplayFn(value:any):string{
    return value && value['name'] +'('+value['merchantNo']+')';
  }

  public merchantBeforClickFunc(value:any):boolean{
    let flag:boolean = true;
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
    if(!this.helper.isEmpty(this.form._agencyName)){
      return this.form._agencyName;
    }
    let name = value && value['name'];
    if(name){
      this.form._agencyName = name;
    }
    return name;
  }

  public bankSelected(res){
    if(res) {
      this.form._agencyName = res['value']['name'];
    }
    //在选择所属机构时，把商户名称控件中的值清空
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
    let flag:boolean = true;
    if(this.helper.isEmpty(value)){
      this.snackBar.alert('请先输入过滤值！');
      flag = false;
    }
    this.businessBankOrganDb.params = {name:value};
    return flag;
  }
  /**
   * 结算账户控件显示函数
   */
  public cashCompaniondisplayFn(value: any):string{
    if(!this.helper.isEmpty(this.form._allyName)){
      return this.form._allyName;
    }
    let name = value && value['companionName'];
    if(name){
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
    let flag:boolean = true;
    if(this.helper.isEmpty(value)){
      this.snackBar.alert('请先输入过滤值！');
      flag = false;
    }
    this.cashCompanionOrganDb.params = {name:value};
    return flag;
  }
  /**
   * 导出报表
   * @author lyl
   */
  onExport() {
    let params = _.clone(this.form);
    this.hitMoneyDBLoad.loadExport(params).subscribe(res => {
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
   * 查询按钮
   */
  onSearch() {
    this.form.doSearch(this.hitMoneyListDB);
    this.hitMoneyListTable.refresh();
    this.summaryCount = {};//清空统计面板数据
    this.loadHitmoneyCount();
  }
}
