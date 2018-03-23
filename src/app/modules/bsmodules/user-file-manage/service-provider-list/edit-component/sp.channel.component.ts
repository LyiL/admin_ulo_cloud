import {Component, OnInit, ViewChild} from "@angular/core";
import {InputSearchDatasource} from "../../../../../common/services/impl/input.search.datasource";
import {Confirm, MdPupop, MdSelectChange, MdSnackBar} from "@angular/material";
import {
  CommonDBService, LoadBankOrgDBService,
  LoadTableDbService, LoadTableDbService2
} from "../../../../../common/db-service/common.db.service";
import {Column} from "../../../../../common/components/table/table-extend-config";
import {ISidenavSrvice} from "../../../../../common/services/isidenav.service";
import {SPDetailDBService} from "../sp.db.service";
import {MdTableExtend} from "../../../../../common/components/table/table-extend";
import {ULODetailContainer} from "../../../../../common/components/detail/detail-container";
import {HelpersAbsService} from "../../../../../common/services/helpers.abs.service";
import {Observable} from "rxjs/Observable";
import {ULOSpTradeRuleWinComponent} from "../sp.tradeRule.win.component";
import {ULOSPChannelEditWinComponent} from "./sp.channel.edit.win.component";
@Component({
  selector: 'ulo-sp-channel',
  templateUrl: './sp.channel.component.html',
  providers:[
    CommonDBService,
    LoadBankOrgDBService,
    LoadTableDbService,
    LoadTableDbService2,
    SPDetailDBService
  ]
})
export class ULOSPChannelComponent implements OnInit{
  public ctr: ULODetailContainer;
  public ruleState:any;
  public tradeType:any;
  public winParams:any;
  public forbidParams:any;
  public poil: any;
  public oParams: any;
  public _chanCode: any;
  public _bankCode: any;
  @ViewChild('channelTable') channelTable:MdTableExtend;

  /**
   * 渠道信息列表
   * @type {[{name: string; title: string},{name: string; title: string},{name: string; title: string},{name: string; title: string}]}
   */
  public channelColumns: Array<Column>;

  /**
   * 渠道信息按钮配置
   * @type {{actions: [{btnName: string; hide: boolean}]}}
   */
  public channelActionCfg:any = {
    actions:[
    {
      btnName:'del',
      hide:(function(row:any){
        if(!row['isEdit'] && row['isNew']){
          return false;
        }
        return true;
      }).bind(this)
    },
    {
      btnName:'edit',
      click: this.onEditChannel.bind(this)
    }]
  };

  /**
   * 总通道弹窗配置
   * @type {title: string, isRequser: boolean}
   */
  public totalChannelWinOption:any = {
    title: '总通道配置',
    isRequser: false
  };
  /**
   * 总通道配置列表
   * @type {[{name: string; title: string},{name: string; title: string},{name: string; title: string},{name: string; title: string}]}
   */
  public totalChannelColumns: Array<Column>;

  /**
   * 总通道配置按钮配置
   * @type {{actions: [{btnName: string; hide: boolean}]}}
   */
  public totalChannelActionCfg:any = {
    actions:
      [
        {
          btnName: 'edit',
        },
        {
          btnName: 'del',
          hide: true,
        },
      ]
  };

  constructor(
    public commonDBService: CommonDBService,
    public spOrganDb: LoadBankOrgDBService,
    public spTotalOrganDb: LoadBankOrgDBService,
    public channelDB: LoadTableDbService,
    public totalChannelDB: LoadTableDbService2,
    public sidenavService: ISidenavSrvice,
    public spDetailDBService: SPDetailDBService,
    public snackBar: MdSnackBar,
    public helper: HelpersAbsService,
    public pupop: MdPupop
  ){}

