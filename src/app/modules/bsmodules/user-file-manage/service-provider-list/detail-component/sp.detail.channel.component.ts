import {Component, LOCALE_ID, Inject, OnInit, ViewChild} from "@angular/core";
import {ULODetail} from "../../../../../common/components/detail/detail";
import {Column} from "../../../../../common/components/table/table-extend-config";
import {SPDetailDBService} from "../sp.db.service";
import {ISidenavSrvice} from "../../../../../common/services/isidenav.service";
import {
  LoadTableDbService,
  CommonDBService,
  LoadTableDbService2,
  LoadBankOrgDBService,
  LoadBankLinkNo
} from "../../../../../common/db-service/common.db.service";
import {MdPupop, Confirm, MdSnackBar} from "@angular/material";
import {HelpersAbsService} from "../../../../../common/services/helpers.abs.service";
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/of";
import {InputSearchDatasource} from "../../../../../common/services/impl/input.search.datasource";
import {ULODetailContainer} from "../../../../../common/components/detail/detail-container";
import * as moment from "moment";
import {ULOSpTradeRuleWinComponent} from "../sp.tradeRule.win.component";
import {ULOSPChannelEditWinComponent} from "../edit-component/sp.channel.edit.win.component";
import {ULOSPChannelDetailComponent} from "../edit-component/sp.channel.detail.component";

@Component({
  selector: 'ulo-detail-channel',
  templateUrl: 'sp.detail.channel.component.html',
  providers:[
    LoadTableDbService,
    LoadTableDbService2,
    SPDetailDBService,
    CommonDBService,
    LoadBankOrgDBService,
    LoadBankLinkNo
  ]
})

export class ULOSPDetailChannelComponent implements OnInit {

