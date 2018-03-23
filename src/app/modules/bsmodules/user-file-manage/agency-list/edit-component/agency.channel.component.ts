import {Component, OnInit, ViewChild} from '@angular/core';
import {Column, MdTableExtendConfig} from '../../../../../common/components/table/table-extend-config';
import {MdTableExtend} from '../../../../../common/components/table/table-extend';
import {Router} from '@angular/router';
import {ISidenavSrvice} from '../../../../../common/services/isidenav.service';
import {
  CommonDBService, LoadBankOrgDBService,
  LoadTableDbService
} from '../../../../../common/db-service/common.db.service';

import {ULODetailContainer} from '../../../../../common/components/detail/detail-container';
import {MdSelectChange, MdSnackBar} from '@angular/material';
import {HelpersAbsService} from '../../../../../common/services/helpers.abs.service';
import {InputSearchDatasource} from "../../../../../common/services/impl/input.search.datasource";
import {AgencyDetailDBService} from "app/modules/bsmodules/user-file-manage/agency-list/agency.list.db.service";
import {Observable} from "rxjs/Observable";
@Component({
  selector: 'agency-channel',
  templateUrl: './agency.channel.component.html',
  providers: [ CommonDBService, LoadBankOrgDBService, LoadTableDbService, AgencyDetailDBService]
})
export class AgencyChannelComponent implements OnInit{
  public ctr: ULODetailContainer;

  @ViewChild('channelTable') channelTable: MdTableExtend;

  public channelEditWinOption:any = {
    title:'渠道信息',
    isRequser:false
  };
  /**
   * 渠道信息列表
   * @type {[{name: string; title: string},{name: string; title: string},{name: string; title: string},{name: string; title: string}]}
   */
  public channelColumns: Array<Column>;


  /**
   * 渠道信息按钮配置
   * @type {{actions: [{btnName: string; hide: boolean}]}}
   */
  public channelActionCfg: any = {
    actions: [{
      btnName: 'del',
      hide: (function(row: any){
        if (!row['isEdit'] && row['isNew']){
          return false;
        }
        return true;
      }).bind(this)
    }]
  };

  constructor(public commonDBService: CommonDBService, public agencyOrganDb: LoadBankOrgDBService, public channelDB: LoadTableDbService,
              public sidenavService: ISidenavSrvice, public agencyDetailDBService: AgencyDetailDBService, public snackBar: MdSnackBar, public helper: HelpersAbsService){}