  ngOnInit(): void{
    this.oParams = this.ctr && this.ctr.params;
    this._chanCode = this.oParams['chanCode'];
    this._bankCode = this.oParams['bankCode'];
    let params = this.sidenavService.getPageParams();
    if(params){
      if(this.helper.hasConfigValueMatch('CLOUD_ULO_BANK_NO', this._bankCode)){
        // 初始化服务商总通道信息
        this.spDetailDBService
          .loadTotalChannels({ proNo: this._chanCode })
          .subscribe(res => {
            if(res && res['status'] == 200){
              this.totalChannelDB.dataChange.next(res['data']);
            }
          });
        // 初始化轮循信息
        this.loadpoil({ chanCode: this._chanCode});
        // 初始化路由配置信息
        this.spDetailDBService
          .loadTradeRule( { parentNo: this._chanCode})
          .subscribe( res => {
            if(res && res['status'] == 200){
              this.ruleState = res['data'] ? res['data']['ruleState'] : 1;
              this.tradeType = res['data'] ? res['data']['tradeType'] : '--';
            }
          });
      }
      // 初始化服务商通道信息
      this.spDetailDBService
        .loadChannelInfos({ merchantId: this._chanCode })
        .subscribe(res => {
          if(res && res['status'] == 200){
            let data = res['data'];
            data && data.forEach((item,ind) => {
              item['limitDay'] = item ['limitDay'] && this.helper.shuntElement(item['limitDay']);
              item['limitSingle'] = item ['limitSingle'] && this.helper.shuntElement(item['limitSingle']);
              item['limitSingleMin'] = item ['limitSingleMin'] && this.helper.shuntElement(item['limitSingleMin']);
            });
            this.channelDB.dataChange.next(data);
          }
      });
    }
    this.channelColumns = [
      {
        name: 'transId',
        title: '支付类型',
        type: 'select',
        otherOpts:{
          disabled:((row:any,cell:any)=>{
            return row['isEdit'] && !row['isNew'];
          }).bind(this),
          valueField: 'transId',
          displayField: 'transType',
          data: this.commonDBService.syncLoadTradeType(),
          onChange:(function (row,change:MdSelectChange) {
            // let value = change.source.selectOptionRes;
            // row = this.helper.mergeObj(row, value,['id'],{
            //   'combId': 'combindId',
            //   'limitSingle': 'limitSingleMax',
            //   'shareRule': 'chanShareRule',
            //   'settleRate': 'chanRate'
            // });
            row['transType'] = change.source.triggerValue;
            // 更改支付类型， 清空渠道编号、所属银行（所属银行为银行不可以清空）、通道类型、第三方平台商户号、第三方平台商户号密钥
            row['providerNo'] = '';
            row['ptCenterId'] = '';
            row['ally'] = '';
            row['pcmPartkey'] = '';
            if(this.helper.hasConfigValueMatch('CLOUD_ULO_BANK_NO',this._bankCode)){
              // row['bankNo'] = '';
              this.spOrganDb.params = {};
              this.spOrganDb.refreshChange.next(true);
            }
            this.commonDBService.reload.next({
              type: 'loadCenter',
              params: {
                transId: change.value,
                bankNo: row['agencyCode'],
                parentChanCode: this.oParams['parentChanCode']
              }
            });
            this.spOrganDb.params = {transId: change.value};
          }).bind(this),
          required: true
        },
        render:(function(row: any){
          if(this.helper.isEmpty(row['transType'])){
            return '/'
          }
          return row['transType'];
        }).bind(this)
      },
      // {
      //   name: 'categoryType',
      //   title: '行业类别',
      //   type: 'select',
      //   otherOpts: {
      //     valueField: 'id',
      //     displayField: 'name',
      //     disabled: true,
      //     data: Observable.of(this.helper.getDictByKey('MCH_TYPE')),
      //     required: true
      //   },
      //   render: (function(row: any, name: string){
      //     if(this.helper.isEmpty(row[name])){
      //       return '/';
      //     }
      //     return this.helper.dictTrans('MCH_TYPE', row[name]);
      //   }).bind(this)
      // },
      {
        name: 'agencyCode',
        title: '所属银行',
        type: 'inputSearch',
        // width: '200px',
        otherOpts: {
          disabled:((row: any, cell: any) => {
            // let data = this.helper.getDictByKey('CLOUD_ULO_BANK_NO');
            // if(this.oParams['bankCode'] == data){
            //   return false;
            // }
            return row['isEdit'] && !row['isNew'];
          }).bind(this),
          required:true,
          displayFn:(function(value: any){
            return value && value['name'];
          }).bind(this),
          optionDisplayFn:(function(value:any){
            return value && value['name'] + '(' + value['orgNo'] + ')';
          }).bind(this),
          filterField: ['orgNo', 'name'],
          valueField: 'orgNo',
          onBeforClick:(function(value:any){
            let flag:boolean = true;
            if(this.helper.isEmpty(value)){
              this.snackBar.alert('请先输入过滤值！');
              flag = false;
            }
            this.spOrganDb.params = _.extend(this.spOrganDb.params, { name: value });
            // this.spOrganDb.params = {name:value};
            return flag;
          }).bind(this),
          onSelected:(function(row: any, data: any){
            if(data &&　data.value){
              row['agencyName'] = data.value.name;
              this.commonDBService.reload.next({
                type: 'loadCenter',
                params: {
                  bankNo: data.value.orgNo,
                  transId: row['transId'],
                  parentChanCode: this.oParams['parentChanCode']
                }
              });
            }
          }).bind(this),
          dataSource: new InputSearchDatasource(this.spOrganDb)
        },
        render: (function(row: any) {
          if(this.helper.isEmpty(row['agencyName'])){
            return '/'
          }
          return row['agencyName'];
        }).bind(this)
      },
      {
        name: 'ptCenterId',
        title: '通道类型',
        type: 'select',
        otherOpts:{
          valueField: 'id',
          displayField: 'name',
          data: this.commonDBService.syncLoadCenter(),
          onChange:(function (row, change: MdSelectChange) {
            let value = change.source.selectOptionRes;
            row['ptCenterName'] = value.name;
            row['providerNo'] = value.providerNo;
            row['otherCenterId'] = value.otherCenterId; // 后台需要这个参数
            row['otherCenterBank'] = value.otherCenterBank; // 后台需要这个参数
            row['ally'] = value.ally;
            row['pcmPartkey'] = value.pcmPartkey
          }).bind(this),
          required: true,
        },
        render:(function(row: any){
          if(this.helper.isEmpty(row['ptCenterName'])){
            return '/';
          }
          return row['ptCenterName'];
        }).bind(this)
      },
      {
        name: 'providerNo',
        title: '渠道编号',
        inputDes: '多个编号以英文逗号分隔'
      },
      // {
      //   name: 'ally',
      //   title: '第三方平台商户号'
      // },
      // {
      //   name: 'pcmPartkey',
      //   title: '第三方平台商户号密钥',
      //   // width: '40px'
      // },
      {
        name: 'used',
        title: '启用状态',
        type: 'select',
        otherOpts: {
          valueField: 'id',
          displayField: 'name',
          required: true,
          data: Observable.of(this.helper.getDictByKey('ENABLE_STATUS')),
        },
        render: this.onUseState.bind(this)
      },
      // {
      //   name: 'limitDay',
      //   title: '单日限额(元)',
      //   xtype: 'number'
      // },
      // {
      //   name: 'limitSingle',
      //   title: '单笔最大限额(元)',
      //   xtype: 'number'
      // },
      // {
      //   name: 'limitSingleMin',
      //   title: '单笔最小限额(元)',
      //   xtype: 'number'
      // },
      // {
      //   name: 'thirdAppid',
      //   title: '商户APPID'
      // },
      {
        name: 'settleCycle',
        title: '结算周期',
        type: 'select',
        otherOpts: {
          valueField: 'id',
          displayField: 'name',
          data: Observable.of(this.helper.getDictByKey('BALANCE_DATE')),
          required: true
        },
        render:(function(row: any, name: string){
          if(this.helper.isEmpty(row[name])){
            return '/'
          }
          return this.helper.dictTrans('BALANCE_DATE', row[name]);
        }).bind(this)
      },
      {
        name: 'settleRate',
        title: '结算费率(‰)',
        xtype: 'number',
        otherOpts: {
          required: true
        }
      }
    ];

    this.totalChannelColumns = [
      {
        name: 'bankNo',
        title: '银行',
        type: 'inputSearch',
        otherOpts: {
          required: true,
          displayFn: (function (value: any) {
            return value && value['name'];
          }).bind(this),
          optionDisplayFn: (function (value: any) {
            return value && value['name'] + '(' + value['orgNo'] + ')';
          }).bind(this),
          filterField: ['orgNo', 'name'],
          valueField: 'orgNo',
          onBeforClick: (function (value: any) {
            let flag: boolean = true;
            if (this.helper.isEmpty(value)) {
              this.snackBar.alert('请先输入过滤值！');
              flag = false;
            }
            this.spTotalOrganDb.params = _.extend(this.spTotalOrganDb.params, {name: value});
            // this.spOrganDb.params = {name:value};
            return flag;
          }).bind(this),
          onSelected: (function (row: any, data: any) {
            if (data && data.value) {
              row['bankName'] = data.value.name;
            }
          }).bind(this),
          dataSource: new InputSearchDatasource(this.spTotalOrganDb)
        },
        render: (function(row: any){
          if(this.helper.isEmpty(row['bankName'])){
            return '/';
          }
          return row['bankName']
        }).bind(this)
      },
      {
        name: 'bankProNo',
        title: '银行服务商编号',
        otherOpts: {
          disabled: true
        }
      },
      {
        name: 'applyState',
        title: '同步状态',
        type: 'select',
        otherOpts: {
          valueField: 'id',
          displayField: 'name',
          data: Observable.of(this.helper.getDictByKey('SUBMCH_SYNC_STATE')),
          disabled: true
        },
        render: (function(row: any){
          if(this.helper.isEmpty(row['applyState'])){
            return '/';
          }
          return this.helper.dictTrans('SUBMCH_SYNC_STATE', row['applyState']);
        }).bind(this)
      },
      {
        name: 'applyTime',
        title: '最近同步时间',
        xtype: 'datetime',
        otherOpts: {
          disabled: true
        },
      }
    ];
  }

