import {Component, OnInit, ViewChild} from "@angular/core";
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/of";
import {ULODetailContainer} from "../../../../../common/components/detail/detail-container";
import {HelpersAbsService} from "../../../../../common/services/helpers.abs.service";
import {ProdFormDBLoad, ProductCfgDBService} from "../product.db.service";
import {Column} from "../../../../../common/components/table/table-extend-config";
import {MdTableExtend} from "../../../../../common/components/table/table-extend";
import {CommonDBService} from "../../../../../common/db-service/common.db.service";
import {MdSnackBar, MdSelectChange, MdPupop, Confirm, MdTabChangeEvent} from "@angular/material";
import {ISidenavSrvice} from "../../../../../common/services/isidenav.service";
@Component({
  selector:'ulo-product-cfg-info',
  templateUrl:'./product.cfg.info.component.html',
  styleUrls:['../product.manage.scss'],
  providers:[ProdFormDBLoad,ProductCfgDBService,CommonDBService]
})
export class ProductCfgInfoComponent implements OnInit{

  public ctr:ULODetailContainer;
  public prodCfgTabs:Observable<any>;
  public prodCfgTabsData:Array<any> = [];
  public previousTabs:string;
  public prodInfo:any;//产品信息
  private previousEditTab:number = 0;//之前的页签
  /**
   * 产品配置对应KEY
   * @type
   */
  public prodCfg:any = {
    SERVICEPROVIDER:'0',//服务商
    CHANNELTRADER:'1',//代理商
    MERCHANT:'2'//商户
  };

  public selectedIndex:number = 0;
  public prodCfgDatas:any; //产品配置信息
  @ViewChild('prodCfgTable') prodCfgTable:MdTableExtend;

