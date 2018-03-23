import {OnInit, Component, Inject} from "@angular/core";
import {ULODetailContainer} from "../../../../../common/components/detail/detail-container";
import {HelpersAbsService} from "../../../../../common/services/helpers.abs.service";
import {MchDetailDBService} from "./mch.detail.list.db.service";
import {MdPupop, MdSnackBar, MdDialogRef, MD_DIALOG_DATA} from "@angular/material";
import {ISidenavSrvice} from "../../../../../common/services/isidenav.service";
/**
 * rsa公钥配置
 * Created by peishen.nie on 2018/1/23.
 */
@Component({
  selector: 'mch-info-secretkey',
  templateUrl: './mch.info.secretkey.component.html',
  styles: ['md-input-container{ width: 86%; margin-left: 40px;}'],
  providers: [
    MchDetailDBService
  ]
})
export class mchInfoSecretkeyComponent implements OnInit{
  public ctr:ULODetailContainer;
  rsaPublicKey : string;
  merchantNo : string;
  constructor(public helper:HelpersAbsService, public mchDetailDBService:MchDetailDBService,
              public pupop: MdPupop,@Inject(MD_DIALOG_DATA) public data: any,
              public dialogRef: MdDialogRef<mchInfoSecretkeyComponent>,
              public snackBar:MdSnackBar,public sidenavService:ISidenavSrvice){
    this.merchantNo = data['merchantNo'];
  }

  ngOnInit(){

  }

  /**
   * 表单提交
   */
  onSubmit() {
    this.mchDetailDBService.addOrgRsakey({ orgNo:this.merchantNo ,rsaPublicKey:this.rsaPublicKey})
      .subscribe( res => {
        if (res && res['status'] == 200) {
          this.snackBar.alert('保存成功！');
          this.dialogRef.close(res);
        } else {
          this.snackBar.alert(res['message']);
        }
      })

  }
}