  /**
   * 新增通道
   * @param channelTable
   */
  onNewChannel(channelTable: MdTableExtend){
    // // this.spOrganDb.params = {};
    // // 加载支付类型的数据
    // this.commonDBService.reloadTradeType.next({
    //   type: 'loadTradeType',
    //   params: {
    //     userNo: this._chanCode,
    //   }
    // });
    // let _that = this;
    // let timer = setTimeout(function(){
    //   // 所属机构为银行时 ，渠道信息里的所属银行不可选
    //   if(!_that.helper.hasConfigValueMatch('CLOUD_ULO_BANK_NO', _that.ctr.params['bankCode'])){
    //     channelTable.newRow({ agencyName: _that.ctr.params['bankName'], used: 1});
    //     _that.spOrganDb.params = { name: _that.ctr.params['bankCode'] };
    //     _that.spOrganDb.refreshChange.next(true);
    //     _that.channelColumns[1].otherOpts['disabled'] = () => true;
    //   }else{
    //     channelTable.newRow({used: 1});
    //     _that.spOrganDb.params = {};
    //   }
    //   clearTimeout(timer);
    // }, 500);

    // channelTable.newRow();
    let win = this.pupop.openWin(ULOSPChannelEditWinComponent, {
      title: '新增渠道信息',
      width: '1200px',
      height: '0',
      data: {
        userNo: this._chanCode, // 服务商编号
        agencyCode: this._bankCode, // 所属机构编号
        agencyName: this.oParams['bankName'], // 所属机构名称
        used: 1,
        channelDBdata: this.channelDB.data
      }
    });
    win.afterClosed().subscribe( res => {
      if(res){
        let row = this.helper.clone(res);
        row['isNewest'] = false;
        row['isNew'] = true;
        row['isEdit'] = false;
        channelTable.newRow(row);
        channelTable.dataSource.localRefreshSourceDataChange.next(true);
      }
    })
  }

