import {Component, OnInit, ViewChild} from '@angular/core';
import { DetailField } from '../../../../common/components/detail/detail';
import { CommonDBService } from '../../../../common/db-service/common.db.service';
import { MdPupop, MdSnackBar } from '@angular/material';
import { HelpersAbsService } from '../../../../common/services/helpers.abs.service';
import { SidenavService } from 'app/common/services/impl/sidenav.service';
import { ULOSPInfoWeixinWinComponent } from './sp.info.weixin.win.component';
import {ULODetailContainer} from "../../../../common/components/detail/detail-container";
import {ULOSPInfoSubMchPatternWinComponent} from "./sp.info.subMchPattern.win.component";
import {ULODetail} from "../../../../common/components/detail";
import {ULOSPInfoTradeLimitWinComponent} from "./sp.info.tradeLimit.win.component";
import {spDetailSecretkeyComponent} from "./detail-component/sp.detail.secretkey.component";


@Component({
    selector: 'ulo-sp-info',
    templateUrl: './sp.info.component.html',
    providers: [
        SidenavService,
        CommonDBService
    ]
})
export class ULOSPInfoComponent implements OnInit {

    public spWeixinReqParam: any; // 服务商微信公众号参数
    public spSubMchPatternReqParam: any; // 服务商子商户模式配置参数
    public spTradeLimitReqParam: any; // 服务商交易限额配置参数
    public spRsakeyReqParam: any; //rsa公钥配置参数
    public spWeixinData: any;
    @ViewChild('spWeixinDetail') spWeixinDetail: ULODetail;
    @ViewChild('spSubMchPatternDetail') spSubMchPatternDetail: ULODetail;
    @ViewChild('spTradeLimitDetail') spTradeLimitDetail: ULODetail;
    @ViewChild('mchRsakeyDetail') mchRsakeyDetail: ULODetail;
    public ctr: ULODetailContainer;
    public spWeixinFields: Array<DetailField> = [
        {
            title: '关联公众号APPID：',
            field: 'subAppid'
        },
        {
            title: '推荐关联公众号APPID：',
            field: 'subscribeAppid'
        },
        {
            title: '支付授权目录：',
            field: 'jsapiPath'
        }
    ];
    public spSubMchPatternFields: Array<DetailField> = [
      {
        title: '当前模式：',
        field: 'examStyle',
        render: (function(row: any){
          let _state = row['examStyle'];
          return this.helper.isEmpty(_state) ? '/' : this.helper.dictTrans('CHAN_PRO_EXAM_STYLE', _state);
        }).bind(this)
      }
    ];
    public spTradeLimitFields: Array<DetailField> = [
      {
        title: '交易当日总限额(元)：',
        field: 'totalFeeLimit',
        render: (function(row: any){
          if(this.helper.isEmpty(row['totalFeeLimit'])){
            return '/';
          }
          return row['totalFeeLimit'];
        }).bind(this)
      }
    ];

    public spRsakeyFields: Array<DetailField> = [
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

    constructor(
        public pupop: MdPupop,
        public snackbar: MdSnackBar,
        public sidenavService: SidenavService,
        public helper: HelpersAbsService
    ) {
    }

    ngOnInit() {
        let params = this.sidenavService.getPageParams();
        let _chanCode = params && params['chanCode'];
        if(params){
          this.spWeixinReqParam = {
            url: '/servicepro/queryWxConfig',
            params: {
              chanCode: _chanCode
            }
          };
          this.spWeixinDetail && this.spWeixinDetail.detailData.subscribe( res => {
            this.spWeixinData = res && res['subAppid'];
          });
          this.spSubMchPatternReqParam = {
            url: '/servicepro/getChanProExamStyle',
            params: {
              chanCode: _chanCode
            }
          };
          this.spTradeLimitReqParam = {
            url: '/cloud/servicepro/searchTotalFeeLimit',
            params: {
              chanCode: _chanCode
            }
          };
          this.spRsakeyReqParam = {
            url: '/cloud/queryrsaconfig',
            params: {orgNo:_chanCode}
          };
        }
    }

    /**
     * 添加/编辑微信公众号配置
     */
    public onEditWeixin() {
        // let _that = this;
        let params = this.sidenavService.getPageParams();
        let _chanCode = params && params['chanCode'];
        let weixinConfigRef = this.pupop.openWin( ULOSPInfoWeixinWinComponent, {
            title: '公众号配置',
            width: '800px',
            height: '0',
            data: {
                chanCode: _chanCode
            }
        });
        weixinConfigRef.afterClosed().subscribe(result => {
            this.spWeixinDetail.refresh();
        })
    }

    /**
     * 添加/编辑子商户模式配置
     */
    public onEditSubMchPattern() {
      let subMchPatternRef = this.pupop.openWin(ULOSPInfoSubMchPatternWinComponent, {
        title: '子商户模式配置',
        width: '400px',
        height: '0',
      });
      subMchPatternRef.afterClosed().subscribe(result => {
        this.spSubMchPatternDetail.refresh();
      })
    }

    /**
     * 添加/编辑交易限额
     */
    onEditTradeLimit() {
      let params = this.sidenavService.getPageParams();
      let _chanCode = params && params['chanCode'];
      let win = this.pupop.openWin(ULOSPInfoTradeLimitWinComponent, {
        title: '交易限额配置',
        width: '600px',
        height: '0',
        data: {
          chanCode: _chanCode
        }
      });
      win.afterClosed().subscribe( results => {
        this.spTradeLimitDetail.refresh();
      })
    }

  /**
   * 配置RSA公钥
   */
  onSetOrgRsakey() {
    let params = this.sidenavService.getPageParams();
    let _chanCode = params && params['chanCode'];
    let win = this.pupop.openWin(spDetailSecretkeyComponent, {
      title: '公钥配置',
      width: '600px',
      height: '0',
      data: {
        chanCode: _chanCode,
      }
    });
    win.afterClosed().subscribe( results => {
      this.mchRsakeyDetail.refresh();
    })
  }

    /**
     * 判断新增还是详情
     */
    public hasSource(){
      let params = this.sidenavService.getPageParams();
      if(!params || (params && this.helper.isEmpty(params['step'])) ){
        return true; // 详情进来
      }else{
        return false;// 新增进来
      }
    }

    /**
     * 返回上一步
     */
    public onLastStep() {
      let _params = {
        step: 3,
        isEdit: true,
        id: this.ctr.params['id'],
        orgId: this.ctr.params['orgId'],
        chanCode: this.ctr.params['chanCode'],
        name: this.ctr.params['name'],
        bankCode: this.ctr.params['bankCode'],
        bankName: this.ctr.params['bankName'],
        parentChanCode: this.ctr.params['parentChanCode']
      };
      this.ctr.params = _params;
      this.ctr.onStep(3);
    }

    /**
     * 返回列表页
     */
    public onSave() {
      this.sidenavService.onNavigate('/admin/splist', '服务商户列表', {}, true);
    }
}
