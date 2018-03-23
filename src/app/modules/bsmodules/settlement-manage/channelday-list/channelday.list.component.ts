import {Component, ViewChild,OnInit} from '@angular/core';
import {Column} from "../../../../common/components/table/table-extend-config";
import {ISidenavSrvice} from "../../../../common/services/isidenav.service";
import {ChannelDayDBService, ChannelDayDetailDBService, ChannelDBService} from "./channelday.list.db.service";
import {ChannelDayForm} from "../../../../common/search.form/settlement-manage/channel.day.form";
import {MdTableExtend} from "../../../../common/components/table/table-extend";
import {HelpersAbsService} from "../../../../common/services/helpers.abs.service";
import {
  CommonDBService, LoadAgentDBService, LoadBankOrgDBService, LoadCompanionForBank,
  LoadMerchantDBService,
  LoadAgentAndSPDBService, LoadServiceProviderDBService,
} from "../../../../common/db-service/common.db.service";
import {InputSearchDatasource} from "../../../../common/services/impl/input.search.datasource";
import {MdDialog, MdPupop, MdSnackBar} from "@angular/material";
import {settlePayWinComponent} from "./settlepay.win.component";


@Component({
  selector: 'channel-day',
  templateUrl: './channelday.list.component.html',
  providers: [ChannelDayDBService,ChannelDayDetailDBService,LoadAgentAndSPDBService,LoadCompanionForBank,LoadMerchantDBService,ChannelDBService,LoadBankOrgDBService,CommonDBService,LoadAgentDBService, LoadServiceProviderDBService]
})
export class ChannelDayListComponent implements OnInit{
  public form: ChannelDayForm = new ChannelDayForm();
  @ViewChild('channelDayTable') channelDayTable: MdTableExtend;
  @ViewChild('channelDayDetailTable') channelDayDetailTable: MdTableExtend;
  /**
   * 受理机构配置
   */
  public mchBnakFilterFields:Array<string>= ["orgNo","name"];
  /**
   * 渠道名称配置
   */
  public mchAgentFilterFields:Array<string>= ["chanCode","name"];
  /**
   * 支付类型配置
   */
  public tradeTypes:Array<string>= [];
  /**
   * 商户信息配置
   */
  public merchantFilterFields:Array<string>= ["merchantNo","name"];
  /**
   * 结算账户配置
   */
  public cashCompanionFilterFields:Array<string>= ["companion","companionName"];
  public cashCompanionDataSource: InputSearchDatasource;//结算账户控件数据源
  public mchBankDataSource:InputSearchDatasource;//机构控件数据源
  public merchantDataSource:InputSearchDatasource;//获取商户信息数据源
  public mchAgentDataSource:InputSearchDatasource;//获取渠道名称数据源

  /**
   * 服务商信息配置
   */
  public providerFilterFields:Array<string>= ["chanCode","name"];
  public providerDataSource: InputSearchDatasource;//服务商数据源
  /**
   * 款项类型数据
   */
  public cashType:Array<any> = [];
  /**
   * 付款状态数据
   */
  public cashState:Array<any> = [];

