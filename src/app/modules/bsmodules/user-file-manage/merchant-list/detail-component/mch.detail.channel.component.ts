import {Component, Inject, LOCALE_ID, OnInit, ViewChild} from "@angular/core";
import {DetailField, ULODetail} from "../../../../../common/components/detail/detail";
import {MchCfgAccountDBService, MchChannelDBService, MchDetailDBService} from "./mch.detail.list.db.service";
import {Column, MdTableExtendConfig} from "../../../../../common/components/table/table-extend-config";
import {MdTableExtend} from "../../../../../common/components/table/table-extend";
import {Confirm, MdPupop, MdSelectChange, MdSnackBar} from "@angular/material";
import {Observable} from "rxjs";
import {HelpersAbsService} from "../../../../../common/services/helpers.abs.service";
import {ISidenavSrvice} from "../../../../../common/services/isidenav.service";
import {InputSearchDatasource} from "../../../../../common/services/impl/input.search.datasource";
import {
  CommonDBService, LoadBankLinkNo,
  LoadBankOrgDBService
} from "../../../../../common/db-service/common.db.service";
import {isBoolean} from "util";
import {rendererTypeName} from "@angular/compiler";
import {ULODetailContainer} from "app/common/components/detail";
import {mchDetailChannelTradeRulerWinComponent} from "./mch.detail.channel.tradeRuler.win.component";

@Component({
  selector:'mch-detail-channel',
  templateUrl:'mch.detail.channel.component.html',
  providers:[MchChannelDBService,MchDetailDBService,CommonDBService,LoadBankOrgDBService,LoadBankLinkNo]
})
export class MchDetailChannelComponent implements OnInit{
  public ctr:ULODetailContainer;
  @ViewChild('channelTable') channelTable:MdTableExtend;

  public channelEditWinOption:any = {
    title:'渠道信息',
    isRequser:true
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
      hide:true
    },{
      btnDisplay :'进件',
      hide:((row:any)=>{
        if(!this.helper.btnRole('MCHINTOPIECES')){
          return true;
        }
        if(row['applyState'] == 0){
          return false;
        }
        return true;
      }).bind(this),
      disabled:((row:any)=> {
        if (row['isEdit']) {
          return true
        }
      }),
      click:this.onInto.bind(this)
    },{
      btnDisplay:"重新进件",
      hide:((row:any)=>{
        if(row['applyState'] == 3){
          return false;
        }
        return  true;
      }),
      disabled:((row:any)=> {
        if (row['isEdit']) {
          return true
        }
      }),
      click:this.onReInto.bind(this)
    }, {
      btnName:'edit',
      hide:((row:any)=>{
        if(this.helper.btnRole('MCHPGEDIT') && !row['isEdit']){
          if(row['applyState'] == 1 || row['applyState'] == 4){
            return true;
          }
          if((row['applyState'] == 2 || row['applyState'] ==0 || row['applyState'] ==3)   && !row['isEdit']){
            return false;
          }
        }
        return true;
      }).bind(this)
    }
    ]
  };
