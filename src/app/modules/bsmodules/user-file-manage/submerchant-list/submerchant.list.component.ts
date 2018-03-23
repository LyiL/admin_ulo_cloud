import {Component, ViewChild, OnInit} from "@angular/core";
import {ISidenavSrvice} from "../../../../common/services/isidenav.service";
import {Column} from "../../../../common/components/table/table-extend-config";
import {Confirm, MdDialog, MdPupop, MdSelectChange, MdSnackBar} from "@angular/material";
import {MdTableExtend} from "../../../../common/components/table/table-extend";
import {HelpersAbsService} from "../../../../common/services/helpers.abs.service";
import {
  CommonDBService, LoadAgentAndSPDBService, LoadBankOrgDBService
} from "../../../../common/db-service/common.db.service";
import {InputSearchDatasource} from "../../../../common/services/impl/input.search.datasource";
import {Observable} from "rxjs/Observable";
import {SubmerchantDetailDBService, SubmerchantListDBService} from "./submerchant.list.db.service";
import {SubmerchantListForm} from "app/common/search.form/user-file-manage/submerchant.list.form";


@Component({
  selector:'submerchant-list-component',
  templateUrl:'./submerchant.list.component.html',
  providers:[SubmerchantListDBService,LoadBankOrgDBService,LoadAgentAndSPDBService,SubmerchantDetailDBService]
})
export class SubmerchantListComponent implements  OnInit{
  public form:SubmerchantListForm =new SubmerchantListForm();
  @ViewChild('submerchantListTable') submerchantListTable:MdTableExtend;
  /**
   * 所属机构配置
   */
  public mchBnakFilterFields:Array<string>= ["orgNo","name"];
  public mchBankDataSource:InputSearchDatasource;//机构控件数据源
  /**
   * 所属上级配置
   */
  public mchAgentFilterFields:Array<string>= ["chanCode","name"];
  public mchAgentDataSource:InputSearchDatasource;//所属上级数据源
  /**
   * 用户状态
   */
  public examState:Array<any> = [];
  public uloCode:any;
  public submerchantListColumns:Array<Column>=
    [{
      name:"name",
      title:"商户名称",
      },{
      name:"merchantNo",
      title:"商户编号",
    },{
      name:"outerBatchId",
      title:"进件批次号",
    },{
      name:"shortName",
      title:"商户简称",
    },{
      name:"chanName",
      title:"所属上级"
    },{
      name:"bankName",
      title:"所属机构",
    },{
      name:"examState",
      title:"用户状态",
      render:(function(row:any,name:string,cell:any){
        let _examState = row[name];
        switch(_examState){
          case 0:
            cell.bgColor = 'warning-bg';
            break;
          case 1:
            cell.bgColor = 'success-bg';
            break;
          case 2:
            cell.bgColor = 'danger-bg';
            break;
          case 3:
          case 4:
            cell.bgColor = 'disables-bg';
            break;
        }
        return this.helper.dictTrans('EXAMINE_STATUS',_examState);
      }).bind(this)
    }];
  /**
   * 表格按钮配置
   */

  public tableActionCfg: any = {
    width:'100px',
    actions:[{
        btnName:"del",
        hide:true
      },{
        btnName:"edit",
        hide:true
      },{
        btnDisplay:"详情",
        click:this.onDetailHendler.bind(this),
        hide:(()=>{
          if(this.helper.btnRole('SUBMCHDETAIL')){
            return false;
          }
          return true;
        }).bind(this),
      }]
  };
  constructor(public subMchListDB:SubmerchantListDBService ,
              public sidenavService:ISidenavSrvice,
              public dialog: MdDialog,
              public helper:HelpersAbsService,
              public snackBar:MdSnackBar,
              public pupop:MdPupop,
              public mckBankOrganDb:LoadBankOrgDBService,
              public mckAgentOrganDb:LoadAgentAndSPDBService,
              public subMchOtherDB: SubmerchantDetailDBService
  ){
    this.mchBankDataSource = new InputSearchDatasource(mckBankOrganDb);
    this.mchAgentDataSource = new InputSearchDatasource(mckAgentOrganDb);
    this.examState = this.helper.getDictByKey('EXAMINE_STATUS');
    this.uloCode = this.helper.getDictByKey('CLOUD_ULO_BANK_NO');
  }

  ngOnInit(){
    this.subMchListDB.params = this.form;
  }

  /**
   * 批量认证
   */
  public onBatchTest(){
    let condition1 = !this.form.chanNo;
    let condition2 = (this.form.examState !== 0) && (this.form.examState !== 2);
    if(condition1 || condition2){
      this.snackBar.alert("必须选择待审核或者未通过状态且所属上级不能为空！");
      return false;
    }
    let _confirm = this.pupop.confirm({
      message: "您确定对"+"【"+this.form._chanName+"】"+"下的商户进行批量认证操作？",
      confirmBtn: "是",
      cancelBtn: "否",
      width:"560px"
    });
    _confirm.afterClosed().subscribe(res => {
      if (res == Confirm.YES) {
        this.subMchOtherDB.batchIdentification(this.form).subscribe(_res => {
          if (_res && _res['status'] == 200) {
            this.snackBar.alert("批量认证中，稍后请自行查询认证结果！");
            // this.submerchantListTable.refresh();后端处理数据时是异步操作 ，前端不做刷新
          } else {
            this.snackBar.alert(_res['message']);
          }
        })
      }
    })
  }

  /**
   * 批量退回
   */
  public onBatchSendBack(){
    if((!this.form.chanNo) || (this.form.examState !== 1)){
      this.snackBar.alert("必须选择通过状态且所属上级不能为空！");
      return false;
    }
    let _confirm = this.pupop.confirm({
      message: "您确定对"+"【"+this.form._chanName+"】"+"下的商户进行批量退回操作？",
      confirmBtn: "是",
      cancelBtn: "否",
      width:"560px"
    });
    _confirm.afterClosed().subscribe(res => {
      if (res == Confirm.YES) {
        this.subMchOtherDB.batchSendBack(this.form).subscribe(_res => {
          if (_res && _res['status'] == 200) {
            this.snackBar.alert("批量退回中，稍后请自行查询结果！");
            // this.submerchantListTable.refresh();后端处理数据时是异步操作 ，前端不做刷新
          } else {
            this.snackBar.alert(_res['message']);
          }
        })
      }
    })
  }
  /**
   *详情
   */
  onDetailHendler(row:any,e:MouseEvent):void{
    this.sidenavService.onNavigate('/admin/submerchantdetail','子商户详情',{id:row['id']});
  }
  public onSearch(){
    this.form.doSearch(this.subMchListDB);
    this.submerchantListTable.refresh();
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
  public bankSelected(res){
    if(res){
      this.form["_bankName"] = res["value"]["name"];
    }
    this.mckAgentOrganDb.params = {};
    this.mckAgentOrganDb.refreshChange.next(true);
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
   * 所属上级控件显示函数
   */
  public mchAgentDisplayFn(value: any):string{
    if(!this.helper.isEmpty(this.form._chanName)){
      return this.form._chanName
    }
    let name = value && value['name'];
    if(name){
      this.form._chanName = name;
    }
    return name;
  }
  public chanSelected(res){
    if(res){
      this.form["_chanName"] = res["value"]["name"];
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
    // this.mckAgentOrganDb.params = {name:value};
    if(this.form.bankNo){
      this.mckAgentOrganDb.params = {name:value,bankCode:this.form.bankNo};
    }else {
      this.mckAgentOrganDb.params = {name:value,bankCode:this.uloCode};
    }
    return flag;
  }

}


