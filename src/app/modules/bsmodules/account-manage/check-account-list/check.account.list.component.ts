/**
 * Created by lenovo on 2017/8/1.
 */
import {Component, ViewChild, OnInit} from "@angular/core";
import {Column} from "../../../../common/components/table/table-extend-config";
import {CheckAccountDBLoad, CheckAccountListDBService} from "./check.account.list.db.service"
import {ISidenavSrvice} from "../../../../common/services/isidenav.service";
import {CheckAccountSearchForm} from "../../../../common/search.form/account-manage/check.account.search.form";
import {HelpersAbsService} from "../../../../common/services/helpers.abs.service";
import {MdTableExtend} from "../../../../common/components/table/table-extend";
import {HttpService} from "../../../../common/services/impl/http.service";
import {LoadCompanionForBank} from "../../../../common/db-service/common.db.service";
import {InputSearchDatasource} from "../../../../common/services/impl/input.search.datasource";
import {MdSnackBar} from "@angular/material";

@Component({
  selector: "check-account",
  templateUrl: "check.account.list.component.html",
  providers: [CheckAccountListDBService, LoadCompanionForBank,CheckAccountDBLoad]
})
export class CheckAccountComponent implements OnInit {
  /**
   * 对账状态
   */
  public checkStates:Array<any> = [];
  /**
   * 结算账户配置
   */
  public cashCompanionFilterFields:Array<string>= ["companion","companionName"];
  public cashCompanionDataSource: InputSearchDatasource;//结算账户控件数据源
  /**
   * 查询表单
   */
  public form: CheckAccountSearchForm = new CheckAccountSearchForm();
  @ViewChild('checkAccountListTable') checkAccountListTable: MdTableExtend;

  /**
   *时间配置
   */
  public dateOpts:any = {
    format:'yyyy-MM-dd',
    limit:30
  };

  public checkAccountColumns:Array<Column>=[{
    name:"reconDay",
    title:"对账日期/结算账户",
    render:((row:any,fieldName:string,cell?:any) => {
      return (this.helper.isEmpty(row[fieldName])?'/':this.helper.format(row[fieldName], 'yyyy-MM-dd')) + '<br/>'+ (this.helper.isEmpty(row['ally']) ? '/' : row['ally']);
    }),
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
    name:"eqTotalFee",
    title:"平账交易（元）<br/>平账退款（元）",
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
    name:"trdTotalFee",
    title:"第三方交易（元）<br/>第三方退款（元）",
    render:((row:any,fieldName:string,cell?:any) => {
      let price1 = row[fieldName] || 0;
      let price2 = row['trdRefundFee'] || 0;
      return  this.helper.priceFormat(price1) + '<br/>' + this.helper.priceFormat(price2);
    }).bind(this)
  },{
    name:"trdPodg",
    title:"第三方手续费（元）<br/>第三方退款手续费（元）",
    render:((row:any,fieldName:string,cell?:any) => {
      let price1 = row[fieldName] || 0;
      let price2 = row['trdFavRefundFee'] || 0;
      return  this.helper.priceFormat(price1) + '<br/>' + this.helper.priceFormat(price2);
    }).bind(this)
  },{
    name:"reconState",
    title:"对账状态",
    render:this.onTreatState.bind(this)
  }];
  public tableActionCfg: any = {
    width:"80px",
    actions:[{
      btnName:"del",
      hide:true
    },{
      btnName:"edit",
      hide:true
    }, {
      btnDisplay:"详情",
      hide:(()=>{
        if(this.helper.btnRole('CHECKACTINFO')){
          return false;
        }
        return true;
      }).bind(this),
      click:this.onDetailHendler.bind(this)
    }]
  };
  public summaryCount: any = {};
  constructor(
    public checkAccountListDB: CheckAccountListDBService,
    public sidenavService: ISidenavSrvice,
    public helper: HelpersAbsService,
    public http: HttpService,
    protected cashCompanionOrganDb: LoadCompanionForBank,
    protected snackBar: MdSnackBar,
    public checkAccountDBLoad:CheckAccountDBLoad
  ){
    this.cashCompanionDataSource = new InputSearchDatasource(cashCompanionOrganDb);//结算账户
  }
  ngOnInit() {
    this.checkStates = this.helper.getDictByKey('PARTNER_PRCSTATUS');
    this.checkAccountListDB.params = this.form;
    this.loadCheckAccount();
  }
  /**
   * 对账账户统计面板
   */
  public loadCheckAccount(){
    if(this.form.isDataEmpty()){
      return;
    }
    this.checkAccountDBLoad.loadCount(_.clone(this.form)).subscribe(res=>{
      if(res && res['status'] == 200){
        this.summaryCount = res.data;
      }else{
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
   *对账账户详情
   */
  onDetailHendler(row:any,e:MouseEvent):void{
    this.sidenavService.onNavigate('/admin/checkaccountdetail', '详情-对账账户' , {id: row['id']});
  }

  /**
   * 查询按钮
   * @param value
   */
  onSearch() {
    if(this.helper.isEmpty(this.form['_searchEndTime'])) {
      this.snackBar.alert('请选择结束日期!') ;
    }else {
      this.form.doSearch(this.checkAccountListDB);
      this.checkAccountListTable.refresh();
      this.summaryCount = {};//清空统计面板数据
      this.loadCheckAccount();
    }
  }
}