  public channelDayColumn: Array<Column> = [
    {
      name: "reconDay",
      title: "划账日期",
      xtype:"datetime",
      format:"YYYY-MM-DD"
    }, {
      name: "canalName",
      title: "渠道名称"
    }, {
      name: "transType",
      title: "支付类型"
    }, {
      name: "totalQua",
      title: "交易笔数（笔）"
    }, {
      name: "totalFee",
      title: "交易净额（元）",
      // xtype:'price'
    }, {
      name: "cashTotalFee",
      title: "分润总额（元）",
      // xtype:'price'
    }, {
      name: "cashType",
      title: "款项类型",
      render:(function(row:any,name:string){
        return this.helper.dictTrans('CASH_TYPE',row[name]);
      }).bind(this)
    }, {
      name: "cashState",
      title: "付款状态",
      render:(function(row:any,name:string){
        return this.helper.dictTrans('CASH_STATUS',row[name]);
      }).bind(this)
    }
  ];
  public channelDayDetailColumn: Array<Column> = [
    {
      name: "tradeTime",
      title: "交易日期",
      xtype:"datetime",
      format:"YYYY-MM-DD"
    }, {
      name: "canalName/merchantName",
      title: "渠道名称/商户名称",
      render:((row:any,fieldName:string,cell?:any) => {
        return (row['canalName']? row['canalName']: '/') + '<br/>'+ (row['merchantName']? row['merchantName']: '/');
      })
    }, {
      name: "transType",
      title: "支付类型"
    }, {
      name: "atRate/parentRate",
      title: "本级费率（‰）/下级费率（‰）",
      render:((row:any,fieldName:string,cell?:any) => {
        // return row['atRate'] + '<br/>'+ row['parentRate'];
        let Rate1 = row['atRate'] || 0;
        let Rate2 = row['parentRate'] || 0;
        return (Rate1 * 1000).toFixed(2) + '<br/>'+ (Rate2 * 1000).toFixed(2);
      })
    }, {
      name: "difRate",
      title: "费率差（‰）",
      render:((row:any,fieldName:string,cell?:any) => {
        let Rate = row['difRate'] || 0;
        return (Rate * 1000).toFixed(2);
      })
    }, {
      name: "totalQua",
      title: "交易笔数(笔)"
    }, {
      name: "totalFee",
      title: "交易净额",
      // xtype:'price'
    }, {
      name: "cashTotalFee",
      title: "款项支出",
    }, {
      name: "cashType",
      title: "款项类型",
      render:(function(row:any,name:string){
        return this.helper.dictTrans('CASH_TYPE',row[name]);
      }).bind(this)
    }
  ];
  public tableActionCfg: any = {
    hide:true
  };
  public count:any ={};
  public countDetail:any ={};
  public  UloCode:any;//优络编码
  constructor (public sidenavService: ISidenavSrvice,
               public channelDayDB: ChannelDayDBService,
               public helper:HelpersAbsService,
               public snackBar: MdSnackBar,
               public dialog: MdDialog,
               public CommonDB:CommonDBService,
               public mckBankOrganDb:LoadBankOrgDBService,
               public merchantOrganDb:LoadMerchantDBService,
               public cashCompanionOrganDb: LoadCompanionForBank,
               public SPAndChan:LoadAgentAndSPDBService,
               public mckAgentOrganDb:LoadAgentDBService,public pupop:MdPupop,
               public channelDb:ChannelDBService,
               public channelDayDetailDB: ChannelDayDetailDBService,
               public providerOrganDb: LoadServiceProviderDBService,
  ) {
    this.CommonDB.loadTransApi({transId:""}).subscribe(res =>{
      this.tradeTypes = res
    });
    this.mchBankDataSource = new InputSearchDatasource(mckBankOrganDb);
    this.merchantDataSource = new InputSearchDatasource(merchantOrganDb);
    this.mchAgentDataSource = new InputSearchDatasource(mckAgentOrganDb);
    this.cashCompanionDataSource = new InputSearchDatasource(cashCompanionOrganDb);//结算账户
    this.providerDataSource = new InputSearchDatasource(providerOrganDb);//服务商
    let params = this.sidenavService.getPageParams();
    // this.channelDayDB.params = this.form;
    // this.channelDayDetailDB.params = this.form;
    this.channelDb.loadChannelDayCount({billTimeEnd: this.form.billTimeEnd,billTimeStart:this.form.billTimeStart}).subscribe(res=>{
      if(res && res['status'] == 200){
        this.count = res.data
      }
    });

  }
  ngOnInit(){
    this.cashType = this.helper.getDictByKey('CASH_TYPE');
    this.cashState = this.helper.getDictByKey('CASH_STATUS');
    this.UloCode = this.helper.getDictByKey('CLOUD_ULO_BANK_NO');
    this.channelDayDB.params = this.form;
    this.channelDayDetailDB.params = this.form;
    this.channelDayDetailTable && this.channelDayDetailTable.database && this.channelDayDetailTable.database.curPageDataChange.subscribe(res=>{
      if(res && res['status'] == 200){
        this.channelDetailCount();
      }
    });
  }
  public tradeTimeOpts:any = {//时间配置
    limit:30,
    format:'yyyy-MM-dd'
  };
  //渠道日结时间---》当天，日结详情---》取渠道日结时间前一天
  onChangeTab(selectedIndex:any){
    // console.log(selectedIndex);
    if(selectedIndex == 1){
      this.form['billTimeStart'] = this.helper.format(this.onMinusDate(this.form['billTimeStart']));
      this.form['billTimeEnd'] = this.helper.format(this.onMinusDate(this.form['billTimeEnd']));
      this.onSearchDetail();
      // console.log(this.form['billTimeStart'],this.form['billTimeEnd']);
    }else if(selectedIndex == 0){
      this.form['billTimeStart'] = this.helper.format(this.onPlusDate(this.form['billTimeStart']));
      this.form['billTimeEnd'] = this.helper.format(this.onPlusDate(this.form['billTimeEnd']));
      this.onSearch();
      // console.log(this.form['billTimeStart'],this.form['billTimeEnd']);
    }

  }
  onMinusDate(theTime: any){
    // var date = this.form['billTimeStart'];
    var date = theTime;
    date = date.substring(0,19);
    date = date.replace(/-/g,'/');
    var timestamp = new Date(date).getTime();
    var yesterdsay = new Date(timestamp - 86400000);
    // this.form['billTimeStart'] = this.helper.format(yesterdsay);
    return yesterdsay;
  }
  onPlusDate(theTime: any){
    var date = theTime;
    date = date.substring(0,19);
    date = date.replace(/-/g,'/');
    var timestamp = new Date(date).getTime();
    var  tomorrow = new Date(timestamp + 86400000);
    return  tomorrow;
  }

