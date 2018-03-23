import {Component, OnInit} from "@angular/core";
import {Column} from "../../../../../common/components/table/table-extend-config";
import {ULODetailContainer} from "../../../../../common/components/detail/detail-container";
import {LoadBankLinkNo, LoadTableDbService} from "../../../../../common/db-service/common.db.service";
import {Observable} from "rxjs";
import {HelpersAbsService} from "../../../../../common/services/helpers.abs.service";
import {MdSnackBar} from "@angular/material";
import {ISidenavSrvice} from "../../../../../common/services/isidenav.service";
import {MdTableExtend} from "../../../../../common/components/table/table-extend";
import {MchDetailDBService} from "../detail-component/mch.detail.list.db.service";
import {InputSearchDatasource} from "../../../../../common/services/impl/input.search.datasource";
@Component({
  selector:'mch-account-info',
  templateUrl:'./mch.account.info.component.html',
  providers:[LoadTableDbService,MchDetailDBService,LoadBankLinkNo]
})
export class MchAccountInfoComponent implements OnInit{
  public ctr:ULODetailContainer;
  public accountEditWinOption:any = {
    title:'账户信息',
    isRequser:false
  };
  /**
   * 账户信息表格列
   * @type {Array}
   */
  public accountColumns:Array<Column> = [{
    name:'name',
    title:'开户名称',
    otherOpts:{
      required:true
    }
  },{
    name:'type',
    title:'账户类型',
    type:'select',
    otherOpts:{
      required:true,
      valueField:'id',
      displayField:'name',
      data:Observable.of(this.helper.getDictByKey('ACCOUNT_TYPE'))
    },
    render:(function(row:any,name:string){
      return this.helper.dictTrans('ACCOUNT_TYPE',row[name]);
    }).bind(this)
  },{
    name:'bankCardno',
    title:'银行账号',
    xtype:"number",
    otherOpts:{
      required:true
    }
  },{
    name:'bankName',
    title:'开户行',
    otherOpts:{
      required:true
    }
  },{
    name:'subbranchName',
    title:'开户支行',
    width:"170px",
    type:'inputSearch',
    otherOpts:{
      required:(row:any,cell:any)=>{
        return row['type'] == 1;
      },
      displayFn:(function(value:any){
        return value && value['subBankName'];
      }).bind(this),
      optionDisplayFn:(function(value:any){
        return value && value['subBankName'] +'('+value['linkNo']+')';
      }).bind(this),
      filterField:["linkNo","subBankName"],
      valueField:'subBankName',
      onBeforClick:(function(value:any){
        let flag:boolean = true;
        if(this.helper.isEmpty(value)){
          this.snackBar.alert('请输入关键字！');
          flag = false;
        }
        this.loadBankLinkNoDB.params = {subBankName:value};
        return flag;
      }).bind(this),
      onSelected:(function(row:any,data: any){
        if(data &&　data.value){
          row['subbranchName'] = data.value.subBankName;
          row['subbanrchCode'] = data.value.linkNo;
        }
      }).bind(this),
      dataSource:new InputSearchDatasource(this.loadBankLinkNoDB)
    },
    render:(function(row:any){
      return row['subbranchName'];
    }).bind(this)
  },{
    name:'subbanrchCode',
    title:'联行号',
    otherOpts:{
      required:(row:any,cell:any)=>{
        return row['type'] == 1;
      }
    }
  },
    {
      name:'transId',
      title:'支付类型',
      type:'multipleSelect',
      width:'200px',
      otherOpts:{
        required:true,
        valueField:'id',
        displayField:'name',
        data:Observable.of(this.helper.getDictByKey('BANK_ACT_TRADE_TYPE'))
      },
      render:(function(row:any,name:string){
        let _transIds:any = row[name];
        let _transNames:Array<string> = [];
        if(typeof _transIds == 'string'){
          _transIds = _transIds.split(',');
        };
        if(_transIds && _transIds.length > 0){
          (_transIds instanceof Array) && _transIds.forEach((_transId:any)=>{
            _transNames.push(this.helper.dictTrans('BANK_ACT_TRADE_TYPE',_transId));
          });
        }
        return _transNames.join(',');
      }).bind(this)
    },{
      name:'cardType',
      title:'行内帐户',
      type:'select',
      otherOpts:{
        required:true,
        valueField:'id',
        displayField:'name',
        data:Observable.of(this.helper.getDictByKey('ACCOUNT_CARD_TYPE'))
      },
      render:(function(row:any,name:string){
        return this.helper.dictTrans('ACCOUNT_CARD_TYPE',row[name]);
      }).bind(this)
    }];

