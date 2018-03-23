/**
 * Created by lenovo on 2017/8/1.
 */
import {Component, OnInit, ViewChild} from '@angular/core';
import {Column} from '../../../../common/components/table/table-extend-config';
import {ISidenavSrvice} from "../../../../common/services/isidenav.service";
import {MdDialog, MdSnackBar} from '@angular/material';
import {CashManageAccountdetailSearchForm} from "../../../../common/search.form/to-pay-manage/cash.manage.accountdetail.search.form";
import {MdTableExtend} from "../../../../common/components/table/table-extend";
import {HttpService} from "../../../../common/services/impl/http.service";
import {CashManageAccountdetailService} from "app/modules/bsmodules/to-pay-manage/cash-manage-list/cash.manage.list.db.service";
import {HelpersAbsService} from "../../../../common/services/helpers.abs.service";

@Component({
  selector: 'cash-manage-accountdetail',
  templateUrl: "cash.manage.accountdetail.component.html",
  providers: [CashManageAccountdetailService]
})
export class CashManageAccountdetailComponent implements OnInit{

  public form: CashManageAccountdetailSearchForm = new CashManageAccountdetailSearchForm();
  @ViewChild('cashManageAccountdetailTable') cashManageAccountdetailTable: MdTableExtend;

  /**
   * 时间控件
   */
  public dateOpts:any = {
    format:'yyyy-MM-dd HH:mm:ss',
    // lastMinDate:this.form.startDate
  };
  public cashManageAccountdetailColumns:Array<Column>=[{
    name:"poolNo",
    title:"资金池编号"
  },{
    name:"poolBalance",
    title:"当前资金池余额（元）",
    // xtype:'price'
  },{
    name:"increase",
    title:"增加资金（元）",
    // xtype:'price'
  },{
    name:"chanBalance",
    title:"上游资金池余额（元）",
    // xtype:'price'
  },{
    name:"createdAt",
    title:"入账日期",
    xtype:"datetime"
  }];
  public cashManageAccountDetailActionCfg: any = {
    hide: true
  };

  constructor(public cashManageAccountdetailDBService: CashManageAccountdetailService,
              public sidenavService: ISidenavSrvice,
              public dialog: MdDialog,
              public http: HttpService,
              public helper: HelpersAbsService,
              public snackBar: MdSnackBar,
  ) {

  }
  ngOnInit(){
    let params = this.sidenavService.getPageParams();
    this.form.poolNo = params['poolNo'];
    //入账明细
    this.cashManageAccountdetailDBService.params = this.form;
  }

  /**
   * 查询按钮
   */
  onSearch() {
    if(this.helper.isEmpty(this.form['_endDate'])) {
      this.snackBar.alert('请选择结束日期!')
    } else {
      let params = this.sidenavService.getPageParams();//路由参数
      this.form.poolNo = params['poolNo'];
      this.form.doSearch(this.cashManageAccountdetailDBService);
      this.cashManageAccountdetailTable.refresh();
    }
  }


}





