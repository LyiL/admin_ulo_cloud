/**
 * Created by lenovo on 2017/8/1.
 */
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Column} from '../../../../common/components/table/table-extend-config';
import {ISidenavSrvice} from "../../../../common/services/isidenav.service";
import {MdDialog, MdPupop, MdSnackBar} from '@angular/material';
import {CashManageListService, CashPoolOtherDBLoad} from "./cash.manage.list.db.service";
import {CashManagelistAddbtnWinComponent} from "./cash.manage.list.addbtn.win.component";
import {CashManagelistEditbtnWinComponent} from "./cash.manage.list.editbtn.win.component";
import {CashManageSearchForm} from "../../../../common/search.form/to-pay-manage/cash.manage.search.form";
import {Router} from "@angular/router";
import {MdTableExtend} from "../../../../common/components/table/table-extend";
import {HelpersAbsService} from "../../../../common/services/helpers.abs.service";
import {HttpService} from "../../../../common/services/impl/http.service";
import {LoadBankOrgDBService} from "../../../../common/db-service/common.db.service";
import {InputSearchDatasource} from "../../../../common/services/impl/input.search.datasource";

@Component({
  selector: 'cash-manage-list',
  templateUrl: "cash.manage.list.component.html",
  providers: [CashManageListService, LoadBankOrgDBService,CashPoolOtherDBLoad]
})
export class CashManageListComponent implements OnInit {
  /**
   * 启用状态
   */
  public startStates:Array<any> = [];
  /**
   * 受理机构配置
   */
  public cashBnakFilterFields:Array<string>= ["orgNo","name"];
  public cashBankDataSource: InputSearchDatasource;//机构控件数据源
  /**
   *查询表单
   */
  public form: CashManageSearchForm = new CashManageSearchForm();
  @ViewChild('cashManageListTable') cashManageListTable: MdTableExtend;

  //表格
  public cashManageListColumns:Array<Column>=[{
    name:"poolNo",
    title:"编号"
  },{
    name:"accountName",
    title:"账户名称"
  },{
    name:"bankName",
    title:"所属机构",
    width:"80px"
  },{
    name:"useState",
    title:"启用状态",
    render:this.onUseState.bind(this),
  },{
    name:"singleProcsFee",
    title:"手续费（元）",
    // xtype:'price',
    render:(function(row:any,name:string){
      if(!this.helper.isEmpty(row[name])){
        return row[name];
      }else{
        return "0";
      }
    }).bind(this)
  },{
    name:"advanceProcsFee",
    title:"垫资手续费（%）",
    render:(function(row:any,name:string){
      let price = row[name] || 0;
      let advanceFee = price * 100;
      return advanceFee;
    }).bind(this)
  },{
    name:"currentAmount",
    title:"余额（元）",
    // xtype:'price',
    render:(function(row:any,name:string){
      let price = row[name] || 0;
      return price;
    }).bind(this)
  },{
    name:"c",
    title:"入账明细",
    render: this.onAccountDetail.bind(this)
  //  查看链接到入账明细
  }];
  public tableActionCfg: any = {
    width:"80px",
    actions:[{
      btnName:"detail",
      btnDisplay:"详情",
      hide:(()=>{
        if(this.helper.btnRole('MONEYPOOLDETAIL')){
          return false;
        }
        return true;
      }).bind(this),
      click:this.onDetailHendler.bind(this)
    },{
      btnName:"del",
      hide:true,
    },{
      btnName:"edit",
      hide:(()=>{
        if(this.helper.btnRole('MONEYPOOLEDIT')){
          return false;
        }
        return true;
      }).bind(this),
      click:this.onEditDialog.bind(this)
    }]
  };

