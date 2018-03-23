import {Component, OnInit, ViewChild} from "@angular/core";
import {
  LoadTableDbService, LoadTableDbService2,
  CommonDBService
} from "../../../../../common/db-service/common.db.service";
import {ISidenavSrvice} from "../../../../../common/services/isidenav.service";
import {SPDetailDBService} from "../sp.db.service";
import {MdPupop, MdSelectChange, MdSnackBar} from "@angular/material";
import {SPDetailProductFormComponent} from "./sp.detail.product.form.component";
import {HelpersAbsService} from "../../../../../common/services/helpers.abs.service";
import {MdTableExtendConfig} from "../../../../../common/components/table/table-extend-config";
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/of";
import "rxjs/add/observable/timer";
import {MdTableExtend} from "../../../../../common/components/table/table-extend";
import {Subscription} from "rxjs";
import {ULODetailContainer} from "../../../../../common/components/detail/detail-container";
@Component({
  selector:'ulo-sp-detail-product',
  templateUrl:'sp.detail.product.component.html',
  providers:[LoadTableDbService,SPDetailDBService,CommonDBService]
})
export class ULOSPDetailProductComponent implements OnInit{

  @ViewChild('spProdTable') spProdTable:MdTableExtend;
  public ctr: ULODetailContainer;

  public spProdColumns:Array<any> = [{
    title:'产品名称',
    name:'combName'
  },{
    title:'产品代码',
    name:'combNo'
  },{
    title:'开通状态',
    name:'state',
    render:(function(row:any,name:string,cell:any){
      let _state = row[name];
      switch(_state){  // [{"id":0,"name":"待审核"},{"id":1,"name":"已开通"},{"id":2,"name":"已关闭"},{"id":3,"name":"未开通"},{"id":4,"name":"驳回"}]
        case 0:
          cell.bgColor = 'warning-bg';
          break;
        case 2:
          cell.bgColor = 'danger-bg';
          break;
        case 1:
          cell.bgColor = 'success-bg';
          break;
        case 3:
        case 4:
          cell.bgColor = 'disables-bg';
          break;
      }
      return this.helper.dictTrans('PRODUCT_OPEN_STATE',_state);
    }).bind(this)
  }];



