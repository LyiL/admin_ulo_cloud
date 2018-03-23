import {Component, OnInit, ViewChild} from "@angular/core";
import {Column} from "app/common/components/table";

import {
  CommonDBService, LoadBankOrgDBService,
  LoadTableDbService
} from "../../../../../common/db-service/common.db.service";
import {ULODetailContainer} from "../../../../../common/components/detail/detail-container";
import {MdTableExtend} from "../../../../../common/components/table/table-extend";
import {ISidenavSrvice} from "../../../../../common/services/isidenav.service";
import {MdPupop, MdSelectChange, MdSnackBar} from "@angular/material";
import {HelpersAbsService} from "../../../../../common/services/helpers.abs.service";
import {InputSearchDatasource} from "../../../../../common/services/impl/input.search.datasource";
import {MchDetailDBService} from "../detail-component/mch.detail.list.db.service";
import {ULODetail} from "../../../../../common/components/detail/detail";
import {mchDetailChannelTradeRulerWinComponent} from "../detail-component/mch.detail.channel.tradeRuler.win.component";
import {Observable} from "rxjs/Observable";

@Component({
  selector:'mch-channel-info',
  templateUrl:'./mch.channel.info.component.html',
  providers:[CommonDBService,LoadBankOrgDBService,LoadTableDbService,MchDetailDBService]
})
export class MchChannelInfoComponent implements OnInit{
  public ctr:ULODetailContainer;
  public channelEditWinOption:any = {
    title:'渠道信息',
    isRequser:false
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
      hide:(function(row:any){
        if(!row['isEdit'] && row['isNew']){
          return false;
        }
        return true;
      }).bind(this)
    }]
  };
  public mchBaseData:any;
  public ruleState:any;
  public tradeType:any;
  public winParams:any;
  public parentNo:any;
  public tradeId:any;
  public forbidParams:any;
  constructor(public commonDBService:CommonDBService,public spOrganDb:LoadBankOrgDBService,public channelDB:LoadTableDbService,public pupop:MdPupop,
              public sidenavService:ISidenavSrvice, public mchDetailDBService:MchDetailDBService,public snackBar:MdSnackBar,public helper:HelpersAbsService){}

  ngOnInit():void{
    // console.log(33);
    // console.log(this.ctr.params);
    let ctrParams = this.ctr.params;
     this.mchBaseData = ctrParams;
    let parentNoParams:any={parentNo:this.mchBaseData.merchantNo};
    let params = this.sidenavService.getPageParams();
    if(params){
      //初始化服务商通道信息
      this.mchDetailDBService.loadChannelData({merchantId:params['id']}).subscribe(res=>{
        if(res && res['status'] == 200){
          this.channelDB.dataChange.next(res['data']);
        }
      });
      this.loadTradeRuleConf(parentNoParams);
    }
    this.channelColumns =    [
      {
        name:'transId',
        title:'支付类型',
        type:'select',
        otherOpts:{
          // disabled:((row:any,cell:any,e:any)=>{
          //   return !row['isNew'];
          // }).bind(this),
          disabled:false,
          valueField:'transId',
          required:true,
          displayField:'transType',
          data:this.commonDBService.syncLoadTradeType(),
          onChange:(function (row,change:MdSelectChange) {
            let value = change.source.selectOptionRes;
            row = this.helper.mergeObj(row,value,['used',"id","agencyCode"]);
            // console.log(row);
            row['transType'] = change.source.triggerValue;
            row['providerNo'] = "";
            row['ptCenterId'] = "";
            row['pcmPartkey'] = "";
            row['ally'] = "";
            if(this.helper.hasConfigValueMatch('CLOUD_ULO_BANK_NO',this.ctr.params['agencyCode'])){
              // row['bankNo'] = '';
              this.spOrganDb.params = {};
              this.spOrganDb.refreshChange.next(true);
            }
            let chanNo = this.ctr.params['chanNo'];
            this.commonDBService.reload.next({type:'loadCenter',params:{transId:change.value,bankNo:row["agencyCode"],parentChanCode:chanNo}});
            this.spOrganDb.params = {transId:change.value};
          }).bind(this)
        },
        render:(function(row:any,name:string){
          return row['transType'];
        }).bind(this)
      },{
        name:'agencyCode',
        title:'所属银行',
        type:'inputSearch',
        width:'280px',
        otherOpts:{
          required:true,
          disabled:((row:any,cell:any)=>{
            return row['isEdit'] && !row['isNew'];
          }).bind(this),
          displayFn:(function(value:any){
            return value && value['name'];
          }).bind(this),
          optionDisplayFn:(function(value:any){
            return value && value['name'] +'('+value['orgNo']+')';
          }).bind(this),
          filterField:["orgNo","name"],
          valueField:'orgNo',
          onBeforClick:(function(value:any){
            let flag:boolean = true;
            if(this.helper.isEmpty(value)){
              this.snackBar.alert('请输入关键字！');
              flag = false;
            }
            this.spOrganDb.params =_.extend(this.spOrganDb.params,{name:value});
            return flag;
          }).bind(this),
          onSelected:(function(row:any,data: any){
            if(data && data.value){
              row['agencyName'] = data.value.name;
              let chanNo = this.ctr.params['chanNo'];
              this.commonDBService.reload.next({type:'loadCenter',params:{bankNo:data.value.orgNo,transId:row["transId"],parentChanCode:chanNo}});
            }
          }).bind(this),
          dataSource:new InputSearchDatasource(this.spOrganDb)
        },
        render:(function(row:any){
          return this.helper.isEmpty(row['agencyName'])?  '/':row['agencyName'];
        }).bind(this)
      },{
        name:'ptCenterId',
        title:'通道类型',
        type:'select',
        otherOpts:{
          valueField:'id',
          required:true,
          displayField:'name',
          data:this.commonDBService.syncLoadCenter(),
          onChange:(function (row,change:MdSelectChange,data: any) {
            let value = change.source.selectOptionRes;
            // console.log(value);
            row['centerName'] = value.name;
            row['otherCenterId'] = value.otherCenterId;//后台需要这个参数
            row['otherCenterBank'] = value.otherCenterBank;
            row['providerNo'] = value.providerNo;
            row['pcmPartkey'] = value.pcmPartKey;
            row['ally'] = value.ally;
          }).bind(this)
        },
        render:(function(row:any,name:string){
          return this.helper.isEmpty(row['centerName'])?  '/':row['centerName'];
        }).bind(this)
      },{
        name:'providerNo',
        title:'渠道编号'
      },{
        name:'ally',
        title:'商户识别码'
      },{
        name:'thirdAppid',
        title:'商户APPID'
      },{
        name:'pcmPartkey',
        title:'商户密钥'
      },{
        name:'subAlly',
        title:'独立子商户号'
      }
    ];
  }
  public  loadTradeRuleConf(parentNoParams:any){
    this.mchDetailDBService.tradeRuleConf(parentNoParams).subscribe(res =>{
      if (res && res['status'] == 200) {
        if(!this.helper.isEmpty(res.data)){
          this.ruleState = res.data.ruleState;
          this.tradeType = res.data.tradeType;
          this.parentNo = res.data.parentNo;
          this.tradeId = res.data.tradeId
        }else{
          this.ruleState = 1;
          this.tradeType = "--";
        }

      }
    });
  }

  /**
   * 新增通道
   * @param channelTable
   */
  onNewChannel(channelTable: MdTableExtend){
    // console.log(this.ctr.params);
    //所属机构为银行时 ，渠道信息里的所属银行不可选（diabled）
    this.commonDBService.reloadTradeType.next({type:'loadTradeType',params:{userNo:this.ctr.params['merchantNo'],parentChanNo:this.ctr.params['chanNo'], categoryType:this.ctr.params['categoryType']}})
    if(!this.helper.hasConfigValueMatch("CLOUD_ULO_BANK_NO",this.mchBaseData['agencyCode'])){
      // console.log(this.ctr.params['agencyName']);
      let agencyName = this.mchBaseData['agencyName'];
      channelTable.newRow({agencyName:agencyName});
      this.spOrganDb.params = {name:this.mchBaseData['agencyCode']};
      this.spOrganDb.refreshChange.next(true);
      this.channelColumns[1].otherOpts['disabled'] = this.disableFn;
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
  onEditMchChannel(row:any){
    if(!this.helper.hasConfigValueMatch("CLOUD_ULO_BANK_NO",this.mchBaseData['agencyCode'])){
      // this.spOrganDb.params = {name: row['agencyCode']};
      // this.spOrganDb.refreshChange.next(true);
      this.channelColumns[1].otherOpts['disabled'] = this.disableFn;
    } else {
      this.channelColumns[1].otherOpts['disabled'] = this.disableFnF;
    }
    this.spOrganDb.params = {name: row['agencyCode']};
    this.spOrganDb.refreshChange.next(true);
    this.commonDBService.reloadTradeType.next({type:'loadTradeType',params:{userNo:this.ctr.params['merchantNo'],parentChanNo:this.ctr.params['chanNo'], categoryType:this.ctr.params['categoryType']}});
    this.commonDBService.reload.next({
      type: 'loadCenter',
      params: {bankNo: row['agencyCode'], transId: row['transId'],parentChanCode:this.ctr.params['chanNo'],userNo:this.ctr.params['merchantNo']}
    });

  }
  disableFnF(){
    return false  ;
  }
  onBefore(){
         let _params = {step:2,isEdit:true,source:this.ctr.params['source'],
           orgId:this.ctr.params['orgId'],
           name:this.ctr.params['name'],
           agencyCode: this.ctr.params['agencyCode'],
           agencyName:this.ctr.params['agencyName'],
           chanNo:this.ctr.params['chanNo'],
           merchantNo:this.ctr.params['merchantNo'],
           parentChanNo:this.ctr.params['chanNo'],
           userNo:this.ctr.params['merchantNo'],
           categoryType:this.ctr.params['categoryType'],
           id:this.ctr.params['id']};
        this.ctr.params = _params;
    this.sidenavService.resetPageParams(_params);
    this.ctr && this.ctr.onStep(2);
  }
  onUsed(){
    if(!this.ruleState){
      this.forbidParams = {parentNo:this.mchBaseData.merchantNo,ruleState:1};
      this.ruleState =  this.forbidParams.ruleState;
      this.tradeType = '-- ';
    }else{
      let tradeRule = this.pupop.openWin(mchDetailChannelTradeRulerWinComponent, {
        title: '正在操作停用业务路由，请选择一种支付类型进行交易！',
        width: '500px',
        height: '0',
        data:{
          merchantNo:this.mchBaseData.merchantNo,
          ruleState:this.ruleState,
          _params:this.ctr.params
        }
      });
      tradeRule.afterClosed().subscribe(result => {
        if(!this.helper.isEmpty(result)){
          this.winParams = result;
          this.ruleState =  this.winParams.ruleState;
          this.tradeType =  this.winParams.tradeType;
        }
      })
    }
  }

  /**
   * 保存渠道
   */
  onSaveChannels(){
    if(this.hasData()){
      let flag: boolean = false;
      let _msg: string;
      let _params = this.ctr.params;
      // console.log(_params);
      this.channelDB.data.forEach((data)=>{
        data['merchantId'] = _params['id'];
        data['applyState'] = 0;
        //剔除支付类型中括号与括号中的值
        let arr = this.helper.getDictByKey('MCH_TYPE');
        data['transType'] = this.helper.stringReplace(data['transType'],arr);
        if (this.helper.isEmpty(data['centerName']) || data['ptCenterId'] === 0) {
          flag = true;
          _msg = '通道类型不能为空';
        }
        if(data['isEdit'] == true){
          flag = true;
          _msg = '您有正在编辑的数据，请先确认或取消！';
        }else{
          // data['categoryType'] = data['categoryType'] instanceof Array ? data['categoryType'].join(',') : data['categoryType'];
        }
      });
      if(flag){
        this.snackBar.alert(_msg);
        return false;
      }
      let _commitData = this.channelDB.data.filter(data=>{
        return data['isNewest'] !== true;
      });
      let post1 = this.mchDetailDBService.saveChannelInfos(_commitData);
      if(this.ruleState){
        let post2 = this.mchDetailDBService.tradeRuleSave({parentNo:this.mchBaseData.merchantNo,ruleState:1});
        Observable.forkJoin([post1, post2]).subscribe(results=>{
          if(results && results[0] && results[1] && results[0]['status'] == 200 && results[1]['status'] == 200){
            this.snackBar.alert('保存通道信息成功！');
            this.ruleState =  results[1].data.ruleState;
            this.tradeType =  results[1].data.tradeType;
            // if(_params['source'] && _params['source'] == 'detail'){
            //   this.sidenavService.onNavigate('/admin/merchantdetail','商户详情',{id:_params['id'],orgId:_params['orgId'],chanCode:_params['chanCode'],name:_params['name'],ptCenterId:_params['ptCenterId'],agencyCode:_params['agencyCode']},true);
            // }else{
            //   this.sidenavService.onNavigate('/admin/mchlist','商户列表',{},true)
            // }
            let _params = {step:4,isEdit:true,source:this.ctr.params['source'],
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
            this.ctr.onStep(4);
          }else{
            this.snackBar.alert(results[0]['message'] + '<br/>' + results[1]['message']);
          }
        });
      }else{
        // console.log(this.winParams);
        let post2 = this.mchDetailDBService.tradeRuleSave(this.winParams || {parentNo: this.parentNo, ruleState:this.ruleState,tradeId:this.tradeId,tradeType:this.tradeType });
        // let post2 = this.mchDetailDBService.tradeRuleSave(this.winParams);
        Observable.forkJoin([post1, post2]).subscribe(results=>{
          if(results && results[0] && results[1] && results[0]['status'] == 200 && results[1]['status'] == 200){
            this.ruleState =  results[1].data.ruleState;
            this.tradeType =  results[1].data.tradeType;
            this.snackBar.alert('保存通道信息成功！');
            // if(_params['source'] && _params['source'] == 'detail'){
            //   this.sidenavService.onNavigate('/admin/merchantdetail','商户详情',{id:_params['id'],orgId:_params['orgId'],chanCode:_params['chanCode'],name:_params['name'],ptCenterId:_params['ptCenterId'],agencyCode:_params['agencyCode']},true);
            // }else{
            //   this.sidenavService.onNavigate('/admin/mchlist','商户列表',{},true)
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
            this.ctr.onStep(4);
          }else{
            this.snackBar.alert(results[0]['message'] + '<br/>' + results[1]['message']);
          }
        });
      }

      // this.mchDetailDBService.saveChannelInfos(_commitData).subscribe(res=>{
      //   if(res && res['status'] == 200){
      //     this.snackBar.alert('保存通道信息成功！');
      //     if(_params['source'] && _params['source'] == 'detail'){
      //       this.sidenavService.onNavigate('/admin/merchantdetail','详情',{id:_params['id'],orgId:_params['orgId'],chanCode:_params['chanCode'],name:_params['name'],ptCenterId:_params['ptCenterId'],agencyCode:_params['agencyCode']},true);
      //     }else{
      //       this.sidenavService.onNavigate('/admin/mchlist','服务商户列表',{},true)
      //     }
      //   }else{
      //     this.snackBar.alert(res['message']);
      //   }
      // });
    }
  }
  /**
   * 表格点击确定按钮事件
   */
  onSaveChannel(row:any){
    this.spOrganDb.params ={};
    // this.spOrganDb.refreshChange.next(true);
    // console.log(this.spOrganDb);
  }
  /**
   * 表格点击取消按钮事件
   */
  onCancelChannel($event){
    // console.log($event);
    // if(!$event.agencyCode){
    //   $event.agencyName = null;
    // }
    // if(!$event.ptCenterId){
    //   $event.centerName = null;
    // }
    this.spOrganDb.params = null;
  }

  /**
   * 表格点击确定按钮保存之前触发事件
   */
  onBeforeSaveChannel(row: any){
    // console.log(row);
    if(row['ptCenterId'] === 0 ){
      this.snackBar.alert("请选择通道类型!");
      return false;
    }
    let hasDataSourceInTransId = this.channelDB.data.find((item)=>{
      let _tmpTransId = _.isArray(item['transId']) ? item['transId'].join(',') : item['transId'];
      if(!(row['table_id'] == item['table_id']) && !_.isEmpty(row['transId']) && _tmpTransId.indexOf(row['transId']) != -1){
        return true;
      }
      return false;
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
    if(this.channelDB.data && this.channelDB.data.length > 0){
      return true;
    }
    return false;
  }
}
