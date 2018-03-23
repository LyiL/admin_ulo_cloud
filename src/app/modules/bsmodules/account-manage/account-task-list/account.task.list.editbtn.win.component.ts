import {Component, Inject, OnInit} from "@angular/core";
import {MD_DIALOG_DATA, MdSnackBar} from "@angular/material";
import {AccountTaskModel} from "../../../../common/models/account-manage/account.task.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpService} from "../../../../common/services/impl/http.service";
import {HelpersAbsService} from "../../../../common/services/helpers.abs.service";
import {AccountTaskDBLoad} from "./account.task.list.db.service";

@Component({
  selector: 'account-task-list-editbtn-win',
  templateUrl: 'account.task.list.editbtn.win.component.html',
  providers: [AccountTaskDBLoad]
})
export class AccountTaskListEditbtnWinComponent implements OnInit{
  public formGroup: FormGroup;
  public model: AccountTaskModel = new AccountTaskModel();

  public accountTypes;//对账类型
  public drawbackAccordings;//退款依据

  /**
   * 保存按钮点击事件（提示信息）
   */
  constructor(public snackBar: MdSnackBar, public http: HttpService, @Inject(MD_DIALOG_DATA) public data: any,public helper: HelpersAbsService,public accountDB:AccountTaskDBLoad) {
    this.formGroup = new FormGroup({
      'reconPath':new FormControl(this.model.reconPath),
      'reconType':new FormControl(this.model.reconType, Validators.required),
      'refundType':new FormControl(this.model.refundType, Validators.required),
    });
    this.model.id = data.id;
    this.model.reconPath = data.reconPath;
    this.model.reconType = data.reconType;
    this.model.refundType = data.refundType;
  }
  ngOnInit() {
    this.accountTypes = this.helper.getDictByKey('SHOW_CHECK_TYPE');
    this.drawbackAccordings = this.helper.getDictByKey('REFUND_BASE');
  }
  getAccountName(result: any){
    this.model.reconTypeName = result.source.triggerValue;
  }
  getRefundName(result: any){
    this.model.refundTypeName = result.source.triggerValue;
  }
  onSave() {
    this.accountDB.loadEdit(this.model)
      .subscribe((res) => {
        if(res && res['status'] == 200){
          this.snackBar.alert('保存成功！');
        }else {
          this.snackBar.alert(res['message']);
        }
      });
  }

}
