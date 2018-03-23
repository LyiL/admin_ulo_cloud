import {Component, OnInit} from "@angular/core";
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {HttpService} from "../../common/services/impl/http.service";
import {MdSnackBar, MdDialogRef} from "@angular/material";
@Component({
  selector:'edit-pwd-com',
  templateUrl:'./edit.pwd.component.html',
  styles:[`
    .row{
      margin:0 20px 0 10px;
    }
  `]
})
export class EditPwdComponent implements OnInit{
  public pwdFormGroup:FormGroup;

  constructor(public http:HttpService,public snackBar:MdSnackBar,public dialogRef: MdDialogRef<EditPwdComponent>){}

  ngOnInit(){
    this.pwdFormGroup = new FormGroup({
      'userPwd':new FormControl(null,[Validators.required]),
      'newPassword':new FormControl(null,[Validators.required]),
      'newpwd2':new FormControl(null,[Validators.required]),
    });
  }

  onSubmit(value:any){
    if(this.pwdFormGroup.valid){
      if(value['newPassword'] != value['newpwd2']){
        this.snackBar.alert('新密码与确认密码不一致！');
        return false;
      }
      this.http.post('/loginAuth/changePwd',value).subscribe(res=>{
        if(res && res['status'] == 200){
          this.snackBar.alert('密码修改成功！');
          this.dialogRef.close();
        }else{
          this.snackBar.alert(res['message']);
        }
      });
    }
  }
}