  /**
   * 表格点击编辑按钮事件
   */
  onEditChannel(row: any) {
    let _data = this.helper.clone(row);
    _data['parentChanCode'] = this.oParams['parentChanCode'];
    _data['channelDBdata'] = this.channelDB.data;
    let win = this.pupop.openWin(ULOSPChannelEditWinComponent, {
      title: '编辑渠道信息',
      width: '1200px',
      height: '0',
      data: _data
    });
    win.afterClosed().subscribe( res => {
      if(!this.helper.isEmpty(res)){
        row = this.helper.clone(res);
        this.channelTable.editRowData(row);
        this.channelTable.dataSource.localRefreshSourceDataChange.next(true);
      }else{
        this.channelTable.database.restoreData(row);
      }
    })
  }

  /**
   * 返回上一步
   */
  public onLastStep() {
    let _params = {
      step: 2,
      isEdit: true,
      id: this.oParams['id'],
      orgId: this.oParams['orgId'],
      chanCode: this._chanCode,
      bankCode: this._bankCode,
      bankName: this.oParams['bankName'],
      parentChanCode: this.oParams['parentChanCode']
    };
    this.sidenavService.resetPageParams(_params);
    this.ctr.params = _params;
    this.ctr.onStep(2);
  }

  /**
   * 保存总通道配置、渠道信息、轮循配置、路由配置
   */
  onSaveChannels(){
    if(this.hasData()){
      let flag: boolean = false;
      let _msg: string;
      this.totalChannelDB.data.forEach(data => {
        data['proNo'] = this._chanCode;
        if(data['isEdit'] == true){
          flag = true;
          _msg = '您有正在编辑的总通道信息数据，请先确认或取消！';
        }
      });
      this.channelDB.data.forEach(data => {
        data['merchantId'] = this._chanCode;
        // data['orgId'] = _params['orgId'];
        // data['categoryType'] = null;
        // 剔除支付类型中括号与括号中的值
        let arr = this.helper.getDictByKey('MCH_TYPE');
        data['transType'] = this.helper.stringReplace(data['transType'], arr);
        if (!this.helper.isEmpty(data['limitDay'])) {
          data['limitDay'] *= 100;
        }
        if (!this.helper.isEmpty(data['limitSingleMin'])) {
          data['limitSingleMin'] *= 100;
        }
        if (!this.helper.isEmpty(data['limitSingle'])) {
          data['limitSingle'] *= 100;
        }
        if(this.helper.isEmpty(data['ptCenterName'])){
          flag = true;
          _msg = '通道类型不能为空';
        }
        if(data['isEdit'] == true){
          flag = true;
          _msg = '您有正在编辑的渠道信息数据，请先确认或取消！';
        }
      });
      if(flag){
        this.snackBar.alert(_msg);
        return false;
      }
      let _commitData1 = this.totalChannelDB.data.filter( data => data['isNewest'] !== true );
      let _commitData2 = this.channelDB.data.filter(data => data['isNewest'] !== true );
      let _commitData4: any;
      let post1 = this.spDetailDBService.saveTotalChannels(_commitData1);
      let post2 = this.spDetailDBService.saveChannelInfos(_commitData2);
      let post3 = this.spDetailDBService.updatepoil( {
        chanCode: this._chanCode,
        usePolling: this.helper.isEmpty(this.poil) ? 0 : this.poil,
      });
      if(this.ruleState){
        _commitData4 = {parentNo:this._chanCode,ruleState:1}
      }else{
        _commitData4 = this.winParams;
      }
      let post4 = this.spDetailDBService.saveTradeRule(_commitData4);
      Observable.forkJoin([post1, post2, post3, post4])
        .subscribe(results => {
          if(results && results[1] && results[1]['status'] == 200){
            this.snackBar.alert('保存通道信息成功！');
            let _params = {
              step: 4,
              isEdit: true,
              id: this.oParams['id'],
              orgId: this.oParams['orgId'],
              chanCode: this._chanCode,
              bankCode: this._bankCode,
              bankName: this.oParams['bankName'],
              parentChanCode: this.oParams['parentChanCode']
            };
            this.sidenavService.resetPageParams(_params);
            this.ctr.params = _params;
            this.ctr.onStep(4);
          }else{
            let _msg = '总通道配置：' + results[0]['message'] + '；渠道信息配置：' + results[1]['message'] + '；轮循配置：' + results[2]['message'] + '；路由配置：' + results[3]['message'];
            this.channelDB.data.forEach( data => {
              data['limitDay'] = data['limitDay'] && this.helper.shuntElement(data['limitDay']);
              data['limitSingleMin'] = data['limitSingleMin'] && this.helper.shuntElement(data['limitSingleMin']);
              data['limitSingle'] = data['limitSingle'] && this.helper.shuntElement(data['limitSingle']);
            });
            this.snackBar.alert(_msg);
          }
        });
    }
  };

