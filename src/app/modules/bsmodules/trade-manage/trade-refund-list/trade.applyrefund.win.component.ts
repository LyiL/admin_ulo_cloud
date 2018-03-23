import {Component} from "@angular/core";
import {TradeApplyRefundModel} from "../../../../common/models/trade-manage.models/trade.applyrefund.model";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MdDialog, MdDialogRef, MdSnackBar} from "@angular/material";
import {InputSearchDatasource} from "../../../../common/services/impl/input.search.datasource";
import {LoadMerchantDBService} from "../../../../common/db-service/common.db.service";
import {HelpersAbsService} from "../../../../common/services/helpers.abs.service";
import {TradeRefundDBService} from "./trade.refund.list.db.service";

@Component({
  selector:'trade-applyrefund-win',
  templateUrl:'trade.applyrefund.win.component.html',
  providers:[LoadMerchantDBService,TradeRefundDBService]
})
export class TradeApplyRefundComponent{
  public model:TradeApplyRefundModel = new TradeApplyRefundModel();
  /**
   * 商户信息配置
   */
  public merchantFilterFields:Array<string>= ["merchantNo","name"];
  public merchantDataSource:InputSearchDatasource;//获取商户信息数据源
  public applyRefund: FormGroup;

  constructor(public helper:HelpersAbsService,  public dialogRef: MdDialogRef<TradeApplyRefundComponent>,public  TradeRefundDb:TradeRefundDBService,

              public fb: FormBuilder,public snackBar: MdSnackBar, public dialog: MdDialog, public merchantOrganDb:LoadMerchantDBService)
  {
    this.merchantDataSource = new InputSearchDatasource(merchantOrganDb);
    this.applyRefund = this.fb.group({
      orderNo: [this.model.orderNo,[Validators.required]],
      merchantNo: [this.model.merchantNo,[Validators.required]],
      availableFee:[  ],
      refundFee:[this.model.refundFee,[Validators.required,Validators.pattern(/^\d+(\.\d+){0,1}$/)]],
      mchRefuseReason:[this.model.mchRefuseReason,[Validators.required]]
    });
  }

  /**
   * 退款申请提交
   * @param action
   */
  public onSubmit(){
    this.TradeRefundDb.loadReqRefund({orderNo:this.applyRefund.get("orderNo").value,merchantNo:this.applyRefund.get("merchantNo").value,refundFee:this.applyRefund.get("refundFee").value *100 ,mchRefuseReason:this.applyRefund.get("mchRefuseReason").value}).subscribe(res=>{
      if(res && res['status'] == 200){
        this.snackBar.alert("退款申请成功！");
        this.dialogRef.close(res);
      }else {
        this.snackBar.alert(res.message);
      }
    });
  }

  /**
   * 平台单号改变事件
   * @param action
   */
  public loseFocus(event){
    if(this.applyRefund.get("orderNo").value != ""){
      this.TradeRefundDb.loadMayRefundFee({orderNo:this.applyRefund.get("orderNo").value}).subscribe(res=>{
        if(res && res['status'] == 200){
          this.applyRefund.controls['availableFee'].setValue(res.data.availableFee / 100);
          this.applyRefund.controls['refundFee'].setValue(res.data.availableFee / 100)
        }else{
          this.snackBar.alert(res.message);
        }
      });
    }else{
      this.snackBar.alert("平台单号不能为空");
    }
  }

  /**
   * 退款金额校验
   * @param action
   */
  public checkRefundFee(event){
    let _refundFee = this.applyRefund.get("refundFee").value;
    let _availableFee = this.applyRefund.get("availableFee").value;
    if(_refundFee > _availableFee ){
      this.snackBar.alert("退款金额不能大于可退金额");
      this.applyRefund.controls['refundFee'].setValue(_availableFee)
    }
    if(_refundFee <= 0){
      this.snackBar.alert("退款金额必须大于0")
      this.applyRefund.controls['refundFee'].setValue("")
    }
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
    if(this.helper.isEmpty(value)){
      this.snackBar.alert('请先输入过滤值！');
      return false;
    }
    this.merchantOrganDb.params = {name:value};
  }
}
