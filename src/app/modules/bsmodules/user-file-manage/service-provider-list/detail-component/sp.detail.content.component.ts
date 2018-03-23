import {Component, LOCALE_ID, Inject, OnInit, ViewChild} from "@angular/core";
import {DetailField, ULODetail} from "../../../../../common/components/detail/detail";
import {Column} from "../../../../../common/components/table/table-extend-config";
import {SPDetailDBService} from "../sp.db.service";
import {ISidenavSrvice} from "../../../../../common/services/isidenav.service";
import {
  LoadTableDbService,
  CommonDBService,
  LoadTableDbService2,
  LoadBankOrgDBService, LoadBankLinkNo
} from "../../../../../common/db-service/common.db.service";
import {MdPupop, Confirm, MdSnackBar, MdSelectChange} from "@angular/material";
import {HelpersAbsService} from "../../../../../common/services/helpers.abs.service";
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/of";
import {MdTableExtend} from "../../../../../common/components/table/table-extend";
import {InputSearchDatasource} from "../../../../../common/services/impl/input.search.datasource";
import {ULODetailContainer} from "../../../../../common/components/detail/detail-container";

/**
 * 服务商户详情控件
 */
@Component({
  selector:'ulo-sp-detail-content',
  templateUrl:'sp.detail.content.component.html',
  providers:[LoadTableDbService,LoadTableDbService2,SPDetailDBService,CommonDBService,LoadBankOrgDBService,LoadBankLinkNo]
})
export class ULOSPDetailContentComponent implements OnInit{

  public spDetailReqParam:any;//服务商详情参数
  public spDetailData:any;//服务商详情信息
  public spOperationLog:Observable<any>;//服务商操作日志
  @ViewChild('spDetail') spDetail:ULODetail;
  public ctr: ULODetailContainer;

  //服务商详情字段
  public spDetailFields:Array<DetailField> = [{
    title:'企业信息',
    childs:[{
      title:'所属机构：',
      field:'bankName'
    },{
      title:'所属上级：',
      field:'parentChanName'
    },{
      title:'企业名称：',
      field:'name'
    },{
      title:'企业简称：',
      field:'shortName'
    },{
      title:'服务商编号：',
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
      field:'address'
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
      title:'证件有效期：',
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
      field:'salesmanName'
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
      title:'结算方式：',
      field:'settleStyle',
      render:((data:any,field:DetailField)=>{
        if(!this.helper.isEmpty(data[field.field])){
          return this.helper.dictTrans('SETTLE_STYLE_CONFIG',data[field.field]);
        }else{
          return '/';
        }
      }).bind(this)
    },{
      title: '创建时间：',
      field: 'registerTime',
      type: 'datetime'
    },{
      title: '审核时间：',
      field: 'examTime',
      type: 'datetime'
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
      //des:'',
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
    title: '账户信息',
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
      return this.helper.isEmpty(row['subbranchName'])?'/':row['subbranchName'];
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
  //   {
  //   name:'d',
  //   title:'开户行所在地'
  // },
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
        if(this.helper.btnRole('SPACCOUNTEDIT') && !row['isEdit']){
          return false;
        }
        return true;
      }).bind(this)
    }]
  };

  constructor(
    public accountDB: LoadTableDbService,
    public channelDB: LoadTableDbService2,
    public sidenavSrvice: ISidenavSrvice,
    public snackBar: MdSnackBar,
    @Inject(LOCALE_ID) public _locale: string,
    public spDetailDBService: SPDetailDBService,
    public pupop: MdPupop,
    public helper: HelpersAbsService,
    public commonDBService: CommonDBService,
    public spOrganDb: LoadBankOrgDBService,
    public loadBankLinkNoDB: LoadBankLinkNo
  ) {}

  ngOnInit():void{
    this.loadData();
  }

  public loadData(isRefreash:boolean = false){
    let params = this.sidenavSrvice.getPageParams();
    if(params){
      //初始化查询参数
      let orgParams:any = {orgId:params['orgId']};

      //初始化服务商户帐户信息
      this.loadAccountInfo(orgParams);

      //初始化服务商操作日志
      this.spDetailDBService.loadExamLog(orgParams).subscribe(res=>{
        if(res && res['status'] == 200){
          this.spOperationLog = Observable.of(res['data']);
        }
      });

      if(!isRefreash){
        this.spDetailReqParam = {
          params:{id:params['id']},
          url:'/servicepro/detailServiceProvider'
        };
      }else{
        this.spDetail.refresh();
      }
    }
  }

  /**
   * 初始化服务商户账户信息
   */
  public loadAccountInfo(orgParams: any){
    this.spDetailDBService.loadAccountData(orgParams).subscribe(res=>{
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
   * 编辑服务商基础信息
   */
  public onEditBaseInfo(){
    this.sidenavSrvice.onNavigate('/admin/spedit','编辑',{isEdit:true,source:'detail',id:this.spDetailData['id'],orgId:this.spDetailData['orgId'],chanCode:this.spDetailData['chanCode'],name:this.spDetailData['name']},true);
  }

  /**
   * 新增服务商帐户信息
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
  onEditSPAccount(row:any){
    if(!this.helper.isEmpty(row['subbranchName'])) {
      this.loadBankLinkNoDB.params = {subBankName: row['subbranchName']};
      this.loadBankLinkNoDB.refreshChange.next(true);
    }
  }
  /**
   * 保存服务商帐户信息
   * @param value
   */
  public onSaveAccount(value:any){
    let vals:Array<any> = [];
    let _value = this.helper.clone(value);
        _value['orgId'] = this.spDetailData['orgId'];
        _value['transId'] = _value['transId'].join(',');
        vals.push(_value);
    this.loadBankLinkNoDB.params = {};
    return this.spDetailDBService.saveAccountInfos(vals).map(res=>{
      if(res && res['status'] == 200){
        this.snackBar.alert('保存帐户信息成功！');
        this.loadAccountInfo({orgId:this.spDetailData['orgId']});//保存成功时刷新表格
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

  public onCancelAccount(){
    this.loadBankLinkNoDB.params = {};
    this.loadAccountInfo({orgId:this.spDetailData['orgId']});//刷新表格
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
      title:'审核服务商',
      statusDatas:this.helper.getDictByKey('EXAMINE_STATUS'),
      statusField:{
        name: 'examState',
        value: this.spDetailData['examState']
      },
      remarkField:{
        name:'examIllu',
        value:''
      },
      onConfirm:(function(value:any){
        value = _.extend(value,{id:this.spDetailData['id']});
        return this.spDetailDBService.examineSP(value).map(res=>{
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
        this.spDetailDBService.sendEmailAndSTM({id:this.spDetailData['id']}).subscribe(res=>{
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
  public spDetailDataLoaded(data:any){
    this.spDetailData = data;
    if(this.ctr){
      this.ctr.params = {
        bankCode: data['bankCode'],
        bankName: data['bankName'],
        chanCode: data['chanCode'],
        orgId: data['orgId'],
        parentChanCode: data['parentChanCode']
      }
    }
  }

  /**
   * 判断用户审核状态
   * [{"id":0,"name":"待审核"},{"id":1,"name":"通过"},{"id":2,"name":"未通过"},{"id":3,"name":"冻结"},{"id":4,"name":"接口"}]
   */
  public userState():string{
    if(!this.spDetailData){
      return '';
    }
    let _state = this.spDetailData['examState'];
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