  constructor(public cashManageListDB: CashManageListService,
              protected sidenavService: ISidenavSrvice,
              protected dialog: MdDialog,
              protected router: Router,
              public helper: HelpersAbsService,
              protected http: HttpService,
              public cashBankOrganDb: LoadBankOrgDBService,
              protected snackBar: MdSnackBar,
              protected pupop: MdPupop,
              public cashPoolOtherDBLoad:CashPoolOtherDBLoad
  ) {
    this.cashBankDataSource = new InputSearchDatasource(cashBankOrganDb);//受理机构
  }
  ngOnInit(){
    this.cashManageListDB.params = this.form;
    this.startStates = this.helper.getDictByKey('ENABLE_STATUS');
  }
  /**
   * 机构控件显示函数
   */
  public cashBankdisplayFn(value: any):string{
    if(!this.helper.isEmpty(this.form._bankName)){
      return this.form._bankName;
    }
    let name = value && value['name'];
    if(name){
      this.form._bankName = name;
    }
    return name;
  }
  public bankSelected(res){
    if(res) {
      this.form._bankName = res['value']['name'];
    }
  }
  /**
   * 机构控件选项显示函数
   */
  public cashBankOptionDisplayFn(value:any):string{
    return value && value['name'] +'('+value['orgNo']+')';
  }

  public cashBankbeforClickFunc(value:any):boolean{
    let flag:boolean = true;
    if(this.helper.isEmpty(value)){
      this.snackBar.alert('请先输入过滤值！');
      flag = false;
    }
    this.cashBankOrganDb.params = {name:value};
    return flag;
  }
  /**
   * 详情按钮点击事件
   */
  onDetailHendler(row:any,e:MouseEvent):void{
    this.sidenavService.onNavigate('/admin/cashmanagedetail','资金池管理详情', {poolNo: row['poolNo']});
  }
  /**
   * 编辑按钮点击事件
   */
  onEditDialog(row: any) {
    let editDialog = this.pupop.openWin(CashManagelistEditbtnWinComponent, {
      title:'资金池',
      width:'488px',
      height:'498px',
      data: {
        poolNo: row['poolNo'],
        accountName: row['accountName'],
      },
    });
    editDialog.afterClosed().subscribe(result => {
      this.cashManageListTable.refresh(this.form.page);
    });
  }

  /**
   * 新增按钮点击事件
   */
  onAddNewDialog() {
    let addDialog = this.pupop.openWin(CashManagelistAddbtnWinComponent, {
      title:'资金池',
      width:'488px',
      height:'498px',
    });
    addDialog.afterClosed().subscribe(result => {
      this.cashManageListTable.refresh(this.form.page);
    });
  }

  /**
   *表格中入账明细列（查看）
   * @author lyl
   * @date 2017-08-15
   */
  onGotoAccountDetails(row: any) {
    this.sidenavService.onNavigate('/admin/cashmanageaccountdetail','入账明细', {poolNo: row['poolNo']});
    return false;
  }
  onAccountDetail(row:any,name:string,cell:Column,cellEl:ElementRef){
    if(!this.helper.btnRole('MONEYPOOLDETAILLOOK')) {
      return "/";
    }
    let _cellEl = cellEl.nativeElement;
    if(_cellEl.childElementCount > 0){
      return;
    }
    let _cellHtml = row[name] = '查看';
    let _a = jQuery('<a href="#">'+_cellHtml+'</a>');
    _a.bind('click',this.onGotoAccountDetails.bind(this,row,name,cell));
    jQuery(_cellEl).html('').empty().append(_a);
  }

  /**
   *启用状态列
   * 0禁用,1启用
   * @author lyl
   * @date 2017-08-15
   */
  onChangeStatus(row:any,name:string,cell:any,span:any,i:any){
    let userStatus = row[name];
    userStatus = row[name] == 1?'0':'1';
    this.cashPoolOtherDBLoad.loadUseState({poolNo: row['poolNo'], useState: userStatus})
      .subscribe((res)=>{
        this.cashManageListTable.refresh(this.form.page);
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
    if(this.helper.btnRole('MONEYPOOLSTATE')) {
      _i.bind('click',this.onChangeStatus.bind(this,row,name,cell,_span,_i));
    }
    jQuery(_cellEl).html('').empty().append(_span ,_i);
  }

  /**
   * 查询按钮
   */
  onSearch() {
    this.form.doSearch(this.cashManageListDB);
    this.cashManageListTable.refresh();
  }
}





