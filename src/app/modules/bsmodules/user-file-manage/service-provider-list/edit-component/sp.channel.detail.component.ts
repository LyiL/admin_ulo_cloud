import {Component, Inject, OnInit} from '@angular/core';
import {MD_DIALOG_DATA} from "@angular/material";
import {ISidenavSrvice} from "../../../../../common/services/isidenav.service";
import {HelpersAbsService} from "../../../../../common/services/helpers.abs.service";
import {DetailField} from "../../../../../common/components/detail";

@Component({
  selector: 'ulo-channel-detail',
  templateUrl: './sp.channel.detail.component.html'
})

export class ULOSPChannelDetailComponent implements OnInit{

  public ULOSPDetailChanenlDetailinpData: any;
  public ULOSPDetailChanenlDetailField: Array<DetailField> = [
    {
      title: '支付类型：',
      field: 'transType'
    },
    {
      title: '所属银行：',
      field: 'agencyName'
    },
    {
      title: '通道类型：',
      field: 'ptCenterName'
    },
    {
      title: '渠道编号：',
      field: 'providerNo'
    },
    {
      title: '第三方平台商户号：',
      field: 'thirdMchId'
    },
    {
      title: '第三方平台商户号密钥：',
      field: 'pcmPartkey'
    },
    {
      title: '启用状态：',
      field: 'used',
      render:(function(row:any,field:DetailField){
        let _state = row[field.field];
        if(!this.helper.isEmpty(_state)){
          return this.helper.dictTrans('ENABLE_STATUS',_state);
        }
      }).bind(this)
    },
    {
      title: '单日限额(元)：',
      field: 'limitDay'
    },
    {
      title: '单笔最大限额(元)：',
      field: 'limitSingle'
    },
    {
      title: '单笔最小限额(元)：',
      field: 'limitSingleMin'
    },
    {
      title: '商户APPID：',
      field: 'thirdAppid'
    },
    {
      title: '结算周期：',
      field: 'settleCycle',
      render:(function(row:any,field:DetailField){
        let _state = row[field.field];
        if(!this.helper.isEmpty(_state)){
          return this.helper.dictTrans('BALANCE_DATE',_state);
        }
      }).bind(this)
    },
    {
      title: '结算费率(‰)：',
      field: 'settleRate'
    }
  ];

  constructor(
    public sidenavService: ISidenavSrvice,
    public helper: HelpersAbsService,
    @Inject(MD_DIALOG_DATA) public data: any,
  ){
    if(this.data){
      this.ULOSPDetailChanenlDetailinpData = this.data;
    }
  }

  ngOnInit(): void {
  }
}
