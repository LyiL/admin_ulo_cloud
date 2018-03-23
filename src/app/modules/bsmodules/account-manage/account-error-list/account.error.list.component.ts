/**
 * Created by lenovo on 2017/8/1.
 */
import {Component, ViewChild, OnInit} from "@angular/core";
import {Column} from '../../../../common/components/table/table-extend-config';
import {AccountErrorService} from './account.error.list.db.service'
import {ISidenavSrvice} from "../../../../common/services/isidenav.service";
import {AccountErrorSearchForm} from "../../../../common/search.form/account-manage/account.error.search.form";
import {HelpersAbsService} from "../../../../common/services/helpers.abs.service";
import {MdTableExtend} from "../../../../common/components/table/table-extend";
import {LoadCompanionForBank} from "../../../../common/db-service/common.db.service";
import {InputSearchDatasource} from "../../../../common/services/impl/input.search.datasource";
import {MdSnackBar} from "@angular/material";

@Component({
  selector: "account-error",
  templateUrl: "account.error.list.component.html",
  providers: [AccountErrorService, LoadCompanionForBank]
})
export class AccountErrorComponent implements OnInit {
  /**
   * 处理状态
   */
  public handleStates:Array<any> = [];
  /**
   * 结算账户配置
   */
  public cashCompanionFilterFields:Array<string>= ["companion","companionName"];
  public cashCompanionDataSource: InputSearchDatasource;//结算账户控件数据源
  /**
   * 查询表单
   */
  public form: AccountErrorSearchForm = new AccountErrorSearchForm();
  @ViewChild('accountErrorListTable') accountErrorListTable: MdTableExtend;

  /**
   *时间配置
   */
  public dateOpts:any = {
    format:'yyyy-MM-dd',
    limit:30
  };

  show: boolean = false;

  public accountErrorColumns:Array<Column>=[{
    name:"reconDay",
    title:"对账日期/结算账户",
    render:((row:any,fieldName:string,cell?:any) => {
      return (this.helper.isEmpty(row[fieldName])?'/':this.helper.format(row[fieldName], 'yyyy-MM-dd')) + '<br/>'+ (this.helper.isEmpty(row['partner']) ? '/' : row['partner']);
    })
  },{
    name:"merchantName",
    title:"商户名称"
  },{
    name:"totalFee",
    title:"交易金额（元）/退款金额（元）",
    render:((row:any,fieldName:string,cell?:any) => {
      let price1 = row[fieldName] || 0;
      let price2 = row['refundFee']|| 0;
      return  this.helper.priceFormat(price1) + '<br/>' + this.helper.priceFormat(price2);
    }).bind(this)
  },{
    name:"orderNo",
    title:"平台单号/退款单号",
    width:"50px",
    render:((row:any,fieldName:string,cell?:any) => {
      return (this.helper.isEmpty(row[fieldName]) ? '/' : row[fieldName]) + '<br/>' + (this.helper.isEmpty(row['refundNo']) ? '/' : row['refundNo']);
    })
  },{
    name:"transactionId",
    title:"第三方订单号/第三方退款单号",
    width:"50px",
    render:((row:any,fieldName:string,cell?:any) => {
      return (this.helper.isEmpty(row[fieldName]) ? '/' : row[fieldName]) + '<br/>' + (this.helper.isEmpty(row['refundId']) ? '/' : row['refundId']);
    })
  },{
    name:"handleState",
    title:"处理状态",
    render:(function(row:any,name:string){
      if(this.helper.isEmpty(row[name])){
        return '/';
      }else{
        return this.helper.dictTrans('CHECKERROR_PRCSTATUS',row[name]);
      }
    }).bind(this)
  }];
  public tableActionCfg: any = {
    hide:(()=>{
      if(this.helper.btnRole('CHECKERRORINFO')){
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
    public accountErrorDB: AccountErrorService,
    public sidenavService:ISidenavSrvice,
    public helper: HelpersAbsService,
    protected cashCompanionOrganDb: LoadCompanionForBank,
    protected snackBar: MdSnackBar,
  ) {
    this.cashCompanionDataSource = new InputSearchDatasource(cashCompanionOrganDb);//结算账户
  }
  ngOnInit(){
    this.handleStates = this.helper.getDictByKey('CHECKERROR_PRCSTATUS');
    this.accountErrorDB.params = this.form;
  }
  /**
   * 结算账户控件显示函数
   */
  public cashCompaniondisplayFn(value: any):string{
    // return value && value['companionName'];
    if (!this.helper.isEmpty(this.form._partnerName)) {
      return this.form._partnerName;
    }
    let name = value && value['companionName'];
    if (name) {
      this.form._partnerName = name;
    }
    return name;
  }
  /**
   * 结算账户控件选项显示函数
   */
  public cashCompanionOptionDisplayFn(value:any):string{
    return value && value['companionName'] +'('+value['companion']+')';
  }

  public cashCompanionbeforClickFunc(value: any): boolean {
    let flag: boolean = true;
    if(this.helper.isEmpty(value)){
      this.snackBar.alert('请先输入过滤值！');
      flag = false;
    }
    this.cashCompanionOrganDb.params = {name: value};
    return flag;
  }

  public partnerSelected(res) {
    if (res) {
      this.form._partnerName = res['value']['companionName'];
    }
  }

  /**
   *对账异常详情
   */
  onDetailHendler(row:any,e:MouseEvent):void{
    this.sidenavService.onNavigate('/admin/accounterrordetail', '详情-对账异常', {id: row['id']});
  }
  /**
   * 查询按钮
   */
  onSearch() {
    if(this.helper.isEmpty(this.form['_checkTimeEnd'])) {
      this.snackBar.alert('请选择结束日期!')
    } else {
    this.form.doSearch(this.accountErrorDB);
    this.accountErrorListTable.refresh();
    }
  }

}