  /**
   * 只保存渠道信息
   */
  onSaveChannelsOnly() {
    if(this.hasData()){
      let flag: boolean = false;
      let _msg: string;
      this.channelDB.data.forEach(data => {
        data['merchantId'] = this._chanCode;
        // data['orgId'] = _params['orgId'];
        // data['categoryType'] = null;
        // 剔除支付类型中括号与括号中的值
        let arr = this.helper.getDictByKey('MCH_TYPE');
        data['transType'] = this.helper.stringReplace(data['transType'], arr);
        if (!this.helper.isEmpty(data['limitDay'])) {
          data['limitDay'] *= 100;
        }
        if (!this.helper.isEmpty(data['limitSingleMin'])) {
          data['limitSingleMin'] *= 100;
        }
        if (!this.helper.isEmpty(data['limitSingle'])) {
          data['limitSingle'] *= 100;
        }
        if(this.helper.isEmpty(data['ptCenterName'])){
          flag = true;
          _msg = '通道类型不能为空';
        }
        if(data['isEdit'] == true){
          flag = true;
          _msg = '您有正在编辑的渠道信息数据，请先确认或取消！';
        }
      });
      if(flag){
        this.snackBar.alert(_msg);
        return false;
      }
      let _commitData = this.channelDB.data.filter(data => data['isNewest'] !== true );
      this.spDetailDBService.saveChannelInfos(_commitData)
        .subscribe( res => {
          if(res && res['status'] == 200){
            this.snackBar.alert('保存通道信息成功！');
            let _params = {
              step: 4,
              isEdit: true,
              id: this.oParams['id'],
              orgId: this.oParams['orgId'],
              chanCode: this._chanCode,
              bankCode: this._bankCode,
              bankName: this.oParams['bankName'],
              parentChanCode: this.oParams['parentChanCode']
            };
            this.sidenavService.resetPageParams(_params);
            this.ctr.params = _params;
            this.ctr.onStep(4);
          }else{
            this.channelDB.data.forEach( data => {
              data['limitDay'] = data['limitDay'] && this.helper.shuntElement(data['limitDay']);
              data['limitSingleMin'] = data['limitSingleMin'] && this.helper.shuntElement(data['limitSingleMin']);
              data['limitSingle'] = data['limitSingle'] && this.helper.shuntElement(data['limitSingle']);
            });
            this.snackBar.alert(res['message']);
          }
        })
    }
  }

