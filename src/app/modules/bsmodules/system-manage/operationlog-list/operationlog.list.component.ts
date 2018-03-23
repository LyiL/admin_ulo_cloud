import {ChangeDetectorRef, Component, OnInit,AfterContentChecked, ViewChild} from "@angular/core";
import {OperationLogListDBService} from "./operationlog.list.db.service";
import {Column} from "../../../../common/components/table/table-extend-config";
import {OperationLogForm} from "../../../../common/search.form/system-manage.form/operationlog.form";
import {MdTableExtend} from "../../../../common/components/table/table-extend";
import {HelpersAbsService} from "../../../../common/services/helpers.abs.service";
import {MdSnackBar} from "@angular/material";


@Component({
    selector:'operationlog-list',
    templateUrl:'operationlog.list.component.html',
    providers:[OperationLogListDBService]
})
export class OperationLogComponent implements OnInit,AfterContentChecked{
  public form:OperationLogForm = new OperationLogForm();
  @ViewChild('operationLogTable')operationLogTable:MdTableExtend;

  public operationLogColumns:Array<Column>=[
    {
    name:"createdTime",
    title:"操作时间",
      xtype:"datetime"
  },{
    name:"userName",
    title:"用户名"
  },{
    name:"realName",
    title:"真实姓名"
  },{
    name:"ipaddress",
    title:"IP"
  },{
    name:"targetName",
    title:"目标名称 "
  },{
    name:"actionName",
    title:"请求名称 "
  },{
    name:"reqUrl",
    title:"请求地址 "
  }, {
    name:"descript",
    title:"备注 "
  }
  ];
  public tableActionCfg: any = {
    hide:true
  };
  public certDateOpts:any = {
    lastMinDate:this.form.createdTime
  };
  constructor(public operationLogDB:OperationLogListDBService,private changeDetectorRef:ChangeDetectorRef, public helper:HelpersAbsService,public snackBar: MdSnackBar){


  }
  ngAfterContentChecked(){
    if(this.form.createdTime){
      this.certDateOpts = {
        lastMinDate:this.form.createdTime
      };
    }
  }
    ngOnInit(){
      this.operationLogDB.params = this.form;
      this.changeDetectorRef.detectChanges();
    }
  public onSearch(){
    if(this.helper.isEmpty(this.form['_lastCreated'])) {
      this.snackBar.alert('请选择结束日期!') ;
    }else {
      this.form.doSearch(this.operationLogDB);
      this.operationLogTable.refresh();
    }

  }
}
