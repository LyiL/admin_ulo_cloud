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

@Component({
  selector:'mch-detail-list',
  templateUrl:'mch.detail.list.component.html',
  providers:[MchChannelDBService,MchCfgAccountDBService,MchDetailDBService,CommonDBService,LoadBankOrgDBService,LoadBankLinkNo]
})
export class MchDetailListComponent implements OnInit{
  public ctr:ULODetailContainer;
  @ViewChild('channelTable') channelTable:MdTableExtend;
  @ViewChild('mchDetail') mchDetail:ULODetail;
  /**
   * 商户详情参数
   * @type {{url: string}}
   */
  public MchDetailReqParam:any;
  //商户操作日志记录
  public mchOperationRecord:Observable<any>;
  //商户详情信息
  public mchDetailData:any;

  /**
   * 商户详情字段
   * @type {Array}
   */
  public MchDetailFields:Array<DetailField> =
    [
    {
      title:'企业信息',
      childs:[
        {
          title:'所属机构：',
          field:'bankName'
        },{
          title:'所属上级：',
          field:'chanName'
        },
        {
          title:'企业名称：',
          field:'name'
        },{
          title:'企业简称：',
          field:'shortName'
        },{
          title:'商户编号：',
          field:'merchantNo'
        },{
          title:'企业邮箱：',
          field:'orgEmail'
        },{
          title:'所在地：',
          field:'provinceName',
          render:(function(data:any,field:DetailField){
            if(!this.helper.isEmpty(data[field.field])){
              return data[field.field] + ' ' + data['cityName']+' '+data['countyName'];
            }else {
              return "/"
            }
          }).bind(this)
        },{
          title:'经营地址：',
          field:'address'
        },{
          title:'商户证件类型：',
          field:'certificateType',
          render:(function(data:any,field:DetailField){
            if(data && data[field.field] !== undefined){
              return this.helper.dictTrans('CERTIFICATE_TYPE',data[field.field]);
            }else {
              return "/"
            }
          }).bind(this)
        },{
          title:'商户证件编号：',
          field:'linenceNo'
        },{
          title:'证件有效期：',
          field:'linenceTermStart',
          render:(function(data:any,field:DetailField){
            if(!this.helper.isEmpty(data[field.field])){
              let beginTime = this.helper.format(data[field.field],'yyyy-MM-dd');
              let endTime = this.helper.format(data['linenceTermEnd'],'yyyy-MM-dd');
              return beginTime+' - '+endTime
            }else {
              return "/"
            }
          }).bind(this)
        },{
          title:'所属行业：',
          field:'categoryType',
          render:(function(data:any,field:DetailField){
            let _val = data[field.field];
            if(!this.helper.isEmpty(_val)){
              return this.helper.dictTrans('PAY_MCH_ISBIGBUSI',data['mchRole']) +"-" +this.helper.dictTrans('MCH_TYPE',_val[0]) + ' - ' + data['mchTypeName']
            }else {
              return "/"
            }
          }).bind(this)
        },{
          title:'企业网站：',
          field:'orgWebsite'
        },{
          title:'客服电话：',
          field:'customerPhone'
        },{
          title:'所属业务员：',
          field:'salesmanName'
        },{
          title:'创建时间：',
          field:'createdTime',
          type:"datetime"
        },{
          title:'审核时间：',
          field:'examTime',
          type:"datetime"
        }]
    },{
      title:'负责人信息',
      childs:[
        {
        title:'负责人姓名：',
        field:'operator'
      },{
        title:'负责人类型：',
        field:'contactsType',
          render:(function(data:any,field:DetailField){
            if(!this.helper.isEmpty(data[field.field])){
              return this.helper.dictTrans('CONTACTS_TYPE',data[field.field]);
            }else {
              return "/"
            }
          }).bind(this)
      },{
        title:'身份证号：',
        field:'operatorIdno'
      },{
        title:'负责人电话：',
        field:'operatorPhone'
      },{
        title:'负责人邮箱：',
        field:'operatorEmail'
      }]
    },{
      title:'联系人信息',
      childs:[
        {
        title:'联系人姓名：',
        field:'linkman'
      },{
        title:'联系人邮箱：',
        field:'email'
      },{
        title:'联系人手机：',
        field:'phone'
      }]
    },{
      title:'附件信息',
      childs:[
        {
        title:'营业执照：',
        field:'linenceImg',
        type:'image',
        // des:'aflkasjdflaflaskfjlasfjlasjfklajfklajflajsklfajsfkjasdklfjaklsdfjakls',
        // joinField:['imageUrl','imageUrl2','imageUrl3','imageUrl4']
      },{
        title:'开户许可证：',
        field:'orgAccountImg',
        type:'image'
      },{
        title:'法人身份证-正面：',
        field:'indentityImg',
        type:'image',
          joinField:['operatorIdno']
      },{
        title:'法人身份证-反面：',
        field:'indentityBackImg',
        type:'image'
      },{
        title:'银行卡照：',
        field:'bankCardImg',
        type:'image'
      }]
    }];
  public accountEditWinOption:any = {
    title:'账户信息',
    isRequser:true
  };