  /**
   * 判断是否有数据
   */
  hasData():boolean{
    if(!this.helper.hasConfigValueMatch('CLOUD_ULO_BANK_NO', this._bankCode) ){
      if(this.channelDB.data && this.channelDB.data.length > 0){
        return true;
      }
    }else{
      if(this.channelDB.data && this.channelDB.data.length > 0 && this.totalChannelDB.data && this.totalChannelDB.data.length > 0){
        return true;
      }
    }
    return false;
  }

  /**
   * 新增总通道配置
   * @param channelTable
   */
  onNewTotalChannel(totalChannelTable: MdTableExtend) {
    totalChannelTable.newRow();
    this.spTotalOrganDb.params = {};
  }

  /**
   * 关联总通道配置表格点击编辑按钮事件
   * @param row
   */
  onEditSPTotalChannel(row: any) {
    if(!this.helper.isEmpty(row['bankNo'])) {
      this.spOrganDb.params = {name: row['bankNo']};
      this.spOrganDb.refreshChange.next(true);
    }
    /**
     * 重新根据行业类别加载支付类型的数据
     */
    this.commonDBService.reloadTradeType.next({
      type: 'loadTradeType',
      params:{
        userNo: this._chanCode,
        // categoryTypeChan: row['categoryType'],
        transId: row['transId'],
      }
    });
    /**
     * 重新根据支付类型及所属银行加载通道类型的数据
     */
    this.commonDBService.reload.next({
      type: 'loadCenter',
      params:{bankNo: row['bankNo'],
        transId: row['transId'],
        parentChanCode: this.oParams['parentChanCode']
      }
    });
  }

  /**
   * 保存总通道配置（单条）
   */
  onSaveTotalChannel() {
    this.spTotalOrganDb.params = {};
  }

  /**
   * 退出总通道配置弹窗
   */
  onCancelTotalChannel() {
    this.spTotalOrganDb.params = {};
  }