  ngOnInit(): void{
    const params = this.sidenavService.getPageParams();
    if (params){
      //初始化服务商通道信息
      this.agencyDetailDBService.loadChannelData({chanCode: params['chanCode']}).subscribe(res => {
        if (res && res['status'] == 200){
          this.channelDB.dataChange.next(res['data']);
        }
      });
    }

    //默认有一条新增待填写的渠道信息
    // Observable.timer(500).subscribe(() => {
    //   if (this.channelTable) {
    //     this.channelTable.newRow();
    //   }
    // });

    this.channelColumns = [{
      name:'transId',
      title:'支付类型',
      type:'select',
      otherOpts:{
        disabled:((row:any,cell:any)=>{
          return row['isEdit'] && !row['isNew'];
        }).bind(this),
        valueField:'transId',
        displayField:'transType',
        data:this.commonDBService.syncLoadTradeType(),
        // data:this.commonDBService.loadTradeType({userNo: this.ctr.params['chanCode'],parentChanNo:this.ctr.params['parentChanCode']}),
        onChange:(function (row,change:MdSelectChange) {
          let value = change.source.selectOptionRes;
          row = this.helper.mergeObj(row,value,['id'],{'combId':'combindId','limitSingle':'limitSingleMax','shareRule':'chanShareRule','settleRate':'chanRate'});
          // row['transType'] = value['transType'];
          //更改支付类型， 清空渠道编号、所属银行（所属银行为银行不可以清空）、通道类型、第三方商户号、密钥
          row['providerNo'] = '';
          row['centerId'] = '';
          row['ally'] = '';
          row['pcmPartKey'] = '';
          if(this.helper.hasConfigValueMatch('CLOUD_ULO_BANK_NO',this.ctr.params['bankCode'])){
            // row['bankNo'] = '';
            this.agencyOrganDb.params = {};
            this.agencyOrganDb.refreshChange.next(true);
          }
          this.commonDBService.reload.next({type:'loadCenter',params:{transId:change.value,bankNo:row['bankNo'],parentChanCode:this.ctr.params['parentChanCode']}});
          this.agencyOrganDb.params = {transId:change.value};
        }).bind(this),
        required:true
      },
      render:(function(row:any,name:string){
        return this.helper.isEmpty(row['transType'])?'/':row['transType'];
      }).bind(this)
    },{
      name: 'categoryType',
      title: '行业类别',
      type: 'select',
      otherOpts: {
        valueField: 'id',
        displayField: 'name',
        data: Observable.of(this.helper.getDictByKey('MCH_TYPE')),
        disabled:true,
        required:true,
      },
      render: (function (row: any, name: string) {
        if(this.helper.isEmpty(row[name])){
          return '/';
        }else{
          return this.helper.dictTrans('MCH_TYPE', row[name]);
        }
      }).bind(this)
    },{
      name: 'bankNo',
      title: '所属银行',
      type: 'inputSearch',
      width: '240px',
      otherOpts: {
        disabled:((row:any,cell:any)=>{
          // let data = this.helper.getDictByKey('CLOUD_ULO_BANK_NO');
          // if(this.ctr.params['bankCode'] == data){
          //   return false;
          // }
          return row['isEdit'] && !row['isNew'];
        }).bind(this),
        required:true,
        displayFn: (function(value: any){
          return value && value['name'];
        }).bind(this),
        optionDisplayFn: (function(value: any){
          return value && value['name'] + '(' + value['orgNo'] + ')';
        }).bind(this),
        filterField: ['orgNo', 'name'],
        valueField: 'orgNo',
        onBeforClick: (function(value: any){
          let flag:boolean = true;
          if (this.helper.isEmpty(value)){
            this.snackBar.alert('请先输入过滤值！');
            flag = false;
          }
          this.agencyOrganDb.params = _.extend(this.agencyOrganDb.params,{name:value});
          return flag;
        }).bind(this),
        onSelected:(function(row:any,data: any){
          if(data &&　data.value){
            row['bankName'] = data.value.name;
            this.commonDBService.reload.next({type:'loadCenter',params:{bankNo:data.value.orgNo,transId:row['transId'],parentChanCode:this.ctr.params['parentChanCode']}});
          }
        }).bind(this),
        dataSource: new InputSearchDatasource(this.agencyOrganDb),
      },
      render: (function(row: any){
        return this.helper.isEmpty(row['bankName']) ? '/':row['bankName'];
      }).bind(this)
    },{
      name:'centerId',
      title:'通道类型',
      type:'select',
      otherOpts:{
        valueField:'id',
        displayField:'name',
        data:this.commonDBService.syncLoadCenter(),
        onChange:(function (row,change:MdSelectChange) {
          let value = change.source.selectOptionRes;
          row['centerName'] = value.name;
          row['providerNo'] = value.providerNo;
          row['ally'] = value.ally;
          row['pcmPartKey'] = value.pcmPartKey;
          row['otherCenterId'] = value.otherCenterId;//后台需要这个参数
          row['otherCenterBank'] = value.otherCenterBank;//后台需要这个参数
        }).bind(this),
        // required:true,
      },
      render:(function(row:any,name:string){
        return this.helper.isEmpty(row['centerName']) ? '/':row['centerName'];
      }).bind(this)
    },{
      name: 'providerNo',
      title: '渠道编号',
      inputDes:'多个编号以英文逗号分隔'
      // otherOpts:{
      //   required:true
      // }
    },{
      name:'ally',
      title:'第三方平台商户号'
    },{
      name:'pcmPartKey',
      title:'第三方平台商户号密钥'
    }];


  }

  /**
   * 新增通道
   * @param channelTable
   */
  onNewChannel(channelTable: MdTableExtend){
    /**
     * 加载支付类型的数据
     */
    this.commonDBService.reloadTradeType.next({type:'loadTradeType',params:{userNo: this.ctr.params['chanCode']}});

    //所属机构为银行时 ，渠道信息里的所属银行不可选（diabled）
    if(!this.helper.hasConfigValueMatch('CLOUD_ULO_BANK_NO',this.ctr.params['bankCode'])){
      // console.log(this.ctr.params['bankName'])
      channelTable.newRow({bankName: this.ctr.params['bankName']});
      this.agencyOrganDb.params = {name:this.ctr.params['bankCode']};
      this.agencyOrganDb.refreshChange.next(true);
      this.channelColumns[2].otherOpts['disabled'] = this.disableFn;
    }else{
      channelTable.newRow();
    }
  }
  /**
   *disabled方法的覆盖
   */
  disableFn(){
    return true;
  }

