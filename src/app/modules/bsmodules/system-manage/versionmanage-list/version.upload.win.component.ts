import {Component, Inject, OnInit} from "@angular/core";
import {MD_DIALOG_DATA, MdDialog, MdDialogRef, MdSnackBar} from "@angular/material";
import {FormBuilder, FormGroup} from "@angular/forms";
import {HelpersAbsService} from "../../../../common/services/helpers.abs.service";
import {VersionUploadModel} from "../../../../common/models/system-manage.models/versionuploadmanage.model";
import {VersionDBLoad} from "./versionmanage.list.db.service";

@Component({
  selector:'version-upload-win',
  templateUrl:'version.upload.win.component.html',
  providers:[VersionDBLoad]
})
export class VersionUploadeComponent{
  public model:VersionUploadModel = new VersionUploadModel();
  //文件上传控件配置
  public defFieldUploadSetting : any = {
    url:'/assets/upload',
    fileSuffix:'.jpg;.jpeg;.png;.gif;'
  };

  constructor(public helper:HelpersAbsService, @Inject(MD_DIALOG_DATA) public data: any, public versionDb:VersionDBLoad,
              public dialogRef: MdDialogRef<VersionUploadeComponent>,public fb: FormBuilder,public snackBar: MdSnackBar, public dialog: MdDialog){

    //data从父组件里拿到的数据赋给this.model
    if(data){
      this.model.id = data.id
      this.versionDb.loadVersion({id:this.model.id}).subscribe(res=>{
        if(res && res['status'] == 200){
          this.model = res.data
        }
      })
    }

  }
  ngOnInit() {

  }

  public handleUpload(data){
    if(data['status'] != 200){
      return;
    }
    let res = JSON.parse(data.response);
    if(res && res['status'] == 200){
      this.model.path = res['data']['url'];
    }

  }
  /**
   * 上传提交
   * @param action
   */
  onSubmit(){
    this.versionDb.loadUpdatePlatVersio(this.model).subscribe( res => {
      if(res && res['status'] == 200){
        this.snackBar.alert('上传成功');
        this.dialogRef.close(res);
      }
    })
  }


  /**
   * 文件上传错误信息
   * @param data
   */
 public onFileUploadError(data){
    if(data && data['message']){
      this.snackBar.alert(data['message']);
    }else if(data['error'] == true){
      this.snackBar.alert('系统异常，请联系管理员');
    }
  }
}
