import {ChangeDetectorRef, Component, OnInit, AfterContentChecked,ViewChild} from "@angular/core";
import {Column} from "../../../../common/components/table/table-extend-config";
import {LoginLogListDBService} from "./loginlog.list.db.service";
import {MdTableExtend} from "../../../../common/components/table/table-extend";
import {LoginLogForm} from "../../../../common/search.form/system-manage.form/loginlog.form";
import {HelpersAbsService} from "../../../../common/services/helpers.abs.service";
import {MdSnackBar} from "@angular/material";


@Component({
    selector:'loginlog-list',
    templateUrl:'loginlog.list.component.html',
    providers:[LoginLogListDBService]
})
export class LoginLogComponent implements OnInit,AfterContentChecked {
  public form:LoginLogForm = new LoginLogForm()
  @ViewChild('loginTable') loginTable:MdTableExtend;
  public LoginLogColumns:Array<Column>=[{
    name:"loginTime",
    title:"登陆时间",
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
    name:"descript",
    title:"备注 "
  }
  ];
  public tableActionCfg: any = {
    hide:true
  };
  public certDateOpts:any = {
    lastMinDate:this.form.loginTime
  };
  constructor(public loginDB:LoginLogListDBService, private changeDetectorRef:ChangeDetectorRef, public helper:HelpersAbsService,public snackBar: MdSnackBar){

  }
  ngAfterContentChecked(){
    if(this.form.loginTime){
      this.certDateOpts = {
        lastMinDate:this.form.loginTime
      };
    }
  }

    ngOnInit(){
      this.loginDB.params = this.form;
      this.changeDetectorRef.detectChanges();
    }
  public onSearch(){
    if(this.helper.isEmpty(this.form['_loginTimeAt'])) {
      this.snackBar.alert('请选择结束日期!') ;
    }else {
      this.form.doSearch(this.loginDB);
      this.loginTable.refresh();
    }
  }

}
