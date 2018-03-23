/**
 * Created by lenovo on 2017/8/1.
 */
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Column} from '../../../../common/components/table/table-extend-config';
import {ISidenavSrvice} from "../../../../common/services/isidenav.service";
import {MdDialog, MdPupop, MdSnackBar} from '@angular/material';
import {AccountOtherDBLoad, ElectronicAccountListService} from "./electronic.account.list.db.service";
import {ElectronicAccountListAddbtnWinComponent} from "./electronic.account.list.addbtn.win.component";
import {ElectronicAccountListEditbtnWinComponent} from "./electronic.account.list.editbtn.win.component";
import {ElectronicAccountSearchForm} from "../../../../common/search.form/to-pay-manage/electronic.account.search.form";
import {ElectronicAccountListTakecashbtnWinComponent} from "./electronic.account.list.takecashbtn.win.component";
import {Router} from "@angular/router";
import {ElectronicAccountListDistributionWinComponent} from "./electronic.account.list.distribution.win.component";
import {MdTableExtend} from "../../../../common/components/table/table-extend";
import {HelpersAbsService} from "../../../../common/services/helpers.abs.service";
import {HttpService} from "../../../../common/services/impl/http.service";
import {LoadMerchantDBService} from "../../../../common/db-service/common.db.service";
import {InputSearchDatasource} from "../../../../common/services/impl/input.search.datasource";

@Component({
  selector: 'electronic-account-list',
  templateUrl: "electronic.account.list.component.html",
  providers: [ElectronicAccountListService, LoadMerchantDBService,AccountOtherDBLoad]
})
export class ElectronicAccountListComponent implements OnInit {
  /**
   * 启用状态
   */
  public startStates: Array<any> = [];
  /**
   * 商户信息配置
   */
  public merchantFilterFields: Array<string>= ["merchantNo","name"];
  public merchantDataSource: InputSearchDatasource;//获取商户信息数据源
  /**
   *查询表单
   */
  public form: ElectronicAccountSearchForm = new ElectronicAccountSearchForm();
  @ViewChild('electronicAccountListTable') electronicAccountListTable: MdTableExtend;

  //表格
  public electronicAccountListColumns: Array<Column>=[{
    name:"accountNo",
    title:"账户编号"
  },{
    name:"accountName",
    title:"账户名称"
  },{
    name:"organName",
    title:"所属商户"
  },{
    name:"outMchno",
    title:"外部商户号"
  },{
    name:"cashpoolName",
    title:"归属资金池"
  },{
    name:"useState",
    title:"启用状态",
    render:this.onUseState.bind(this),
  },{
    name:"a",
    title:"记账明细",
    render:this.onAccountDetail.bind(this)
  },{
    name:"singleProcsFee",
    title:"对公手续费（元）<br/>对私手续费（元）<br/>垫资手续费（%）",
    render:((row:any,fieldName:string,cell?:any) => {
      let publiFee = row[fieldName] || 0;
      let privFee = row['privProcsFee'] || 0;
      let advanceFee = row['advanceProcsFee'] || 0;
      let advanceFeeTemp = advanceFee * 100;
      return publiFee + '<br/>' + privFee + '<br/>' + advanceFeeTemp;
    })
  },{
    name:"currentAmount",
    title:"可用余额（元）",
    // xtype:'price',
    render:(function(row:any,name:string){
      let price = row[name] || 0;
      return price;
    }).bind(this)
  },{
    name:"canSettleBalance",
    title:"可结算余额（元）",
    // xtype:'price',
    render:(function(row:any,name:string){
      let price = row[name] || 0;
      return price;
    }).bind(this)
  },{
    name:"f",
    title:"分配账号",
    render:this.onDistribution.bind(this)
  },{
    name:"b",
    title:"余额查询",
    render:this.onCashCheck.bind(this)
  }];
  public tableActionCfg: any = {
    width: '100px',
    actions:[{
      btnName:"detail",
      btnDisplay:"详情",
      hide:(()=>{
        if(this.helper.btnRole('EACCOUNTINFO')){
          return false;
        }
        return true;
      }).bind(this),
      click:this.onDetailHendler.bind(this)
    }, {
      btnName:"cash",
      btnDisplay:"提现",
      hide:(()=>{
        if(this.helper.btnRole('EACCOUNTWITHDRAW')){
          return false;
        }
        return true;
      }).bind(this),
      click:this.onTakeCash.bind(this)
    },{
      btnName:"del",
      hide:true,
    },{
      btnName:"edit",
      hide:(()=>{
        if(this.helper.btnRole('EACCOUNTEDIT')){
          return false;
        }
        return true;
      }).bind(this),
      click:this.onEditDialog.bind(this)
    }]
  };