  /**
   * 账户信息表格列
   * @type {Array}
   */
  public accountColumns:Array<Column> =
    [
    {
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
        valueField:'id',
        displayField:'name',
        required:true,
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
    type:'inputSearch',
    title:'开户支行',
      width:'170px',
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
        return  this.helper.isEmpty(row['subbranchName'])? "/":row['subbranchName'];
      }).bind(this)
      }
  ,{
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
          valueField:'id',
          displayField:'name',
          required:true,
          data:Observable.of(this.helper.getDictByKey('BANK_ACT_TRADE_TYPE'))
        },
        render:(function(row:any,name:string){
          let _transIds:any = row[name];
          let _transNames:Array<string> = [];
          if(_transIds && _transIds.length > 0){
            _transIds.forEach && _transIds.forEach((_transId:any)=>{
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
      hide:true

    },{
      btnName:'edit',
      hide:((row:any)=>{
        if(this.helper.btnRole('MCHACCOUNTEDIT') && !row['isEdit']){
          return false;
        }
        return true;
      }).bind(this)
    }
    ]
  };


  constructor( public commonDBService:CommonDBService,public mchOrganDb:LoadBankOrgDBService,@Inject(LOCALE_ID) public _locale: string,
    public accountDB:MchCfgAccountDBService,public channelDB:MchChannelDBService,public snackBar:MdSnackBar,
  public sidenavService:ISidenavSrvice,public helper:HelpersAbsService,public pupop:MdPupop,public mchDetailDBService:MchDetailDBService,public loadBankLinkNoDB:LoadBankLinkNo
  ){}
  ngOnInit():void{
    this.loadData();
  }
    // console.log(this.helper.btnRole('MCHINTOPIECES'));

  public loadData(isRefreash:boolean = false){
    let params = this.sidenavService.getPageParams();
    // console.log(params);
    if(params){
      //初始化查询参数
      let mchParams:any = {merchantId:params['id']};
      let orgParams:any = {orgId:params['orgId']};
      //初始化商户帐户信息
      this.loadAccentData(orgParams);
      // this.mchDetailDBService.loadAccountData(orgParams).subscribe(res=>{
      //   if(res && res['status'] == 200 && res['data'] && res['data'].length > 0){
      //     let _data = res['data'];
      //     _data.forEach((item,ind)=>{
      //       let tmpTransId = _data[ind]['transId'];
      //       _data[ind]['transId'] = _.isEmpty(tmpTransId) ? [] : tmpTransId.split(',');
      //     });
      //     this.accountDB.dataChange.next(_data);
      //   }
      // });


      //初始化商户操作日志
      this.mchDetailDBService.loadExamLog({orgId:params['orgId']}).subscribe(res=>{
        if(res && res['status'] == 200){
          this.mchOperationRecord = Observable.of(res['data']);
        }
      });
      //
      if(!isRefreash){
        this.MchDetailReqParam = {
          params:{id:params['id']},
          url:'/mchManager/search/mchInfo',
        }
      }else {
        this.mchDetail.refresh();
      }

    }
    }

  /**
   * 编辑商户基础信息
   */
  public onBaseInfoHeadler(){
    this.sidenavService.onNavigate('/admin/merchantadd','编辑商户',{isEdit:true,source:'detail',id:this.mchDetailData['id'],orgId : this.mchDetailData['orgId'],merchantNo:this.mchDetailData['merchantNo'],chanNo:this.mchDetailData['chanNo']},true);
  }
  /**
   * 新增商户帐户信息
   * @param table
   * @param e
   */
  public onNewAccount(accountTable:MdTableExtend){
    accountTable.newRow();
  }
  /**
   * 表格点击编辑按钮事件
   * @param row
   */
  public onEditAccount(row:any){
    if(!this.helper.isEmpty(row['subbranchName'])){
      // row['transId'] = !(row['transId'] instanceof Array )?  row['transId'].split(',') :  row['transId'];
      this.loadBankLinkNoDB.params = {subBankName:row['subbranchName']};
      this.loadBankLinkNoDB.refreshChange.next(true);
    }
  }

  /**
   * 保存商户帐户信息
   * @param value
   */
  public onSaveAccount(value:any){
    let vals:Array<any> = [];
    let _value = this.helper.clone(value);
    _value['orgId'] = this.mchDetailData['orgId'];
    _value['transId'] = _value['transId'].join(',');
    vals.push(_value);
    this.loadBankLinkNoDB.params = {};
    return this.mchDetailDBService.saveAccountInfos(vals).map(res=>{
      if(res && res['status'] == 200){
        this.snackBar.alert('保存帐户信息成功！');
        //保存成功时刷新表格
        this.loadAccentData({orgId:this.mchDetailData['orgId']});
        this.loadData(true);
        return res;
      }else{
        this.snackBar.alert(res['message']);
        //保存失败时，该数据需要保持在编辑状态
        value['isEdit'] = true;
        return undefined;
      }
    });

  }

  onCancelAccount(){
    this.loadBankLinkNoDB.params = {};
    this.loadAccentData({orgId:this.mchDetailData['orgId']})
  }

  /**
   * 初始化商户账户信息
   */
  public loadAccentData(orgParams: any){
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
   * 审核服务
   */
  public onExamine(){
    this.pupop.openStatus({
      title:'审核商户',
      statusDatas:this.helper.getDictByKey('EXAMINE_STATUS'),
      statusField:{
        name: 'examState',
        value: this.mchDetailData['examState']
      },
      remarkField:{
        name:'examIllu',
        value:''
      },
      onConfirm:(function(value:any){
        value = _.extend(value,{id:this.mchDetailData['id']});
        return this.mchDetailDBService.examineSP(value).map(res=>{
          if(res && res['status'] == 200){
            this.loadData(true);
          }
          return res;
        });
      }).bind(this)
    });
  }

  /**
   * 发送邮件与短信
   */
  public onSendEmailAndSTM(){
    // console.log(this.mchDetailData);
    let _confirm = this.pupop.confirm({message:'您确定需要发送邮件与短信吗？'});
    _confirm.afterClosed().subscribe(res=>{
      if(res && res == Confirm.YES){
        this.mchDetailDBService.sendEmailAndSTM({id:this.mchDetailData['id']}).subscribe(res=>{
          if(res && res['status'] == 200){
            this.snackBar.alert('邮件与短信发送成功！');
          }else{
            this.snackBar.alert(res['message']);
          }
        });
      }
    });
  }

  /**
   * 获取明细数据
   */
  public onDetailData(data:any){
    this.mchDetailData = data;
    if(this.ctr){
      this.ctr.params ={
        userNo:data['merchantNo'],
        id:data['id'],
        orgId : data['orgId'],
        merchantNo:data['merchantNo'],
        bankNo:data['bankNo'],
        chanNo:data['chanNo'],
        parentChanNo:data['chanNo'],
        categoryType:data['categoryType']
      }
    }
  };
  /**
   * 判断用户审核状态
   * [{"id":0,"name":"待审核"},{"id":1,"name":"通过"},{"id":2,"name":"未通过"},{"id":3,"name":"冻结"},{"id":4,"name":"接口"}]
   */
  public userState():string{
    if(!this.mchDetailData){
      return '';
    }
    let _state = this.mchDetailData['examState'];
    let _stateClass = 'normal';
    switch (_state){
      case 0://待审核
        _stateClass = 'pending-audit';
        break;
      case 1://通过
        _stateClass = 'normal';
        break;
      case 2://未通过
        _stateClass = 'fail';
        break;
      case 3:
      case 4:
        _stateClass = 'in-process';
        break;
    }
    return _stateClass;
  }


}

