import {Component, Inject, OnInit} from '@angular/core';
import {MD_DIALOG_DATA, MdDialogRef, MdPupop, MdSelectChange, MdSnackBar} from "@angular/material";
import {ISidenavSrvice} from "../../../../../common/services/isidenav.service";
import {HelpersAbsService} from "../../../../../common/services/helpers.abs.service";
import {spChannelModel} from "../../../../../common/models/user-file-manage/sp.channel.model";
import {
  CommonDBService,
  LoadBankLinkNo, LoadBankOrgDBService, LoadTableDbService
} from "../../../../../common/db-service/common.db.service";
import {SPDetailDBService} from "../sp.db.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs/Observable";
import {InputSearchDatasource} from "../../../../../common/services/impl/input.search.datasource";

@Component({
  selector: 'ulo-channel-edit-win',
  templateUrl: './sp.channel.edit.win.component.html',
  providers: [
    LoadTableDbService,
    SPDetailDBService,
    CommonDBService,
    LoadBankOrgDBService,
    LoadBankLinkNo
  ]
})

export class ULOSPChannelEditWinComponent implements OnInit{

  public model: spChannelModel = new spChannelModel();
  public spChannelFormGroup: FormGroup;
  public trans: any; // 支付类型
  public centers: any; // 通道类型
  public states: any; // 启用状态
  public cycles: any; // 结算周期
  /**
   * 所属银行配置
   */
  public agencyCodeFilterFields: Array<string>= ['orgNo','name'];
  public agencyCodeDataSource: InputSearchDatasource;


  constructor(
    public helper: HelpersAbsService,
    @Inject(MD_DIALOG_DATA) public data: any,
    public channelDB: LoadTableDbService,
    public sidenavSrvice: ISidenavSrvice,
    public snackBar: MdSnackBar,
    public spDetailDBService: SPDetailDBService,
    public pupop: MdPupop,
    public commonDBService: CommonDBService,
    public spOrganDb: LoadBankOrgDBService,
    public loadBankLinkNoDB: LoadBankLinkNo,
    protected fb: FormBuilder,
    public dialogRef: MdDialogRef<ULOSPChannelEditWinComponent>,
    public sidenavService:ISidenavSrvice,
  ){
    if(this.data){
      this.agencyCodeDataSource = new InputSearchDatasource(this.spOrganDb);
      if(_.size(this.data) > 5){
        this.model = this.helper.clone(this.data, ['channelDBdata']);
        this.spOrganDb.params = {name: this.model['agencyCode']};
        this.spOrganDb.refreshChange.next(true);
        this.trans = this.commonDBService.loadTradeType({
          userNo: this.data['merchantId'],
          transId: this.model['transId']
        }); // 支付类型
        this.centers = this.commonDBService.loadCenter({
              bankNo: this.model['agencyCode'],
              transId: this.model['transId'],
              parentChanCode: this.data['parentChanCode']
        })
      }else{
        this.model['used'] = this.data['used'];
        this.model['merchantId'] = this.data['userNo'];
        if(!this.helper.hasConfigValueMatch('CLOUD_ULO_BANK_NO', this.data['agencyCode'])){
          this.model['agencyCode'] = this.data['agencyCode'];
          this.model['agencyName'] = this.data['agencyName'];
          this.spOrganDb.params = {name: this.model['agencyCode']};
          this.spOrganDb.refreshChange.next(true);
        }
        this.trans = this.commonDBService.loadTradeType({
          userNo: this.data['userNo']
        }); // 支付类型
      }
    }
    this.states = Observable.of(this.helper.getDictByKey('ENABLE_STATUS')); // 启用状态
    this.cycles = Observable.of(this.helper.getDictByKey('BALANCE_DATE')); // 结算周期
    this.spChannelFormGroup = this.fb.group({
      transId: [this.model['transId'], Validators.required],
      agencyCode: [this.model['agencyCode'], Validators.required],
      ptCenterId: [this.model['ptCenterId'], Validators.required],
      providerNo: [this.model['providerNo']],
      thirdMchId: [this.model['thirdMchId']],
      pcmPartkey: [this.model['pcmPartkey']],
      used: [this.model['used'], Validators.required],
      limitDay: [this.model['limitDay']],
      limitSingle: [this.model['limitSingle']],
      limitSingleMin: [this.model['limitSingleMin']],
      thirdAppid: [this.model['thirdAppid']],
      settleCycle: [this.model['settleCycle'], Validators.required],
      settleRate: [this.model['settleRate'], Validators.required]
    })
  }

