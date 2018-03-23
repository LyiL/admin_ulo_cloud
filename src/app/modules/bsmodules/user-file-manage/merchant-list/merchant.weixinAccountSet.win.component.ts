import {Component, Inject} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MD_DIALOG_DATA, MdDialog, MdDialogRef, MdSnackBar} from "@angular/material";

import {HelpersAbsService} from "../../../../common/services/helpers.abs.service";
import {MerchantWeixinAccountSet} from "../../../../common/models/user-file-manage/mch.weixin.account.setmodel";
import {MchDetailDBService} from "./detail-component/mch.detail.list.db.service";

@Component({
  selector:'merchant-weixinAccountSet-win',
  templateUrl:'merchant.weixinAccountSet.win.component.html',
  providers:[MchDetailDBService]
})
export class MerchantWeixinAccountSetComponent{
  public model:MerchantWeixinAccountSet = new MerchantWeixinAccountSet();

  public formGroup: FormGroup;

  constructor(public helper:HelpersAbsService,   @Inject(MD_DIALOG_DATA) public data: any,
              public dialogRef: MdDialogRef<MerchantWeixinAccountSetComponent>, public MchDB:MchDetailDBService,
              public snackBar: MdSnackBar, public dialog: MdDialog)
  {
    this.model.mchId = data.id
  }
  ngOnInit (): void {
    this.formGroup = new FormGroup({
      'jsapiPath': new FormControl(this.model.jsapiPath),
      'subAppid': new FormControl(this.model.subAppid),
      'subscribeAppid': new FormControl(this.model.subscribeAppid)
    });
  }

  onSubmit() {
    if (this.formGroup.valid) {
      if ((this.helper.isEmpty(this.model.jsapiPath)) &&(this.helper.isEmpty(this.model.subAppid)) && (this.helper.isEmpty(this.model.subscribeAppid))) {
        this.snackBar.alert('授权目录、关联APPID、推荐关注APPID三选一必填一项!');
        return false;
      }
    // else{
      //   if((this.helper.isEmpty(this.model.subAppid)) && (!this.helper.isEmpty(this.model.subscribeAppid))){
      //     this.snackBar.alert('请选择填写关联APPID!');
      //     return false ;
      //   }
        this.MchDB.accountConfig(this.model).subscribe((res)=>{
          if(res && res['status'] == 200){
            this.snackBar.alert('配置成功！');
            this.dialogRef.close(res);
          }else{
            this.snackBar.alert(res['message']);
          }
        })
}
  }
}
