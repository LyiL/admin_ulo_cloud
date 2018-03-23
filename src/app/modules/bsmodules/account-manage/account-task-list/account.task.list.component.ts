/**
 * Created by lenovo on 2017/8/1.
 */
import {Component, OnInit, ViewChild} from '@angular/core';
import {Column} from '../../../../common/components/table/table-extend-config';
import {AccountTaskDBLoad, AccountTaskService} from './account.task.list.db.service';
import {ISidenavSrvice} from "../../../../common/services/isidenav.service";
import {Confirm, MdDialog, MdPupop, MdSnackBar} from '@angular/material';
import {AccountTaskListEditbtnWinComponent} from "./account.task.list.editbtn.win.component";
import {AccountTaskSearchForm} from "../../../../common/search.form/account-manage/account.task.search.form";
import {MdTableExtend} from "../../../../common/components/table/table-extend";
import {HelpersAbsService} from "../../../../common/services/helpers.abs.service";
import {InputSearchDatasource} from "../../../../common/services/impl/input.search.datasource";
import {LoadCompanionForBank} from "../../../../common/db-service/common.db.service";
import {HttpService} from "../../../../common/services/impl/http.service";

@Component({
  selector: 'account-task',
  templateUrl: "account.task.list.component.html",
  providers: [AccountTaskService, LoadCompanionForBank,AccountTaskDBLoad]
})
export class AccountTaskComponent implements OnInit{
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
  public form: AccountTaskSearchForm = new AccountTaskSearchForm();
  @ViewChild('accountTaskListTable') accountTaskListTable: MdTableExtend;

  /**
   *时间配置
   */
  public dateOpts:any = {
    format:'yyyy-MM-dd',
    limit:30
  };

