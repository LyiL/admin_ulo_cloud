import {Component, Inject} from "@angular/core";
import {MD_DIALOG_DATA, MdDialogRef, MdSnackBar} from "@angular/material";
import {ElectronicAccountListDistributionModel} from "../../../../common/models/to-pay-manage/electronic.account.list.distribution.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpService} from "../../../../common/services/impl/http.service";
import {AccountOtherDBLoad} from "./electronic.account.list.db.service";
/**
 * 点击编辑按钮的弹出层
 */
@Component({
  selector: 'electronic-account-list-distribution-win',
  templateUrl: 'electronic.account.list.distribution.win.component.html',
  providers:[AccountOtherDBLoad]
})
export class ElectronicAccountListDistributionWinComponent {
  public formGroup: FormGroup;
  public model: ElectronicAccountListDistributionModel = new ElectronicAccountListDistributionModel()

  constructor(public snackBar: MdSnackBar,
              public http: HttpService,
              public accountOtherDBLoad:AccountOtherDBLoad,
              @Inject(MD_DIALOG_DATA) public data: any,
              public dialogRef: MdDialogRef<ElectronicAccountListDistributionWinComponent>,
  ) {
    this.formGroup = new FormGroup({
      'externalAccount':new FormControl(this.model.externalAccount, Validators.required),
      'externalPassword':new FormControl(this.model.externalPassword, Validators.required),
    });
    this.model.accountNo = data.accountNo;
    this.model.externalAccount = data.externalAccount;
    this.model.externalPassword = data.externalPassword;
  }
  /**
   * 保存按钮点击事件（提示信息）
   */
  public onSave() {
    this.accountOtherDBLoad.loadDistribution(this.model)
      .subscribe((res) => {
        if(res && res['status'] == 200){
          this.snackBar.alert('操作成功！');
          this.dialogRef.close();
        }else {
          this.snackBar.alert(res['message']);
        }
      });
  }

}
