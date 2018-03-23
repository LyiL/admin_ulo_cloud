/**
 * Created by lenovo on 2017/8/14.
 */
import {Component, Inject, LOCALE_ID, ViewChild} from "@angular/core";
import {DetailField, ULODetail} from "../../../../../common/components/detail/detail";
import {Column} from "../../../../../common/components/table/table-extend-config";
import {MdTableExtend} from "../../../../../common/components/table/table-extend";
import {Confirm, MdPupop, MdSelectChange, MdSnackBar} from "@angular/material";
import {ISidenavSrvice} from "../../../../../common/services/isidenav.service";
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/of";
import {HelpersAbsService} from "../../../../../common/services/helpers.abs.service";
import {InputSearchDatasource} from "../../../../../common/services/impl/input.search.datasource";
import {
  CommonDBService,
  LoadBankLinkNo,
  LoadBankOrgDBService,
  LoadTableDbService,
  LoadTableDbService2
} from "../../../../../common/db-service/common.db.service";
import {AgencyDetailDBService} from "../agency.list.db.service";
import {element} from "protractor";
import {ULODetailContainer} from "../../../../../common/components/detail/detail-container";

@Component({
  selector:'agency-detail-content',
  templateUrl:'agency.detail.content.component.html',
  providers:[LoadTableDbService,LoadTableDbService2,CommonDBService,LoadBankOrgDBService,AgencyDetailDBService,LoadBankLinkNo]
})
export class AgencyDetailContentComponent {

  public agencyDetailReqParam: any; //代理商详情参数
  public agencyDetailData:any;//代理商详情信息
  public agencyOperationLog:Observable<any>;//代理商操作日志
  @ViewChild('accountTable') accountTable:MdTableExtend;
  @ViewChild('agencyDetail') agencyDetail:ULODetail;
  public ctr:ULODetailContainer;

