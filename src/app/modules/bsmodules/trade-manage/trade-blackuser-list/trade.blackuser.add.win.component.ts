import {TradeBlackuserDBService} from "./trade.blackuser.list.db.service";
import {Component, OnInit} from "@angular/core";
import {TradeBlackuserModel} from "../../../../common/models/trade-manage.models/trade.blackuser.model";
import {HelpersAbsService} from "../../../../common/services/helpers.abs.service";
import {MdDialogRef, MdSnackBar, MdDialog} from "@angular/material";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";

/**
 * 添加交易黑名单组件
 */
@Component({
  selector:"trade-blackuser-add-win",
  templateUrl:"./trade.blackuser.add.win.component.html",
  providers:[TradeBlackuserDBService]
})
export class TradeBlackuserAddWinComponent{

  public model:TradeBlackuserModel = new TradeBlackuserModel();
  public tradeBlackuser: FormGroup;

  constructor(public helper:HelpersAbsService,  public dialogRef: MdDialogRef<TradeBlackuserModel>,public tradeBlackuserDBService:TradeBlackuserDBService,
              public fb: FormBuilder,public snackBar: MdSnackBar, public dialog: MdDialog)
  {
    this.tradeBlackuser = this.fb.group({
      orderNo: [this.model.orderNo,[Validators.required]]
    });
  }

  /**
   * 退款申请提交
   * @param action
   */
  public onSubmit(){
    this.tradeBlackuserDBService.add({orderNo:this.tradeBlackuser.get("orderNo").value}).subscribe(res=>{
      if(res && res['status'] == 200){
        this.snackBar.alert("添加黑名单成功！");
        this.dialogRef.close(res);
      }else {
        this.snackBar.alert(res.message);
      }
    });
  }
}
