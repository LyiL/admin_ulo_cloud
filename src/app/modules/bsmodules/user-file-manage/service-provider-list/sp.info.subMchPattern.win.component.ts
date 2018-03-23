import {Component, OnInit} from '@angular/core';
import { MdDialogRef, MdSnackBar } from '@angular/material';
import {HelpersAbsService} from '../../../../common/services/helpers.abs.service';
import { SPDetailDBService } from 'app/modules/bsmodules/user-file-manage/service-provider-list/sp.db.service';
import { SpWeixinModel } from '../../../../common/models/user-file-manage/sp.weixin.model';
import { ISidenavSrvice } from '../../../../common/services/isidenav.service';

@Component({
  selector: 'ulo-sp-info-subMchPattern-win',
  templateUrl: './sp.info.subMchPattern.win.component.html',
  styles: ['md-radio-button{margin:10px 30px }'],
  providers: [
    SPDetailDBService
  ]
})

export class ULOSPInfoSubMchPatternWinComponent implements OnInit {
  public model: SpWeixinModel = new SpWeixinModel();
  public examStyles: Array<any>;
  public checkedStyle: any;

  constructor(
    public helper: HelpersAbsService,
    public dialogRef: MdDialogRef<ULOSPInfoSubMchPatternWinComponent>,
    public snackBar: MdSnackBar,
    public sPDetailDBService: SPDetailDBService,
    public sidenavSrvice: ISidenavSrvice
  ) {
  }

  ngOnInit() {
    this.examStyles = this.helper.getDictByKey('CHAN_PRO_EXAM_STYLE');
    this.loadSubMchType();
  }

  /**
   * 载入配置信息
   */
  loadSubMchType(){
    let params = this.sidenavSrvice.getPageParams();
    if(params){
      this.sPDetailDBService.loadSubMchType({ chanCode: params['chanCode'] })
        .subscribe( res => {
          if(res && res['status'] == 200){
            this.checkedStyle = res['data']['examStyle']
          }
        })
    }
  }

  /**
   * 表单提交
   */
  onSubmit() {
    let params = this.sidenavSrvice.getPageParams();
    if(params){
      this.sPDetailDBService.editSubMchType({ chanCode: params['chanCode'], examStyle: this.checkedStyle })
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

}