  public agencyDetailFields: Array<DetailField> = [{
    title:'企业信息',
    childs:[{
      title:'所属机构：',
      field:'bankName'
    },{
      title:'上级代理：',
      field:'parentChanName'
    },{
      title:'代理类型：',
      field:'appCode',
      render:(function(data:any,field:DetailField){
        if(!this.helper.isEmpty(data[field.field])){
          return this.helper.dictTrans('PROXY_TYPE',data[field.field]);
        }else{
          return '/';
        }
      }).bind(this)
    },{
      title:'企业名称：',
      field:'name'
    },{
      title:'企业简称：',
      field:'shortName'
    },{
      title:'代理商编号：',
      field:'chanCode'
    },{
      title:'企业邮箱：',
      field:'orgEmail'
    },{
      title:'所在地：',
      field:'provinceName',
      render:(function(data:any,field:DetailField){
        if(!this.helper.isEmpty(data[field.field])){
          return data[field.field] + ' ' + data['cityName']+' '+data['countyName'];
        }else{
          return '/';
        }
      }).bind(this)
    },{
      title:'经营地址：',
      field:'comAddress'
    },{
      title:'商户证件类型：',
      field:'certificateType',
      render:(function(data:any,field:DetailField){
        if(!this.helper.isEmpty(data[field.field])){
          return this.helper.dictTrans('CERTIFICATE_TYPE',data[field.field]);
        }else{
          return '/';
        }
      }).bind(this)
    },{
      title:'商户证件编号：',
      field:'linenceNo'
    },{
      title:'证件有效期：',
      //linenceTermStart 证件有效期开始时间，linenceTermEnd 证件有效期结束时间
      field:'linenceTermStart',
      render:(function(data:any,field:DetailField){
        if(!this.helper.isEmpty(data[field.field])){
          let beginTime = this.helper.format(data[field.field],'yyyy-MM-dd');
          let endTime = this.helper.format(data['linenceTermEnd'],'yyyy-MM-dd');
          return beginTime+' - '+endTime
        }else{
          return '/';
        }
      }).bind(this)
    },{
      title:'所属行业：',
      field:'categoryType',
      render:(function(data:any,field:DetailField){
        let _val = data[field.field];
        if(!this.helper.isEmpty(_val)){
          return this.helper.dictTrans('MCH_TYPE',_val[0]) + ' - ' + data['categoryName'];
        }else{
          return '/';
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
      // field:'salesmanNo'
      field: 'salesmanName'
    },{
      title:'分润规则：',
      field:'shareRule',
      render:((data:any,field:DetailField)=>{
        if(!this.helper.isEmpty(data[field.field])){
          return this.helper.dictTrans('PAYCENTER_CH_TYPE',data[field.field]);
        }else{
          return '/';
        }
      }).bind(this)
    },{
      title:'创建时间：',
      field: 'registerTime',
      type:"datetime"
    },{
      title:'审核时间：',
      field: 'examTime',
      type:"datetime"
    }]
  },{
    title:'负责人信息',
    childs:[{
      title:'负责人姓名：',
      field:'operator'
    },{
      title:'负责人类型：',
      field:'contactsType',
      render:(function(data:any,field:DetailField){
        if(!this.helper.isEmpty(data[field.field])){
          return this.helper.dictTrans('CONTACTS_TYPE',data[field.field]);
        }else{
          return '/';
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
    childs:[{
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
    childs:[{
      title:'营业执照：',
      field:'linenceImg',
      type:'image',
      // des:'描述信息',
      // joinField:['imageUrl','imageUrl2','imageUrl3','imageUrl4']
    },{
      title:'开户许可证：',
      field:'orgAccountImg',
      type:'image'
    },{
      title:'法人身份证-正面：',
      field:'indentityImg',
      type:'image'
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
    isRequser: true
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
    xtype: 'number',
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
    type:'inputSearch',
    width:'220px',
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
          this.snackBar.alert('请先输入过滤值！');
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
      // return row['subbranchName'];
      return this.helper.isEmpty(row['subbranchName'])?'/':row['subbranchName'];
    }).bind(this)
  },{
    name:'subbanrchCode',
    title:'联行号',
    otherOpts:{
      required:(row:any,cell:any)=>{
        return row['type'] == 1;
      },
    },
  },{
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
      valueField:'id',
      displayField:'name',
      required:true,
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
        if(this.helper.btnRole('AGENTACCOUNTEDIT') && !row['isEdit']){
          return false;
        }
        return true;
      }).bind(this)
    }]
  };


  constructor(public accountDB:LoadTableDbService,public channelDB:LoadTableDbService2,public sidenavSrvice:ISidenavSrvice,public snackBar:MdSnackBar,
              @Inject(LOCALE_ID) public _locale: string,public agencyDetailDBService:AgencyDetailDBService,public pupop:MdPupop,public helper:HelpersAbsService,
              public commonDBService:CommonDBService,public agencyOrganDb:LoadBankOrgDBService,public loadBankLinkNoDB:LoadBankLinkNo){}
  ngOnInit():void{
    this.loadData();
  }
  public loadData(isRefreash:boolean = false){
    let params = this.sidenavSrvice.getPageParams();

    if(params){
      //初始化查询参数
      let chanParams:any = {chanCode:params['chanCode']};
      let orgParams: any = {orgId:params['orgId']};

      //初始化代理商户账户信息
      this.loadAccountInfo(chanParams);

      //初始化代理商操作日志
      this.agencyDetailDBService.loadExamLog(orgParams).subscribe(res=>{
        if(res && res['status'] == 200){
          this.agencyOperationLog = Observable.of(res['data']);
        }
      });
      //代理商基本信息
      if(!isRefreash){
        this.agencyDetailReqParam = {
          url: '/agentInfo/getAgentDetail',
          params: params
        };
      }else{
        this.agencyDetail.refresh();
      }
    }
  }

  /**
   * 初始化代理商户账户信息
   */
  public loadAccountInfo(chanParams: any){
    this.agencyDetailDBService.loadAccountData(chanParams).subscribe(res=>{
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
   * 编辑代理商基本信息
   */
  public onEditBaseInfo(){
    this.sidenavSrvice.onNavigate('/admin/agencyedit','编辑',{isEdit:true,source:'detail',id:this.agencyDetailData['id'],orgId:this.agencyDetailData['orgId'],name:this.agencyDetailData['name'],chanCode:this.agencyDetailData['chanCode'],parentChanCode:this.agencyDetailData['parentChanCode']},true);
  }

  /**
   * 新增代理商账户信息
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
  onEditAgencyAccount(row:any){
    if(!this.helper.isEmpty(row['subbranchName'])){
      this.loadBankLinkNoDB.params = {subBankName:row['subbranchName']};
      this.loadBankLinkNoDB.refreshChange.next(true);
    }
  }
  /**
   * 保存代理商账户信息
   * @param value
   */
  public onSaveAccount(value:any){
    let vals:Array<any> = [];
    let _value = this.helper.clone(value);
    _value['orgId'] = this.agencyDetailData['orgId'];
    _value['transId'] = _value['transId'] instanceof Array ? _value['transId'].join(',') : _value['transId'];
    vals.push(_value);
    this.loadBankLinkNoDB.params = {};

    return this.agencyDetailDBService.saveAccountInfos(vals).map(res=>{
      if(res && res['status'] == 200){
        this.snackBar.alert('保存账户信息成功！');
        // this.loadAccountInfo({chanCode:this.agencyDetailData['chanCode']});//保存成功时刷新表格
        this.loadData(true);//刷新
        return res;
      }else{
        this.snackBar.alert(res['message']);
        //保存失败时，该数据需要保持在编辑状态
        value['isEdit'] = true;
        return undefined;
      }
    });

  }
  /**
   * 表格点击取消事件
   */
  onCancelAccount(){
    this.loadBankLinkNoDB.params = {};
    this.loadAccountInfo({chanCode:this.agencyDetailData['chanCode']});//刷新表格
  }

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
      title:'审核代理商',
      statusDatas:this.helper.getDictByKey('EXAMINE_STATUS'),
      statusField:{
        name: 'examState',
        value: this.agencyDetailData['examState']
      },
      remarkField:{
        name:'examIllu',
        value:''
      },
      onConfirm:(function(value:any){
        value = _.extend(value,{id:this.agencyDetailData['id'],chanCode: this.agencyDetailData['chanCode']});
        return this.agencyDetailDBService.examineAgency(value).map(res=>{
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
    let _confirm = this.pupop.confirm({message:'您确定需要发送邮件与短信吗？'});
    _confirm.afterClosed().subscribe(res=>{
      if(res && res == Confirm.YES){
        this.agencyDetailDBService.sendEmailAndSTM({chanCode:this.agencyDetailData['chanCode']}).subscribe(res=>{
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
   * 明细数据加载完成
   * @param data
   */
  public agencyDetailDataLoaded(data:any){
    this.agencyDetailData = data;
    /**
     * 把参数传给父组件，其他子组件可以取到this.ctr.params
     */
    if(this.ctr){
      this.ctr.params = {
        chanCode:data['chanCode'],
        name:data['name'],
        orgId: data['orgId'],
        bankCode:data['bankCode'],
        parentChanCode: data['parentChanCode'],
      };
    }
  }

  /**
   * 判断用户审核状态
   * [{"id":0,"name":"待审核"},{"id":1,"name":"通过"},{"id":2,"name":"未通过"},{"id":3,"name":"冻结"},{"id":4,"name":"接口"}]
   */
  public userState():string{
    if(!this.agencyDetailData){
      return '';
    }
    let _state = this.agencyDetailData['examState'];
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


