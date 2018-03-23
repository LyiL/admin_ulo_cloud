import {Component, Inject, OnInit, ViewChild} from "@angular/core";
import {MD_DIALOG_DATA, MdDialogRef, MdSnackBar} from "@angular/material";
import {CashManageModel} from "../../../../common/models/to-pay-manage/cash.manage.model";
import {MdTableExtend} from "../../../../common/components/table/table-extend";
import {HttpService} from "../../../../common/services/impl/http.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {LoadBankOrgDBService} from "../../../../common/db-service/common.db.service";
import {InputSearchDatasource} from "../../../../common/services/impl/input.search.datasource";
import {HelpersAbsService} from "../../../../common/services/helpers.abs.service";
import {CashPoolOtherDBLoad} from "./cash.manage.list.db.service";
/**
 * 点击编辑按钮的弹出层
 */
@Component({
  selector: 'cash-manage-list-addbtn-win',
  templateUrl: 'cash.manage.list.addbtn.win.component.html',
  providers: [LoadBankOrgDBService, CashPoolOtherDBLoad]
})
export class CashManagelistEditbtnWinComponent implements OnInit{
  /**
   * 资金池类型
   */
  public cashPoolTypes:Array<any> = [];
  /**
   * 受理机构配置
   */
  public cashBnakFilterFields:Array<string>= ["orgNo","name"];
  public cashBankDataSource: InputSearchDatasource;//机构控件数据源

  public formGroup: FormGroup;
  public model: CashManageModel = new CashManageModel();
  constructor(
    public snackBar: MdSnackBar,
    public http: HttpService,
    @Inject(MD_DIALOG_DATA) public data: any,
    protected cashBankOrganDb: LoadBankOrgDBService,
    protected helper: HelpersAbsService,
    protected fb: FormBuilder,
    public cashPoolOtherDB: CashPoolOtherDBLoad,
    public dialogRef: MdDialogRef<CashManagelistEditbtnWinComponent>,
  ) {
    this.cashBankDataSource = new InputSearchDatasource(cashBankOrganDb);//受理机构
    this.formGroup = fb.group({
      poolNo:[this.model.poolNo],
      accountName:[this.model.accountName, [Validators.required]],
      bankNo:[this.model.bankNo, [Validators.required]],
      bankName:[this.model.bankName],
      singleProcsFee:[this.model.singleProcsFee, [Validators.required, this.numberValidator]],
      advanceProcsFee:[this.model.advanceProcsFee, [Validators.required, this.numberValidator]],
      poolType:[this.model.poolType, [Validators.required]],
      apiCode:[this.model.apiCode, [Validators.required]],
    });
    //data.poolNo赋值给this.model
    this.model.poolNo = data.poolNo;
    this.cashPoolOtherDB.loadCashPoolInfo({poolNo: this.model.poolNo}).subscribe(res=>{
      if(res && res['status'] == 200){
        // this.model = res.data;
        this.model.resetValue(res['data']);
        this.model.advanceProcsFee *= 100;
        //受理机构的显示
        this.cashBankOrganDb.params = {name:this.model['bankNo']};
        this.cashBankOrganDb.refreshChange.next(true);
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
    this.cashPoolTypes = this.helper.getDictByKey('CASH_POOL_TYPE');
  }
  /**
   * 定义数字的校验器
   */
  numberValidator(control: FormControl): any{
    // var req = /^\d+(\.\d{2})?$/;
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
    'apiCode':'required',
    'advanceProcsFee':'required|number'
  };
  /**
   * 错误对应的提示
   */
  validationMessages = {
    'singleProcsFee': {
      'required': '【手续费（元）】不能为空',
      'number': '【手续费（元）】无效的数字',
    },
    'apiCode':{
      'required': '【接口编号】不能为空',
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
   * 机构控件显示函数
   */
  public cashBankdisplayFn(value: any):string{
    return value && value['name'];
  }
  /**
   * 机构控件选项显示函数
   */
  public cashBankOptionDisplayFn(value:any):string{
    return value && value['name'] +'('+value['orgNo']+')';
  }

  public cashBankbeforClickFunc(value:any):boolean{
    let flag:boolean = true;
    if(this.helper.isEmpty(value)){
      this.snackBar.alert('请先输入过滤值！');
      flag = false;
    }
    this.cashBankOrganDb.params = {name:value};
    return flag;
  }
  /**
   * 获取机构名称
   */
  public onSelect(value: any ){
    this.model.bankName = value.value.name;
  }
  /**
   * 保存按钮点击事件（有提示信息）
   */
  onSave() {
    this.cashPoolOtherDB.loadEdit(this.model)
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