  /**
   * 配置信息列表字段
   */
  public prodCfgColumns:Array<Column> = [{
    name:'transId',
    title:'支付类型',
    type:'select',
    otherOpts:{
      valueField:'transId',
      displayField:'transType',
      required:true,
      data:this.commonDBService.loadTransApi({}),
      onChange:(function (row,change:MdSelectChange) {
        row['transType'] = change.source.triggerValue;
      }).bind(this)
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
      disabled:false
    },
    hide:false,
    render: (function (row: any, name: string) {
      if(this.helper.isEmpty(row[name])){
        return '/';
      }else{
        return this.helper.dictTrans('MCH_TYPE', row[name]);
      }
    }).bind(this)
  },{
    name:'limitDay',
    title:'单日限额（元）',
    xtype: 'number',
    render:(function(row:any,name:string){
      let _mon = row[name];
      if (this.helper.isEmpty(_mon)) {
        _mon = '/';
      } else {
        _mon = this.helper.shuntElement(_mon);
      }
      return _mon;
    }).bind(this)
  },{
    name:['limitSingleMin', 'limitSingle'],
    title: '单笔限额（元）',
    xtype: 'number',
    firstTitle: '单笔最小',
    lastTitle: '单笔最大',
    type: 'inputGroup',
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
      return row[name] ;
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
    hide:false,
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
      required:true,
      data:Observable.of(this.helper.getDictByKey('BALANCE_DATE'))
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
      required:true,
      data:Observable.of(this.helper.getDictByKey('PAYCENTER_CH_TYPE'))
    },
    render:(function(row:any,name:string){
      return this.helper.dictTrans('PAYCENTER_CH_TYPE',row[name]);
    }).bind(this)
  }];

  public prodActionCfg:any = {
      actions:[{
        btnName:'del',
        hide:(function(row:any){
          if(!row['isEdit'] && row['isNew']){
            return false;
          }
          return true;
        }).bind(this)
      }]
  };

  constructor(public helper:HelpersAbsService,public prodFormDB:ProdFormDBLoad,public prodCfgDB:ProductCfgDBService,
              public commonDBService:CommonDBService,public snackBar:MdSnackBar,public sidenavSrvice:ISidenavSrvice,public pupop: MdPupop){
  }

  ngOnInit():void{
    this.prodInfo = this.ctr.params;
    //初始化tab项
    let prodUserTypes = this.helper.getDictByKey('PRODUCT_USER_TYPE');

    prodUserTypes.forEach(type=>{
      if(this.prodInfo.applyType.indexOf(type.id) != -1){
        this.prodCfgTabsData.push({label:type.name,key:type.id});
      }
    });
    this.prodCfgTabs = Observable.of(this.prodCfgTabsData);

    //加载已经配置好的数据
    this.prodFormDB.loadProdCfg(this.prodInfo['id']).subscribe(res=>{
      if(res && res['status'] == 200){
        this.prodCfgDatas = res['data'];
        this.previousTabs =this.getProdCfgKey();
          this.prodCfgDB.dataChange.next(this.prodCfgDatas[this.previousTabs]);
      }
    });
  }

  public onProdCfgSelectChange(changeEvent:MdTabChangeEvent){
    let flag = false;
    this.prodCfgDB.data.forEach(_data=>{
      if(_data['isEdit'] == true){
        flag = true;
      }
    });
    if(flag){
      this.snackBar.alert('当前页签有正在编辑的数据！');
      this.selectedIndex = this.previousEditTab;
      return false;
    }
    this.previousTabs = this.getProdCfgKey();
    this.prodCfgDB.dataChange.next(this.prodCfgDatas[this.previousTabs]);
    this.prodCfgDB.refreshChange.next(true);
    this.previousEditTab = changeEvent.index;

    //判断所属行业和固定费率是否显示（当配置对象为商户时不显示）
    const _prodCfgCls = _.clone(this.prodCfgColumns);
    if(this.previousTabs == 'MERCHANT'){
      _prodCfgCls[1].hide = true;
      _prodCfgCls[5].hide = true;
      this.prodCfgColumns = _prodCfgCls;
    }else {
      _prodCfgCls[1].hide = false;
      _prodCfgCls[5].hide = false;
      this.prodCfgColumns = _prodCfgCls;
    }

  }

  /**
   * 表格记录保存更新内存数据
   * @param row
   */
  public onTableSave(row:any){
    if (!this.helper.isEmpty(row['limitDay'])) {
      row['limitDay'] *= 100;
    }
    if (!this.helper.isEmpty(row['limitSingleMin'])) {
      row['limitSingleMin'] *= 100;
    }
    if (!this.helper.isEmpty(row['limitSingle'])) {
      row['limitSingle'] *= 100;
    }
    this.prodCfgDatas[this.previousTabs] = this.prodCfgDB.data;
  }

  /**
   * 表格记录删除更新内存数据
   * @param row
   */
  public onTableDel(row:any){
    this.prodCfgDatas[this.previousTabs] = this.prodCfgDB.data;
  }

  /**
   * 新增产品配置
   */
  public onNewProdCfg(prodCfgTable: MdTableExtend){
    this.prodCfgTable.newRow({shareRule: 1,fixFloatRate:0});
  }

  /**
   * 表格点击确定按钮保存之前触发事件
   */
  public onBeforeSave(row: any){
    this.previousTabs = this.getProdCfgKey();
    if(this.previousTabs == 'MERCHANT'){
      let hasDataSourceInTransId = this.prodCfgDB.data.find((item)=>{
        let _tmpTransId = _.isArray(item['transId']) ? item['transId'].join(',') : item['transId'];
        if(!(row['table_id'] == item['table_id']) && !_.isEmpty(row['transId']) && _tmpTransId.indexOf(row['transId']) != -1){
          return true;
        }
        return false;
      });
      if(hasDataSourceInTransId){
        this.snackBar.alert('支付类型不能重复，请调整！');
        return false;
      }
    }else{
      let hasDataSourceInTransId = this.prodCfgDB.data.find((item)=>{
        let _tmpTransId = _.isArray(item['transId']) ? item['transId'].join(',') : item['transId'];
        if(!(row['table_id'] == item['table_id']) && !_.isEmpty(row['transId']) && _tmpTransId.indexOf(row['transId']) != -1 && row['categoryType'] == item['categoryType']){
          return true;
        }
        return false;
      });
      if(hasDataSourceInTransId){
        this.snackBar.alert('支付类型,行业类别不能同时重复，请调整！');
        return false;
      }
    }

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
  }

  private headlerNumberNull(val:any,row:any,fieldName:string): any{
    if(this.helper.isEmpty(val)){
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
    // else {
      // return '不是数字';
      // return false;
    // }
  }

  /**
   * 保存
   */
  public onSaveProdCfgInfo(){
    if(this.hasData()){
      let flag: boolean = false;
      this.prodCfgDB.data.forEach(_data=>{
        if(_data['isEdit'] == true){
          flag = true;
        }else{
          _data['transId'] = _data['transId'] instanceof Array ? _data['transId'].join(',') : _data['transId'];
        }
      });
      if(flag){
        this.snackBar.alert('您有正在编辑的数据，请先确认或取消！');
        return false;
      }
      this.prodFormDB.saveProdCfg(this.processingData()).subscribe(res=>{
        if(res && res['status'] == 200){
          this.snackBar.alert('保存成功！');
          if('detail,base'.indexOf(this.prodInfo.source) != -1){
            this.sidenavSrvice.onNavigate('/admin/productdetail','详情',{id:this.prodInfo['id']},true);
          }else{
            this.sidenavSrvice.onNavigate('/admin/productlist','产品列表',null,true);
          }
        }else{
          this.snackBar.alert(res['message'] ? res['message'] : '保存失败！');
        }
      });
    }
  }

  /**
   * 编辑
   */
  onEditProdCfg(row: any) {
    row['limitDay'] = this.helper.shuntElement(row['limitDay']);
    row['limitSingleMin'] = this.helper.shuntElement(row['limitSingleMin']);
    row['limitSingle'] = this.helper.shuntElement(row['limitSingle']);
  }

  /**
   * 处理配置数据
   */
  public processingData(){
    let data:Array<any> = [];
    for(let key in this.prodCfgDatas){
      this.prodCfgDatas[key].forEach((_data,ind)=>{
        _data['combindId'] = this.prodInfo['id'];
        _data['sellType'] = this.prodCfg[key];
        data.push(_data);
      });
    }
    return data;
  }

  /**
   * 判断是否可以提交数据
   * @returns {boolean}
   */
  public hasData(){
    let flag:boolean = true;
    for(let key in this.prodCfgDatas){
      if(this.prodCfgDatas[key].length <= 0){
        flag = false;
      }
    }
    if(this.prodInfo && flag){
      return true;
    }
    return false;
  }

  /**
   * 通过值获取key
   * @returns {string}
   */
  public getProdCfgKey(){
    let retKey = ''
    for(let key in this.prodCfg){
      if(this.prodCfg[key] == this.prodCfgTabsData[this.selectedIndex]['key']){
        retKey = key;
      }
    }
    return retKey;
  }

  /**
   * 确认删除
   */
  public onDelete(row: any){
    let deletePupop = this.pupop.confirm({
      message:'您确认要删除【'+row['transType']+'】吗？'
    });
    return deletePupop.afterClosed().map(result => {
      if(result == Confirm.YES){
        return true;
      }
      return false;
    });
  }
}
