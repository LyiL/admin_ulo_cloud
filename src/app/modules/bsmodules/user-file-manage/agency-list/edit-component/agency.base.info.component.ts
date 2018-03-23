import {Component, OnInit, AfterContentChecked, ChangeDetectorRef} from "@angular/core";
import {ULODetailContainer} from "../../../../../common/components/detail/detail-container";
import {ISidenavSrvice} from "../../../../../common/services/isidenav.service";
import {Observable} from "rxjs/Observable";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {InputSearchDatasource} from "../../../../../common/services/impl/input.search.datasource";
import {
  CommonDBService,
  LoadAgentDBService,
  LoadBankOrgDBService,
  LoadSalesmanDBService
} from "../../../../../common/db-service/common.db.service";
import {HelpersAbsService} from "../../../../../common/services/helpers.abs.service";
import {MdOptionSelectionChange, MdSnackBar} from "@angular/material";
import {AgencyBaseInfoModel} from "../../../../../common/models/user-file-manage/agency.base.info.model";
import {AgencyDetailDBService} from "../agency.list.db.service";
import {ValidatorsPatterns} from "../../../../../common/services/impl/validators.patterns.const";
@Component({
  selector:'agency-base-info',
  templateUrl:'./agency.base.info.component.html',
  providers:[CommonDBService,LoadBankOrgDBService,AgencyDetailDBService,LoadSalesmanDBService,LoadAgentDBService]
})
export class AgencyBaseInfoComponent implements OnInit,AfterContentChecked{
  public ctr:ULODetailContainer;
  public provinces:Observable<any>; //省份
  public citys:Observable<any>;//城市
  public areas:Observable<any>;//区县
  public cTypeGroups:Observable<any>;//所属行业 - 类别
  public categoryTypes:Observable<any>;//所属行业 - 名称
  public certificateTypes:Observable<any>;//证件类别
  public contactsTypes:Observable<any>;//负责人类型数据
  public shareRules:Observable<any>;//分润规则
  /**
   * 代理类型
   */
  public agencyTypes:Observable<any>;
  public model:AgencyBaseInfoModel = new AgencyBaseInfoModel();
  public agencyBaseInfoFormGroup:FormGroup;
  //上级代理配置
  public agentInputSearchSource:InputSearchDatasource;
  public agencyAgentFilterFields:Array<string> = ['chanCode','name'];
  //机构控件配置
  public bankInputSearchSource:InputSearchDatasource;
  public agencyBankFilterFields:Array<string> = ['orgNo','name'];
  //业务员控件配置
  public salesmanInputSearchSource:InputSearchDatasource;
  public agencySalesmanFilterFields:Array<string> = ['salesmanId','realName'];

  //文件上传控件配置
  public defFieldUploadSetting : any = {
    url:'/assets/upload',
    fileSuffix:'.jpg;.jpeg;.png;.gif;'
  };

  /**
   * 有效证件
   * @type {{format: string}}
   */
  public certDateOpts:any = {
    format:'yyyy-MM-dd',
    lastMinDate:this.model.linenceTermStart
  };

  constructor(public commonDBService:CommonDBService,
              public helper:HelpersAbsService,
              public loadBankOrgDBService:LoadBankOrgDBService,
              public snackBar:MdSnackBar,
              public agencyDetailDBService:AgencyDetailDBService,
              public loadSalesmanDBService:LoadSalesmanDBService,
              public sidenavService:ISidenavSrvice,
              public agentLoadAgentDBService:LoadAgentDBService,
              private changeDetectorRef:ChangeDetectorRef){
    this.bankInputSearchSource = new InputSearchDatasource(loadBankOrgDBService);
    this.salesmanInputSearchSource = new InputSearchDatasource(loadSalesmanDBService);
    this.agentInputSearchSource = new InputSearchDatasource(agentLoadAgentDBService);
  }

  ngAfterContentChecked(){
    if(this.model.linenceTermStart){
      this.certDateOpts = {
        format:'yyyy-MM-dd',
        lastMinDate:this.model.linenceTermStart
      };
    }
  }

