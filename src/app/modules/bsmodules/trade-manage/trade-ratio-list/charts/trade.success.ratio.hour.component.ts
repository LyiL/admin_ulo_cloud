import {Component, ViewChild} from "@angular/core";
import {TradeRatioHourForm} from "../../../../../common/search.form/trade-manage.form/trade.ratio.hour.form";
import {
  LoadBankOrgDBService, LoadAgentAndSPDBService,
  LoadMerchantDBService
} from "../../../../../common/db-service/common.db.service";
import {TradeRationCharts} from "../trade.ratio.list.db.service";
import {BaseChartDirective} from "../../../../../common/components/charts/base.chart.directive";
import {InputSearchDatasource} from "../../../../../common/services/impl/input.search.datasource";
import {HelpersAbsService} from "../../../../../common/services/helpers.abs.service";
import {ISidenavSrvice} from "../../../../../common/services/isidenav.service";
import {MdSnackBar} from "@angular/material";
import {TimeIntervalMovedService} from "../../../../../common/directives/time.interval.moved.directive/moved.service";
@Component({
  selector:'trade-success-ratio-hour',
  templateUrl:'./trade.success.ratio.hour.component.html',
  providers:[LoadMerchantDBService,TradeRationCharts,LoadAgentAndSPDBService,LoadBankOrgDBService],
  styleUrls:['../chart.scss']
})
export class TradeSuccessRatioHourComponent{
  public form:TradeRatioHourForm = new TradeRatioHourForm();

  @ViewChild('baseChart') baseChart:BaseChartDirective;
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
  private countData:any = {};//统计结果
  //lineChart
  public lineChartData: Array<any> = [];
  public lineChartLabels: Array<any> = [];
  public lineChartOptions: any = {
    responsive: true
  };

  public lineChartLegend: boolean = true;
  public lineChartType: string = 'line';
  public equalParts:number = 12;
  private showXPointNum:number = 12;//显示的x坐标数量
  private showPointInterval:Array<number> = [0,this.showXPointNum];//X显示区间
  private sourceChartLabels:Array<any> = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];//原始X坐标
  private curGranularity:string = 'successRatio';
  public  UloCode:any;
  constructor(public sidenavService:ISidenavSrvice,private helper:HelpersAbsService,private snackBar:MdSnackBar,
              public mckAgentOrganDb:LoadAgentAndSPDBService, public mckBankOrganDb:LoadBankOrgDBService,private movedService:TimeIntervalMovedService,
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
    if(this.helper.isEmpty(this.form['tradeTime'])){
      this.snackBar.alert("请您选择清算结束时间!")
    }else {
      jQuery('#successBtn').addClass('active').siblings().removeClass('active');

      this.showPointInterval = [0,this.showXPointNum];
      this.curGranularity = 'successRatio';
      this.movedService.resetIntervalEvent.next(true);
      this.loadData();

    }
  }

  goRatio(){
    this.sidenavSrvice.onNavigate('/admin/traderatio','交易比率',{},true);
  }

  onChangeTime(result: any){
    this.form.tradeTime = result.value;
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

    // this.lineChartData = this.countData[granularity];
    this.curGranularity = granularity;
    this.calcShowCharDatas();
  }

  onTimeIntervalMoved(moved:number){
    if(moved != -1){
      this.movedService.moveEvent.next({before:false,after:true});
    }else{
      this.movedService.moveEvent.next({before:true,after:false});
    }
    if(this.showPointInterval[0] > 0 && this.showPointInterval[1] <= 23 && this.form['tradeTime'] == this.form.format(new Date(),'YYYY-MM-DD')) {
      this.loadData();
    }
  }

  onMovedChange(res:any){
    if(res.before){//向前
      if(this.showPointInterval[0] > 0){
        this.showPointInterval[0] = this.showPointInterval[0] - 1;
        this.showPointInterval[1] = this.showPointInterval[1] - 1;
      }
    }else{
      if(this.showPointInterval[1] < this.sourceChartLabels.length) {
        this.showPointInterval[0] = this.showPointInterval[0] + 1;
        this.showPointInterval[1] = this.showPointInterval[1] + 1;
      }
    }

    if(this.showPointInterval[0] >=0 && this.showPointInterval[1] < this.sourceChartLabels.length){
      this.calcShowChartLabels();
      this.calcShowCharDatas();
    }
  }

  private loadData(){
    this.tradeRationCharts.loadChartsDataHour(_.clone(this.form)).subscribe(res=>{
      if(res && res['status'] == 200){
        if(_.size(res['data']['data']) == 0){
          this.isShow = true;
        }else{
          this.isShow = false;
          this.countData = res['data']['data'];
          // this.lineChartData = this.countData['successRatio'];
          this.calcShowCharDatas();
        }
      }
    });
    jQuery('#successBtn').addClass('active').siblings().removeClass('active');
    this.calcShowChartLabels();
  }

  private calcShowChartLabels(){
    this.lineChartLabels = this.sourceChartLabels.filter((item,index)=>{
      return index >= this.showPointInterval[0] && index <= this.showPointInterval[1];
    });
  }

  private calcShowCharDatas(){
    this.lineChartData = [];
    this.countData[this.curGranularity] && this.countData[this.curGranularity].forEach((item)=>{
      if(item){
        let _item = this.helper.clone(item);
        _item['data'] = item['data'].filter((subItem,sIndex)=>{
          return sIndex >= this.showPointInterval[0] && sIndex <= this.showPointInterval[1];
        });
        this.lineChartData.push(_item);
      }
    });
  }
}
