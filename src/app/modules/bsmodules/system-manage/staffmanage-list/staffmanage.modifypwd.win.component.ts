import {Component, Inject} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {StaffPwdModifyModel} from "../../../../common/models/system-manage.models/staff.pwdmodify.model";
import {HelpersAbsService} from "../../../../common/services/helpers.abs.service";
import {MD_DIALOG_DATA, MdDialogRef, MdSnackBar} from "@angular/material";
import {StaffFormDBLoad} from "./staffmanage.list.db.service";
import "rxjs/add/operator/debounceTime";


@Component({
  selector:"staffmanage-modifypwd-win",
  templateUrl:"./staffmanage.modifypwd.win.component.html",
  providers: [StaffFormDBLoad]
})
export class staffManageModifyPwdComponent{
  public model:StaffPwdModifyModel = new StaffPwdModifyModel();
  public modifypwd: FormGroup;
  constructor(public helper:HelpersAbsService,public staffDB:StaffFormDBLoad,
              public dialogRef: MdDialogRef<staffManageModifyPwdComponent>,@Inject(MD_DIALOG_DATA) public data: any,public fb: FormBuilder,public snackBar: MdSnackBar){
      this.model = data
  }
  ngOnInit() {
    this.modifypwd = this.fb.group({
      userPwd: [this.model.userPwd,[Validators.required,Validators.minLength(6)]],
      userPwdc: [this.model.userPwdc,[Validators.required]]
    });
    this.modifypwd.valueChanges.debounceTime(400).subscribe((data) => {
      if(this.onValueChanged(data) == undefined){
        return false;
      }else {
        this.snackBar.alert(this.onValueChanged(data));
      }
    });
  }
  //存储错误信息
  formErrors = {
    'userPwd': '',
  };
  //错误对应的提示
  validationMessages = {
    'userPwd': {
      'minLength': '密码最少6位.',
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
      const control = this.modifypwd.get(field);
      //表单字段已修改或无效

      if (control && control.dirty && !control.valid) {
        //取出对应字段可能的错误信息
        const messages = this.validationMessages[field]['minLength'];
        // console.log(messages);
        return messages
      }
    }

  }
   onSubmit(){
    if(this.model.userPwd !== this.model.userPwdc){
      this.snackBar.alert('俩次密码输入不一致');
      return;
    }
    this.staffDB.loadUserModifyPwd(this.model).subscribe(res=>{
      if(res && res['status'] == 200){
        this.snackBar.alert('保存成功！');
        this.dialogRef.close(res);
      }else {
        this.snackBar.alert(res['message']);
      }
    });
  }

}