  /**
   * 总通道配置保存前事件
   * @param row
   * @returns {boolean}
   */
  onBeforeSaveTotalChannel(row) {
    let _msg: string;
    let hasBank = this.totalChannelDB.data.find((item)=>{
      if(this.helper.isEmpty(row['bankName']) || this.helper.isEmpty(row['bankNo'])){
        _msg = '请选择银行';
        return true;
      }
      if(!(row['table_id'] == item['table_id']) && (row['bankNo'] == item['bankNo'] || row['bankName'] == item['bankName'])){
        _msg = '银行不能重复，请调整！';
        return true;
      }
      return false;
    });
    if(hasBank){
      this.snackBar.alert(_msg);
      return false;
    }
  }

  /***
   * 修改路由配置
   */
  onUsed(){
    if(!this.ruleState){
      this.forbidParams = {parentNo: this._chanCode, ruleState: 1};
      this.ruleState =  this.forbidParams.ruleState;
      this.tradeType = '--';
    }else{
      let win = this.pupop.openWin(ULOSpTradeRuleWinComponent, {
        title: '正在操作停用业务路由，请选择一种支付类型进行交易！',
        width: '500px',
        height: '0',
        data:{
          parentNo: this._chanCode,
          ruleState: this.ruleState,
          step: this.oParams['step']
        }
      });
      win.afterClosed().subscribe(result => {
        if(!this.helper.isEmpty(result)){
          this.winParams = result;
          this.ruleState =  this.winParams['ruleState'];
          this.tradeType =  this.winParams['tradeType'];
        }
      })
    }
  }

  /**
   * 初始化轮循配置
   */
  loadpoil(params) {
    this.spDetailDBService.loadpoil(params).subscribe( res => {
      if(res && res['status'] == 200) {
        this.poil = res['data']['usePolling'];
      }
    })
  }

  /**
   * 修改轮循配置
   */
  changePoil(){
    let _msg = this.poil == 0 ? '是否启用轮循' : '是否禁用轮循';
    let _poil = this.poil == 0 ? 1 : 0;
    let _confirm = this.pupop.confirm({
      message: _msg ,
      confirmBtn: "确认",
      cancelBtn: "取消"
    });
    _confirm.afterClosed().subscribe((res) => {
      if (res == Confirm.YES) {
        this.poil = _poil;
      }
    })
  }

  /**
   * 切换启用状态
   */
  onUseState(row:any,name:string,cell:any,cellEl:any) {
    let _cellEl = cellEl.nativeElement;
    let _jQEl = jQuery(_cellEl);
    if(_cellEl.childElementCount > 0){
      _jQEl.html('').empty();
    }
    let _span = jQuery('<span></span>');
    let _i = jQuery('<i class="fa"></i>');
    if(row[name] == 1){
      _span.html('启用');
      _i.addClass('fa-pause');
      cell.bgColor = 'success-bg';
    }else if(row[name] == 0){
      _span.html('禁用');
      _i.addClass('fa-toggle-right');
      cell.bgColor = 'danger-bg';
    }else{
      cell.bgColor = 'none';
      return '/';
    }
    _i.bind('click',this.onChangeStatus.bind(this,row,name,cell,_span,_i));
    _jQEl.append(_span ,_i);
  }

  /**
   * 切换启用状态请求
   */
  onChangeStatus(row: any, name, cell:any, cellEl:any,_i:any): void {

    let _confirm = this.pupop.confirm({
      message: "您确认要变更当前状态吗？",
      confirmBtn: "确认",
      cancelBtn: "取消"
    });
    _confirm.afterClosed().subscribe(res => {
      if (res == Confirm.YES) {
        if(row[name] === 0){
          row[name] = 1;
        }else {
          row[name] = 0;
        }
        this.channelTable && this.channelTable.editRowData(row);
      }
    });
  }

  private headlerNumberNull(val: any, row: any, fieldName: string): any {
    if (this.helper.isEmpty(val)) {
      row[fieldName] = undefined;
      return null;
    }
    return val;
  }

  public judgeSign(num) {
    let reg = new RegExp('^-?[0-9]*.?[0-9]*$');
    if ( reg.test(num) ) {
      let absVal = Math.abs(num);
      // return num==absVal?'是正数':'是负数';
      return num==absVal? false: true;
    }
    else {
      // return '不是数字';
      return false;
    }
  }
}
