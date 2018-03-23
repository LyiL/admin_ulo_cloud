import {Component} from "@angular/core";
import {DetailField} from "../../../../common/components/detail/detail";
import {Column} from "../../../../common/components/table/table-extend-config";
import {Router} from "@angular/router";
import {ISidenavSrvice} from "../../../../common/services/isidenav.service";
import {HelpersAbsService} from "../../../../common/services/helpers.abs.service";


@Component({
  selector:"account-task-detail",
  templateUrl:"account.task.detail.component.html",
  providers: []
})

export class AccountTaskDetailComponent{
  public accountTaskDetailReqParam: any;
  public accountDetailFields:Array<DetailField> = [{
      title:'任务编号：',
      field:'scheNo'
    },{
      title:'对账日期：',
      field:'reconDay',
      type:"datetime",
      format: 'yyyy-MM-dd'
    },{
      title:'对账账户：',
      field:'ally'
    },{
      title:'处理总数：',
      field:'treatQua'
    },{
      title:'差错总数：',
      field:'errQua'
    },{
      title:'处理速度：',
      field:'treatSpeed'
    },{
      title:'对账状态：',
      field:'treatState',
      render:(function(row:any,field:DetailField){
        let _state = row[field.field];
        if(!this.helper.isEmpty(_state)){
          return this.helper.dictTrans('PROCS_STATUS',_state);
        }
      }).bind(this),
    },{
      title:'处理编号：',
      field:'treatId'
    },{
      title:'对账类型：',
      field:'reconType',
      render:(function(row:any,field:DetailField){
        if(this.helper.isEmpty(row[field.field])){
          return '/';
        }else{
          return this.helper.dictTrans('SHOW_CHECK_TYPE',row[field.field]);
        }
      }).bind(this)
    },{
      title:'退款依据：',
      field:'refundType',
      render:(function(row:any,field:DetailField){
        if(this.helper.isEmpty(row[field.field])){
          return '/';
        }else{
          return this.helper.dictTrans('REFUND_BASE',row[field.field]);
        }
      }).bind(this)
    },{
      title:'执行时间：',
      field:'beginTime',
      type:"datetime"
    },{
      title:'结束时间：',
      field:'endTime',
      type:"datetime"
    },{
      title:'成本费率：',
      field:'basicRate'
    },{
      title: '手续费计算规则：',
      field: 'feeRuleType'
  }];
  constructor(public sidenavService: ISidenavSrvice,public helper: HelpersAbsService,) {
    let params = this.sidenavService.getPageParams();
    //对账任务详情信息
    this.accountTaskDetailReqParam = {
      url: '/paymentCheckTradeTask/searchDetail',
      params: params
    };
  }
  backToList(){
    this.sidenavService.onNavigate('/admin/accounttask', '对账任务', [], true);
  }
}





