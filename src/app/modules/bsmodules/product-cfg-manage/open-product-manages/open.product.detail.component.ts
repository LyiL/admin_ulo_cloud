import {Component, Inject, ViewChild} from "@angular/core";
import {DetailField, ULODetail} from "../../../../common/components/detail/detail";
import {HelpersAbsService} from "../../../../common/services/helpers.abs.service";
import {MdDialogRef, MD_DIALOG_DATA, MdSelectChange, MdSnackBar} from "@angular/material";
import {Column} from "../../../../common/components/table/table-extend-config";
import {LoadTableDbService, CommonDBService} from "../../../../common/db-service/common.db.service";
import {OpenProductDBService} from "./open.product.db.service";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/timer';
import "rxjs/add/observable/of";
import {MdTableExtend} from "../../../../common/components/table/table-extend";
@Component({
  selector:'ulo-open-product-detail',
  templateUrl:'./open.product.detail.component.html',
  styleUrls:['./open.product.component.scss'],
  providers:[LoadTableDbService,OpenProductDBService,CommonDBService]
})
export class OpenProductDetailComponent{
  @ViewChild('detail') productDetail:ULODetail;
  @ViewChild('productTable') productTable:MdTableExtend;
  public openProdDetailField:Array<DetailField>=[{
    title:'用户类型',
    field:'userType',
    render:(function(data:any,field:DetailField){
      return this.helper.dictTrans('PRODUCT_USER_TYPE',data[field.field]);
    }).bind(this)
  },{
    title:'用户名称',
    field:'userName'
  },{
    title:'用户编号',
    field:'userNo'
  },{
    title:'产品名称',
    field:'combName'
  },{
    title:'产品代码',
    field:'combNo'
  },{
    title:'开通状态',
    field:'state',
    type:'html',
    render:(function(data:any,field:DetailField){
      if(data && data[field.field] !== undefined){
        let _state = data[field.field];
        let _class = '';
        switch(_state){
          case 0:
            _class = 'warning-bg';
            break;
          case 2:
            _class = 'danger-bg';
            break;
          case 1:
            _class = 'success-bg';
            break;
          case 3:
            _class = 'disables-bg';
            break;
        }

        return '<span class="'+_class+'">'+this.helper.dictTrans('PRODUCT_OPEN_STATE',_state)+'</span>'
      }
    }).bind(this)
  }];

  public openProdDetailParam:any;

