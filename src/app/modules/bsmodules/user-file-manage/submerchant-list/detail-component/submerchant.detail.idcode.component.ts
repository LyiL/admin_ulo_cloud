import {Component, Inject, LOCALE_ID, OnInit, ViewChild} from "@angular/core";
import {DetailField, ULODetail} from "../../../../../common/components/detail/detail";
import {Column, MdTableExtendConfig} from "../../../../../common/components/table/table-extend-config";
import {MdTableExtend} from "../../../../../common/components/table/table-extend";
import {Confirm, MdPupop, MdSelectChange, MdSnackBar} from "@angular/material";
import {Observable} from "rxjs";
import {HelpersAbsService} from "../../../../../common/services/helpers.abs.service";
import {ISidenavSrvice} from "../../../../../common/services/isidenav.service";
import {InputSearchDatasource} from "../../../../../common/services/impl/input.search.datasource";
import {
  CommonDBService, LoadBankLinkNo,
  LoadBankOrgDBService, LoadTableDbService
} from "../../../../../common/db-service/common.db.service";
import {isBoolean} from "util";
import {rendererTypeName} from "@angular/compiler";
import {ULODetailContainer} from "app/common/components/detail";
import {SubmerchantDetailDBService} from "../submerchant.list.db.service";

@Component({
  selector:'submerchant-detail-idcode',
  templateUrl:'submerchant.detail.idcode.component.html',
  providers:[CommonDBService,LoadTableDbService,SubmerchantDetailDBService]
})
export class SubmerchantDetailIdcodeComponent implements OnInit{
  public ctr:ULODetailContainer;
  @ViewChild('subMchIdcodeTable') subMchIdcodeTable:MdTableExtend;

  /**
   * 商户识别码信息列表
   */
  /**
   * 商户识别码信息列表
   */
  public subMchIdcodeColumns:Array<Column> = [
    {
      name:'transType',
      title:'支付类型',
    },{
      name:'merchantNo',
      title:'子商户编号'
    },{
      name:'chanNo',
      title:'所属服务商编号'
    },{
      name:'bankMerchantNo',
      title:'银行子商户编号'
    },{
      name:'bankNo',
      title:'受理机构编号'
    },{
      name:'payState',
      title:'支付权限',
      type:'select',
      otherOpts:{
        valueField:'id',
        displayField:'name',
        data:Observable.of(this.helper.getDictByKey('MCH_WECHAT_TRADE_AUTH')),
      },
      render:(function(row:any,name:string,cell:any){
        if(this.helper.isEmpty(row[name])){
          return '/';
        }
        let _status = row[name];
        switch(_status){
          case 0:
            cell.bgColor = 'danger-bg';
            break;
          case 1:
            cell.bgColor = 'success-bg';
            break;
        }
        return this.helper.dictTrans('MCH_WECHAT_TRADE_AUTH',_status);
      }).bind(this)
    },{
      name:'chanNoPartner',
      title:'上游渠道商编号'
    },{
      name:'applyCount',
      title:'上报次数'
    },{
      name:'applyState',
      title:'上报状态',
      render:(function(row:any,name:string,cell:any){
        let _examState = row[name];
        switch(_examState){
          case 0:
            cell.bgColor = 'warning-bg';
            break;
          case 1:
            cell.bgColor = 'success-bg';
            break;
          case 2:
            cell.bgColor = 'danger-bg';
            break;
        }
        return this.helper.dictTrans('SUBMCH_SYNC_STATE',_examState);
      }).bind(this)
    }
  ];

  /**
   * 渠道信息按钮配置
   * @type {{actions: [{btnName: string; hide: boolean}]}}
   */
  public subMchIdcodeActionCfg:any = {
    hide:true,
    actions:[{
      btnName:'del',
      hide:true
    },{
      btnName:'edit',
      hide:true
    }]
  };
public subMchDetailData:any;

  constructor( public commonDBService:CommonDBService,
               @Inject(LOCALE_ID) public _locale: string,
               public subMchIdcodeDB:LoadTableDbService,
               public snackBar:MdSnackBar,
               public sidenavService:ISidenavSrvice,
               public helper:HelpersAbsService,
               public pupop:MdPupop,
               public subMchDetailDBService:SubmerchantDetailDBService,
  ){}
  ngOnInit():void{
    this.loadData();
  }

  public loadData(isRefreash:boolean = false){
    let params = this.ctr.params;
    this.subMchDetailData = params;
    if(params){
      //初始化查询
      this.loadIdcodeInfo({merchantNo:params['merchantNo']});
    }
  }
  public loadIdcodeInfo(params: any) {
    this.subMchDetailDBService.loadIdcodeData(params).subscribe(res => {
      if (res && res['status'] == 200) {
        this.subMchIdcodeDB.dataChange.next(res['data']);
      }
    });
  }


}


