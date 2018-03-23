import {Component, OnInit, Inject, ViewChild} from "@angular/core";

import {ResourcePoolOtherDBService} from "./resource.pool.list.db.service";
import {CommonDBService} from "../../../../common/db-service/common.db.service";
import {DetailField, ULODetail} from "../../../../common/components/detail/detail";
import {ISidenavSrvice} from "../../../../common/services/isidenav.service";
import {HelpersAbsService} from "../../../../common/services/helpers.abs.service";

@Component({
  selector: 'resource-pool-add',
  templateUrl: 'resource.pool.detail.component.html',
  providers: [ResourcePoolOtherDBService,CommonDBService]
})
export class ResourcePoolDetailComponent implements OnInit {

  @ViewChild('resourceDetail') resourceDetail: ULODetail;
  public useStates:Array<any> = [];//用户状态
  public payTypes:Array<string>= []; //支付类型
  public payStates:Array<string>= []; // 支付权限

  public uloCode:any;
  public resourceDetailReqParam: any;

  // 络络应用详情页
  public resourceDetailFields: Array<DetailField> = [
    {
      title: '商户编号：',
      field: 'mchNo'
    },{
      title: '服务商编号：',
      field: 'chanNo'
    },{
      title: '银行商户号：',
      field: 'bankMchno'
    },{
      title: '微信受理机构号：',
      field: 'partner'
    },{
      title: '微信交易识别码：',
      field: 'subPartner'
    },{
      title: '微信渠道编号：',
      field: 'chanPartner'
    },{
      field:"tradeType",
      title:"支付类型：",
      render:(function(data:any,field:DetailField){
        if(this.helper.isEmpty(data[field.field])){
          return '/';
        }else{
          let tradetype = this.payTypes && this.payTypes.find((item) =>{
            return item['transId'] == data[field.field];
          });
          return tradetype ? tradetype['transType'] : '/';
        }
      }).bind(this)
    },{
      title: '支付权限：',
      field: 'payState',
      render:(function(data:any,field:DetailField){
        if(this.helper.isEmpty(data[field.field])){
          return '/';
        }else{
          return this.helper.dictTrans('RES_POOL_STATUS',data[field.field]);
        }
      }).bind(this)

    },{
      title: '启用状态：',
      field: 'useState',
      render:(function(data:any,field:DetailField){
        if(this.helper.isEmpty(data[field.field])){
          return '/';
        }else{
          return this.helper.dictTrans('RES_POOL_STATUS',data[field.field]);
        }
      }).bind(this)
    },{
      title: '成功笔数（笔）：',
      field: 'success'
    },{
      title: '总提交笔数（笔)：',
      field: 'totalcount'
    },{
      title: '成功率（%）：',
      field: 'suRate'
    },{
      title: '交易金额（元）：',
      field: 'amount',
      render:(function(data:any,field:DetailField){
        if(this.helper.isEmpty(data[field.field])){
          return '/';
        }else{
          return this.helper.shuntElement(data[field.field]);
        }
      }).bind(this)
    },{
      title: '门店数量：',
      field: 'storeCount'
    },{
      title: '同步门店信息：',
      field: 'storeMsg'
    },{
      title: '创建日期：',
      field: 'createAt',
      type: 'datetime'
    },{
      title: '更新日期：',
      field: 'updateAt',
      type: 'datetime'
    }
  ]

  constructor(public sidenavService: ISidenavSrvice,
              public helper:HelpersAbsService,
              protected CommonDB: CommonDBService,
  ) {
    this.uloCode = this.helper.getDictByKey('CLOUD_ULO_BANK_NO');
    this.CommonDB.loadTransApi({bankNo:this.uloCode}).subscribe(res =>{
      this.payTypes = res;
    });//支付类型
    this.useStates = this.helper.getDictByKey('RES_POOL_STATUS');//启用状态
    this.payStates = this.helper.getDictByKey('RES_POOL_STATUS'); // 支付权限
  }

  ngOnInit() {
    let params = this.sidenavService.getPageParams();
    this.resourceDetailReqParam = {
      url: '/cloud/dealersubmchpool/detail',
      params: params
    };
  }

  public onBack(row: any) {
    this.sidenavService.onNavigate('/admin/resourcepoollist', '识别码管理', {resPoolAdd:'resPoolAdd'}, true);
  }
}

