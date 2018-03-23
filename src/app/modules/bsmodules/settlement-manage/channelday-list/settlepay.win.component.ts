import {Component, Inject} from "@angular/core";
import {HelpersAbsService} from "../../../../common/services/helpers.abs.service";
import {MD_DIALOG_DATA, MdDialogRef, MdSnackBar} from "@angular/material";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

import {settlePayModel} from "../../../../common/models/settlement-manage/settlepay.model";
import {ChannelDBService} from "./channelday.list.db.service";

@Component({
  selector:"settlepay-win",
  templateUrl:"./settlepay.win.component.html",
  providers:[ChannelDBService]
})
export class settlePayWinComponent{
  public model:settlePayModel = new settlePayModel();
  public settlepay: FormGroup;
  constructor(public helper:HelpersAbsService, public channelDb:ChannelDBService,
              public fb: FormBuilder, public dialogRef: MdDialogRef<settlePayWinComponent>,public snackBar: MdSnackBar,@Inject(MD_DIALOG_DATA) public data: any,){
   this.model = data
  }
  ngOnInit(){
    this.settlepay = this.fb.group({
      settleTitle: [this.model.settleTitle,[Validators.required]],
      remark: [this.model.remark ],
    });
  }
public onSubmit(){
  this.channelDb.loadSettle(
    this.model
    ).subscribe(res =>{
      if(res && res['status'] == 200){
        // console.log(res);
        this.snackBar.alert('保存成功');
        this.dialogRef.close(res);
      }else {
        this.snackBar.alert(res.message);
      }
    })
}

}