  /**
   * 产品列表按钮配置
   */
  public spProdActions:any = {
      actions:[{
        btnName:'edit',
        hide:true
      },{
        btnName:'del',
        hide:true
      },{
        btnDisplay:'编辑提交',
        hide:((row:any,target:any)=>{
          if(!this.helper.btnRole('SPPRODCFGCOMMIT')){
            return true;
          }

          if(!this.helper.hasConfigValueMatch('CLOUD_ULO_BANK_NO', this.bankCode)){
            return true;
          }
          let detailTable = target && target.detailTables[row['table_id']];
          if(row['state'] == 3 || !detailTable || (detailTable != undefined && detailTable.database != undefined && detailTable.database.previousValues != undefined && detailTable.database.previousValues.length == 0)){
            return true;
          }
          return false;
        }).bind(this),
        click:(function(row:any){
          const detailTable = this.spProdTable.detailTables[row['table_id']];
          if(detailTable){
            let flag: boolean = false;
            let tableData = this.spProdTable.detailTables[row['table_id']].database.data;
            tableData.forEach(_data=>{
              if(_data['isEdit'] == true){
                flag = true;
              }
            });
            if(flag){
              this.snackBar.alert('您有正在编辑的数据，请先确认或取消！');
              return false;
            }
            let data = detailTable.database && detailTable.database.data;
            if(data){//判断是否修改了数据，没有就不需要提交到后端
               this.spDetailDBService.saveSPProdCfgs({id:row['id'],tradetypes:data}).subscribe(res=>{
                 if(res && res['status'] == 200){
                   this.snackBar.alert('提交产品配置信息成功！');
                   this.refreshProdTable();
                 }else{
                   this.snackBar.alert(res['message']);
                 }
               });
            }
          }
        }).bind(this)
      },{
        btnDisplay:'新增',
        hide:((row:any,target:any)=>{
          if(!this.helper.btnRole('SPADDPRODPAYTYPE')){
            return true;
          }
          if(!this.helper.hasConfigValueMatch('CLOUD_ULO_BANK_NO', this.bankCode)){
            return true;
          }
          if(row['state'] == 0){
            return true;
          }
          return false;
        }).bind(this),
        click:((row:any,cell:any,e:any,target:any)=>{
          let detailTable = target && target.detailTables[row['table_id']];
          if(!detailTable){
            let mdRow = jQuery(e.target).parents('md-row');
            mdRow.trigger('click');
            let trimerSub:Subscription = Observable.timer(1000).subscribe(()=>{
              detailTable = target && target.detailTables[row['table_id']];
              detailTable && detailTable.newRow({shareRule:1,used:1,fixFloatRate:0});
              trimerSub.unsubscribe();
            });
          }else {
            detailTable && detailTable.newRow({shareRule:1,used:1,fixFloatRate:0});
          }
        }).bind(this)
      },{
        btnDisplay:'关闭产品',//[{"id":0,"name":"待审核"},{"id":1,"name":"已开通"},{"id":2,"name":"已关闭"},{"id":3,"name":"未开通"}]
        hide:(function(row:any,target:any){
          if(!this.helper.btnRole('SPCLOSEPROD')){
            return true;
          }
          if(this.helper.hasConfigValueMatch('CLOUD_ULO_BANK_NO', this.bankCode)) {
            let detailTable = target && target.detailTables[row['table_id']];
            if (detailTable != undefined && detailTable.database != undefined && detailTable.database.previousValues != undefined && detailTable.database.previousValues.length != 0) {
              return true;
            }
          }

          if(row['state'] == 1 || row['state'] == 4){
            return false;
          }
          return true;
        }).bind(this),
        click:(function(row:any){
          const detailTable = this.spProdTable.detailTables[row['table_id']];
          if(detailTable){
            let flag: boolean = false;
            let tableData = this.spProdTable.detailTables[row['table_id']].database.data;
            tableData.forEach(_data=>{
              if(_data['isEdit'] == true){
                flag = true;
              }
            });
            if(flag){
              this.snackBar.alert('您有正在编辑的数据，请先确认或取消！');
              return false;
            }
          }
          if(row['state'] == 1 || row['state'] == 4){
              this.spDetailDBService.saveSPProdClose({id:row['id']}).subscribe(res=>{
                if(res && res['status'] == 200){
                  this.snackBar.alert('产品关闭成功！');
                  this.refreshProdTable();
                }else{
                  this.snackBar.alert(res['message']);
                }
              });
          }
        }).bind(this)
      },{
        btnDisplay:'开通产品',
        hide:(function(row:any,target:any){
          if(!this.helper.btnRole('SPOPENPROD')){
            return true;
          }

          if(row['state'] == 3){//当产品状态为 未开通 时，显示开通产品按钮
            return false;
          }
          return true;
        }).bind(this),
        click:(function(row:any){
          const detailTable = this.spProdTable.detailTables[row['table_id']];
          if(detailTable){
            let flag: boolean = false;
            let tableData = this.spProdTable.detailTables[row['table_id']].database.data;
            tableData.forEach(_data=>{
              if(_data['isEdit'] == true){
                flag = true;
              }
            });
            if(flag){
              this.snackBar.alert('您有正在编辑的数据，请先确认或取消！');
              return false;
            }
          }
          if(row['state'] == 3){
            this.spDetailDBService.saveSPProdOpen({userNo:row['userNo'],combId:row['id'],tradetypes:detailTable && detailTable.database.data}).subscribe(res=>{
              if(res && res['status'] == 200){
                this.snackBar.alert('开通产品成功！');
                this.refreshProdTable();
              }else{
                this.snackBar.alert(res['message']);
              }
            });
          }
        }).bind(this)
      },{
        btnDisplay:'通过',
        hide:(function(row:any,target: any){
          if(!this.helper.btnRole('SPPRODEXAMINE')){
            return true;
          }

          if(this.helper.hasConfigValueMatch('CLOUD_ULO_BANK_NO', this.bankCode)){
            let detailTable = target && target.detailTables[row['table_id']];
            if(detailTable != undefined && detailTable.database != undefined && detailTable.database.previousValues != undefined && detailTable.database.previousValues.length != 0){
              return true;
            }
          }


          if(row['state'] == 0){ //当产品状态为 待审核 时，显示通过与拒绝按钮
            return false;
          }
          return true;
        }).bind(this),
        click:(function(row:any){
          const detailTable = this.spProdTable.detailTables[row['table_id']];
          if(detailTable){
            let flag: boolean = false;
            let tableData = this.spProdTable.detailTables[row['table_id']].database.data;
            tableData.forEach(_data=>{
              if(_data['isEdit'] == true){
                flag = true;
              }
            });
            if(flag){
              this.snackBar.alert('您有正在编辑的数据，请先确认或取消！');
              return false;
            }
          }
          if(row['state'] == 0){
            this.spDetailDBService.saveSPProdExamine({id:row['id'],state:1}).subscribe(res=>{
              if(res && res['status'] == 200){
                this.snackBar.alert('审核通过！');
                this.refreshProdTable();
              }else{
                this.snackBar.alert(res['message']);
              }
            });
          }
        }).bind(this)
      },{
        btnDisplay:'拒绝',
        hide:(function(row:any,target:any){
          if(!this.helper.btnRole('SPPRODREFUSE')){
            return true;
          }

          if(this.helper.hasConfigValueMatch('CLOUD_ULO_BANK_NO', this.bankCode)) {
            let detailTable = target && target.detailTables[row['table_id']];
            if (detailTable != undefined && detailTable.database != undefined && detailTable.database.previousValues != undefined && detailTable.database.previousValues.length != 0) {
              return true;
            }
          }

          if(row['state'] == 0){ //当产品状态为 待审核 时，显示审核与拒绝按钮
            return false;
          }
          return true;
        }).bind(this),
        click:(function(row:any){
          const detailTable = this.spProdTable.detailTables[row['table_id']];
          if(detailTable){
            let flag: boolean = false;
            let tableData = this.spProdTable.detailTables[row['table_id']].database.data;
            tableData.forEach(_data=>{
              if(_data['isEdit'] == true){
                flag = true;
              }
            });
            if(flag){
              this.snackBar.alert('您有正在编辑的数据，请先确认或取消！');
              return false;
            }
          }
          if(row['state'] == 0){
            this.spDetailDBService.saveSPProdExamine({id:row['id'],state:4}).subscribe(res=>{
              if(res && res['status'] == 200){
                this.snackBar.alert('审核拒绝！');
                this.refreshProdTable();
              }else{
                this.snackBar.alert(res['message']);
              }
            });
          }
        }).bind(this)
      },{
        btnDisplay:'重新开通',
        hide:(function(row:any,target:any){
          if(!this.helper.btnRole('SPRESETPROD')){
            return true;
          }

          if(this.helper.hasConfigValueMatch('CLOUD_ULO_BANK_NO', this.bankCode)){
            let detailTable = target && target.detailTables[row['table_id']];
            if(detailTable != undefined && detailTable.database != undefined && detailTable.database.previousValues != undefined && detailTable.database.previousValues.length != 0){
              return true;
            }
          }

          if(row['state'] == 2 || row['state'] == 4){//当产品状态为 已关闭 时，显示重新开通按钮
            return false;
          }
          return true;
        }).bind(this),
        click:(function(row:any){
          const detailTable = this.spProdTable.detailTables[row['table_id']];
          if(detailTable){
            let flag: boolean = false;
            let tableData = this.spProdTable.detailTables[row['table_id']].database.data;
            tableData.forEach(_data=>{
              if(_data['isEdit'] == true){
                flag = true;
              }
            });
            if(flag){
              this.snackBar.alert('您有正在编辑的数据，请先确认或取消！');
              return false;
            }
          }
          if(row['state'] == 2 || row['state'] == 4){
            this.spDetailDBService.saveSPProdResetOpen({id:row['id']}).subscribe(res=>{
              if(res && res['status'] == 200){
                this.snackBar.alert('重新开通成功！');
                this.refreshProdTable();
              }else{
                this.snackBar.alert(res['message']);
              }
            });
          }
        }).bind(this)
      }]
  };

