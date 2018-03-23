/**
 * Created by lenovo on 2017/8/1.
 */
import {Component, OnInit, ViewChild} from '@angular/core';
import {Column} from '../../../../common/components/table/table-extend-config';
import {ISidenavSrvice} from "../../../../common/services/isidenav.service";
import {MdDialog, MdSnackBar} from '@angular/material';

import {CashManageAccountdetailSearchForm} from "../../../../common/search.form/to-pay-manage/cash.manage.accountdetail.search.form";
import {MdTableExtend} from "../../../../common/components/table/table-extend";
import {ElectronicAccountAccountdetailSearchForm} from "../../../../common/search.form/to-pay-manage/electronic.account.accountdetail.search.form";
import {HttpService} from "../../../../common/services/impl/http.service";
import {ElectronicAccountAccountdetailService} from "./electronic.account.list.db.service";
import {InputSearchDatasource} from "../../../../common/services/impl/input.search.datasource";
import {LoadMerchantDBService} from "../../../../common/db-service/common.db.service";
import {HelpersAbsService} from "../../../../common/services/helpers.abs.service";

@Component({
  selector: 'electronic-account-accountdetail',
  templateUrl: "electronic.account.accountdetail.component.html",
  providers: [ElectronicAccountAccountdetailService,LoadMerchantDBService]
})
export class ElectronicAccountAccountdetailComponent implements OnInit {
  /**
   * 记账类型
   */
  public accountTypes: Array<any> = [];
  /**
   * 商户信息配置
   */
  public merchantFilterFields: Array<string>= ["merchantNo","name"];
  public merchantDataSource: InputSearchDatasource;//获取商户信息数据源

  public form: ElectronicAccountAccountdetailSearchForm = new ElectronicAccountAccountdetailSearchForm();
  @ViewChild('electronicAccountAccountdetailTable') electronicAccountAccountdetailTable: MdTableExtend;

  /**
   * 时间控件
   */
  public dateOpts:any = {
    format:'yyyy-MM-dd HH:mm:ss',
    limit:14
  };


  public electronicAccountAccountdetailColumns:Array<Column>=[{
    name:"createdAt",
    title:"交易日期",
    xtype:"datetime"
  },{
    name:"mchNo",
    title:"商户号"
  },{
    name:"transNo",
    title:"代付编号"
  },{
    name:"totalFee",
    title:"代付金额（元）",
    // xtype:'price',
  },{
    name:"procsFee",
    title:"手续费（元）",
    // xtype:'price',
  },{
    name:"totalAmount",
    title:"总金额（元）",
    // xtype:'price',
  },{
    name:"incash",
    title:"记账类型",
    render:(function(row:any,name:string){
      if(this.helper.isEmpty(row[name])){
        return '/';
      }else{
        return this.helper.dictTrans('RECORD_IN_CASH',row[name]);
      }
    }).bind(this)
  }];
  public electronicAccountAccountdetailActionCfg: any = {
    hide: true
  };

  constructor(public electronicAccountAccountdetailDB: ElectronicAccountAccountdetailService,
              public sidenavService:ISidenavSrvice,
              public dialog: MdDialog,
              public http: HttpService,
              public merchantOrganDb: LoadMerchantDBService,
              public helper: HelpersAbsService,
              public snackBar: MdSnackBar,
  ) {
    this.merchantDataSource = new InputSearchDatasource(merchantOrganDb);//商户
  }
  ngOnInit(){
    let params = this.sidenavService.getPageParams();
    this.form.accountNo = params['accountNo'];
    //进入页面
    this.electronicAccountAccountdetailDB.params = this.form;
    this.accountTypes = this.helper.getDictByKey('RECORD_IN_CASH');
  }
  /**
   * 商户名称控件显示函数
   */
  public merchantDisplayFn(value: any):string{
    if(!this.helper.isEmpty(this.form._mchName)){
      return this.form._mchName;
    }
    let name = value && value['name'];
    if(name){
      this.form._mchName = name;
    }
    return name;
  }

  public merchantSelected(res){
    if(res) {
      this.form._mchName = res['value']['name'];
    }
  }
  /**
   * 商户名称控件选项显示函数
   */
  public merchantOptionDisplayFn(value:any):string{
    return value && value['name'] +'('+value['merchantNo']+')';
  }

  public merchantBeforClickFunc(value:any):boolean{
    if(this.helper.isEmpty(value)){
      this.snackBar.alert('请先输入过滤值！');
      return false;
    }

    this.merchantOrganDb.params = {name:value};
  }

  /**
   * 查询按钮
   */
  onSearch() {
    if(this.helper.isEmpty(this.form['_endDate'])) {
      this.snackBar.alert('请选择结束日期!')
    } else {
      let params = this.sidenavService.getPageParams();//路由参数
      this.form.accountNo = params['accountNo'];
      this.form.doSearch(this.electronicAccountAccountdetailDB);
      this.electronicAccountAccountdetailTable.refresh();
    }
  }

}