  /**
   * 表格列
   */
  public accountTaskColumns:Array<Column>=[{
    name:"scheNo",
    title:"任务编码"
  },{
    name:"reconDay",
    title:"对账日期",
    xtype:"datetime",
    format:"YYYY-MM-DD"
  },{
    name:"ally",
    title:"结算账户"
  },{
    name:"treatQua",
    title:"处理总数",
    render:(function(row:any,name:string){
      let count = row[name] || 0;
      return count;
    }).bind(this)
  },{
    name:"errQua",
    title:"差错总数",
    render:(function(row:any,name:string){
      let count = row[name] || 0;
      return count;
    }).bind(this)
  },{
    name:"reconType",
    title:"对账类型",
    render:(function(row:any,name:string){
      if(this.helper.isEmpty(row[name])){
        return '/';
      }else {
        return this.helper.dictTrans('SHOW_CHECK_TYPE',row[name]);
      }
    }).bind(this)
  },{
    name:"refundType",
    title:"退款依据",
    render:(function(row:any,name:string){
      if(this.helper.isEmpty(row[name])){
        return '/';
      }else{
        return this.helper.dictTrans('REFUND_BASE',row[name]);
      }
    }).bind(this)
  },{
    name:"treatState",
    title:"对账状态",
    render:(function(row:any,name:string,cell:any){
        if(this.helper.isEmpty(row[name])){
          cell.color = '';
          return '/';
        }else{
          let _status = row[name];
          switch(_status){
            case 0:
            case 1:
              cell.bgColor = 'warning-bg';
              break;
            case 3:
              cell.bgColor = 'danger-bg';
              break;
            case 4:
              cell.bgColor = 'success-bg';
              break;
          }
          return this.helper.dictTrans('PROCS_STATUS',_status);
        }
    }).bind(this)
  },{
    name:"beginTime",
    title:"执行时间/结算时间",
    render:((row:any,fieldName:string,cell?:any) => {
      return this.helper.format(row[fieldName]) + '<br/>'+ this.helper.format(row['endTime']);
    })
  }];
  public tableActionCfg: any = {
    actions:[{
      btnName:"reset",
      btnDisplay:"重置任务",
      hide:((row: any)=>{
        if(!this.helper.btnRole('TASKRESET')){
          return true;
        }
        if (row['treatState'] == 3) {
          return false;
        }
        return true;
      }).bind(this),
      click:this.onReset.bind(this)
    }, {
      btnDisplay: "执行任务",
      hide: ((row: any) => {
        if(!this.helper.btnRole('TASKRESET')){
          return true;
        }
        if (row['treatState'] == 0) {
          return false;
        }
        return true;
      }),
      click: this.onGoForTask.bind(this)
    },{
      btnName:"detail",
      btnDisplay:"详情",
      hide:(()=>{
        if(this.helper.btnRole('TASKINFO')){
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
        if(this.helper.btnRole('TASKEDIT')){
          return false;
        }
        return true;
      }).bind(this),
      click:this.openEditDialog.bind(this)
    }]
  };

  constructor(
    public accountTaskDB: AccountTaskService,
    public sidenavService: ISidenavSrvice,
    protected dialog: MdDialog,
    public helper: HelpersAbsService,
    public pupop: MdPupop,
    protected cashCompanionOrganDb: LoadCompanionForBank,
    protected snackBar: MdSnackBar,
    public http: HttpService,
    public accountDB:AccountTaskDBLoad
  ) {
    this.cashCompanionDataSource = new InputSearchDatasource(cashCompanionOrganDb);//结算账户
  }

  ngOnInit() {
    this.checkStates = this.helper.getDictByKey('PROCS_STATUS');
    this.accountTaskDB.params = this.form;
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
   * 详情按钮点击事件
   */
  onDetailHendler(row:any,e:MouseEvent):void{
    this.sidenavService.onNavigate('/admin/accounttaskdetail', '任务详情', {id: row['id']});
  }
  /**
   * 编辑按钮点击事件
   */
  openEditDialog(row: any) {
    let editDialog = this.pupop.openWin(AccountTaskListEditbtnWinComponent, {
      title:'对账任务',
      width:'390px',
      height:'300px',
      data: {
        id: row['id'],
        reconPath: row['reconPath'],
        reconType: row['reconType'],
        refundType: row['refundType']
      },
    });
    editDialog.afterClosed().subscribe(result => {
      this.accountTaskListTable.refresh(this.form.page);
    });
  }

  /**
   * 重置任务按钮点击事件
   */
  onReset(row: any, e: MouseEvent): void {
    let _confirm = this.pupop.confirm({
      message: "您确认要重置任务吗？",
      confirmBtn: "确认",
      cancelBtn: "取消"
    })
    _confirm.afterClosed().subscribe(res => {
      if (res == Confirm.YES) {
        this.accountDB.loadReset({ id: row['id'] }).subscribe((_res) => {
          if (_res && _res['status'] == 200) {
            this.snackBar.alert('操作成功!');
            this.accountTaskListTable.refresh(this.form.page);
          } else {
            this.snackBar.alert(_res['message']);
          }
        });
      }
    });
  }
  /**
   * 执行任务按钮点击事件
   */
  onGoForTask(row: any, e: MouseEvent){
    let _confirm = this.pupop.confirm({
      message: "您确认要执行任务吗？",
      confirmBtn: "确认",
      cancelBtn: "取消"
    })
    _confirm.afterClosed().subscribe(res => {
      if (res == Confirm.YES) {
        this.accountDB.loadProcess({ id: row['id'] }).subscribe((_res) => {
          if (_res && _res['status'] == 200) {
            this.snackBar.alert('操作成功!');
            this.accountTaskListTable.refresh(this.form.page);
          } else {
            this.snackBar.alert(_res['message']);
          }
        });
      }
    });
  }

  /**
   * 查询按钮
   * @param value
   */
  onSearch() {
    if(this.helper.isEmpty(this.form['_searchEndTime'])) {
      this.snackBar.alert('请选择结束日期!') ;
    }else {
      this.form.doSearch(this.accountTaskDB);
      this.accountTaskListTable.refresh();
    }
  }
}





