import {Component, OnInit, ViewChild} from "@angular/core";

import {ISidenavSrvice} from "../../../../../common/services/isidenav.service";
import {TradeSuccessRatioMapForm} from "../../../../../common/search.form/trade-manage.form/trade.success.ratio.map.form";
import {HelpersAbsService} from "../../../../../common/services/helpers.abs.service";
import {MdSnackBar} from "@angular/material";
import {
  LoadAgentAndSPDBService, LoadBankOrgDBService,
  LoadMerchantDBService
} from "../../../../../common/db-service/common.db.service";
import {InputSearchDatasource} from "../../../../../common/services/impl/input.search.datasource";
import {TradeRationCharts} from "../trade.ratio.list.db.service";
import {TimeIntervalMovedService} from "../../../../../common/directives/time.interval.moved.directive/moved.service";
import {BaseChartDirective} from "../../../../../common/components/charts/base.chart.directive";
@Component({
  selector:"trade-ratio-list-list",
  templateUrl:"trade.success.ratio.day.component.html",
  providers:[LoadMerchantDBService,TradeRationCharts,LoadAgentAndSPDBService,LoadBankOrgDBService],
  styleUrls:['../chart.scss']
})
export class TradeSuccessRatioChartDayComponent implements OnInit{
  public form:TradeSuccessRatioMapForm = new TradeSuccessRatioMapForm();
  @ViewChild('baseChart') baseChart:BaseChartDirective;
  public tradeTimeOpts:any = {
    limit:7,
    format:'yyyy-MM-dd'
  };
  public merchantDataSource:InputSearchDatasource;
  public mchBankDataSource:InputSearchDatasource;//机构控件数据源
  public mchAgentDataSource:InputSearchDatasource;//受理机构数据源
  /**
   * 商户信息配置
   */
  public merchantFilterFields:Array<string>= ["merchantNo","name"];
  /**
   * 所属机构配置
   */
  public mchBnakFilterFields:Array<string>= ["orgNo","name"];
  /**
   * 所属渠道配置
   */
  public mchAgentFilterFields:Array<string>= ["chanCode","name","agentno"];
  public isShow:boolean = false;
  private countData:any;//统计结果
  //lineChart
  public lineChartData: Array<any> = [];
  public lineChartLabels: Array<any> = [];
  public lineChartOptions: any = {
    responsive: true
  };

  public lineChartLegend: boolean = true;
  public lineChartType: string = 'line';
  public UloCode:any;//优络编码;
  constructor(public sidenavService:ISidenavSrvice,private helper:HelpersAbsService,private snackBar:MdSnackBar,
              public mckAgentOrganDb:LoadAgentAndSPDBService, public mckBankOrganDb:LoadBankOrgDBService,
              public merchantOrganDb:LoadMerchantDBService,private sidenavSrvice:ISidenavSrvice,private tradeRationCharts:TradeRationCharts){
    this.merchantDataSource = new InputSearchDatasource(merchantOrganDb);
    this.mchBankDataSource = new InputSearchDatasource(mckBankOrganDb);
    this.mchAgentDataSource = new InputSearchDatasource(mckAgentOrganDb);
  }

  ngOnInit(){
    this.loadData();
    this.UloCode = this.helper.getDictByKey('CLOUD_ULO_BANK_NO');
  }

  /**
   * 查询
   */
  doSearch(){
    if(this.helper.isEmpty(this.form['tradeTimeEnd'])){
      this.snackBar.alert("请您选择清算结束时间!")
    }else {
      this.loadData();
    }
  }

  goRatio(){
    this.sidenavSrvice.onNavigate('/admin/traderatio','交易比率',{},true);
  }

  public merchantBeforClickFunc(value:any):boolean{
    let flag: boolean = true;
    if(this.helper.isEmpty(value)){
      this.snackBar.alert('请先输入过滤值！');
      flag = false;
    }
    if(this.form.bankNo){
      this.merchantOrganDb.params = {name:value,bankNo:this.form.bankNo};
    }else {
      this.merchantOrganDb.params = {name:value,bankNo:this.UloCode};
    }
    return flag;
  }

  /**
   * 商户名称控件显示函数
   */
  public merchantDisplayFn(value: any):string{
    if(!this.helper.isEmpty(this.form._merchantName)){
      return this.form._merchantName;
    }
    let name = value && value['name'];
    if(name){
      this.form._merchantName = name;
    }
    return name;
  }

  public merchantSelected(res) {
    if(res) {
      this.form["_merchantName"] = res["value"]["name"];
    }
  }

  /**
   * 商户名称控件选项显示函数
   */
  public merchantOptionDisplayFn(value:any):string{
    return value && value['name'] +'('+value['merchantNo']+')';
  }


  /**
   * 机构控件显示函数
   */
  public mchBankdisplayFn(value: any):string{
    if(!this.helper.isEmpty(this.form._bankName)){
      return this.form._bankName;
    }
    let name = value && value['name'];
    if(name){
      this.form._bankName = name;
    }
    return name;
  }

  public bankSelected(res) {
    if(res) {
      this.form["_bankName"] = res["value"]["name"];
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
   *所属渠道控件显示函数
   */
  public mchAgentDisplayFn(value: any):string{
    if(!this.helper.isEmpty(this.form._agentName)){
      return this.form._agentName;
    }
    let name = value && value['name'];
    if(name){
      this.form._agentName = name;
    }
    return name;
  }

  public agentSelected(res) {
    if(res) {
      this.form["_agentName"] = res["value"]["name"];
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
    if(this.form.bankNo){
      this.mckAgentOrganDb.params = {name:value,bankCode:this.form.bankNo};
    }else {
      this.mckAgentOrganDb.params = {name:value,bankCode:this.UloCode};
    }
    return flag;
  }


  /**
   * 切换统计粒度
   * @param granularity 统计粒度(successRatio:成功率,tradeMoney:交易金额,tradeSum:交易总数)
   */
  public onSwitchData(granularity,e){
    let target = e.target;
    jQuery(target).parents('button').addClass('active').siblings().removeClass('active');
    this.lineChartData = this.countData[granularity];
  }

  private loadData(){
    this.tradeRationCharts.loadChartsData(_.clone(this.form)).subscribe(res=>{
      if(res && res['status'] == 200){
        if(_.size(res['data']['data']) == 0){
          this.isShow = true;
        }else{
          this.isShow = false;
          this.countData = res['data']['data'];
          this.lineChartData = this.countData['successRatio'];
        }
      }
    });
    jQuery('#successBtn').addClass('active').siblings().removeClass('active');
    this.calcTimeXAxis();
  }

  private calcTimeXAxis(){
    let startTime = moment(this.form.tradeTimeStart);
    let endTime = moment(this.form.tradeTimeEnd);
    let diff = endTime.diff(startTime,'days');
    let format:string = 'YYYY-MM-DD';
    let xAxis:Array<string> = new Array<string>();
    xAxis.push(startTime.format(format));
    for(let i=2; i<=diff; i++){
      xAxis.push(startTime.add(1,"days").format(format));
    }
    xAxis.push(endTime.format(format));
    this.lineChartLabels = xAxis;
  }
}
