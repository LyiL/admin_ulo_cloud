import {Component, OnInit} from "@angular/core";
import {DetailField} from "../../../../common/components/detail/detail";
import {Column} from "../../../../common/components/table/table-extend-config";
import {Router} from "@angular/router";
import {ISidenavSrvice} from "../../../../common/services/isidenav.service";
import {HelpersAbsService} from "../../../../common/services/helpers.abs.service";


@Component({
  selector:"cash-manage-detail",
  templateUrl:"cash.manage.detail.component.html",
  providers: []
})

export class CashManageDetailComponent implements OnInit{
  /**
   * 账户状态
   */
  public startStates:Array<any> = [];
  public cashManageDetailReqParam: any;
  public cashManageDetailFields:Array<DetailField> = [{
      title:'编号：',
      field:'poolNo'
    },{
      title:'名称：',
      field:'accountName'
    },{
      title:'所属机构：',
      field:'bankName'
    },{
      title:'账户状态：',
      field:'useState',
      render:(function(row:any,field:DetailField){
        let _state = row[field.field];
        if(!this.helper.isEmpty(_state)){
          return this.helper.dictTrans('ACTV_STATUS',_state);
        }
      }).bind(this),
    },{
      title:'接口编号：',
      field:'apiCode'
    },{
      title:'资金池类型：',
      field:'poolType',
      render:(function(row:any,field:DetailField){
        let _type = row[field.field];
        if(!this.helper.isEmpty(_type)){
          return this.helper.dictTrans('CASH_POOL_TYPE',_type);
        }
      }).bind(this),
    },{
      title:'手续费（元）：',
      field:'singleProcsFee',
      // type: "price"
    },{
      title:'垫资手续费（%）：',
      field:'advanceProcsFee',
      render:(function(row:any,field:DetailField){
        let advanceFee = row[field.field];
        if(!this.helper.isEmpty(advanceFee)){
          advanceFee *= 100;
          return advanceFee;
        }
      }).bind(this),
    },{
      title:'当前余额（元）：',
      field:'currentAmount',
      // type: "price"
    },{
      title:'冻结余额（元）：',
      field:'frozenAmount',
      // type: "price"
    },{
      title:'总入款金额（元）：',
      field:'totalAmount',
      // type: "price"
    },{
      title:'总出款金额（元）：',
      field:'transAmount',
      // type: "price"
    },{
      title:'上游账户余额（元）：',
      field:'balance',
      // type: "price"
    },{
      title:'更新时间：',
      field:'updatedAt',
      type:"datetime"
    },{
      title:'创建时间：',
      field:'createdAt',
      type:"datetime"
    }];
  constructor(public sidenavService: ISidenavSrvice, public helper: HelpersAbsService){
    let params = this.sidenavService.getPageParams();
    //资金池管理详情信息
    this.cashManageDetailReqParam = {
      url: '/cashPool/detail',
      params: params
    };
  }
  ngOnInit(){
    this.startStates = this.helper.getDictByKey('ACTV_STATUS');
  }
  backToList() {
    this.sidenavService.onNavigate('/admin/cashmanagelist', '资金池管理', [], true);
  }
}