  ngOnInit():void{
    this.agencyBaseInfoFormGroup = new FormGroup({
      'name':new FormControl(this.model.name,[Validators.required]),                                  //企业名称
      'bankCode':new FormControl(this.model.bankCode,[Validators.required]),                             //所属银行 (更新时不可编辑)
      'bankName':new FormControl(this.model.bankName),                             //所属银行
      'parentChanCode':new FormControl(this.model.parentChanCode),                 // 上级代理
      'appCode':new FormControl(this.model.appCode,[Validators.required]),                             //代理类型
      'shortName':new FormControl(this.model.shortName,[Validators.required]),                      //企业简称
      'orgEmail':new FormControl(this.model.orgEmail,[Validators.required,Validators.email]),                        //企业邮箱
      'orgWebsite':new FormControl(this.model.orgWebsite,[Validators.required]),                   //企业网站
      'province':new FormControl(this.model.province,[Validators.required]),                        //省份编码
      'city':new FormControl(this.model.city,[Validators.required]),                                  //  城市编码
      'county':new FormControl(this.model.county,[Validators.required]),                              //区县编码
      'comAddress':new FormControl(this.model.comAddress,[Validators.required]),                            //经营地址
      'certificateType':new FormControl(this.model.certificateType,[Validators.required]),          //商户证件类型
      'linenceNo':new FormControl(this.model.linenceNo,[Validators.required]),                        //商户证件号码
      // 'linenceTermStart':new FormControl(this.model.linenceTermStart,[Validators.required]),        //证件有效期开始时间
      // 'linenceTermEnd':new FormControl(this.model.linenceTermEnd,[Validators.required]),            //证件有效期结束时间
      'shareRule':new FormControl(this.model.shareRule,[Validators.required]),                        //分润规则，0否1是
      'categoryTypeGroup':new FormControl(this.model.categoryTypeGroup),                           //所属行业 - 类别
      'categoryType':new FormControl(this.model.categoryType,[Validators.required]),                //所属行业 - 名称
      'customerPhone':new FormControl(this.model.customerPhone,[Validators.required,Validators.minLength(7),Validators.maxLength(32)]),              //客服电话
      'salesmanNo':new FormControl(this.model.salesmanNo),                                          //所属业务员
      'operator':new FormControl(this.model.operator,[Validators.required]),                          //  负责人姓名
      'operatorIdno':new FormControl(this.model.operatorIdno,[Validators.required]),                  //负责人身份证号码
      'operatorPhone':new FormControl(this.model.operatorPhone,[Validators.pattern(ValidatorsPatterns.NUMBER),Validators.maxLength(11)]),                //负责人手机
      'operatorEmail':new FormControl(this.model.operatorEmail),                //负责人邮箱
      'contactsType':new FormControl(this.model.contactsType,[Validators.required]),                  //负责人类型
      'linkman':new FormControl(this.model.linkman,[Validators.required]),                              //联系人姓名
      'phone':new FormControl(this.model.phone,[Validators.required,Validators.pattern(ValidatorsPatterns.NUMBER),Validators.maxLength(11)]),                                  //联系人手机
      'email':new FormControl(this.model.email,[Validators.required,Validators.email]),                                  //联系人邮箱
      'linenceImg':new FormControl(this.model.linenceImg,[Validators.required]),                      //营业执照
      'orgAccountImg':new FormControl(this.model.orgAccountImg,[Validators.required]),                //开户许可证
      'indentityImg':new FormControl(this.model.indentityImg,[Validators.required]),                  //身份证正面
      'indentityBackImg':new FormControl(this.model.indentityBackImg,[Validators.required]),        //身份证背面
      'bankCardImg':new FormControl(this.model.bankCardImg,[Validators.required])                    //银行卡照片
    });
    this.provinces = this.commonDBService.loadProvince();

    this.cTypeGroups = Observable.of(this.helper.getDictByKey('MCH_TYPE'));
    this.certificateTypes = Observable.of(this.helper.getDictByKey('CERTIFICATE_TYPE'));
    this.contactsTypes = Observable.of(this.helper.getDictByKey('CONTACTS_TYPE'));
    this.shareRules = Observable.of(this.helper.getDictByKey('PAYCENTER_CH_TYPE'));//分润规则
    this.agencyTypes = Observable.of(this.helper.getDictByKey('PROXY_TYPE'));//代理类型

    let params = this.sidenavService.getPageParams();
    /**
     * 判断是否是返回上一步进来的数据
     */

    if(params){//如果为编辑时
      this.agencyDetailDBService.loadAgencyBaseInfoData({id:params['id'],chanCode: params['chanCode']}).subscribe(res=>{
        if(res && res['status'] == 200){
          // this.model = res['data'];
          this.model.resetValue(res['data']);
          this.model.categoryTypeGroup = parseInt(this.model.categoryType == null?'1':this.model.categoryType[0]);
          this.categoryTypes = this.commonDBService.loadIndustryData({ parent: this.model.categoryTypeGroup });

          let salesmanNo = this.model['salesmanNo'];
          if(!this.helper.isEmpty(salesmanNo)) {
            this.loadSalesmanDBService.params = {realName:salesmanNo,bankNo:this.model['bankCode'],channelId:this.model['parentChanCode']};
            this.loadSalesmanDBService.refreshChange.next(true);
          }
          this.loadBankOrgDBService.params = {name:this.model['bankCode']};
          this.loadBankOrgDBService.refreshChange.next(true);

          let parentChanCode = this.model['parentChanCode'];
          if(!this.helper.isEmpty(parentChanCode)) {
            this.agentLoadAgentDBService.params = {name:parentChanCode,bankCode:this.model['bankCode']};
            //chanCode
            this.agentLoadAgentDBService.refreshChange.next(true);
          }
          this.changeDetectorRef.detectChanges();
        }
      });
    }

  }