public mchData:any;
public ruleState:any;
public tradeType:any;
  constructor( public commonDBService:CommonDBService,public mchOrganDb:LoadBankOrgDBService,@Inject(LOCALE_ID) public _locale: string,public channelDB:MchChannelDBService,public snackBar:MdSnackBar,
               public sidenavService:ISidenavSrvice,public helper:HelpersAbsService,public pupop:MdPupop,public mchDetailDBService:MchDetailDBService,public loadBankLinkNoDB:LoadBankLinkNo
  ){}
  ngOnInit():void{
    let params = this.ctr.params;
    this.mchData = params;
    // let parentNoParams:any={parentNo:this.mchData.merchantNo};
    this.loadData();
    this.channelColumns= [
      {
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
            row = this.helper.mergeObj(row,value,['used',"id","agencyCode"]);
            // console.log(row);
            row['transType'] = change.source.triggerValue;
            row['providerNo'] = '';
            row['ptCenterId'] = "";
            row['ally'] = "";
            row['pcmPartkey'] = "";
            if(this.helper.hasConfigValueMatch('CLOUD_ULO_BANK_NO',this.ctr.params['bankNo'])){
              // row['bankNo'] = '';
              this.mchOrganDb.params = {};
              this.mchOrganDb.refreshChange.next(true);
            }
            this.commonDBService.reload.next({type:'loadCenter',params:{transId:change.value,bankNo:row["agencyCode"],parentChanCode:this.ctr.params['chanNo']}});
            this.mchOrganDb.params={transId:change.value}
          }).bind(this),
          required:true
        },
        render:(function(row:any,name:string){
          return row['transType'];
        }).bind(this)
      },{
        name:'agencyCode',
        title:'所属银行',
        type:'inputSearch',
        width:'220px',
        otherOpts:{
          required:true,
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
            this.mchOrganDb.params =_.extend(this.mchOrganDb.params,{name:value});
            return flag;
          }).bind(this),
          onSelected:(function(row:any,data: any){
            if(data &&　data.value){
              row['agencyName'] = data.value.name;
              this.commonDBService.reload.next({type:'loadCenter',params:{bankNo:data.value.orgNo,transId:row["transId"],parentChanCode:this.ctr.params['chanNo']}});
            }
          }).bind(this),
          dataSource:new InputSearchDatasource(this.mchOrganDb),
          disabled:((row:any,cell:any,e:any,)=>{
            return row['isEdit'] && !row['isNew'];
          }).bind(this)
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
          displayField:'name',
          data:this.commonDBService.syncLoadCenter(),
          // data:this.commonDBService.loadCenter({}),
          onChange:(function (row,change:MdSelectChange) {
            let value = change.source.selectOptionRes;
            // console.log(value);
            row['centerName'] = value.name;
            row['otherCenterId'] = value.otherCenterId;//后台需要这个参数
            row['otherCenterBank'] = value.otherCenterBank;
            row['providerNo'] = value.providerNo;
            row['ally'] = value.ally;
            row['pcmPartkey'] = value.pcmPartKey;
          }).bind(this),
          required:true
        },
        render:(function(row:any,name:string){
          return this.helper.isEmpty(row['centerName'])?  '/':row['centerName'];
        }).bind(this)
      },{
        name:'providerNo',
        title:'渠道编号'
      },{
        name:'applyState',
        title:'进件状态',
        type:'select',
        otherOpts:{
          valueField:'id',
          displayField:'name',
          data:Observable.of(this.helper.getDictByKey('APPLY_STATE').filter((item=>{
            return item['id'] != 1;
          })))
          // disabled:((row:any,cell:any,e:any)=>{
          //   return row['isEdit'] && !row['isNew'];
          // }).bind(this)
        },
        render:(function(row:any,name:string,cell:any){
          let _status = row[name];
          switch(_status){
            case 0:
            case 3:
            case 4:
              cell.bgColor = 'danger-bg';
              break;
            case 2:
              cell.bgColor = 'success-bg';
              break;
            case 1:
              cell.bgColor = 'warning-bg';
              break;
          }
          return this.helper.dictTrans('APPLY_STATE',_status);
        }).bind(this)
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
    // this.mchDetailDBService.tradeRuleConf(parentNoParams).subscribe(res =>{
    //   if (res && res['status'] == 200) {
    //     this.ruleState = res.data.ruleState;
    //     this.tradeType = res.data.tradeType;
    //   }
    // });
    // this.loadTradeRuleConf(parentNoParams);

  }
  public  loadTradeRuleConf(parentNoParams:any){
    this.mchDetailDBService.tradeRuleConf(parentNoParams).subscribe(res =>{
      if (res && res['status'] == 200) {
        // console.log(res.data);
        if(!this.helper.isEmpty(res.data)){
          this.ruleState = res.data.ruleState;
          this.tradeType = res.data.tradeType;
        }else{
          this.ruleState = 1;
          this.tradeType = "--";
        }

      }
    });
  }
  public loadData(isRefreash:boolean = false){
    let params = this.ctr.params;
    this.mchData = params;
    let parentNoParams:any={parentNo:this.mchData.merchantNo};
    // console.log(params);
    if(params){
      //初始化查询参数
      let mchParams:any = {merchantId:params['id']};
      let orgParams:any = {orgId:params['orgId']};

      this.loadChannelInfo(mchParams);
      this.loadTradeRuleConf(parentNoParams);
    }
  }
  public loadChannelInfo(orgParams: any) {
    this.mchDetailDBService.loadChannelData(orgParams).subscribe(res => {
      if (res && res['status'] == 200) {
        this.channelDB.dataChange.next(res['data']);
      }
    });
  }


  /**
   * 进件
   * @param row
   * @param e
   */

  public onInto(row:any,e:MouseEvent){
    if(this.helper.isEmpty(row["agencyCode"])){
      this.snackBar.alert('请输入所属银行');
      return;
    }
    if(row['ptCenterId'] == 0){
      this.snackBar.alert('请输入通道类型');
    }else {
      if(row['applyState'] == 0){
        this.mchDetailDBService.loadOnInto({providerNo:row['providerNo'] ,ptCenterId:row['ptCenterId'], merchantId:row['merchantId'],agencyCode:row['agencyCode'] ,id:row['id']}).subscribe(res =>{
          if(res && res['status'] == 200){
            this.snackBar.alert('进件成功');
            this.loadChannelData({merchantId:this.ctr.params['id']})
          }else {
            this.snackBar.alert(res['message']);
          }
        })
      }
    }
  }
  /**
   * 重新进件
   * @param row
   * @param e
   */
  public onReInto(row:any,e:MouseEvent){
    if(row['applyState'] == 3 || row['applyState'] == 4){
      this.mchDetailDBService.loadOnInto({
        providerNo:row['providerNo'] ,ptCenterId:row['ptCenterId'], merchantId:row['merchantId'],agencyCode:row['agencyCode'] ,id:row['id']
      }).subscribe(res =>{
        if(res && res['status'] == 200){
          this.snackBar.alert('重新进件成功');
          this.loadChannelData({merchantId:this.ctr.params['id']})
        }else {
          this.snackBar.alert(res['message']);
        }
      })
    }
  }



  /**
   * 新增商户通道信息
   * @param table
   * @param e
   */
  public onNewChannel(channelTable){
    //所属机构为银行时 ，渠道信息里的所属银行不可选（diabled）
      this.commonDBService.reloadTradeType.next({type:'loadTradeType',params:{userNo:this.mchData['merchantNo'],parentChanNo:this.mchData['chanNo'], categoryType:this.mchData['categoryType']}})
      if(!this.helper.hasConfigValueMatch('CLOUD_ULO_BANK_NO',this.ctr.params['bankNo'])){
      channelTable.newRow();
      this.mchOrganDb.params = {name:this.ctr.params['bankNo']};
      this.mchOrganDb.refreshChange.next(true);
      this.channelColumns[1].otherOpts['disabled'] = this.disableFn;
    }else{
      this.channelColumns[1].otherOpts['disabled'] = this.disableFnF;
      channelTable.newRow();
    }
  }
  disableFn(){
    return true;
  }


  /**
   * 点击编辑渠道商信息按钮触发前事件
   * @param row
   */
  public onEditMchChannel(row:any) {
    if (this.helper.isEmpty(row['agencyCode'])) {
      this.channelColumns[1].otherOpts['disabled'] = this.disableFnF;
    }else {
      this.channelColumns[1].otherOpts['disabled'] = this.disableFn;
    }
    this.mchOrganDb.params = {name: row['agencyCode']};
    this.mchOrganDb.refreshChange.next(true);
    this.commonDBService.reloadTradeType.next({type:'loadTradeType',params:{userNo:this.ctr.params['merchantNo'],transId: row['transId'],parentChanNo:this.ctr.params['chanNo'], categoryType:this.ctr.params['categoryType']}});
    this.commonDBService.reload.next({
      type: 'loadCenter',
      params: {bankNo: row['agencyCode'], transId: row['transId'],parentChanCode:this.ctr.params['chanNo']}
    });
  }

  disableFnF(){
    return false  ;
  }


  /**
   * 保存商户渠道信息
   * @param value
   */
  public onSaveChannel(value:any){
    // console.log(value)
    // let vals:Array<any> = [];
    value['merchantId'] =this.ctr.params['id'];
    if(value['applyState']){
      value['applyState']  = value['applyState'];
    }else {
      value['applyState'] = 0;
    }
    let arr = this.helper.getDictByKey('MCH_TYPE');
    value['transType'] = this.helper.stringReplace(value['transType'],arr);
    // vals.push(value);
    this.mchOrganDb.params = {};

    return this.mchDetailDBService.saveChannelSingle(value).map(res=>{
      if(res && res['status'] == 200){
        this.snackBar.alert('保存渠道信息成功！');
        this.loadChannelData({merchantId:this.ctr.params['id']});
        return res;
      }else{
        this.snackBar.alert(res['message']);
        value['isEdit'] = true;
        return undefined;
      }
    });
  }
  /**
   * 表格点击取消事件
   */
  onCancelChannel(){
    this.mchOrganDb.params = {};
    this.loadChannelData({merchantId:this.ctr.params['id']})
  }
  // 封装初始化渠道表格
  public loadChannelData(channelparams:any){
    this.mchDetailDBService.loadChannelData(channelparams).subscribe(res=>{
      if(res && res['status'] == 200){
        this.channelDB.dataChange.next(res['data']);
      }
    });
  }

  /**
   * 表格点击确定按钮保存之前触发事件
   */
  onBeforeSaveChannel(row: any){
    if(row['ptCenterId'] ==0 ){
      row['ptCenterId'] =null;
    }
    let hasDataSourceInTransId = this.channelDB.data.find((item)=>{
      // console.log(item);
      let _tmpTransId = _.isArray(item['transId']) ? item['transId'].join(',') : item['transId'];
      if( item['applyState'] === 3 || item['applyState'] === 4 ){
        return false;
      }
      if(!(row['table_id'] == item['table_id']) && !_.isEmpty(row['transId']) && _tmpTransId.indexOf(row['transId']) != -1 ){
        return true;
      }
      return false;
    });

    if(hasDataSourceInTransId){
      this.snackBar.alert('支付类型不能重复，请调整！');
      return false;
    }
  }

  onUsed(){
    if(!this.ruleState){
      this.mchDetailDBService.tradeRuleSave({parentNo:this.mchData.merchantNo,ruleState:1}).subscribe(res =>{
        if (res && res['status'] == 200) {
          this.ruleState = res.data.ruleState;
          this.tradeType = res.data.tradeType;
          // this.loadTradeRuleConf({parentNo:this.mchData.merchantNo})
        }
      });
      // this.loadTradeRuleConf({parentNo:this.mchData.merchantNo})
    }else{
      let tradeRule = this.pupop.openWin(mchDetailChannelTradeRulerWinComponent, {
        title: '正在操作停用业务路由，请选择一种支付类型进行交易！',
        width: '500px',
        height: '0',
        data:{
          merchantNo:this.mchData.merchantNo,
          ruleState:this.ruleState
        }
      });
      tradeRule.afterClosed().subscribe(result => {

        // if(this.ruleState){
        //   this.loadTradeRuleConf({parentNo:this.mchData.merchantNo})
        // }
        this.mchDetailDBService.tradeRuleConf({parentNo:this.mchData.merchantNo}).subscribe(res =>{
          if (res && res['status'] == 200) {
            if(!this.helper.isEmpty(this.ruleState)){
              if(res.data){
                this.ruleState = res.data.ruleState;
                this.tradeType = res.data.tradeType;
              }else{
                this.ruleState = 1;
                this.tradeType = "--";
              }
            }else{
              this.ruleState = 1;
              this.tradeType = "--";
            }
          }
        });
      })
    }
  }

}