  public onSearch(){
    if(this.helper.isEmpty(this.form['_billTimeEnd'])){
      this.snackBar.alert("请您选择清算结束时间!")
    }else {
      this.form.doSearch(this.channelDayDB);
      this.channelDayTable.refresh();
      this.count ={}; //清空面板数据
      this.channelCount();
    }

  }
  public onSearchDetail() {
    if (this.helper.isEmpty(this.form['_billTimeEnd'])) {
      this.snackBar.alert("请您选择清算结束时间!")
    } else {
      this.form.doSearch(this.channelDayDetailDB);
      this.channelDayDetailTable.refresh();
      this.countDetail ={}; //清空面板数据
      this.channelDetailCount();
    }
  }

  public channelCount(){
    this.channelDb.loadChannelDayCount(this.form).subscribe(res=>{
      if(res && res['status'] == 200){
        this.count = res.data
      }
    });
  }

  public channelDetailCount(){
    this.channelDb.loadChannelDayCountDetail(this.form).subscribe(res=>{
      if(res && res['status'] == 200){
        this.countDetail = res.data
      }
    });
  }
  /**
   * 结算打款
   */
  public settlePay (e:MouseEvent){
    if(!this.form.agencyCode){
      this.snackBar.alert("请选择机构");
      return false;
    }
    if(!this.form.ally){
      this.snackBar.alert("请选择结算账户");
      return false;
    }

  let win = this.pupop.openWin(settlePayWinComponent,{title:'结算打款',width:'400px',height:'280px',
    data: _.extend({'agentno':this.form.canalNo,'beginTime':this.form.billTimeStart,'endTime':this.form.billTimeEnd,'chanProNo':this.form.chanProNo},this.form)
  });
    win.afterClosed().subscribe(result => {
      this.channelDayTable.refresh(this.form.page);
    });
  }
  public settlePayDetail(e:MouseEvent){
    if(!this.form.agencyCode){
      this.snackBar.alert("请选择机构");
      return false;
    }
    if(!this.form.ally){
      this.snackBar.alert("请选择结算账户");
      return false;
    }
    let winDetail = this.pupop.openWin(settlePayWinComponent,{title:'结算打款',width:'400px',height:'280px',
      data: _.extend({'agentno':this.form.canalNo,'beginTime':this.form.billTimeStart,'endTime':this.form.billTimeEnd,'chanProNo':this.form.chanProNo},this.form)
    });
    winDetail.afterClosed().subscribe(result => {
      this.channelDayDetailTable.refresh(this.form.page);
    });
  }

