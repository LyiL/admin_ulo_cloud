import {Component, OnInit, ViewChild, Inject} from "@angular/core";
import {ULODetailContainer} from "../../../../../common/components/detail/detail-container";
import { LoadTableDbService} from "../../../../../common/db-service/common.db.service";
import {Observable} from "rxjs";
import {HelpersAbsService} from "../../../../../common/services/helpers.abs.service";
import {MdSnackBar, MdPupop, MD_DIALOG_DATA} from "@angular/material";
import {ISidenavSrvice} from "../../../../../common/services/isidenav.service";
import {MchDetailDBService} from "../detail-component/mch.detail.list.db.service";
import {DetailField, ULODetail} from "../../../../../common/components/detail/detail";
import {mchInfoTradeLimitWinComponent} from "./mch.info.tradeLimit.win.component";
import {mchInfoSecretkeyComponent} from "./mch.info.secretkey.component";
@Component({
  selector:'mch-detail-info-config',
  templateUrl:'./mch.detail.info.config.component.html',
  providers:[LoadTableDbService,MchDetailDBService]
})
export class MchDetailInfoConfigComponent implements OnInit{
  public ctr:ULODetailContainer;
  @ViewChild('mchTradeLimitDetail') mchTradeLimitDetail: ULODetail;
  @ViewChild('mchRsakeyDetail') mchRsakeyDetail: ULODetail;
  public mchTradeLimitReqParam: any; // 商户交易限额配置参数
  public rsakeyParam:any; //rsa公钥参数配置
  public mchTradeLimitFields: Array<DetailField> = [
    {
      title: '交易当日总限额(元)：',
      field: 'totalFeeLimit'
    }
  ];
  public rsakeyParamFields: Array<DetailField> = [
    {
      title: '公钥信息：',
      field: 'rsaPublicKey',
      render: (function(row: any){
        if(this.helper.isEmpty(row['rsaPublicKey'])){
          return '/';
        } else {
          return '已配置';
        }
      }).bind(this)
    }
  ];
public params:any;
  constructor(public helper:HelpersAbsService,public accountDB:LoadTableDbService, public mchDetailDBService:MchDetailDBService,
              public pupop: MdPupop,
              public snackBar:MdSnackBar,public sidenavService:ISidenavSrvice){}

  ngOnInit(){
    this.params = this.sidenavService.getPageParams();
    let _merchantNo = this.params['merchantNo'];
    if(this.params){
      this.mchTradeLimitReqParam = {
        url: '/mchManager/queryMchLimit',
        params: {merchantNo:_merchantNo}
      };

      this.rsakeyParam = {
        url: '/cloud/queryrsaconfig',
        params: {orgNo:_merchantNo}
      };
    }
  }
  /**
   * 添加/编辑交易限额
   */
  onEditTradeLimit() {
    let win = this.pupop.openWin(mchInfoTradeLimitWinComponent, {
      title: '交易限额配置',
      width: '600px',
      height: '0',
      data: {
        merchantNo: this.params['merchantNo'],
      }
    });
    win.afterClosed().subscribe( results => {
      this.mchTradeLimitDetail.refresh();
    })
  }

  /**
   * 配置RSA公钥
   */
  onSetOrgRsakey() {
    let win = this.pupop.openWin(mchInfoSecretkeyComponent, {
      title: '公钥配置',
      width: '600px',
      height: '0',
      data: {
        merchantNo: this.params['merchantNo'],
      }
    });
    win.afterClosed().subscribe( results => {
      this.mchRsakeyDetail.refresh();
    })
  }

}