  constructor(public electronicAccountListDB: ElectronicAccountListService,
              public sidenavService:ISidenavSrvice,
              public dialog: MdDialog,
              public snackBar: MdSnackBar,
              public router: Router,
              public helper: HelpersAbsService,
              public http: HttpService,
              public merchantOrganDb: LoadMerchantDBService,
              public pupop: MdPupop,
              public accountOtherDBLoad:AccountOtherDBLoad
  ) {
    this.merchantDataSource = new InputSearchDatasource(merchantOrganDb);//商户
  }
  ngOnInit(){
    this.electronicAccountListDB.params = this.form;
    this.startStates = this.helper.getDictByKey('ENABLE_STATUS');
  }
  /**
   * 商户名称控件显示函数
   */
  public merchantDisplayFn(value: any):string{
    if(!this.helper.isEmpty(this.form._organName)){
      return this.form._organName;
    }
    let name = value && value['name'];
    if(name){
      this.form._organName = name;
    }
    return name;
  }

  public merchantSelected(res){
    if(res) {
      this.form._organName = res['value']['name'];
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

    this.merchantOrganDb.params = {name:value};
    return flag;
  }
  /**
   * 详情按钮点击事件
   */
  onDetailHendler(row:any,e:MouseEvent):void{
    this.sidenavService.onNavigate('/admin/electronicaccountdetail', '电子账户详情', {accountNo: row['accountNo']});
  }
  /**
   * 编辑按钮点击事件
   */
  onEditDialog(row: any) {
    let editDialog = this.pupop.openWin(ElectronicAccountListEditbtnWinComponent, {
      title:'电子账户',
      width:'560px',
      height:'668px',
      data: {
        accountNo: row['accountNo'],
      },
    });
    editDialog.afterClosed().subscribe(result => {
      this.electronicAccountListTable.refresh(this.form.page);
    });
  }
  /**
   * 新增按钮点击事件
   */
  public onAddNewDialog() {
    let addDialog = this.pupop.openWin(ElectronicAccountListAddbtnWinComponent, {
      title:'电子账户',
      width:'560px',
      height:'668px',
    });
    addDialog.afterClosed().subscribe(result => {
      this.electronicAccountListTable.refresh(this.form.page);
    });
  }
  /**
   * 提现按钮点击事件(如果余额为0弹出提示信息，否则弹出弹框)
   */
  public onTakeCash(row:any,e:MouseEvent,message: string, action: string):void{
    if(row['useState'] == 0){
      this.snackBar.alert("电子账户为冻结状态，不能进行提现操作！");
    }else if(this.helper.isEmpty(row['currentAmount']) || row['currentAmount'] == 0) {
      this.snackBar.alert("电子账户余额为0，没有可用提现的金额！");
    }else{
      let takeCashDialog = this.pupop.openWin(ElectronicAccountListTakecashbtnWinComponent, {
        title:'提现',
        width:'470px',
        height:'440px',
        data: {
          accountNo: row['accountNo'],
        },
      });
      takeCashDialog.afterClosed().subscribe(result => {
        this.electronicAccountListTable.refresh(this.form.page);
      });
    }

  }

  /**
   *表格中记账明细列（查看）
   * @author lyl
   * @date 2017-08-15
   */
  onGotoAccountDetails(row: any) {
    this.sidenavService.onNavigate('/admin/electronicaccountaccountdetail','记账明细', {accountNo: row['accountNo']});
    return false;
  }
  onAccountDetail(row:any,name:string,cell:Column,cellEl:ElementRef){
    if(!this.helper.btnRole('EACCOUNTACCOUNTING')) {
      return "/";
    }
    let _cellEl = cellEl.nativeElement;
    if(_cellEl.childElementCount > 0){
      return;
    }
    let _cellHtml = row[name] = '查看';
    let a = jQuery('<a href="#">'+_cellHtml+'</a>');
    a.bind('click',this.onGotoAccountDetails.bind(this,row,name,cell));
    jQuery(_cellEl).html('').empty().append(a);
  }

  /**
   *余额查询列（查询）
   * @author lyl
   * @date 2017-08-15
   */
  onAlertCashCheck(row:any,e:MouseEvent,message: string, action: string) {
    this.accountOtherDBLoad.loadSearchMoney({accountNo: row['accountNo']})
      .subscribe((res) => {
        if(res && res['status'] == 200) {
          this.snackBar.alert('查询成功！');
          this.electronicAccountListTable.refresh(this.form.page);
        }else {
          this.snackBar.alert(res['message']);
        }
      });
    return false;
  }
  onCashCheck(row:any,name:string,cell:Column,cellEl:ElementRef){
    if(!this.helper.btnRole('EACCOUNTSEACH')) {
      return "/";
    }
    let _cellEl = cellEl.nativeElement;
    if(_cellEl.childElementCount > 0){
      return;
    }
    let _cellHtml = row[name] = '查询';
    let a = jQuery('<a href="#">'+_cellHtml+'</a>');
    a.bind('click',this.onAlertCashCheck.bind(this,row,name,cell));
    jQuery(_cellEl).html('').empty().append(a);
  }

  /**
   *分配账号列（分配）
   * @author lyl
   * @date 2017-08-15
   */
  onDistributionDialog(row: any) {
    let distributionDialog = this.pupop.openWin(ElectronicAccountListDistributionWinComponent, {
      title:'外部账户',
      width:'380px',
      height:'280px',
      data: {
        accountNo: row['accountNo'],
        externalAccount: row['externalAccount'],
        externalPassword: row['externalPassword']
      },
    });
    distributionDialog.afterClosed().subscribe(result => {
      this.electronicAccountListTable.refresh(this.form.page);
    });
    return false;
  }
  onDistribution(row:any,name:string,cell:Column,cellEl:ElementRef){
    if(!this.helper.btnRole('EACCOUNTALLOT')) {
      return "/";
    }
    let _cellEl = cellEl.nativeElement;
    if(_cellEl.childElementCount > 0){
      return;
    }
    let _cellHtml = row[name] = '分配';
    let a = jQuery('<a href="#">'+_cellHtml+'</a>');
    a.bind('click',this.onDistributionDialog.bind(this,row,name,cell));
    jQuery(_cellEl).html('').empty().append(a);
  }

  /**
   *启用状态列（分配）
   * 0未启用,1启用
   * @author lyl
   * @date 2017-08-15
   */
  onChangeStatus(row:any,name:string,cell:any,span:any,i:any){
    let userStatus = row[name];
    userStatus = row[name] == 1?'0':'1';
    this.accountOtherDBLoad.loadUseState({accountNo: row['accountNo'], useState: userStatus})
      .subscribe((res)=>{
        this.electronicAccountListTable.refresh(this.form.page);
      });
  }
  onUseState(row:any,name:string,cell:any,cellEl:any) {
    let _cellEl = cellEl.nativeElement;
    if(_cellEl.childElementCount > 0){
      return;
    }
    let _span = jQuery('<span></span>');
    let _i = jQuery('<i class="fa"></i>');
    if(row[name] == 1){
      _span.html('启用');
      _i.addClass('fa-pause');
      cell.bgColor = 'success-bg';
    }else if(row[name] == 0){
      _span.html('禁用');
      _i.addClass('fa-toggle-right');
      cell.bgColor = 'danger-bg';
    }else{
      cell.bgColor = 'none';
      return '/';
    }
    if( this.helper.btnRole('EACCOUNTSTATE') ) {
      _i.bind('click',this.onChangeStatus.bind(this,row,name,cell,_span,_i));
    }
    jQuery(_cellEl).html('').empty().append(_span ,_i);
  }
  /**
   * 查询按钮
   */
  onSearch() {
    this.form.doSearch(this.electronicAccountListDB);
    this.electronicAccountListTable.refresh();
  }
}