  /**
   * 表格点击编辑按钮事件
   * @param row
   */
  onEditAgencyChannel(row:any){
    if(!this.helper.isEmpty(row['bankNo'])) {
      this.agencyOrganDb.params = {name: row['bankNo']};
      this.agencyOrganDb.refreshChange.next(true);
    }
    /**
     * 重新根据行业类别加载支付类型的数据
     */
    this.commonDBService.reloadTradeType.next({type:'loadTradeType',params:{userNo: this.ctr.params['chanCode'],categoryTypeChan:row['categoryType'],transId: row['transId']}});
    /**
     * 重新根据支付类型及所属银行加载通道类型的数据
     */
    this.commonDBService.reload.next({type:'loadCenter',params:{bankNo:row['bankNo'],transId:row['transId'],parentChanCode:this.ctr.params['parentChanCode']}});
  }
  /**
   * 返回上一步
   */
  onBack(){
    let _params = {step:2,isEdit:true,source:this.ctr.params['source'],orgId:this.ctr.params['orgId'],chanCode:this.ctr.params['chanCode'],name:this.ctr.params['name'],bankCode: this.ctr.params['bankCode'],bankName:this.ctr.params['bankName'],parentChanCode:this.ctr.params['parentChanCode'],id:this.ctr.params['id']};
    this.sidenavService.resetPageParams(_params);
    this.ctr.params = _params;
    this.ctr && this.ctr.onStep(2);
  }

  /**
   * 保存通道
   */
  onSaveChannels(){
    if (this.hasData()){
      let flag: boolean = false;
      const _params = this.ctr.params;
      this.channelDB.data.forEach((data) => {
        data['chanNo'] = _params['chanCode'];
        data['orgId'] = _params['orgId'];
        //剔除支付类型中括号与括号中的值
        let arr = this.helper.getDictByKey('MCH_TYPE');
        data['transType'] = this.helper.stringReplace(data['transType'],arr);
        // data['categoryType'] = _params['categoryType'];
        // console.log(data)
        if(data['isEdit'] == true){
          flag = true;
        }else{
          // data['categoryType'] = data['categoryType'] instanceof Array ? data['categoryType'].join(',') : data['categoryType'];
        }
      });
      if(flag){
        this.snackBar.alert('您有正在编辑的数据，请先确认或取消！');
        return false;
      }
      let _commitData = this.channelDB.data.filter(data=>{
        return data['isNewest'] !== true;
      });
      this.agencyDetailDBService.saveBatchChannelInfos(_commitData).subscribe(res => {
        if (res && res['status'] == 200){
          this.snackBar.alert('保存通道信息成功！');
          if (_params['source'] && _params['source'] == 'detail'){
            this.sidenavService.onNavigate('/admin/agencydetail', '详情', {id: _params['id'], orgId: _params['orgId'], chanCode: _params['chanCode'], name: _params['name']}, true);
          }else{
            this.sidenavService.onNavigate('/admin/agencylist', '代理商列表', {}, true);
          }
        }else{
          this.snackBar.alert(res['message']);
        }
      });
    }
  }
  /**
   * 表格点击确定按钮事件
   */
  onSaveChannel(){
    this.agencyOrganDb.params = {};
  }
  /**
   * 表格点击取消按钮事件
   */
  onCancelChannel(){
    this.agencyOrganDb.params = {};
  }
  /**
   * 表格点击确定按钮保存之前触发事件
   */
  onBeforeSaveChannel(row: any){
    let hasDataSourceInTransId = this.channelDB.data.find((item)=>{
      let _tmpTransId = _.isArray(item['transId']) ? item['transId'].join(',') : item['transId'];
      if(!(row['table_id'] == item['table_id']) && !_.isEmpty(row['transId']) && _tmpTransId.indexOf(row['transId']) != -1 && row['categoryType'] == item['categoryType']){
        return true;
      }
      return false;
    });
    if(hasDataSourceInTransId){
      this.snackBar.alert('支付类型、行业类别不能同时重复，请调整！');
      return false;
    }
  }
  /**
   * 判断是否有数据
   */
  hasData(): boolean{
    if (this.channelDB.data && this.channelDB.data.length > 0){
      return true;
    }
    return false;
  }
}
