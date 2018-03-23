import {Column} from "../../../../common/components/table/table-extend-config";
import {Component} from "@angular/core";
import {StoreManageListDBService} from "./storemanage.db.service";
import {DetailField} from "../../../../common/components/detail/detail";
import {Router} from "@angular/router";

@Component({
  selector:'mchstore-detail-list',
  templateUrl:'mchstore.detail.list.component.html',
  providers:[StoreManageListDBService]
})
export class MchStoreDetailListComponent {
  public MchStoreDetailReqParam:any = {
    url:'webassets/test-data/service-provider-list/detail.data.json'
  };

  public MchStoreDetailFields:Array<DetailField> =
    [
          {
            title:'门店名称：',
            field:'store_name'
          },{
            title:'门店商户号：',
            field:'a'
          },
          {
            title:'所属商户：',
            field:'b'
          },{
            title:'激活状态：',
            field:'active_state'
          },{
            title:'省市：',
            field:'c '
          },{
            title:'详细地址：',
            field:'address'
          }]


  /**
   * 门店支付配置信息表格列
   * @type {Array}
   */
  public MchStoreDetailColumns:Array<Column> =
    [
      {
        name:'trans_id',
        title:'支付类型'
      },{
      name:'center_name',
      title:'支付中心名称'
    },{
      name:'limit_day',
      title:'单日限额'
    },{
      name:'limit_single',
      title:'单笔限额'
    },{
      name:'settle_rate',
      title:'结算费率(‰)'
    },{
      name:'settle_cycle',
      title:'结算周期'
    },{
      name:'active_state',
      title:'激活状态'
    }];

  /**
   * 门店支付配置信息按钮配置
   * @type {{actions: [{btnName: string; hide: boolean}]}}
   */
  public MchStoreDetailActionCfg:any = {
    actions:[{
      btnName:'del',
      hide:true
    }]
  };
  constructor(public dbService:StoreManageListDBService,public router:Router
  ){}
  back():void{
    this.router.navigate(['/admin/storemanage']);
  }
  onNewAccount(){
    this.router.navigate(['/admin/mchstorepaytypeform']);
  }
}
