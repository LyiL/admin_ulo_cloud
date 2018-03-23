import {Component, Inject, OnInit} from "@angular/core";
import {MD_DIALOG_DATA, MdDialogRef, MdOption, MdSnackBar} from "@angular/material";
import {RefundStrategyModel} from "../../../../../common/models/user-file-manage/refund.strategy.model";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpService} from "../../../../../common/services/impl/http.service";
import {Observable} from "rxjs/Observable";
import {CommonDBService} from "../../../../../common/db-service/common.db.service";
import {HelpersAbsService} from "../../../../../common/services/helpers.abs.service";
import {StrategyOtherDBLoad} from "./refund.strategy.list.db.service";
@Component({
  selector: 'refund-strategy-list-editbtn-win',
  templateUrl: 'refund.strategy.list.editbtn.win.component.html',
  providers: [CommonDBService, StrategyOtherDBLoad]
})
export class RefundStrategyListEditbtnWinComponent implements OnInit{
  /**
   * 支付类型配置
   */
  public payTypes:Array<string>= [];
  /**
   *启用状态
   */
  public useStates;
  public formGroup: FormGroup;
  public model: RefundStrategyModel = new RefundStrategyModel();

  constructor(
    public snackBar: MdSnackBar,
    public http: HttpService,
    protected CommonDB: CommonDBService,
    @Inject(MD_DIALOG_DATA) public data: any,
    protected fb: FormBuilder,
    public helper: HelpersAbsService,
    public dialogRef: MdDialogRef<RefundStrategyListEditbtnWinComponent>,
    public strategyOtherDBLoad: StrategyOtherDBLoad,
  ) {
    this.CommonDB.loadTransApi({transId:""}).subscribe(res =>{
      this.payTypes = res;
    });//支付类型
    this.formGroup = fb.group({
      merchantNo: [this.model.merchantNo, [Validators.required]],
      name:[{value: this.model.name, disabled: true}, [Validators.required]],
      transId:[this.model.transId],
      transType:[this.model.transType],
      useState:[this.model.useState, [Validators.required]],
      refundDayRange:[this.model.refundDayRange, [Validators.required, this.numberValidator]],
      dayRefundCount:[this.model.dayRefundCount, [Validators.required, this.numberValidator]],
      singleRefundFee:[this.model.singleRefundFee, [Validators.required, this.numberValidator]],
      dayRefundFee:[this.model.dayRefundFee, [Validators.required, this.numberValidator]],
    });

    this.model.id = data.id;

    this.strategyOtherDBLoad.loadStrategyInfo({id: this.model.id}).subscribe(res=>{
      if(res && res['status'] == 200){
        // this.model = res.data;
        this.model.resetValue(res['data']);
        this.model.name = data.name;//name取上一个页面通过路由参数带过来的（res.data里没有）
        this.model.singleRefundFee = this.helper.shuntElement(this.model.singleRefundFee);
        this.model.dayRefundFee = this.helper.shuntElement(this.model.dayRefundFee);
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
  /**
   * 定义数字的校验器
   */
  numberValidator(control: FormControl): any{
    var req = /^[0-9]*$/;//整数
    // var req = /^\d+(\.\d+){0,1}$/;//整数和小数都可以
    let valid = req.test(control.value);
    // console.log("数字校验结果是：" + valid);
    return valid ?  null: {number: true};
  }
  /**
   * 存储错误信息
   */
  formErrors = {
    'refundDayRange':'required|number',
    'dayRefundCount':'required|number',
    'singleRefundFee':'required|number',
    'dayRefundFee':'required|number',
  };
  /**
   * 错误对应的提示
   */
  validationMessages = {
    'refundDayRange': {
      'required': '【允许退款天数】不能为空',
      'number': '【允许退款天数】无效的数字',
    },
    'dayRefundCount':{
      'required': '【当日退款笔数】不能为空',
      'number': '【当日退款笔数】无效的数字',
    },
    'singleRefundFee':{
      'required': '【单笔退款金额】不能为空',
      'number': '【单笔退款金额】无效的数字',
    },
    'dayRefundFee':{
      'required': '【当日退款金额】不能为空',
      'number': '【当日退款金额】无效的数字',
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
  ngOnInit() {
    this.useStates = this.helper.getDictByKey('ENABLE_STATUS');
  }
  /**
   *获取支付类型名称
   */
  getTradeName(result){
    this.model.transType = result.source.triggerValue;
  }

  /**
   * 保存按钮点击事件（提示信息）
   */
  onSave() {
    if(Number(this.model.refundDayRange) > 90){
      this.snackBar.alert('商户允许退款天数不能大于90天');
      return;
    }
    if(Number(this.model.dayRefundCount) > 90){
      this.snackBar.alert('商户当日退款笔数不能大于90笔');
      return;
    }
    if(Number(this.model.singleRefundFee) > Number(this.model.dayRefundFee)){
      this.snackBar.alert('单笔退款不能大于当日退款金额');
      return;
    }
    this.editStrategy();
  }

  editStrategy(){
    this.strategyOtherDBLoad.loadEdit(this.model)
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
