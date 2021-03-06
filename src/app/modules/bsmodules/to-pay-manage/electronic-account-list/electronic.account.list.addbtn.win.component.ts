import {Component} from "@angular/core";
import {MdDialogRef, MdSnackBar} from "@angular/material";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ElectronicAccountModel} from "../../../../common/models/to-pay-manage/electronic.account.model";
import {HttpService} from "../../../../common/services/impl/http.service";
import {LoadMerchantDBService} from "../../../../common/db-service/common.db.service";
import {InputSearchDatasource} from "../../../../common/services/impl/input.search.datasource";
import {HelpersAbsService} from "../../../../common/services/helpers.abs.service";
import {AccountOtherDBLoad, ElectronicCommonDBService} from "./electronic.account.list.db.service";

@Component({
  selector: 'electronic-account-list-addbtn-win',
  templateUrl: 'electronic.account.list.addbtn.win.component.html',
  providers: [LoadMerchantDBService, ElectronicCommonDBService,AccountOtherDBLoad]
})
export class ElectronicAccountListAddbtnWinComponent {
  /**
   * 商户信息配置
   */
  public merchantFilterFields: Array<string>= ["merchantNo","name"];
  public merchantDataSource: InputSearchDatasource;//获取商户信息数据源
  /**
   * 资金池账户配置
   */
  public accountTypes:Array<string>= [];
  /**
   * 提现账户配置
   */
  public bankAccounts:Array<string>= [];

  public formGroup: FormGroup;
  public model: ElectronicAccountModel = new ElectronicAccountModel();

  constructor(
    public snackBar: MdSnackBar,
    public http: HttpService,
    public merchantOrganDb: LoadMerchantDBService,
    public helper: HelpersAbsService,
    protected ElectronicCommonDB: ElectronicCommonDBService,
    protected fb: FormBuilder,
    public dialogRef: MdDialogRef<ElectronicAccountListAddbtnWinComponent>,
    public accountOtherDBLoad:AccountOtherDBLoad
  ) {
    this.merchantDataSource = new InputSearchDatasource(merchantOrganDb);//商户
    this.ElectronicCommonDB.loadCashPoolAccount({useState:"1"}).subscribe(res =>{
      this.accountTypes = res;
    });//资金池账户数据

    this.formGroup = fb.group({
      accountName:[this.model.accountName, [Validators.required]],
      organNo:[this.model.organNo, [Validators.required]],
      organName:[this.model.organName],
      accountId:[this.model.accountId],
      cashpoolNo:[this.model.cashpoolNo, [Validators.required]],
      cashpoolName:[this.model.cashpoolName],
      outMchno:[this.model.outMchno],
      signkey:[this.model.signkey],
      singleProcsFee:[this.model.singleProcsFee, [Validators.required, this.numberValidator]],
      privProcsFee:[this.model.privProcsFee, [Validators.required, this.numberValidator]],
      advanceProcsFee:[this.model.advanceProcsFee, [Validators.required, this.numberValidator]],
    });
    /**
     * 对表单进行校验提示
     */
    this.formGroup.valueChanges
      .subscribe((data) => {
        if(this.onValueChanged(data) == undefined){
          return false;
        }else {
          this.snackBar.alert(this.onValueChanged(data));
        }
      });
  }
  /**
   * 定义数字的校验器
   */
  numberValidator(control: FormControl): any{
    // var req = /^[0-9]*$/;
    var req = /^\d+(\.\d+){0,1}$/;//整数和小数都可以
    let valid = req.test(control.value);
    // console.log("数字校验结果是：" + valid);
    return valid ?  null: {number: true};
  }
  /**
   * 存储错误信息
   */
  formErrors = {
    'singleProcsFee':'required|number',
    'privProcsFee':'required|number',
    'advanceProcsFee':'required|number',
  };
  /**
   * 错误对应的提示
   */
  validationMessages = {
    'singleProcsFee': {
      'required': '【对公手续费（元）】不能为空',
      'number': '【对公手续费（元）】无效的数字',
    },
    'privProcsFee':{
      'required': '【对私手续费（元）】不能为空',
      'number': '【对私手续费（元）】无效的数字',
    },
    'advanceProcsFee':{
      'required': '【垫资手续费（%）】不能为空',
      'number': '【垫资手续费（%）】无效的数字',
    }
  };

  /**
   * 表单值改变时，重新校验
   * @param data
   */
  onValueChanged(data) {

    for (const field in this.formErrors) {
      this.formErrors[field] = '';
      //取到表单字段
      const control = this.formGroup.get(field);
      //表单字段已修改或无效
      if (control && control.dirty && !control.valid) {
        //取出对应字段可能的错误信息
        const messages = this.validationMessages[field];
        //从errors里取出错误类型，再拼上该错误对应的信息
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + '';
          return this.formErrors[field];
        }
      }

    }

  }
  /**
   *获取资金池账户名称
   */
  public getAccountName(result) {
    // console.log(result);
    // console.log(result.source.triggerValue);
    this.model.cashpoolName = result.source.triggerValue;
  }
  /**
   * 商户名称控件显示函数
   */
  public merchantDisplayFn(value: any):string{
    return value && value['name'];
  }
  /**
   * 商户名称控件选项显示函数
   */
  public merchantOptionDisplayFn(value:any):string{
    return value && value['name'] +'('+value['merchantNo']+')';
  }

  public merchantBeforClickFunc(value:any):boolean{
    let flag:boolean = true;
    if(this.helper.isEmpty(value)){
      this.snackBar.alert('请先输入过滤值！');
      flag = false;
    }
    this.merchantOrganDb.params = {name:value,examState:1};
    // this.merchantOrganDb.params = {name:value};
    return flag;
  }
  /**
   * 获取商户名称
   */
  public onSelect(value: any ){
    this.model.organName = value.value.name;
    this.ElectronicCommonDB.loadCashPoolBank({mchNo: value.value.merchantNo}).subscribe(res =>{
      this.bankAccounts = res.data;
    });//银行账户数据
  }

  /**
   * 保存按钮点击事件（提示信息）
   */
  onSave() {
    // console.log('cashpoolNo:::',this.model.cashpoolNo);
    // console.log('AGENTPAY_JOIN:::',this.helper.getDictByKey('AGENTPAY_JOIN'));
    let cashpoolNo = this.model.cashpoolNo;
    //判断外部商户号是否填写
    if(this.helper.isEmpty(this.model.outMchno)){
      if(this.helper.hasConfigValueMatch('AGENTPAY_JOIN',cashpoolNo)){
        //当资金池编号存在于配置项中，外部商户号为必填项
        this.snackBar.alert('【外部商户号】不能为空！');
      }else if(!this.helper.hasConfigValueMatch('AGENTPAY_JOIN',cashpoolNo)){
        this.addAccount();
      }
    }else{
      this.addAccount();
    }

  }

  /**
   * 新增电子账户
   */
  addAccount(){
    this.accountOtherDBLoad.loadAdd(this.model)
      .subscribe((res) => {
        if(res && res['status'] == 200){
          this.snackBar.alert('保存成功！');
          this.dialogRef.close();
        }else {
          this.snackBar.alert(res['message']);
        }
      });
  }

}
