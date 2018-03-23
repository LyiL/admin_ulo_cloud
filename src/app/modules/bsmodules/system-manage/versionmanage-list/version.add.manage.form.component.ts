import {Component, Inject, OnInit} from "@angular/core";
import {MD_DIALOG_DATA, MdDialog, MdDialogRef, MdSnackBar} from "@angular/material";
import {VersionAddManageModel} from "../../../../common/models/system-manage.models/versionaddmanage.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HelpersAbsService} from "../../../../common/services/helpers.abs.service";
import {VersionDBLoad} from "./versionmanage.list.db.service";

@Component({
  selector:'version.add.manage-form',
  templateUrl:'version.add.manage.form.component.html',
  providers:[VersionDBLoad]
})
export class VersionAddManageComponent{
  public model:VersionAddManageModel = new VersionAddManageModel();
  public versionAdd: FormGroup;

  constructor(
              public helper:HelpersAbsService,
              public dialogRef: MdDialogRef<VersionAddManageComponent>,
              public fb: FormBuilder,public versionDb:VersionDBLoad,
              public snackBar: MdSnackBar,
              @Inject(MD_DIALOG_DATA) public data: any
  ){

    //data从父组件里拿到的数据赋给this.model
    if(data){
      this.model.id = data.id
      this.versionDb.loadVersion({id:this.model.id}).subscribe(res=>{
        if(res && res['status'] == 200){
          this.model.resetValue(res['data']);
        }
      })
    }
  }
  ngOnInit() {
    this.versionAdd = this.fb.group({
      platform: [this.model.platform,[Validators.required]],
      versionName: [this.model.versionName],
      version:[this.model.version,[Validators.required]],
      versionRemark:[this.model.versionRemark]
    });
  }
  /**
   * 新增版本提交
   * @param action
   */
   onSubmit(){
     this.versionDb.saveVersionInfo(this.model).subscribe(res=>{
        if(res && res['status'] == 200){
          this.snackBar.alert('保存成功！');
          this.dialogRef.close(res);
        }else {
          this.snackBar.alert(res['message']);
        }
      });
    }


}
