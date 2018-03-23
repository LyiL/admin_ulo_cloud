import {Component, ViewChild} from "@angular/core";
import {DetailField, ULODetail} from "../../../../common/components/detail/detail";
import {ISidenavSrvice} from "../../../../common/services/isidenav.service";
import {HelpersAbsService} from "../../../../common/services/helpers.abs.service";
import {HttpService} from "../../../../common/services/impl/http.service";
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/of";
import {Column} from "../../../../common/components/table/table-extend-config";
import {MdTabChangeEvent, MdTab, MdPupop, MdSnackBar} from "@angular/material";
import {ProdFormDBLoad, ProductCfgDBService} from "./product.db.service";

@Component({
  selector:'ulo-product-detail',
  templateUrl:'product.detail.component.html',
  providers:[ProductCfgDBService,ProdFormDBLoad]
})
export class ProductDetailComponent{

  /**
   * 产品详情请求参数
   * @type {{url: string}}
   */
  public prodDetailReqParam:any;
  public transApiData:any;//支付类型数据
  @ViewChild('prodDetail') prodDetail:ULODetail;
  /**
   * 产品详情字段
   * @type {Array}
   */
  public prodDetailFields:Array<DetailField> = [{
    title:'产品名称：',
    field:'combName'
  },{
    title:'所属机构：',
    field:'bankName'
  },{
    title:'产品代码：',
    field:'combNo'
  },{
    title:'产品类型：',
    field:'productType',
    render:(function(data:any,field:DetailField){
      if(data && data[field.field] !== undefined){
        return this.helper.dictTrans('PRODUCT_TYPE',data[field.field]);
      }
    }).bind(this)
  },{
    title:'适用商家：',
    field:'applyType',
    render:(function(data:any,field:DetailField){
      let fieldVal = data[field.field];
      if(data && fieldVal !== undefined){
        let applyTypes = fieldVal && fieldVal.split(',');
        let applyTypeNames = [];
        applyTypes.forEach((res)=>{
          applyTypeNames.push(this.helper.dictTrans('PRODUCT_USER_TYPE',res));
        });
        return applyTypeNames.join(' / ');
      }
    }).bind(this)
  },{
    title:'产品描述：',
    field:'productDepicts'
  }];

  public prodCfgTabs:Observable<any>;
  public prodCfgTabsData:any = {};
  public prodCfg:any = {
    SERVICEPROVIDER:'服务商',
    CHANNELTRADER:'代理商',
    MERCHANT:'商户'
  };