  //产品明细配置
  public spProdDetailCfg:MdTableExtendConfig = {
    columns:[{
      name:'transId',
      title:'支付类型',
      type:'select',
      otherOpts:{
        valueField:'transId',
        displayField:'transType',
        disabled:((row:any)=>{
          if(row['isNewest'] === true){
            return false;
          }
          return true;
        }),
        data:this.commonDBService.loadTransApi({}),
        onChange:(function (row,change:MdSelectChange) {
          row['transType'] = change.source.triggerValue;
        }).bind(this),
        required:true
      },
      render:(function(row:any,name:string){
        return row['transType'];
      }).bind(this)
    },{
      name: 'categoryType',
      title: '行业类别',
      type: 'select',
      otherOpts: {
        valueField: 'id',
        displayField: 'name',
        data: Observable.of(this.helper.getDictByKey('MCH_TYPE')),
        required: true
      },
      render: (function(row: any, name: string){
        if(this.helper.isEmpty(row[name])){
          return '/';
        }
        return this.helper.dictTrans('MCH_TYPE', row[name]);
      }).bind(this)
    },{
      name:'limitDay',
      title:'单日限额（元）',
      xtype: 'number',
      render:(function(row:any,name:string){
        let _mon = row[name];
        if(this.helper.isEmpty(_mon)){
          _mon = '/';
        }else{
          _mon = this.helper.shuntElement(_mon);
        }
        return _mon;
      }).bind(this)
    },{
      name:['limitSingleMin','limitSingle'],
      title:'单笔限额（元）',
      xtype: 'number',
      firstTitle:'单笔最小',
      lastTitle:'单笔最大',
      width:'100px',
      type:'inputGroup',
      render:(function(row:any,name:string){
        let _min = row[name[0]];
        let _max = row[name[1]];
        if (this.helper.isEmpty(_min)) {
          _min = ' / ';
        } else {
          _min = this.helper.shuntElement(_min);
        }
        if (this.helper.isEmpty(_max)) {
          _max = ' / ';
        } else {
          _max = this.helper.shuntElement(_max);
        }
        return _min + ' - ' + _max;
      }).bind(this)
    },{
      name:'settleRate',
      title:'费率(‰)',
      xtype: 'number',
      otherOpts:{
        required:true
      },
      render:(function(row:any,name:string){
        return row[name];
      }).bind(this)
    },{
      name: 'fixFloatRate',
      title: '费率类型',
      type: 'select',
      otherOpts: {
        valueField: 'id',
        displayField: 'name',
        required:true,
        data: Observable.of(this.helper.getDictByKey('RATE_TYPE'))
      },
      render: (function (row: any, name: string) {
        return this.helper.isEmpty(row[name]) ? '/':this.helper.dictTrans('RATE_TYPE', row[name]);
      }).bind(this)
    },{
      name:'settleCycle',
      title:'结算/分润周期',
      type:'select',
      otherOpts:{
        valueField:'id',
        displayField:'name',
        data:Observable.of(this.helper.getDictByKey('BALANCE_DATE')),
        required:true
      },
      render:(function(row:any,name:string){
        return this.helper.dictTrans('BALANCE_DATE',row[name]);
      }).bind(this)
    },{
      name:'shareRule',
      title:'分润规则',
      type:'select',
      otherOpts:{
        valueField:'id',
        displayField:'name',
        data:Observable.of(this.helper.getDictByKey('PAYCENTER_CH_TYPE'))
      },
      render:(function(row:any,name:string){
        return this.helper.dictTrans('PAYCENTER_CH_TYPE',row[name]);
      }).bind(this)
    },{
      name:'used',
      title:'状态',
      type:'select',
      otherOpts:{
        valueField:'id',
        displayField:'name',
        data:Observable.of(this.helper.getDictByKey('ENABLE_STATUS'))
      },
      render:(function(row:any,name:string,cell:any){
        let _state = row[name];
        switch(_state){
          case 0:
            cell.bgColor="danger-bg"
            break;
          case 1:
            cell.bgColor="success-bg"
            break;
        }
        return this.helper.dictTrans('ENABLE_STATUS',_state);
      }).bind(this)
    }],
    actionCfg:{
      width:'116px',
      actions:[{
        btnName:'del',
        hide:((row)=>{
           if(!row['isEdit'] && row['isNew']){
             return false;
           }
           return true;
        }).bind(this)
      }]
    },
    database:LoadTableDbService2,
    local:true,
    mode:'edit',
    initLoad:true,
    onEditBefore:((row)=>{
      row['limitDay'] = this.helper.shuntElement(row['limitDay']);
      row['limitSingleMin'] = this.helper.shuntElement(row['limitSingleMin']);
      row['limitSingle'] = this.helper.shuntElement(row['limitSingle']);
    }).bind(this),
    onSave:((row)=>{
      if (!this.helper.isEmpty(row['limitDay'])) {
        row['limitDay'] *= 100;
      }
      if (!this.helper.isEmpty(row['limitSingleMin'])) {
        row['limitSingleMin'] *= 100;
      }
      if (!this.helper.isEmpty(row['limitSingle'])) {
        row['limitSingle'] *= 100;
      }
    }).bind(this),
    saveConfirmFunc:((row, database) => {
      let _day = this.headlerNumberNull(row['limitDay'], row, 'limitDay'), // 单日限额
        _min = this.headlerNumberNull(row['limitSingleMin'], row, 'limitSingleMin'), // 单笔限额最小
        _max = this.headlerNumberNull(row['limitSingle'], row, 'limitSingle'), // 单笔限额最大
        _settleRate = this.helper.isEmpty(row['settleRate']) ? 0 : row['settleRate'];
      if ((_max !== null && _day !== null) && _max*1 > _day*1) {
        this.snackBar.alert('单日限额需大于单笔限额最大值！');
        return false;
      }
      if ((_min !== null && _day !== null) && _min*1 > _day*1) {
        this.snackBar.alert('单日限额需大于单笔限额最小值！');
        return false;
      }
      if ((_min !== null && _max !== null) && _min*1 > _max*1) {
        this.snackBar.alert('单笔限额最大值需大于单笔限额最小值！');
        return false;
      }
      if (this.judgeSign(_min) || this.judgeSign(_max) || this.judgeSign(_day) || this.judgeSign(_settleRate)) {
        this.snackBar.alert('请填写正数！');
        return false;
      }
      let oldIndex = database['data'].findIndex((_row) => {
        //（新增数据，需要判断添加数据是否有id，老数据需要判断是否为自身），前者达到时在判断支付类型与行业类别组合后是否存在相同数据
        return ((_row['id'] !== undefined && row['id'] === undefined) || (row['id'] !== undefined && row['table_id'] != _row['table_id']))
          && row['transId'] == _row['transId'] && row['categoryType'] == _row['categoryType'];
      });
      if(database && oldIndex != -1){
        this.snackBar.alert('支付类型、行业类别不能同时重复，请调整！');
        return false;
      };
    }).bind(this)
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

  constructor(
    public spProdDB:LoadTableDbService,
    public sidenavService:ISidenavSrvice,
    public spDetailDBService:SPDetailDBService,
    public pupop:MdPupop,
    public helper:HelpersAbsService,
    public commonDBService:CommonDBService,
    public snackBar:MdSnackBar
  ){}
  public bankCode:any;
  ngOnInit():void{
    this.bankCode = this.ctr && this.ctr.params['bankCode'];
    let params = this.sidenavService.getPageParams();
    this.reload(params);
  }

  //events
  onRowClick(e){
    if(e && e.parentData && e.detailCtr){
      let row:any = e.parentData;
      let detailCtr = e.detailCtr;
      this.spDetailDBService.loadSPProdPayTypeData({id:row['id'],state:row['state']}).subscribe(res=>{
        if(res && res['status'] == 200){
          detailCtr.database.dataChange.next(res['data']);
        }
      });
    }
  }

  public reload(params){
    if(params){
      this.spDetailDBService.loadSPProdData({userNo:params['chanCode']}).subscribe(res=>{
        if(res && res['status'] == 200 && res['data'] && res['data'].length > 0){
          this.spProdDB.dataChange.next(res['data']);
        }
      });
    }
  }

  /**
   * 添加产品配置
   */
  public onAddSPProdCfg(){
    let params = this.sidenavService.getPageParams();
    if(!params){
      return;
    }
    let _prodFormWin = this.pupop.openWin(SPDetailProductFormComponent,{
      title: '添加产品',
      width: '1400px',
      height: '0',
      data:{userNo:params['chanCode'],userName:params['name']}
    });
    _prodFormWin.afterClosed().subscribe(res=>{
      if(res && res['status'] == 200){
        this.reload(params);
      }
    });
  }

  /**
   * 刷新表格
   */
  public refreshProdTable(){
    let params = this.sidenavService.getPageParams();
    if(!params){
      return;
    }
    this.reload(params);
  }


  public onLastStep() {
    let _params = {
      step: 2,
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
    this.ctr.onStep(1);
  }

  public onNextStep() {
    let stateArr:any = [];
    if(this.spProdDB && this.spProdDB['data']){
      let _data = this.spProdDB['data'];
      _data.forEach((item) => {
        stateArr.push(item['state']);
      })
    }
    if(stateArr && stateArr.indexOf(0) == -1 && stateArr.indexOf(1) == -1){
      this.snackBar.alert('未申请开通产品！');
      return;
    }
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
    this.sidenavService.resetPageParams(_params);
    this.ctr.params = _params;
    this.ctr.onStep(3);
  }

  public hasSource(){
    let params = this.sidenavService.getPageParams();
    if(!params || (params && this.helper.isEmpty(params['step'])) ){
      return true; // 新增进来
    }else{
      return false;// 详情进来
    }
  }
}