  public openProdDetailColumns:Array<Column> = [{
    title:'支付类型',
    name:'transId',
    type:'select',
    // width:'125',
    otherOpts:{
      disabled:((row:any,cell:any,e:any)=>{
        return row['isEdit'];
      }).bind(this),
      valueField:'transId',
      displayField:'transType',
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
    title:'单日限额（元）',
    name:'limitDay',
    xtype: 'number',
    // width:'80px',
    render: ( function(row: any, name: string){
      let _mon = row[name];
      if (this.helper.isEmpty(_mon)) {
        _mon = '/';
      } else {
        _mon = this.helper.shuntElement(_mon);
      }
      return _mon;
    }).bind(this)
  },{
    title:'单笔限额（元）',
    name:['limitSingleMin','limitSingle'],
    xtype: 'number',
    firstTitle:'单笔最小',
    lastTitle:'单笔最大',
    type:'inputGroup',
    width:'80px',
    render:(function(row:any,name:Array<string>){
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
    title:'费率（‰）',
    name:'settleRate',
    xtype: 'number',
    // width:'80px',
    render:(function(row:any,name:string){
      return row[name]
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
    title:'结算/分润周期',
    name:'settleCycle',
    type:'select',
    // width:'80',
    otherOpts:{
      valueField:'id',
      displayField:'name',
      data:Observable.of(this.helper.getDictByKey('BALANCE_DATE'))
    },
    render:(function(row:any,name:string){
      return this.helper.dictTrans('BALANCE_DATE',row[name]);
    }).bind(this)
  },{
    title:'分润规则',
    name:'shareRule',
    type:'select',
    // width:'125',
    otherOpts:{
      valueField:'id',
      displayField:'name',
      data:Observable.of(this.helper.getDictByKey('PAYCENTER_CH_TYPE'))
    },
    render:(function(row:any,name:string){
      return this.helper.dictTrans('PAYCENTER_CH_TYPE',row[name]);
    }).bind(this)
  },{
    title:'状态',
    name:'used',
    type:'select',
    // width:'80px',
    otherOpts:{
      valueField:'id',
      displayField:'name',
      data:Observable.of(this.helper.getDictByKey('ENABLE_STATUS'))
    },
    render:(function(row:any,name:string,cell:any){
      let _used = row[name];
      if(_used == 0){
        cell.bgColor = 'danger-bg';
      }else if(_used == 1){
        cell.bgColor = 'success-bg';
      }
      return this.helper.dictTrans('ENABLE_STATUS',_used);
    }).bind(this)
  }];

  public openProdDetailActionCfg:any;

  public openProdInfo:any;
  private detailTableData:any;
  public  typePar:any;
  constructor(
    public helper:HelpersAbsService,
    public dialog: MdDialogRef<OpenProductDetailComponent>,
    public openProductDBService:OpenProductDBService,
    public snackBar:MdSnackBar,
    public commonDBService:CommonDBService,
    public openProdDetailDB:LoadTableDbService,
    @Inject(MD_DIALOG_DATA) public data: any
  ){
    if(data){
      this.typePar=data;
      this.openProdDetailParam = {
        url:'/productOpen/info',
        params:{id:data['id']}
      };
    }
    this.openProdDetailDB.pageSize = 5;
  }

  ngOnInit(){
    //判断所属行业和固定费率是否显示（当配置对象为商户时不显示）
      let _usertype=this.typePar['usertype'];
      if(_usertype!=2){
        this.openProdDetailColumns[1]['hide']=false;
        this.openProdDetailColumns[5]['hide']=false;
      }else {
        this.openProdDetailColumns[1]['hide']=true;
        this.openProdDetailColumns[5]['hide']=true;
      }
  }


  /**
   * 明细加载完数据回调方法
   * @param data
   */
  public openProdDetailData(data:any){
    this.openProdInfo = data;
    this.openProdDetailActionCfg = {
      width:'96px',
      hide:(function(){
        if(this.openProdInfo.state == 0){
          return false;
        }
        return true;
      }).bind(this),
      actions:[{
        btnName:'del',
        hide:true
      },{
        btnName:'edit',
        hide:((row:any)=>{
          if(this.helper.btnRole('OPENPRODCFGEDIT') && !row['isEdit']){
            return false;
          }
          return true;
        }).bind(this)
      }]
    };
    this.detailTableData = this.helper.clone(data['payTypes']);
    this.openProdDetailDB.dataChange.next(this.helper.clone(this.detailTableData));
  }

  /**
   * 审核通过
   */
  public onAudited(){
    if(this.openProdInfo){
      let flag: boolean = false;
      this.openProdDetailDB.data.forEach(_data=>{
        if(_data['isEdit'] == true){
          flag = true;
        }
      });
      if(flag){
        this.snackBar.alert('您有正在编辑的数据，请先确认或取消！');
        return false;
      }
    }
    if(!this.openProdInfo){
      return false;
    }
    this.openProductDBService.auditedProd({id:this.openProdInfo['id'],  state:1}).subscribe(res=>{
      if(res && res['status'] == 200){
        this.snackBar.alert('审核通过成功！');
        this.dialog.close(res);
      }else{
        this.snackBar.alert(res['message']);
      }
    });
  }

  /**
   * 审核拒绝事件
   */
  public onAuditReject(){
    if(this.openProdInfo){
      let flag: boolean = false;
      this.openProdDetailDB.data.forEach(_data=>{
        if(_data['isEdit'] == true){
          flag = true;
        }
      });
      if(flag){
        this.snackBar.alert('您有正在编辑的数据，请先确认或取消！');
        return false;
      }
    }
    if(!this.openProdInfo){
      return false;
    }
    this.openProductDBService.auditedProd({id:this.openProdInfo['id'],  state:4}).subscribe(res=>{
      if(res && res['status'] == 200){
        this.snackBar.alert('审核拒绝成功！');
        this.dialog.close(res);
      }else{
        this.snackBar.alert(res['message']);
      }
    });
  }

  /**
   * 判断当前产品审核是否通过
   * @returns {boolean}
   */
  public curProdHasAudited(){
    if(!this.helper.btnRole('OPENPRODEXAMINE') && !this.helper.btnRole('OPENPRODREFUSE')){
      return false;
    }
    if(this.openProdInfo && this.openProdInfo.state == 0){ //当状态为1是，表示产品审核通过
      return true;
    }
    return false;
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
   * 确认保存前的事件
   * @param row
   * @returns {boolean}
   */
  public onBeforeSaveCfg(row:any,database:any){
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
    let sData = database.data.filter((item)=>{
      return item['transId'] == row['transId']&& row['categoryType'] == item['categoryType'];
    });
    if(sData.length >= 2){
      this.snackBar.alert('支付类型,行业类别不能同时重复，请调整！');
      return false;
    }
    return true;
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
  /**
   * 保存调整过的配置信息
   */
  public onOpenProdCfgSave(data:any,value:any){

      if (!this.helper.isEmpty(data['limitDay'])) {
        data['limitDay'] *= 100;
      }
      if (!this.helper.isEmpty(data['limitSingleMin'])) {
        data['limitSingleMin'] *= 100;
      }
      if (!this.helper.isEmpty(data['limitSingle'])) {
        data['limitSingle'] *= 100;
      }
      this.openProductDBService.modifyProdCfg(data).subscribe(res=>{
        if(res && res['status'] == 200){
          this.snackBar.alert('保存成功!');
          this.productDetail.refresh();
          this.openProdDetailDB.dataChange.next(this.helper.clone(this.detailTableData));
        }else {
          this.snackBar.alert(res['message']);
          this.productDetail.refresh();
          this.openProdDetailDB.dataChange.next(this.helper.clone(this.detailTableData));
        }
      });
  }

  /**
   * 取消事件
   */
  onCancel(){
    this.productDetail.refresh();
    this.openProdDetailDB.dataChange.next(this.helper.clone(this.detailTableData));
  }
}