  /**
   * 账户信息按钮配置
   * @type {{actions: [{btnName: string; hide: boolean}]}}
   */
  public accountActionCfg:any = {
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
  constructor(public helper:HelpersAbsService,public accountDB:LoadTableDbService, public mchDetailDBService:MchDetailDBService,
              public snackBar:MdSnackBar,public sidenavService:ISidenavSrvice,public loadBankLinkNoDB:LoadBankLinkNo){}

  ngOnInit(){
    // console.log(11);
    // console.log(this.ctr.params);
    let orgParams:any = {orgId:this.ctr.params['orgId']};
    //初始化服务商户帐户信息
    this.mchDetailDBService.loadAccountData(orgParams).subscribe(res=>{
      if(res && res['status'] == 200 && res['data'] && res['data'].length > 0){
        let _data = res['data'];
        _data.forEach((item,ind)=>{
          let tmpTransId = _data[ind]['transId'];
          _data[ind]['transId'] = _.isEmpty(tmpTransId) ? [] : tmpTransId.split(',');
        });
        this.accountDB.dataChange.next(_data);
      }
    });
  }

  /**
   * 创建帐户信息
   * @param accountTable
   */
  onNewAccount(accountTable:MdTableExtend){
    accountTable.newRow();
  }
  onBefore(){
    let _params = {step:0,isEdit:true,
      id:this.ctr.params['id'],
      orgId:this.ctr.params['orgId'],
      name:this.ctr.params['name'],
      agencyName:this.ctr.params['agencyName'],
      chanNo:this.ctr.params['chanNo'],
      agencyCode:this.ctr.params['agencyCode'],
      parentChanNo:this.ctr.params['chanNo'],
      userNo:this.ctr.params['merchantNo'],
      categoryType:this.ctr.params['categoryType']

    };
    this.sidenavService.resetPageParams(_params);
    this.ctr.params = _params;
    this.ctr.onStep(0);
  }
  /**
   * 保存账号信息
   */
  onSaveAccounts(){
    if(this.hasData()){
      let flag: boolean = false;
      this.accountDB.data.forEach(_data=>{
        _data['orgId'] = this.ctr.params['orgId'];
        // _data['transId'] = _data['transId'].join(',');
        // console.log(_data);
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
      let _commitData = this.accountDB.data.filter(_data=>{
        return _data['isNewest'] !== true;
      });
      // console.log(this.ctr.params);
      this.mchDetailDBService.saveAccountInfos(_commitData).subscribe(res=>{
        if(res && res['status'] == 200){
          this.snackBar.alert('保存帐户信息成功！');
          let _params = {step:2,isEdit:true,source:this.ctr.params['source'],
            id:this.ctr.params['id'],
            orgId:this.ctr.params['orgId'],
            agencyCode:this.ctr.params['bankNo'] || this.ctr.params['agencyCode'],
            agencyName:this.ctr.params['bankName']|| this.ctr.params['agencyName'] ,
            chanNo:this.ctr.params['chanNo'],
            merchantNo:this.ctr.params['merchantNo'],
            parentChanNo:this.ctr.params['chanNo'],
            userNo:this.ctr.params['merchantNo'],
            categoryType:this.ctr.params['categoryType'],
            // ptCenterId:this.ctr.params['centerId'],
            merchantId:this.ctr.params['id']
          };
          this.sidenavService.resetPageParams(_params);
          this.ctr.params = _params;
          // console.log(this.ctr.params);
          this.ctr.onStep(2);
        }else{
          this.snackBar.alert(res['message']);
        }
      });
    }
  }
  /**
   * 表格点击编辑按钮事件
   * @param row
   */
  onEditAccount(row:any){
    //处理编辑状态下的其他数据的支付类型无法显示的问题
    row['transId'] = typeof row['transId'] == 'string' ? row['transId'].split(',') : row['transId'];
    this.loadBankLinkNoDB.params = {subBankName:row['subbranchName']};
    this.loadBankLinkNoDB.refreshChange.next(true);
  }
  /**
   * 表格点击确定按钮事件
   */
  onSaveAccount(){
    this.loadBankLinkNoDB.params = {};
  }
  /**
   * 表格点击取消按钮事件
   */
  onCancelAccount(){
    this.loadBankLinkNoDB.params = {};
  }
  /**
   * 表格点击确定按钮保存之前触发事件
   */
  onBeforeSaveAccount(row: any){
    let hasDataSourceInTransId = this.accountDB.data.find((item)=>{
      let _tmpTransId = _.isArray(item['transId']) ? item['transId'].join(',') : item['transId'];
      let flag = false;
      if(!(row['table_id'] == item['table_id'])){
        row['transId'].forEach((_rowTransId)=>{
          if(!_.isEmpty(_rowTransId) && _tmpTransId.indexOf(jQuery.trim(_rowTransId)) != -1){
            flag = true;
          }
        });
      }
      return flag;
    });
    if(hasDataSourceInTransId){
      this.snackBar.alert('支付类型已经存在，请调整！');
      return false;
    }
  }

  /**
   * 判断是否有数据
   */
  hasData():boolean{
    if(this.accountDB.data && this.accountDB.data.length > 0){
      return true;
    }
    return false;
  }



}
