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
import {Confirm, MdPupop, MdSelectChange, MdSnackBar} from '@angular/material';
import {HelpersAbsService} from '../../../../../common/services/helpers.abs.service';
import {InputSearchDatasource} from "../../../../../common/services/impl/input.search.datasource";
import {AgencyDetailDBService} from "app/modules/bsmodules/user-file-manage/agency-list/agency.list.db.service";
import {Observable} from "rxjs/Observable";
@Component({
  selector: 'agency-detail-channel',
  templateUrl: './agency.detail.channel.component.html',
  providers: [ CommonDBService, LoadBankOrgDBService, LoadTableDbService, AgencyDetailDBService]
})
export class AgencyDetailChannelComponent implements OnInit{

  @ViewChild('channelTable') channelTable:MdTableExtend;
  public ctr:ULODetailContainer;
  public agencyDetailData:any;//代理商详情信息
  public channelEditWinOption:any = {
    title:'渠道信息',
    isRequser: true
  };
  /**
   * 渠道信息列表
   * @type {[{name: string; title: string},{name: string; title: string},{name: string; title: string},{name: string; title: string}]}
   */
  public channelColumns:Array<Column>;


  /**
   * 渠道信息按钮配置
   * @type {{actions: [{btnName: string; hide: boolean}]}}
   */
  public channelActionCfg:any = {
    actions:[{
      btnName:'del',
      hide:((row:any)=>{
        if(this.helper.btnRole('AGENTPGDELETE') && !row['isEdit']){
          return false;
        }
        return true;
      }).bind(this),
      click:this.onDeleteChannel.bind(this)
    },{
      btnName:'edit',
      hide:((row:any)=>{
        if(this.helper.btnRole('AGENTPGEDIT') && !row['isEdit']){
          return false;
        }
        return true;
      }).bind(this)
    }]
  };

  constructor(public commonDBService: CommonDBService,
              public agencyOrganDb: LoadBankOrgDBService,
              public channelDB: LoadTableDbService,
              public sidenavService: ISidenavSrvice,
              public agencyDetailDBService: AgencyDetailDBService,
              public snackBar: MdSnackBar,
              public helper: HelpersAbsService,
              public pupop:MdPupop
  ){

  }

