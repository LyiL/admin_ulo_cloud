import {Component, OnInit, Inject} from '@angular/core';
import {MD_DIALOG_DATA, MdDialogRef, MdSnackBar} from '@angular/material';
import {HelpersAbsService} from "../../../../../common/services/helpers.abs.service";
import {ISidenavSrvice} from "app/common/services/isidenav.service";
import {MchDetailDBService} from "app/modules/bsmodules/user-file-manage/merchant-list/detail-component/mch.detail.list.db.service";


@Component({
  selector: 'mch-info-tradeLimit-win',
  templateUrl: './mch.info.tradeLimit.win.component.html',
  styles: ['md-input-container{ width: 86%; margin-left: 80px;}'],
  providers: [
    MchDetailDBService
  ]
})

export class mchInfoTradeLimitWinComponent implements OnInit {
  totalFeeLimit: number;
  public merchantNo:any;
  constructor(
    public helper: HelpersAbsService,@Inject(MD_DIALOG_DATA) public data: any,
    public dialogRef: MdDialogRef<mchInfoTradeLimitWinComponent>,public mchDetailDBService:MchDetailDBService,
    public snackBar: MdSnackBar,
    public sidenavSrvice: ISidenavSrvice
  ) {
    this.merchantNo = data['merchantNo'];
  }

  ngOnInit() {
    this.mchDetailDBService.queryMchLimit({ merchantNo:this.merchantNo })
      .subscribe( res => {
        if(res && res['status'] == 200){
          this.totalFeeLimit= res.data.totalFeeLimit;
        }
      })
  }

  /**
   * 表单提交
   */
  onSubmit() {
    if(this.totalFeeLimit < 0){
      this.snackBar.alert('金额不能小于0，请重输!');
      return false;
    }
    if(this.totalFeeLimit > 100000000){
      this.snackBar.alert('请输入小于100000000的金额！');
      return false;
    }
    let str = '' + this.totalFeeLimit;
    let ind = str.indexOf('.');
    if(ind > 0 && str.length > 2){
      let _fl = str.split('.')[1];
      if(_fl.length > 2){
        this.snackBar.alert('不能超过2位小数');
        return;
      }
    }
      this.mchDetailDBService.setMchLimit({ merchantNo:this.merchantNo ,totalFeeLimit:this.totalFeeLimit})
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
