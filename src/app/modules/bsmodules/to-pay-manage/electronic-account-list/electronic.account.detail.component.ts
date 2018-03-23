import {Component, OnInit} from "@angular/core";
import {DetailField} from "../../../../common/components/detail/detail";
import {Column} from "../../../../common/components/table/table-extend-config";
import {Router} from "@angular/router";
import {ISidenavSrvice} from "../../../../common/services/isidenav.service";
import {HelpersAbsService} from "../../../../common/services/helpers.abs.service";


@Component({
  selector:"electronic-account-detail",
  templateUrl:"electronic.account.detail.component.html",
  providers: []
})

export class ElectronicAccountDetailComponent implements OnInit{
  /**
   * 账户状态
   */
  public startStates:Array<any> = [];
  public electronicAccountDetailReqParam:any = {
    url:'webassets/test-data/account-task-list/detail.data.json'
  };
  public electronicAccountDetailFields:Array<DetailField> = [{
      title:'账户编号：',
      field:'accountNo'
    },{
      title:'账户名称：',
      field:'accountName'
    },{
      title:'所属商户：',
      field:'organName'
    },{
      title:'外部商户号：',
      field:'outMchno'
    },{
      title:'签名密钥：',
      field:'signkey'
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
      title:'归属资金池：',
      field:'cashpoolName'
    },{
      title:'对公手续费（元）：',
      field:'singleProcsFee',
      // type: "price"
    },{
      title:'对私手续费（元）：',
      field:'privProcsFee',
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
      title:'可用余额（元）：',
      field:'currentAmount',
      // type: "price"
    },{
      title:'可结算余额（元）：',
      field:'canSettleBalance',
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
      title:'更新时间：',
      field:'updatedAt',
      type:"datetime"
    },{
      title:'创建时间：',
      field:'createdAt',
      type:"datetime"
    }];
  constructor(public router: Router, public sidenavService: ISidenavSrvice, public helper: HelpersAbsService,){
    let params = this.sidenavService.getPageParams();
    //电子账户详情信息
    this.electronicAccountDetailReqParam = {
      url: '/cashAccount/detail',
      params: params
    };
  }
  ngOnInit(){
    this.startStates = this.helper.getDictByKey('ACTV_STATUS');
  }
  backToList(){
    this.sidenavService.onNavigate('/admin/electronicaccountlist', '电子账户', [], true);
  }
}