  /**
   * @return {boolean}
   */
  public hasSource(){
    let params = this.sidenavService.getPageParams();
    if(!params || (params && this.helper.isEmpty(params['source'])) ){
      return true; //新增进来/点击返回上一步进来
    }else{
      return false;//编辑
    }
  }

  //func area
  /**
   * 省份内容变更事件
   * @param optionChange
   */
  onProvinceSelected(optionChange:MdOptionSelectionChange){
    let option = optionChange.source;
    if(optionChange.isUserInput && !this.helper.isEmpty(option.value)){
      this.model.provinceName = option.viewValue;
      this.model.provinceAdCode = this.helper.getSourceValue(this.provinces,option.value,'areaCode','adCode');
      this.citys = this.commonDBService.loadCity(option.value);
    }else if(this.citys == undefined && option.value == this.model.province){
      this.citys = this.commonDBService.loadCity(option.value);
    }
  }

  /**
   * 城市内容变更事件
   * @param optionChange
   */
  onCitySelected(optionChange:MdOptionSelectionChange){
    let option = optionChange.source;
    if(optionChange.isUserInput && !this.helper.isEmpty(option.value)){
      this.model.cityName = option.viewValue;
      this.model.cityAdCode = this.helper.getSourceValue(this.citys,option.value,'areaCode','adCode');
      this.areas = this.commonDBService.loadCounty(option.value);
    }else if(this.areas == undefined && option.value == this.model.city){
      this.areas = this.commonDBService.loadCounty(option.value);
    }
  }

  /**
   * 区县内容变更事件
   * @param optionChange
   */
  onAreasSelected(optionChange:MdOptionSelectionChange){
    let option = optionChange.source;
    if(optionChange.isUserInput && !this.helper.isEmpty(option.value)){
      this.model.countyName = option.viewValue;
      this.model.countyAdCode = this.helper.getSourceValue(this.areas,option.value,'areaCode','adCode');
    }
  }

  /**
   * 行业类别内容变更事件
   * @param option
   */
  onCategoryTypeSelected(optionChange:MdOptionSelectionChange){
    let option = optionChange.source;
    if(this.categoryTypes == undefined || (optionChange.isUserInput && !this.helper.isEmpty(option.value))){
      this.categoryTypes = this.commonDBService.loadIndustryData({parent:option.value});
    }
  }
  /**
   * 上级代理查询前事件
   * @param value
   */
  onAgentBeforClickFunc(value:any){
    let flag:boolean = true;
    if(this.helper.isEmpty(value)){
      this.snackBar.alert('请先输入过滤值！');
      flag = false;
    }
    if(this.helper.isEmpty(this.model['bankCode'])){
      this.snackBar.alert('请先选择所属机构！');
      flag = false;
    }
    this.agentLoadAgentDBService.params = {name:value,examState:1,bankCode:this.model['bankCode']};
    return flag;
  }

  /**
   * 所属机构查询前事件
   * @param value
   */
  onBeforClickFunc(value:any){
    let flag:boolean = true;
    if(this.helper.isEmpty(value)){
      this.snackBar.alert('请输入关键字！');
      flag = false;
    }
    this.loadBankOrgDBService.params = {name:value};
    return flag;
  }

  /**
   * 所属机构选种事件
   */
  onBankSelected(data:any){
    this.model.bankName = data.value.name;
  }