  @ViewChild('spDetail') spDetail: ULODetail;
  public ctr: ULODetailContainer;
  public ruleState: any;
  public tradeType: any;
  public poil: any;
  public oParams: any;
  public _chanCode: any;
  public _bankCode: any;
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
      btnName:'detail',
      btnDisplay:"详情",
      hide: (function (row: any) {
        if (this.helper.btnRole('LOOKCHANRATEINFO')) {
          return false;
        }
        return true;
      }).bind(this),
      click:this.onToDetail.bind(this)
    },
    {
      btnName:'del',
      hide: (function (row: any) {
        if (this.helper.btnRole('DELCHANRATEINFO') && !row['isEdit']) {
          return false;
        }
        return true;
      }).bind(this),
      click: this.onDeleteChannel.bind(this)
    },{
      btnName:'edit',
      hide:((row:any)=>{
        if(this.helper.btnRole('SPPGEDIT') && !row['isEdit']){
          return false;
        }
        return true;
      }).bind(this),
      click: this.onEditChannel.bind(this)
    }]
  };

  /**
   * 总通道配置列表
   * @type {[{name: string; title: string},{name: string; title: string},{name: string; title: string},{name: string; title: string}]}
   */
  public totalChannelColumns: Array<Column>;

  public totalChannelWinOption:any = {
    title: '总通道配置',
    isRequser: true,
  };
  /**
   * 总通道按钮配置
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
        {
          btnDisplay: '同步',
          hide: false,
          click: this.syncApplyBank.bind(this)
        }
      ]
  };

  constructor(
    public channelDB: LoadTableDbService,
    public totalChannelDB: LoadTableDbService2,
    public sidenavSrvice: ISidenavSrvice,
    public snackBar: MdSnackBar,
    @Inject(LOCALE_ID) public _locale: string,
    public spDetailDBService: SPDetailDBService,
    public pupop: MdPupop,
    public helper: HelpersAbsService,
    public commonDBService: CommonDBService,
    public spOrganDb: LoadBankOrgDBService,
    public spTotalOrganDb: LoadBankOrgDBService
  ) {

  }

  ngOnInit() {
    this.oParams = this.ctr && this.ctr.params;
    this._chanCode = this.oParams['chanCode'];
    this._bankCode = this.oParams['bankCode'];
    this.loadData();
    this.channelColumns =  [
      {
        name: 'transId',
        title: '支付类型',
        render:(function(row: any) {
          if(this.helper.isEmpty(row['transType'])){
            return '/';
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
        render:(function(row: any){
          if(this.helper.isEmpty(row['agencyName'])){
            return '/';
          }
          return row['agencyName'];
        }).bind(this)
      },
      {
        name: 'ptCenterId',
        title: '通道类型',
        render:(function(row: any, name: string){
          return this.helper.isEmpty(row['ptCenterName']) ? '/' : row['ptCenterName'];
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
      //   title: '第三方平台商户号密钥'
      // },
      {
        name: 'used',
        title: '启用状态',
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
        render:(function(row: any, name: string){
          return this.helper.dictTrans('BALANCE_DATE', row[name]);
        }).bind(this)
      },
      {
        name: 'settleRate',
        title: '结算费率(‰)',
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
          return row['bankName'];
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

  public loadData(){
    let params = this.sidenavSrvice.getPageParams();
    if(params){
      if(this.helper.hasConfigValueMatch('CLOUD_ULO_BANK_NO', this._bankCode)){
        // 初始化服务商总通道信息
        this.loadTotalChannelInfo({ proNo: params['chanCode'] });
        // 初始化服务商轮循配置
        this.loadpoil( {chanCode: params['chanCode'] } );
        // 初始化服务商路由配置
        this.loadTradeRule({ parentNo: params['chanCode'] });
      }
      // 初始化服务商通道信息
      this.loadChannelInfo({ merchantId: params['chanCode'] });
    }
  }

  /**
   * 初始化服务商通道信息
   */
  public loadChannelInfo(params){
    this.spDetailDBService.loadChannelInfos(params).subscribe(res => {
      if(res && res['status'] == 200){
        let data = res['data'];
        data && data.forEach((item,ind) => {
          item['limitDay'] = item['limitDay'] && this.helper.shuntElement(item['limitDay']);
          item['limitSingle'] = item['limitSingle'] && this.helper.shuntElement(item['limitSingle']);
          item['limitSingleMin'] = item['limitSingleMin'] && this.helper.shuntElement(item['limitSingleMin']);
        });
        this.channelDB.dataChange.next(data);
      }
    });
  }

  /**
   * 新增服务商渠道信息（单条）
   * @param table
   * @param e
   */
  public onNewChannel(){
    let win = this.pupop.openWin(ULOSPChannelEditWinComponent, {
      title: '新增渠道信息',
      width: '1200px',
      height: '0',
      data: {
        userNo: this._chanCode, // 服务商编号
        agencyCode: this.oParams['bankCode'], // 所属机构编号
        agencyName: this.oParams['bankName'], // 所属机构名称
        used: 1,
        channelDBdata: this.channelDB.data
      }
    });
    win.afterClosed().subscribe( result => {
      this.loadChannelInfo({ merchantId: this._chanCode });
    })
  }

  /**
   * 编辑渠道信息（单条）
   * @param row
   */
  public onEditChannel(row: any) {
    let _data = this.helper.clone(row);
    _data['parentChanCode'] = this.oParams['parentChanCode'];
    _data['channelDBdata'] = this.channelDB.data;
    // _data = _.extend(row, _parents);
    let win = this.pupop.openWin(ULOSPChannelEditWinComponent, {
      title: '编辑渠道信息',
      width: '1200px',
      height: '0',
      data: _data
    });
    win.afterClosed().subscribe( results => {
      this.loadChannelInfo({ merchantId: this._chanCode });
    })
  }

  /**
   * 删除服务商渠道信息
   * @param row
   */
  public onDeleteChannel(row: any) {
    let _msg: string;
    if(this.helper.isEmpty(row['ptCenterName'])){
      _msg = '您确认要删除本条未配置通道类型的渠道信息吗？';
    }else {
      _msg = '您确认要删除【' + row['ptCenterName'] + '】的渠道信息配置吗？';
    }
    let deletePupop = this.pupop.confirm({
      width: '500px',
      message: _msg
    });
    deletePupop.afterClosed().subscribe(result => {
      let _id = '' + row['id'];
      let _merchantId = '' + row['merchantId'];
      let _transId = row['transId'];
      if (result == Confirm.YES){
        this.spDetailDBService.deleteChannelInfo({
          id: _id,
          merchantId: _merchantId,
          transId: _transId
        }).subscribe(res => {
          if (res && res['status'] == 200) {
            this.snackBar.alert('删除成功！');
            this.loadChannelInfo({ merchantId: this._chanCode });
          } else {
            this.snackBar.alert(res['message']);
          }
        });
      }
    })
  }

  /**
   * 初始化总通道配置
   */
  public loadTotalChannelInfo(params){
    this.spDetailDBService.loadTotalChannels(params).subscribe(res => {
      if(res && res['status'] == 200){
        let data = res['data'];
        data && data.forEach((item,ind)=>{
          data[ind]['applyTime'] = !item['applyTime'] ? item['applyTime'] : moment(item['applyTime']).format('YYYY-MM-DD HH:mm:ss');
        });
        this.totalChannelDB.dataChange.next(data);
      }
    });
  }

  /**
   * 新增总通道配置
   * @param table
   * @param e
   */
  public onNewTotalChannel(totalChannelTable) {
    // this.spOrganDb.params = {};
    totalChannelTable.newRow();
    this.spTotalOrganDb.params = {};
  }

  /**
   * 点击编辑总通道配置按钮触发前事件
   * @param row
   */
  public onEditSPTotalChannel(row: any) {
    if(!this.helper.isEmpty(row['bankNo'])) {
      this.spTotalOrganDb.params = {name: row['bankNo']};
      this.spTotalOrganDb.refreshChange.next(true);
    }
  }

  /**
   * 保存总通道配置
   * @param value
   */
  public onSaveTotalChannel(value: any) {
    if(value){
      // if(this.helper.isEmpty(value['bankName'])){
      //   this.snackBar.alert('银行信息填写错误');
      //   return;
      // }
      value['proNo'] = this._chanCode;
      let _val = this.helper.clone(value, ['applyTime' , 'appState']);
      return this.spDetailDBService.editTotalChannel(_val).map( res => {
        if(res && res['status'] == 200){
          this.snackBar.alert('保存总通道信息成功！');
          this.loadTotalChannelInfo({ proNo: this._chanCode }); // 保存成功时刷新表格
          return res;
        }else{
          this.snackBar.alert(res['message']);
          value['isEdit'] = true;
          return undefined;
        }
      })
    }
  }

  /**
   * 退出总通道配置
   * @param value
   */
  public onCancelTotalChannel() {
    this.spTotalOrganDb.params = {};
    this.spOrganDb.params = {};
    this.loadTotalChannelInfo({ proNo: this._chanCode }); // 刷新表格
  }

  /**
   * 表格点击确定按钮保存之前触发事件
   */
  public onBeforeSaveTotalChannel(row: any) {
    let _msg: string;
    let hasBank = this.totalChannelDB.data.find((item) => {
      if(this.helper.isEmpty(row['bankName']) || this.helper.isEmpty(row['bankNo'])){
        _msg = '请选择银行';
        return true;
      }
      if (!(row['table_id'] == item['table_id']) && (row['bankNo'] == item['bankNo'] || row['bankName'] == item['bankName'])) {
        _msg = '银行不能重复，请调整！';
        return true;
      }
      return false;
    });
    if (hasBank) {
      this.snackBar.alert(_msg);
      return false;
    }
  }

  /**
   * 同步关联银行
   */
  public syncApplyBank(row: any){
    let _confirm = this.pupop.confirm({
      message: '您确定需要同步【' + row['bankName'] + '】吗？',
      confirmBtn: '确认',
      cancelBtn: '取消',
      width: '580px'
    });
    _confirm.afterClosed().subscribe( res => {
      if(res == Confirm.YES){
        this.spDetailDBService
          .syncTotalChannel({
            proNo: row['proNo'],
            bankNo: row['bankNo']
          })
          .subscribe( res => {
            if(res && res['status'] == 200){
              this.snackBar.alert('同步成功!');
              this.loadTotalChannelInfo({ proNo: this._chanCode }); // 刷新表格
            }else{
              this.snackBar.alert(res['message']);
            }
          })
      }
    });
  }

  /**
   * 初始化路由配置
   */
  loadTradeRule(params) {
    this.spDetailDBService.loadTradeRule(params).subscribe( res => {
      if(res && res['status'] == 200) {
        // "data":{"id":1,"parentNo":"26101077","ruleState":0,"tradeId":"","tradeType":"","updateTime":1513132557000}
        this.ruleState = res['data'] ? res['data']['ruleState'] : 1;
        this.tradeType = res['data'] ? res['data']['tradeType'] : '--';
      }
    })
  }

  /**
   * 切换路由配置
   */
  onUsed() {
    if(!this.ruleState){
      this.spDetailDBService.saveTradeRule({parentNo: this._chanCode, ruleState: 1})
        .subscribe( res => {
          if(res && res['status'] == 200) {
            this.ruleState = res['data'] && res['data']['ruleState'];
            this.tradeType = res['data'] && res['data']['tradeType'];
          }
        })
    }else{
      let win = this.pupop.openWin(ULOSpTradeRuleWinComponent, {
        title: '正在操作停用业务路由，请选择一种支付类型进行交易！',
        width: '500px',
        height: '0',
        data: {
          parentNo: this._chanCode,
          ruleState: this.ruleState
        }
      });
      win.afterClosed().subscribe( result => {
        this.spDetailDBService.loadTradeRule({ parentNo: this._chanCode }).subscribe( res => {
          if (res && res['status'] == 200) {
            if(!this.helper.isEmpty(this.ruleState)){
                this.ruleState = res['data'] ? res['data']['ruleState'] : 1;
                this.tradeType = res['data'] ? res['data']['tradeType'] : '--';
            }else{
              this.ruleState = 1;
              this.tradeType = '--';
            }
          }
        })
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
   * 切换轮循配置
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
        this.spDetailDBService.updatepoil({chanCode: this._chanCode, usePolling: _poil})
          .subscribe( res => {
            if(res && res['status'] == 200) {
              this.loadpoil({ chanCode: this._chanCode});
            }
          })
      }
    })
  }

  /**
   * 切换启用状态
   */
  onUseState(row:any,name:string,cell:any,cellEl:any) {
    let _cellEl = cellEl.nativeElement;
    if(_cellEl.childElementCount > 0){
      return;
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
    if(this.helper.btnRole('PROCHANGERATESTATE')){
      _i.bind('click',this.onChangeStatus.bind(this,row,name,cell,_span,_i));
    }
    jQuery(_cellEl).html('').empty().append(_span ,_i);
  }

  /**
   * 切换启用状态请求
   */
  onChangeStatus(row: any, e: MouseEvent): void {
    let _confirm = this.pupop.confirm({
      message: "您确认要变更当前状态吗？",
      confirmBtn: "确认",
      cancelBtn: "取消"
    });
    _confirm.afterClosed().subscribe(res => {
      if (res == Confirm.YES) {
        let _used = row['used'];
        if(_used == 1){
          _used = 0;
        }else if(_used == 0) {
          _used = 1
        }
        this.spDetailDBService.saveState({id: row['id'], used: _used}).subscribe((_res) => {
          if (_res && _res['status'] == 200) {
            this.snackBar.alert('操作成功!');
            this.loadChannelInfo({ merchantId: this._chanCode });
          } else {
            this.snackBar.alert(_res['message']);
          }
        });
      }
    });
  }

  /**
   * 渠道信息详情(单条)
   */
  onToDetail(row: any) {
    let win = this.pupop.openWin(ULOSPChannelDetailComponent, {
      title: '渠道信息详情',
      width: '1000px',
      height: '0',
      data: row
    });
    win.afterClosed().subscribe( result => {
      this.loadChannelInfo({ merchantId: this._chanCode });
    })
  }
}
