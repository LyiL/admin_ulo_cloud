import {Component, Inject} from "@angular/core";
import {MD_DIALOG_DATA, MdDialogRef, MdSnackBar} from "@angular/material";
import {HelpersAbsService} from "../../../../common/services/helpers.abs.service";
import {FormGroup, Validators, FormControl} from "@angular/forms";
import {BussinessSettlementModel} from "../../../../common/models/settlement-manage/bussiness.settlement.model";
import {HttpService} from "../../../../common/services/impl/http.service";
import {BusinessDBLoad} from "./business.list.db.service";
/**
 * 点击编辑按钮的弹出层
 */
@Component({
  selector: 'business-day-list-settlebtn-win',
  templateUrl: 'business.day.list.settlebtn.win.component.html',
  providers: [BusinessDBLoad]
})
export class BusinessDayListSettlebtnWinComponent {
  public formGroup: FormGroup;
  public model: BussinessSettlementModel = new BussinessSettlementModel();
  constructor(public snackBar: MdSnackBar,
              public helper: HelpersAbsService,
              public bussinessDB: BusinessDBLoad,
              public http: HttpService,
              @Inject(MD_DIALOG_DATA) public data: any,
              public dialogRef: MdDialogRef<BusinessDayListSettlebtnWinComponent>
  ) {
    this.formGroup = new FormGroup({
      'settleTitle':new FormControl(this.model.settleTitle, [Validators.required]),
      'remark':new FormControl(this.model.remark, [Validators.required]),
    });
    this.model = data;
    // console.log(this.model);
  }

  onSave() {
    this.bussinessDB.loadSettle(this.model)
      .subscribe((res) => {
        if(res && res['status'] == 200){
          this.snackBar.alert('保存成功！');
          this.dialogRef.close(res);
        }else {
          this.snackBar.alert(res['message']);
        }
      });
  }

}