  ngOnInit(): void{
    // const params = this.sidenavService.getPageParams();
    if (this.ctr){
      const params = this.ctr.params;
      //初始化服务商通道信息
      this.loadChannelInfo({chanCode: params['chanCode']});
      this.agencyDetailData = params;
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
        disabled:((row:any,cell:any,e:any)=>{
          return row['isEdit'] && !row['isNew'];
        }).bind(this),
        valueField:'transId',
        displayField:'transType',
        data:this.commonDBService.syncLoadTradeType(),
        onChange:(function (row,change:MdSelectChange) {
          let value = change.source.selectOptionRes;
          row = this.helper.mergeObj(row,value,['id'],{'combId':'combindId','limitSingle':'limitSingleMax','shareRule':'chanShareRule','settleRate':'chanRate'});
          //更改支付类型， 清空渠道编号、所属银行（所属银行为银行不可以清空）、通道类型、第三方商户号、密钥
          row['providerNo'] = '';
          row['centerId'] = '';
          row['ally'] = '';
          row['pcmPartKey'] = '';
          if(this.helper.hasConfigValueMatch('CLOUD_ULO_BANK_NO',this.agencyDetailData['bankCode'])){
            // row['bankNo'] = '';
            this.agencyOrganDb.params = {};
            this.agencyOrganDb.refreshChange.next(true);
          }
          this.commonDBService.reload.next({type:'loadCenter',params:{transId:change.value,bankNo:row['bankNo'],parentChanCode:this.agencyDetailData['parentChanCode']}});
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
      name:'bankNo',
      title:'所属银行',
      type:'inputSearch',
      width:'100px',
      otherOpts:{
        disabled:((row:any,cell:any)=>{
          // let data = this.helper.getDictByKey('CLOUD_ULO_BANK_NO');
          // if(this.agencyDetailData['bankCode'] == data){
          //   return false;
          // }
          return row['isEdit'] && !row['isNew'];
        }).bind(this),
        required:true,
        displayFn:(function(value:any){
          return value && value['name'];
        }).bind(this),
        optionDisplayFn:(function(value:any){
          return value && value['name'] +'('+value['orgNo']+')';
        }).bind(this),
        filterField:["orgNo","name"],
        valueField:'orgNo',
        onBeforClick:(function(value:any,row:any){
          let flag:boolean = true;
          if(this.helper.isEmpty(value)){
            this.snackBar.alert('请先输入过滤值！');
            flag = false;
          }
          this.agencyOrganDb.params = _.extend(this.agencyOrganDb.params,{name:value});
          // this.agencyOrganDb.params = {name:value};
          return flag;
        }).bind(this),
        onSelected:(function(row:any,data: any){
          if(data &&　data.value){
            row['bankName'] = data.value.name;
            this.commonDBService.reload.next({type:'loadCenter',params:{bankNo:data.value.orgNo,transId:row['transId'],parentChanCode:this.agencyDetailData['parentChanCode']}});
            // console.log(data.value.orgNo);
          }
        }).bind(this),
        dataSource:new InputSearchDatasource(this.agencyOrganDb)
      },
      render:(function(row:any){
        return this.helper.isEmpty(row['bankName'])?'/':row['bankName'];
      }).bind(this)
    },{
      name:'centerId',
      title:'通道类型',
      type:'select',
      width:'100px',
      otherOpts:{
        valueField:'id',
        displayField:'name',
        data:this.commonDBService.syncLoadCenter(),
        onChange:(function (row,change:MdSelectChange) {
          // console.log(change.source.selectOptionRes);
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
        return this.helper.isEmpty(row['centerName'])?'/':row['centerName'];
      }).bind(this)
    },{
      name:'providerNo',
      title:'渠道编号',
      inputDes:'多个编号以英文逗号分隔'
    },{
      name:'ally',
      title:'第三方平台商户号'
    },{
      name:'pcmPartKey',
      title:'第三方平台商户号密钥'
    }];

  }
  /**
   * 初始化代理商通道信息
   */
  public loadChannelInfo(chanParams: any){
    this.agencyDetailDBService.loadChannelData(chanParams).subscribe(res=>{
      if(res && res['status'] == 200){
        this.channelDB.dataChange.next(res['data']);

      }
    });
  }
  /**
   * 表格点击删除触发事件
   */
  onDeleteChannel(row:any){
    let deletePupop = this.pupop.confirm({
      width:'500px',
      message:row['centerName']?'您确认要删除【'+row['centerName']+'】的渠道信息配置吗？':'您确认要删除本条未配置通道类型的渠道信息吗？'
    });
    deletePupop.afterClosed().subscribe(result => {
      if(result == Confirm.YES){
        this.agencyDetailDBService.deleteChannelInfos({id:row['id']}).subscribe(res=>{
          if(res && res['status'] == 200){
            this.snackBar.alert('删除成功！');
            this.loadChannelInfo({chanCode:this.agencyDetailData['chanCode']});//刷新表格
          }else{
            this.snackBar.alert(res['message']);
          }
        });
      }
    })
  }

  /**
   * 新增通道
   * @param channelTable
   */
  public onNewChannel(channelTable){
    /**
     * 加载支付类型的数据
     */
    this.commonDBService.reloadTradeType.next({type:'loadTradeType',params:{userNo: this.agencyDetailData['chanCode']}});

    //所属机构为银行时 ，渠道信息里的所属银行不可选（diabled）
    if(!this.helper.hasConfigValueMatch('CLOUD_ULO_BANK_NO',this.agencyDetailData['bankCode'])){
      channelTable.newRow();
      this.agencyOrganDb.params = {name:this.agencyDetailData['bankCode']};
      this.agencyOrganDb.refreshChange.next(true);
      // console.log(this.channelColumns[2].otherOpts);
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
    this.commonDBService.reloadTradeType.next({type:'loadTradeType',params:{userNo: this.agencyDetailData['chanCode'],categoryTypeChan:row['categoryType'],transId: row['transId']}});
    /**
     * 重新根据支付类型及所属银行加载通道类型的数据
     */
    this.commonDBService.reload.next({type:'loadCenter',params:{bankNo:row['bankNo'],transId:row['transId'],parentChanCode:this.agencyDetailData['parentChanCode']}});
  }

  /**
   * 保存代理商通道信息(单条保存)
   * @param value
   */
  public onSaveChannel(value:any){
    // let vals:Array<any> = [];
    value['orgId'] = this.agencyDetailData['orgId'];
    value['chanNo'] = this.agencyDetailData['chanCode'];
    //剔除支付类型中括号与括号中的值
    let arr = this.helper.getDictByKey('MCH_TYPE');
    value['transType'] = this.helper.stringReplace(value['transType'],arr);
    // vals.push(value);
    this.agencyOrganDb.params = {};
    return this.agencyDetailDBService.saveChannelInfos(value).map(res=>{
      if(res && res['status'] == 200){
        this.snackBar.alert('保存通道信息成功！');
        this.loadChannelInfo({chanCode:this.agencyDetailData['chanCode']});//保存成功时刷新表格
        return res;
      }else{
        this.snackBar.alert(res['message']);
        //保存失败时，该数据需要保持在编辑状态
        value['isEdit'] = true;
        return undefined;
      }
    });

  }
  /**
   * 表格点击取消事件
   */
  onCancelChannel(){
    this.agencyOrganDb.params = {};
    this.loadChannelInfo({chanCode:this.agencyDetailData['chanCode']});//刷新表格
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
   * 剔除支付类型中括号与括号中的值
   * @param _type
   * @return {string}
   */
  // private modifyTradeType(_type:string):string{
  //   let _mchType = this.helper.getDictByKey('MCH_TYPE');
  //   let _mchTypeNames:Array<string> = [];
  //   _mchType && _mchType.forEach((item)=>{
  //     _mchTypeNames.push(item['name']);
  //   });
  //   _mchTypeNames.forEach((name)=>{
  //     _type = _type.replace('('+name+')','');
  //   });
  //   return _type;
  // }
}
