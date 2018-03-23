import {Component, OnInit, ViewChild, Inject} from "@angular/core";
import {ULODetailContainer} from "../../../../../common/components/detail/detail-container";
import {LoadBankLinkNo, LoadTableDbService} from "../../../../../common/db-service/common.db.service";
import {Observable} from "rxjs";
import {HelpersAbsService} from "../../../../../common/services/helpers.abs.service";
import {MdSnackBar, MdPupop, MD_DIALOG_DATA} from "@angular/material";
import {ISidenavSrvice} from "../../../../../common/services/isidenav.service";
import {MchDetailDBService} from "../detail-component/mch.detail.list.db.service";
import {DetailField, ULODetail} from "../../../../../common/components/detail/detail";
import {mchInfoTradeLimitWinComponent} from "../detail-component/mch.info.tradeLimit.win.component";
import {mchInfoSecretkeyComponent} from "../detail-component/mch.info.secretkey.component";
@Component({
  selector:'mch-info-config',
  templateUrl:'./mch.info.config.component.html',
  providers:[LoadTableDbService,MchDetailDBService]
})
export class MchInfoConfigComponent implements OnInit{
  public ctr:ULODetailContainer;
  public mchTradeLimitReqParam: any; // 商户交易限额配置参数
  public rsakeyParam:any; //rsa公钥参数配置
  @ViewChild('mchTradeLimitDetail') mchTradeLimitDetail: ULODetail;
  @ViewChild('mchRsakeyDetail') mchRsakeyDetail: ULODetail;
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
  constructor(public helper:HelpersAbsService,public accountDB:LoadTableDbService, public mchDetailDBService:MchDetailDBService,public pupop: MdPupop,
              public snackBar:MdSnackBar,public sidenavService:ISidenavSrvice){}

  ngOnInit(){
    let params = this.ctr.params;
    let _merchantNo = params['merchantNo'];
    if(params){
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


  onBefore(){
    let _params = {step:4,isEdit:true,source:this.ctr.params['source'],
      userNo:this.ctr.params['merchantNo'],
      id:this.ctr.params['id'],
      orgId:this.ctr.params['orgId'],
      agencyCode:this.ctr.params['agencyCode'],
      agencyName:this.ctr.params['agencyName'],
      chanNo:this.ctr.params['chanNo'],
      // ptCenterId:this.ctr.params['centerId'],
      merchantId:this.ctr.params['id'],
      merchantNo:this.ctr.params['merchantNo'],
      parentChanNo:this.ctr.params['chanNo'],
      categoryType:this.ctr.params['categoryType']
    };
    this.sidenavService.resetPageParams(_params);
    this.ctr.params = _params;
    // console.log(this.ctr.params);
    this.ctr.onStep(3);

    };


  /**
   * 保存下一步
   */
  onSaveInfoConf(){
      this.sidenavService.onNavigate('/admin/mchlist','商户列表',{},true)
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
        merchantNo: this.ctr.params['merchantNo'],
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
        merchantNo: this.ctr.params['merchantNo'],
      }
    });
    win.afterClosed().subscribe( results => {
      this.mchRsakeyDetail.refresh();
    })
  }

}

