import {Component, OnInit, ViewChild} from "@angular/core";
import {MdPupop, MdSelectChange, MdSnackBar} from "@angular/material";
import {MchDetailProductFormComponent} from "./mch.detail.product.form.component";
import {MchDetailDBService} from "./mch.detail.list.db.service";
import {
  CommonDBService, LoadTableDbService,
  LoadTableDbService2
} from "../../../../../common/db-service/common.db.service";
import {ISidenavSrvice} from "../../../../../common/services/isidenav.service";
import {ULODetailContainer} from "../../../../../common/components/detail/detail-container";
import {MdTableExtend} from "../../../../../common/components/table/table-extend";
import {MdTableExtendConfig} from "../../../../../common/components/table/table-extend-config";
import {Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";
import {HelpersAbsService} from "../../../../../common/services/helpers.abs.service";
@Component({
  selector:'mch-detail-product',
  templateUrl:'mch.detail.product.component.html',
  providers:[LoadTableDbService,MchDetailDBService,CommonDBService]
})
export class MchDetailProductComponent implements OnInit{
  public ctr:ULODetailContainer;
  @ViewChild('mchProdTable') mchProdTable:MdTableExtend;
  public mchProdColumns:Array<any> = [{
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
      switch(_state){//[{"id":0,"name":"待审核"},{"id":1,"name":"已开通"},{"id":2,"name":"已关闭"},{"id":3,"name":"未开通"}]
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
  public mchProdActions:any = {
    actions:[{
      btnName:'edit',
      hide:true
    },{
      btnName:'del',
      hide:true
    },{
      btnDisplay:'编辑提交',
      hide:((row:any,target:any)=>{
        if(!this.helper.btnRole('MCHPRODCFGCOMMIT')){
          return true;
        }
        let detailTable = target && target.detailTables[row['table_id']];
        if(row['state'] == 3 || !detailTable || (detailTable != undefined && detailTable.database != undefined && detailTable.database.previousValues != undefined && detailTable.database.previousValues.length == 0)){
          return true;
        }
        if(row['state'] == 3){
          return true;
        }
        if(!this.helper.hasConfigValueMatch('CLOUD_ULO_BANK_NO',this.mchData.agencyCode || this.mchData.bankNo)){
          return true;
        }
        return false;
      }).bind(this),
      click:(function(row:any){
        const detailTable = this.mchProdTable.detailTables[row['table_id']];
        if(detailTable){
          let flag: boolean = false;
          let tableData = this.mchProdTable.detailTables[row['table_id']].database.data;
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
            this.mchDetailDBService.saveMchProdCfgs({id:row['id'],tradetypes:data}).subscribe(res=>{
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
        if(!this.helper.btnRole('MCHPRODPAYTYPE')){
          return true;
        }
        if(row['state'] == 0){
          return true;
        }
        //非优络的不显示此按钮
        if(!this.helper.hasConfigValueMatch('CLOUD_ULO_BANK_NO',this.mchData.agencyCode || this.mchData.bankNo)){
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
            detailTable && detailTable.newRow({shareRule:1,used:1});
            trimerSub.unsubscribe();
          });
        }else {
          detailTable && detailTable.newRow({shareRule:1,used:1});
        }
      }).bind(this)
    },{
      btnDisplay:'关闭产品',//[{"id":0,"name":"待审核"},{"id":1,"name":"已开通"},{"id":2,"name":"已关闭"},{"id":3,"name":"未开通"}]
      hide:(function(row:any,target:any){
        if(!this.helper.btnRole('MCHCLOSEPROD')){
          return true;
        }
        //为优络时才进入这个判断
        if(this.helper.hasConfigValueMatch('CLOUD_ULO_BANK_NO',this.mchData.agencyCode || this.mchData.bankNo)){
          let detailTable = target && target.detailTables[row['table_id']];
          if(detailTable != undefined && detailTable.database != undefined && detailTable.database.previousValues != undefined && detailTable.database.previousValues.length != 0){
            return true;
          }
        }

        if(row['state'] == 1 || row['state'] == 4){
          return false;
        }
        return true;
      }).bind(this),
      click:(function(row:any){
        const detailTable = this.mchProdTable.detailTables[row['table_id']];
        if(detailTable) {
          let flag: boolean = false;
          let tableData = this.mchProdTable.detailTables[row['table_id']].database.data;
          tableData.forEach(_data => {
            if (_data['isEdit'] == true) {
              flag = true;
            }
          });
          if (flag) {
            this.snackBar.alert('您有正在编辑的数据，请先确认或取消！');
            return false;
          }
        }
        if(row['state'] == 1 || row['state'] == 4){
          this.mchDetailDBService.saveMchProdClose({id:row['id']}).subscribe(res=>{
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
      hide:(function(row:any){
        if(!this.helper.btnRole('MCHOPENPROD')){
          return true;
        }
        if(row['state'] == 3){//当产品状态为 未开通 时，显示开通产品按钮
          return false;
        }
        return true;
      }).bind(this),
      click:(function(row:any){
        const detailTable = this.mchProdTable.detailTables[row['table_id']];
        if(detailTable) {
          let flag: boolean = false;
          let tableData = this.mchProdTable.detailTables[row['table_id']].database.data;
          tableData.forEach(_data => {
            if (_data['isEdit'] == true) {
              flag = true;
            }
          });
          if (flag) {
            this.snackBar.alert('您有正在编辑的数据，请先确认或取消！');
            return false;
          }
        }
        if(row['state'] == 3){
          this.mchDetailDBService.saveMchProdOpen({userNo:row['userNo'],combId:row['id'],tradetypes:detailTable && detailTable.database.data}).subscribe(res=>{
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
      hide:(function(row:any,target:any){
        if(!this.helper.btnRole('MCHPRODEXAMINE')){
          return true;
        }
//为优络时才进入这个判断
        if(this.helper.hasConfigValueMatch('CLOUD_ULO_BANK_NO',this.mchData.agencyCode || this.mchData.bankNo)){
          let detailTable = target && target.detailTables[row['table_id']];
          if(detailTable != undefined && detailTable.database != undefined && detailTable.database.previousValues != undefined && detailTable.database.previousValues.length != 0){
            return true;
          }
        }

        if(row['state'] == 0){ //当产品状态为 待审核 时，显示审核与拒绝按钮
          return false;
        }
        return true;
      }).bind(this),
      click:(function(row:any){
        const detailTable = this.mchProdTable.detailTables[row['table_id']];
        if(detailTable) {
          let flag: boolean = false;
          let tableData = this.mchProdTable.detailTables[row['table_id']].database.data;
          tableData.forEach(_data => {
            if (_data['isEdit'] == true) {
              flag = true;
            }
          });
          if (flag) {
            this.snackBar.alert('您有正在编辑的数据，请先确认或取消！');
            return false;
          }
        }
        if(row['state'] == 0){
          this.mchDetailDBService.saveMchProdExamine({id:row['id'],state:1}).subscribe(res=>{
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
        if(!this.helper.btnRole('MCHPRODREFUSE')){
          return true;
        }
        //为优络时才进入这个判断
        if(this.helper.hasConfigValueMatch('CLOUD_ULO_BANK_NO',this.mchData.agencyCode || this.mchData.bankNo)){
          let detailTable = target && target.detailTables[row['table_id']];
          if(detailTable != undefined && detailTable.database != undefined && detailTable.database.previousValues != undefined && detailTable.database.previousValues.length != 0){
            return true;
          }
        }

        if(row['state'] == 0){ //当产品状态为 待审核 时，显示审核与拒绝按钮
          return false;
        }
        return true;
      }).bind(this),
      click:(function(row:any){
        const detailTable = this.mchProdTable.detailTables[row['table_id']];
        if(detailTable) {
          let flag: boolean = false;
          let tableData = this.mchProdTable.detailTables[row['table_id']].database.data;
          tableData.forEach(_data => {
            if (_data['isEdit'] == true) {
              flag = true;
            }
          });
          if (flag) {
            this.snackBar.alert('您有正在编辑的数据，请先确认或取消！');
            return false;
          }
        }
        if(row['state'] == 0){
          this.mchDetailDBService.saveMchProdExamine({id:row['id'],state:4}).subscribe(res=>{
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
        if(!this.helper.btnRole('MCHRESETPROD')){
          return true;
        }
        //为优络时才进入这个判断
        if(this.helper.hasConfigValueMatch('CLOUD_ULO_BANK_NO',this.mchData.agencyCode || this.mchData.bankNo)){
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
        const detailTable = this.mchProdTable.detailTables[row['table_id']];
        if(detailTable) {
          let flag: boolean = false;
          let tableData = this.mchProdTable.detailTables[row['table_id']].database.data;
          tableData.forEach(_data => {
            if (_data['isEdit'] == true) {
              flag = true;
            }
          });
          if (flag) {
            this.snackBar.alert('您有正在编辑的数据，请先确认或取消！');
            return false;
          }
        }
        if(row['state'] == 2 || row['state'] == 4){
          this.mchDetailDBService.saveMchProdResetOpen({id:row['id']}).subscribe(res=>{
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
  public mchProdDetailCfg:MdTableExtendConfig = {
    columns:[{
      name:'transId',
      title:'支付类型',
      type:'select',
      otherOpts:{
        disabled:((row:any)=>{
          if(row['isNewest'] === true){
            return false;
          }
          return true;
        }),
        valueField:'transId',
        displayField:'transType',
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
      name:'limitDay',
      title:'单日限额(元)',
      xtype:"number",
      render:(function(row:any,name:string){
        let _limitDay = row['limitDay'];
        if(this.helper.isEmpty(_limitDay)){
          _limitDay = ' / ';
        }else{
          _limitDay = this.helper.shuntElement(_limitDay);
        }
        return _limitDay;
      }).bind(this)
    },{
      name:['limitSingleMin','limitSingle'],
      title:'单笔限额(元)',
      firstTitle:'单笔最小(元)',
      lastTitle:'单笔最大(元)',
      xtype:"number",
      width:'100px',
      type:'inputGroup',
      render:(function(row:any,name:string){
        let _min = row[name[0]];
        let _max = row[name[1]];
        if(this.helper.isEmpty(_min)){
          _min = ' / ';
        }else{
          _min = this.helper.shuntElement(_min);
        }
        if(this.helper.isEmpty(_max)){
          _max = ' / ';
        }else{
          _max = this.helper.shuntElement(_max);
        }
        return  _min + ' - ' + _max;
      }).bind(this)
    },{
      name:'settleRate',
      title:'费率(‰)',
      xtype:"number",
      otherOpts:{
        required:true
      },
      render:(function(row:any,name:string){
        return row[name];
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
    }
    // ,{
      // name:'categoryType',
      // title:'所属行业',
      // type:'select',
      // otherOpts:{
      //   valueField:'id',
      //   displayField:'name',
      //   disabled:true,
      //   data:Observable.of(this.helper.getDictByKey('MCH_TYPE'))
      // },
      // render:(function(row:any,name:string){
      //   return this.helper.isEmpty(row[name]) ? '/' : this.helper.dictTrans('MCH_TYPE', row[name]);
      // }).bind(this)
    // }
    ,{
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
      this.handlerProdDetailCfg(row);
    }).bind(this),
    saveConfirmFunc:((row,database)=>{
      // console.log(row)
      let _day = this.headlerNumberNull(row['limitDay'], row, 'limitDay'), // 单日限额
        _min = this.headlerNumberNull(row['limitSingleMin'], row, 'limitSingleMin'), // 单笔限额最小
        _max = this.headlerNumberNull(row['limitSingle'], row, 'limitSingle'), // 单笔限额最大
        _settleRate = this.helper.isEmpty(row['settleRate']) ? 0 : row['settleRate'];
      if ((_max !== null && _day !== null) && _max *1 > _day *1 ) {
        this.snackBar.alert('单日限额需大于单笔限额最大值！');
        return false;
      }
      if ((_min !== null && _day !== null) && _min  *1 > _day *1 ) {
        this.snackBar.alert('单日限额需大于单笔限额最小值！');
        return false;
      }
      if ((_min !== null && _max !== null) && _min  *1 > _max *1 ) {
        this.snackBar.alert('单笔限额最大值需大于单笔限额最小值！');
        return false;
      }
      if (this.judgeSign(_min) || this.judgeSign(_max) || this.judgeSign(_day) || this.judgeSign(_settleRate)) {
        this.snackBar.alert('请填写正数！');
        return false;
      }
      let oldIndex = database['data'].findIndex((_row)=>{
        return _row['id'] !== undefined && row['id'] === undefined && row['transId'] == _row['transId'];
      });
      if(database && oldIndex != -1){
        this.snackBar.alert('当前选择的支付类型已存在！');
        return false;
      }
    }).bind(this)
    // onCancel:((row)=>{
    //   this.handlerProdDetailCfg(row);
    // }).bind(this)
  };
  private headlerNumberNull(val: any, row: any, fieldName: string): any {
    if (this.helper.isEmpty(val)) {
      row[fieldName] = undefined;
      return null;
    }
    return val;
  }

  public judgeSign(num) {
    let reg = new RegExp("^-?[0-9]*.?[0-9]*$");
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
public productData:any;
  public mchData:any;
  constructor(public mchProdDB:LoadTableDbService,public helper:HelpersAbsService,public commonDBService:CommonDBService,public snackBar:MdSnackBar,
              public sidenavService:ISidenavSrvice,public mchDetailDBService:MchDetailDBService,public pupop:MdPupop){}
  ngOnInit():void{
    // console.log(22);
    // console.log(this.ctr.params);
    let _params = this.ctr.params;
    this.mchData = _params;
    console.log(this.mchData);
    let params = this.sidenavService.getPageParams();
    this.reload(params);
  }
  //events
  onRowClick(e){
    if(e && e.parentData && e.detailCtr){
      let row:any = e.parentData;
      let detailCtr = e.detailCtr;
      this.mchDetailDBService.loadMchProdPayTypeData({id:row['id'],state:row['state']}).subscribe(res=>{
        if(res && res['status'] == 200){
          detailCtr.database.dataChange.next(res['data']);
        }
      });
    }
  }




  public reload(params){
    if(params){
      // console.log(params);
      this.mchDetailDBService.loadMchProdData({userNo:this.ctr.params['merchantNo']}).subscribe(res=>{
        if(res && res['status'] == 200 && res['data'] && res['data'].length > 0){
          this.productData = res;
          this.mchProdDB.dataChange.next(res['data']);
        }
      });
    }
  }
  /**
   * 添加产品配置
   */
  public onAddMchProdCfg(){
    let params = this.sidenavService.getPageParams();
    if(!params){
      return;
    }
    let _prodFormWin = this.pupop.openWin(MchDetailProductFormComponent,{
      title:'添加产品',
      width:'1200px',
      height:"0",
      data:{userNo:params['merchantNo'],userName:params['name']}
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
  private handlerProdDetailCfg(row){
    if(!this.helper.isEmpty(row['limitDay'])){
      row['limitDay'] *= 100;
    }
    if(!this.helper.isEmpty(row['limitSingleMin'])){
      row['limitSingleMin'] *= 100;
    }
    if(!this.helper.isEmpty(row['limitSingle'])){
      row['limitSingle'] *= 100;
    }
  }
  public hasStep(){
    let params = this.sidenavService.getPageParams();
    if(!params || (params && this.helper.isEmpty(params['step'])) ){
      return true; //新增进来
    }else{
      return false;//点击返回上一步进来
    }
  }
  onBefore(){
    let _params = {step:1,isEdit:true,source:this.ctr.params['source'],
      orgId:this.ctr.params['orgId'],
      name:this.ctr.params['name'],
      agencyCode: this.ctr.params['agencyCode'],
      agencyName:this.ctr.params['agencyName'],
      chanNo:this.ctr.params['chanNo'],
      merchantNo:this.ctr.params['merchantNo'],
      id:this.ctr.params['id'],
      parentChanNo:this.ctr.params['chanNo'],
      userNo:this.ctr.params['merchantNo'],
      categoryType:this.ctr.params['categoryType']
    };
    this.sidenavService.resetPageParams(_params);
    this.ctr.params = _params;
    this.ctr && this.ctr.onStep(1);
  }
  onNext(row: any){
    if(this.productData.data){
      let _state:any= [];
      this.productData.data.forEach((item)=>{
        _state.push(item['state']);
      });
      // console.log(_state);
      // console.log(_state.indexOf(0 ) == -1);
      if(!_.isEmpty(_state) && _state.indexOf(0) == -1 && _state.indexOf(1) == -1){
        this.snackBar.alert('未申请开通产品');
        return false;
      }
    }else{
      this.snackBar.alert('未申请开通产品');
      return false;
    }
    // let _state:any= [];
    //  this.productData.data.forEach((item)=>{
    //    _state.push(item['state']);
    // });
    // // console.log(_state);
    // // console.log(_state.indexOf(0 ) == -1);
    // if(!_.isEmpty(_state) && _state.indexOf(0) == -1 && _state.indexOf(1) == -1){
    //   this.snackBar.alert('未申请开通产品');
    //   return false;
    // }

    let _params = {step:3,isEdit:true,source:this.ctr.params['source'],
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
  }
}