  /**
   * 所属业务员查询前事件
   * @param value
   */
  onSalesmanBeforClickFunc(value:any){
    let flag:boolean = true;
    if(this.helper.isEmpty(value)){
      this.snackBar.alert('请先输入过滤值！');
      flag = false;
    }
    if(this.helper.isEmpty(this.model['parentChanCode'])){
      this.snackBar.alert('请先选择上级代理！');
      flag = false;
    }
    this.loadSalesmanDBService.params ={realName:value,bankNo:this.model['bankCode'],channelId:this.model['parentChanCode']};
    return flag;
  }

  /**
   * 保存并下一步
   */
  onBaseInfoSubmit(){
    if(this.agencyBaseInfoFormGroup.valid){
      this.agencyDetailDBService.saveAgencyBaseInfo(this.model).subscribe(res=>{
        if(res && res['status'] == 200){
          this.snackBar.alert('保存成功！');
          let _data = res['data'];
          let _params = {step:1,isEdit:true,source:this.ctr.params['source'],orgId:_data['orgId'],chanCode:_data['chanCode'],name:_data['name'],bankCode: _data['bankCode'],bankName: this.model['bankName'],parentChanCode:_data['parentChanCode'],id:_data['id']};
          this.sidenavService.resetPageParams(_params);
          // console.log(_params)
          this.ctr.params = _params;
          this.ctr && this.ctr.onStep(1);
        }else{
          if(res['errors']){
            this.snackBar.alert('保存失败！');
          }else{
            this.snackBar.alert(res['message']);
          }
        }
      });
    }
  }

  /**
   * 保存
   */
  onSave(){
    if(this.agencyBaseInfoFormGroup.valid){
      this.agencyDetailDBService.saveAgencyBaseInfo(this.model).subscribe(res=>{
        if(res && res['status'] == 200){
          this.snackBar.alert('保存成功！');
          let _data = res['data'];
          this.sidenavService.onNavigate('/admin/agencydetail','查看代理商详情',{id:_data['id'],chanCode:_data['chanCode'],name:_data['name'],orgId: _data['orgId']},true);
        }else{
          if(res['errors']){
            this.snackBar.alert('保存失败！');
          }else{
            this.snackBar.alert(res['message']);
          }
        }
      });
    }
  }



  /**
   * 返回
   */
  onGoBack(){
    let params = this.sidenavService.getPageParams();
    this.sidenavService.onNavigate('/admin/agencydetail','查看代理商详情',{id:params['id'],chanCode:params['chanCode'],name:params['name'],orgId: params['orgId']},true);
  }

  //public funcs
  /**
   * 机构控件显示函数
   */
  public agencyBankDisplayFn(value:any){
    return value && value['name'];
  }

  /**
   * 机构控件选项显示函数
   */
  public agencyBankOptionDisplayFn(value:any):string{
    return value && value['name'] +'('+value['orgNo']+')';
  }

  /**
   * 机构控件加载完成后触发事件
   * @param value
   */
  public onBankDataLoaded(value:any){
    if(this.helper.isEmpty(value)){
      this.snackBar.alert('没有查询到对应机构信息，请重填写正确的机构名称或机构编号！');
    }
  }
  /**
   * 上级代理显示函数
   */
  public agencyAgentDisplayFn(value:any){
    return value && value['name'];
  }
  /**
   * 上级代理选项显示函数
   */
  public agencyAgentOptionDisplayFn(value:any):string{
    return value && value['name'] +'('+value['chanCode']+')';
  }
  /**
   * 上级代理加载完成后触发事件
   * @param value
   */
  public onAgentDataLoaded(value:any){
    if(this.helper.isEmpty(value)){
      this.snackBar.alert('没有查询到对应上级代理信息，请重填写正确的上级代理名称或编号！');
    }
  }
  /**
   * 所属业务员加载完成后触发事件
   * @param value
   */
  public onSalesmanDataLoaded(value:any){
    if(this.helper.isEmpty(value)){
      this.snackBar.alert('没有查询到对应业务信息，请重填写正确的业务名称或业务编号！');
    }
  }

  /**
   * 所属业务员控件显示函数
   * @param value
   * @returns {string}
   */
  public agencySalesmanDisplayFn(value:any){
    return value && value['realName'];
  }
  /**
   * 所属业务员控件选项显示函数
   */
  public agencySalesmanOptionDisplayFn(value:any){
    return value && value['realName'] +'('+value['salesmanId']+')';
  }

  /**
   * 文件上传错误信息
   * @param data
   */
  public onFileUploadError(data){
    if(data && data['message']){
      this.snackBar.alert(data['message']);
    }
  }
}