  /**
   * 配置信息列表字段
   */
  public prodCfgColumns:Array<Column> = [{
    name:'transType',
    title:'支付类型'
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
  }, {
    name:'limitDay',
    title:'单日限额（元）',
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
    name:['limitSingleMin'],
    title:'单笔限额（元）',
    render:(function(row: any, name: string){
      // return this.helper.shuntElement(row[name]) + ' - ' + this.helper.shuntElement(row['limitSingle']);
      let _min = row[name];
      let _max = row['limitSingle'];
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
    title:'费率（‰）'
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
    render:(function(row:any,name:string){
      return this.helper.dictTrans('BALANCE_DATE',row[name]);
    }).bind(this)
  },{
    name:'shareRule',
    title:'分润规则',
    render:(function(row:any,name:string){
      return this.helper.dictTrans('PAYCENTER_CH_TYPE',row[name]);
    }).bind(this)
  }];

  public prodActionCfg:any = {
    hide:true
  };

  //操作日志记录
  public prodOperationRecord:Observable<any>;
  //产品信息
  public prodDetailData:any;

  constructor(
    public sidenavService:ISidenavSrvice,
    public helper:HelpersAbsService,
    public http:HttpService,
    public prodCfgDB:ProductCfgDBService,
    public pupop:MdPupop,
    public snackbar:MdSnackBar,
    public proDB:ProdFormDBLoad
  ){
    this.reload();
  }

  public reload(isRefresh:boolean = false){
    let params = this.sidenavService.getPageParams();
    if(params){
      if(!isRefresh){
        //查询产品详情信息
        this.prodDetailReqParam = {
          url:'/productManage/findById',
          params:params
        };
      }else {
        this.prodDetail.refresh();
      }

      //查询配置记录
      this.proDB.loadFindConfig({combindId:params['id']}).subscribe(_res=>{
        if(_res && _res['status'] == 200 && _res['data']){
          let _tabs = [];
          for(let key in this.prodCfg){
            let sData = _res['data'];
            let tmpData:any = sData.hasOwnProperty(key) ? sData[key] : undefined;
            if(tmpData){
              _tabs.push({'label':this.prodCfg[key],'key':key});
              this.prodCfgTabsData[key] = tmpData;
              if(this.prodCfgDB.data && this.prodCfgDB.data.length == 0){
                this.prodCfgDB.dataChange.next(tmpData);
              }
            }
          }
          this.prodCfgTabs = Observable.of(_tabs);
        }
      });

      //查询操作日志
      this.proDB.loadExmineLog(params).subscribe(_res=>{
        if(_res && _res['status'] == 200){
          this.prodOperationRecord = Observable.of(_res['data']);
        }
      });
    }
  }

  public onProdCfgSelectChange(tabChange:MdTabChangeEvent){
    let curTab:MdTab = tabChange.tab;
    let _dataKey = '';
    for(let key in this.prodCfg){
      if(this.prodCfg[key] == curTab.textLabel){
        _dataKey = key;
      }
    }
    this.prodCfgDB.dataChange.next(this.prodCfgTabsData[_dataKey]);

    //判断所属行业和固定费率是否显示（当配置对象为商户时不显示）
    const _prodCfgCls = _.clone(this.prodCfgColumns);
    if(_dataKey == 'MERCHANT'){
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
   * 审核产品
   */
  public onExamine(){
    let statusData = this.helper.getDictByKey('PRODUCT_EXAMINE_STATUS');
        statusData = statusData.filter((value,index)=>{
          if(index != statusData.length - 1){
            return true;
          }
          return false;
        });

    this.pupop.openStatus({
      title:'审核状态',
      statusDatas:statusData,
      statusField:{
        name:'productState',
        value:this.prodDetailData.productState
      },
      remarkField: {
        name: 'exmineDes',
        value: ''
      },
      onConfirm: this.examineConfirm.bind(this)
    })
  }

  public onBack(){
    this.sidenavService.onNavigate('/admin/productlist','产品列表',null,true);
  }

  public examineConfirm(value:any){
    if(!value['exmineDes']){
      this.snackbar.alert('审核内容不能为空！');
      return;
    }
    value = _.extend(value,{
      id:this.sidenavService.getPageParams()['id']
    });
    return this.proDB.loadPorExamine(value).map(res=>{
      if(res && res['status'] == 200){
        this.reload(true);
      }
      return res;
    });
  }

  /**
   * 获取明细数据
   */
  public onDetailData(data:any){
    this.prodDetailData = data;
  };

  /**
   * 编辑产品配置信息
   */
  public onEditProdCfgInfo(){
    let params = _.extend({isEdit:true,step:1,source:'detail'},this.prodDetailData);
    this.sidenavService.onNavigate('/admin/productform','编辑产品',params,true);
  }

  /**
   * 编辑产品详情信息
   */
  public onBaseInfoHeadler(){
    this.sidenavService.onNavigate('/admin/productform','编辑产品',{isEdit:true,step:0,source:'detail',id:this.sidenavService.getPageParams()['id']},true);
  }

  /**
   * 获取产品状态
   */
  public productState(){
    if(!this.prodDetailData){
      return '';
    }
    //[{"id":0,"name":"待审核"},{"id":1,"name":"生效"},{"id":2,"name":"未通过"},{"id":3,"name":"作废"}]
    let state = this.prodDetailData['productState'];
    let stateClass = 'prod-pending-audit';
    switch(state){
      case 0://待审核
        stateClass = 'prod-pending-audit';
        break;
      case 1://生效
        stateClass = 'prod-normal';
        break;
      case 2://未通过
        stateClass = 'prod-not-pass';
        break;
      case 3:
        stateClass = 'prod-fail';
        break;
    }
    return stateClass;
  }
}