  /**
   * 机构控件显示函数
   */
  public mchBankdisplayFn(value: any):string{
    if(!this.helper.isEmpty(this.form._agencyName)){
      return this.form._agencyName
    }
    let name = value && value['name'];
    if(name){
      this.form._agencyName = name;
    }
    return name;
  }
  public agencySelected(res){
    if(res){
      this.form["_agencyName"] = res["value"]["name"];
    }
    this.mckAgentOrganDb.params = {};
    this.mckAgentOrganDb.refreshChange.next(true);
    this.providerOrganDb.params = {};
    this.providerOrganDb.refreshChange.next(true);
  }
  /**
   * 机构控件选项显示函数
   */
  public mchBankOptionDisplayFn(value:any):string{
    return value && value['name'] +'('+value['orgNo']+')';
  }

  public mchBankbeforClickFunc(value:any):boolean{
    let flag:boolean = true;
    if(this.helper.isEmpty(value)){
      this.snackBar.alert('请输入关键字！');
      flag = false;
    }
    this.mckBankOrganDb.params = {name:value};
    return flag;
  }
  /**
   * 商户名称控件显示函数
   */
  public merchantDisplayFn(value: any):string{
    if(!this.helper.isEmpty(this.form._merchantName)){
      return this.form._merchantName
    }
    let name = value && value['name'];
    if(name){
      this.form._merchantName = name;
    }
    return name;
  }
  public mchSelected(res){
    if(res){
      this.form["_merchantName"] = res["value"]["name"];
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
      this.snackBar.alert('请输入关键字！');
      flag = false;
    }
    this.merchantOrganDb.params = {name:value};
    return flag;
  }
  /**
   * 所属上级控件显示函数
   */
  public mchAgentDisplayFn(value: any):string{
    if(!this.helper.isEmpty(this.form._canalName)){
      return this.form._canalName
    }
    let name = value && value['name'];
    if(name){
      this.form._canalName = name;
    }
    return name;
  }
  public canalSelected(res){
    if(res){
      this.form["_canalName"] = res["value"]["name"];
    }
  }
  /**
   * 所属上级控件选项显示函数
   */
  public mchAgentOptionDisplayFn(value:any):string{
    return value && value['name'] +'('+value['chanCode']+')';
  }

  public mchAgentBeforClickFunc(value:any):boolean{
    let flag:boolean = true;
    if(this.helper.isEmpty(value)){
      this.snackBar.alert('请输入关键字！');
      flag = false;
    }
    if(this.form.agencyCode){
      this.mckAgentOrganDb.params = {name:value,bankCode:this.form.agencyCode};
    }else {
      this.mckAgentOrganDb.params = {name:value,bankCode:this.UloCode};
    }
    return flag;
  }
  /**
   * 结算账户控件显示函数
   */
  public cashCompaniondisplayFn(value: any):string{
    if(!this.helper.isEmpty(this.form._allyName)){
      return this.form._allyName
    }
    let name = value && value['companionName'];
    if(name){
      this.form._allyName = name;
    }
    return name;
  }
  public actIdSelected(res){
    if(res){
      this.form["_allyName"] = res["value"]["companionName"];
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
      this.snackBar.alert('请输入关键字！');
      flag = false;
    }
    this.cashCompanionOrganDb.params = {name:value};
    return flag;
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
}