  ngOnInit(): void {
  }

  /**
   * 支付类型选中事件
   * @param value
   */
  onChangeTransId(change: MdSelectChange){
    if(change && change['value']){
      let _val = change['value'];
      this.model['transType'] = change.source.triggerValue;
      // 更改支付类型， 清空渠道编号、所属银行（所属银行为银行不可以清空）、通道类型、第三方平台商户号、第三方平台商户号密钥
      this.model['providerNo'] = '';
      this.model['ptCenterId'] = '';
      this.model['thirdMchId'] = '';
      this.model['pcmPartkey'] = '';
      if(this.helper.hasConfigValueMatch('CLOUD_ULO_BANK_NO', this.data['agencyCode'])){
        // row['bankNo'] = '';
        this.spOrganDb.params = {};
        this.spOrganDb.refreshChange.next(true);
      }
      this.centers = this.commonDBService.loadCenter({
        transId: _val,
        bankNo: this.model['agencyCode'],
        parentChanCode: this.data['parentChanCode']
      });
      this.spOrganDb.params = {transId: _val};
    }
  }

  /**
   * 所属银行查询前处理方法
   */
  public agencyCodebeforClickFunc(value:any){
    let flag:boolean = true;
    if(this.helper.isEmpty(value)){
      this.snackBar.alert('请先输入过滤值！');
      flag = false;
    }
    this.spOrganDb.params = _.extend(this.spOrganDb.params, { name: value });
    return flag;
  }

  /**
   * 所属银行控件显示函数
   */
  public agencyCodedisplayFn(value: any){
    return value && value['name'];
  }

  public agencyCodeSelected(res: any){
    if(res) {
      if(res) {
        this.centers = this.commonDBService.loadCenter({
          transId: this.model['transId'],
          bankNo: res['value']['orgNo'],
          parentChanCode: this.data['parentChanCode']
        });
      }
    }
    this.model['agencyName'] = res.value.name;
  }
  /**
   * 所属银行控件选项显示函数
   */
  public agencyCodeOptionDisplayFn(value:any):string{
    return value && value['name'] + '(' + value['orgNo'] + ')';
  }

  public onChangePtCenterId(res: any) {
    this.model['ptCenterName'] = res.source.triggerValue;
  }

  /**
   * 所属银行禁用方法
   */
  public disableBank(): boolean{
    // !helper.hasConfigValueMatch('CLOUD_ULO_BANK_NO', this.data['agencyCode']) || this.data['id']
    if( !this.helper.hasConfigValueMatch('CLOUD_ULO_BANK_NO', this.data['agencyCode']) || _.size(this.data) > 5){
      return true;
    }
    return false;
  }

  public disableTransId(): boolean{
    if(_.size(this.data) > 5){
      return true;
    }
    return false;
  }

