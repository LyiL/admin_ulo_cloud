import {Component, Inject, OnInit} from "@angular/core";
import {MD_DIALOG_DATA, MdDialogRef, MdSnackBar} from "@angular/material";
import {HttpService} from "../../../../common/services/impl/http.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ElectronicAccountListTakeCashModel} from "../../../../common/models/to-pay-manage/electronic.account.list.takecash.model";
import {AccountOtherDBLoad, ElectronicCommonDBService} from "./electronic.account.list.db.service";
import {HelpersAbsService} from "../../../../common/services/helpers.abs.service";
/**
 * 点击编辑按钮的弹出层
 */
@Component({
  selector: 'electronic-account-list-takecashbtn-win',
  templateUrl: 'electronic.account.list.takecashbtn.win.component.html',
  providers: [ElectronicCommonDBService,AccountOtherDBLoad]
})
export class ElectronicAccountListTakecashbtnWinComponent implements OnInit {
  /**
   * 产品类型
   */
  public prodTypes:Array<any> = [];
  /**
   * 资金池编号
   */
  public cashpoolNo: any;
  /**
   * 提现账户配置
   */
  public bankAccounts:Array<string>= [];
  public formGroup: FormGroup;
  public model: ElectronicAccountListTakeCashModel = new ElectronicAccountListTakeCashModel();

  constructor(
    public snackBar: MdSnackBar,
    public http: HttpService,
    @Inject(MD_DIALOG_DATA) public data: any,
    protected fb: FormBuilder,
    protected ElectronicCommonDB: ElectronicCommonDBService,
    public helper: HelpersAbsService,
    public dialogRef: MdDialogRef<ElectronicAccountListTakecashbtnWinComponent>,
    public accountOtherDBLoad:AccountOtherDBLoad
  ) {
    this.formGroup = fb.group({
      accountId:[this.model.accountId, [Validators.required]],
      organNo:[this.model.organNo, [Validators.required]],
      organName:[{value: this.model.organName, disabled: true}, [Validators.required]],
      productType:[this.model.productType],
      bankCity:[this.model.bankCity],
      extractPrice:[this.model.extractPrice, [Validators.required, this.numberValidator]],
    });

    this.model.accountNo = data.accountNo;
    this.accountOtherDBLoad.loadAccountInfo({accountNo: this.model.accountNo}).subscribe(res=>{
      if(res && res['status'] == 200){
        // this.model = res.data;
        this.model.accountId = res.data.accountId;
        this.model.organNo = res.data.organNo;
        this.model.organName = res.data.organName;
        this.model.extractPrice = res.data.extractPrice;
        this.model.bankCity = res.data.bankCity;
        this.model.productType = res.data.productType;
        this.cashpoolNo = res.data.cashpoolNo;
        // console.log(this.model);
        this.ElectronicCommonDB.loadCashPoolBank({mchNo: this.model.organNo}).subscribe(res =>{
          this.bankAccounts = res.data;
        });//银行账户数据
      }
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

  ngOnInit(){
    this.prodTypes = this.helper.getDictByKey('CASH_PRODUC_TTYPE');
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
    'extractPrice':'required|number',
  };
  /**
   * 错误对应的提示
   */
  validationMessages = {
    'extractPrice': {
      'required': '【提现金额】不能为空',
      'number': '【提现金额】无效的数字',
    }
  };

  /**
   * 表单值改变时，重新校验
   * @param data
   */
  public onValueChanged(data) {

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
   * 保存按钮点击事件（提示信息）
   */
  public onSave() {
    if(this.helper.isEmpty(this.model.accountId)) {
      this.snackBar.alert('提现账户不存在！');
    }
    let cashpoolNo = this.cashpoolNo;
    let condition = this.helper.isEmpty(this.model.productType) || this.helper.isEmpty(this.model.bankCity)
    //判断产品类型和收款银行所在城市是否填写
    if(condition){
      if(this.helper.hasConfigValueMatch('AGENTPAY_JOIN',cashpoolNo)){
        //当资金池编号存在于配置项中，外部商户号为必填项
        this.snackBar.alert('【产品类型】和【收款银行所在城市】不能为空！');
      }else if(!this.helper.hasConfigValueMatch('AGENTPAY_JOIN',cashpoolNo)){
        this.takeCash();
      }
    }else{
      this.takeCash();
    }


  }
  takeCash(){
    this.accountOtherDBLoad.loadTakeCash(this.model)
      .subscribe((res) => {
        if(res && res['status'] == 200){
          this.snackBar.alert('提现成功！');
          this.dialogRef.close();
        }else {
          this.snackBar.alert(res['message']);
        }
      });
  }

}
