import { OnInit } from '@angular/core';
/**
 * Created by lenovo on 2017/8/1.
 */
import {Component, ViewChild} from "@angular/core";
import {Column} from "../../../../common/components/table/table-extend-config";
import {AccountDownloadDBLoad, AccountDownloadListDBService} from "./account.download.list.db.service";
import {ISidenavSrvice} from "../../../../common/services/isidenav.service";
import {MdSnackBar} from "@angular/material";
import {HttpService} from "../../../../common/services/impl/http.service";
import {AccountDownloadSearchForm} from "../../../../common/search.form/account-manage/account.download.search.form";
import {HelpersAbsService} from "../../../../common/services/helpers.abs.service";
import {MdTableExtend} from "../../../../common/components/table/table-extend";


@Component({
  selector: "account-download",
  templateUrl: "account.download.list.component.html",
  providers: [AccountDownloadListDBService,AccountDownloadDBLoad]
})
export class AccountDownloadComponent implements OnInit {

  /**
   * 查询表单
   */
  public form: AccountDownloadSearchForm = new AccountDownloadSearchForm();
  @ViewChild('accountDownloadListTable') accountDownloadListTable: MdTableExtend;

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
  public accountDownloadColumns:Array<Column>=[{
    name:"recordDate",
    title:"对账日期",
    xtype:"datetime",
    format:"YYYY-MM-DD"
    // render: this.getDate.bind(this)
  },{
    name:"companion",
    title:"第三方支付号"
  },{
    name:"savePath",
    title:"保存路径",
  },{
    name:"parsePath",
    title:"解析路径",
  },{
    name:"downState",
    title:"下载状态",
    render:this.onDownloadState.bind(this)
  },{
    name:"errMsg",
    title:"状态信息",
  },{
    name:"updatedTime",
    title:"最近下载日期",
    xtype:"datetime",
    format:"YYYY-MM-DD",
  }];

  public tableActionCfg: any = {
    hide:(()=>{
      if(this.helper.btnRole('BILLDOWNLOAD')){
        return false;
      }
      return true;
    }).bind(this),
    actions:[{
      btnName:"del",
      hide:true
    },{
      btnName:"edit",
      hide:true
    }, {
      btnName:"download",
      btnDisplay:this.onDownloadType.bind(this),
      click:this.onDownload.bind(this),
    }]
  };

  constructor(public accountDownloadListDB:AccountDownloadListDBService, public snackBar: MdSnackBar, public http: HttpService, public helper: HelpersAbsService,public accountDownloadDB:AccountDownloadDBLoad){

  }


  ngOnInit() {
    this.accountDownloadListDB.params = this.form;
  }

  /**
   * 下载状态
   * @author lyl
   */
  onDownloadState(row:any,name:string,cell:any,cellEl:any) {
    if(this.helper.isEmpty(row[name])){
      cell.color = '';
      return '/';
    }else{
      let _status = row[name];
      switch(_status){
        case 0:
          cell.bgColor = 'danger-bg';
          break;
        case 1:
          cell.bgColor = 'success-bg';
          break;
      }
      return this.helper.dictTrans('ORDER_API_STATUS',_status);
    }
  }
  /**
   * 对账日期
   * 时间格式：yyyy-MM-dd
   */
    getTheDate(date) {
      let theDate;
      let _Date = new Date(parseInt(date));
      let _Year: any = _Date.getFullYear();
      let _Month: any = _Date.getMonth() + 1;
      _Month = _Month < 10 ? `0${_Month}` : _Month;
      let _Day: any = _Date.getDate();
      _Day = _Day < 10 ? `0${_Day}` : _Day;
      theDate = _Year + "-" + _Month + "-" + _Day;
      return theDate;
    };

  /**
   * 下载或重新下载按钮
   * @author lyl
   */
  onDownloadType(row: any){
    if(row["downState"] == 0) {
      return "下载";
    }
    return "重新下载";
  }

  /**
   * 下载按钮点击事件
   * @author lyl
   */
  onDownload(row: any, e: MouseEvent){
    if(row && row["companion"] && row["recordDate"]) {
      let params = {
        date: this.getTheDate(row["recordDate"]),
        companion: row["companion"],
        force: row['downState'] == 0 ? 0 : 1
      }
      this.accountDownloadDB.loadDownload(params).subscribe(res => {
        if(res && res['status'] == 200) {
          this.snackBar.alert("操作成功");
          this.accountDownloadListTable.refresh(this.form.page);
        }else {
          this.snackBar.alert(res['message']);
        }
      });
    }
  }


  /**
   * 查询按钮
   */
  onSearch() {
    if(this.helper.isEmpty(this.form['_searchEndTime'])) {
      this.snackBar.alert('请选择结束日期!') ;
    }else {
      this.form.doSearch(this.accountDownloadListDB);
      this.accountDownloadListTable.refresh();
    }
  }

}