  /**
   * 保存渠道信息
   */
  onSubmit() {
    let _day = this.headlerNumberNull(this.model['limitDay'], this.model, 'limitDay'), // 单日限额
      _min = this.headlerNumberNull(this.model['limitSingleMin'], this.model, 'limitSingleMin'), // 单笔限额最小
      _max = this.headlerNumberNull(this.model['limitSingle'], this.model, 'limitSingle'), // 单笔限额最大
      _settleRate = this.helper.isEmpty(this.model['settleRate']) ? 0 : this.model['settleRate'];
    if ((_max !== null && _day !== null) && _max*1 > _day*1) {
      this.snackBar.alert('单日限额需大于单笔限额最大值！');
      return;
    }
    if ((_min !== null && _day !== null) && _min*1 > _day*1) {
      this.snackBar.alert('单日限额需大于单笔限额最小值！');
      return;
    }
    if ((_min !== null && _max !== null) && _min*1 > _max*1) {
      this.snackBar.alert('单笔限额最大值需大于单笔限额最小值！');
      return;
    }
    if (this.judgeSign(_min) || this.judgeSign(_max) || this.judgeSign(_day) || this.judgeSign(_settleRate)) {
      this.snackBar.alert('请填写正数！');
      return;
    }
    if(_day*100 > 2147483647) {
      this.snackBar.alert('您输入的【单日限额】超出最大值');
      return false;
    }
    if(_min*100 > 2147483647) {
      this.snackBar.alert('您输入的【单笔限额最小值】超出最大值');
      return false;
    }
    if(_max*100 > 2147483647) {
      this.snackBar.alert('您输入的【单笔限额最大值】超出最大值');
      return false;
    }
    let hasDataSourceInTransId = this.data['channelDBdata'].find((item)=>{
      let _tmpTransId = _.isArray(item['transId']) ? item['transId'].join(',') : item['transId'];
      if(!(this.model['table_id'] == item['table_id']) && !_.isEmpty(this.model['transId']) && _tmpTransId.indexOf(this.model['transId']) != -1 && this.model['ptCenterId'] == item['ptCenterId']){
        return true;
      }
      return false;
    });
    if(hasDataSourceInTransId){
      this.snackBar.alert('支付类型、通道类型不能同时重复，请调整！');
      return false;
    }

    let _obs: Observable<any>;
    this.spOrganDb.params = {};
    if (!this.helper.isEmpty(this.model['limitDay'])) {
      this.model['limitDay'] *= 100;
    }
    if (!this.helper.isEmpty(this.model['limitSingleMin'])) {
      this.model['limitSingleMin'] *= 100;
    }
    if (!this.helper.isEmpty(this.model['limitSingle'])) {
      this.model['limitSingle'] *= 100;
    }
    // 剔除支付类型中括号与括号中的值
    let arr = this.helper.getDictByKey('MCH_TYPE');
    this.model['transType'] = this.helper.stringReplace(this.model['transType'], arr);
    // 判断从详情还是新增页进来
    if(this.hasSource()){
      if(!this.helper.isEmpty(this.data['id'])){
        _obs = this.spDetailDBService.updateSigChannleInfo(this.model);
      }else{
        _obs = this.spDetailDBService.saveSigChannleInfo(this.model);
      }
      _obs.subscribe(res => {
        this.model['limitDay'] = this.helper.shuntElement(this.model['limitDay']);
        this.model['limitSingleMin'] = this.helper.shuntElement(this.model['limitSingleMin']);
        this.model['limitSingle'] = this.helper.shuntElement(this.model['limitSingle']);
        if(res && res['status'] == 200){
          this.snackBar.alert('保存通道信息成功！');
          this.dialogRef.close(res);
        }else{
          this.snackBar.alert(res['message']);
        }
      });
    }else{
      this.model['limitDay'] = this.helper.shuntElement(this.model['limitDay']);
      this.model['limitSingleMin'] = this.helper.shuntElement(this.model['limitSingleMin']);
      this.model['limitSingle'] = this.helper.shuntElement(this.model['limitSingle']);
      let _model =_.clone(this.model);
      this.dialogRef.close(_model);
    }
  }

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

  /**
   * 判断从详情还是新增页进来
   * @returns {boolean}
   */
  public hasSource(){
    let params = this.sidenavService.getPageParams();
    if(!params || (params && this.helper.isEmpty(params['step'])) ){
      return true; // 详情进来
    }else{
      return false;// 新增进来
    }
  }
}
