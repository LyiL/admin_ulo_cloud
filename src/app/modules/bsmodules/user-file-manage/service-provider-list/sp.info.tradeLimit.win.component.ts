import {Component, Inject, OnInit} from '@angular/core';
import {MD_DIALOG_DATA, MdDialogRef, MdSnackBar} from '@angular/material';
import {HelpersAbsService} from '../../../../common/services/helpers.abs.service';
import { SPDetailDBService } from 'app/modules/bsmodules/user-file-manage/service-provider-list/sp.db.service';
import { ISidenavSrvice } from '../../../../common/services/isidenav.service';

@Component({
  selector: 'ulo-sp-info-tradeLimit-win',
  templateUrl: './sp.info.tradeLimit.win.component.html',
  styles: ['md-input-container{ width: 86%; margin-left: 80px;}'],
  providers: [
    SPDetailDBService
  ]
})

export class ULOSPInfoTradeLimitWinComponent implements OnInit{
  tradeLimit: number;
  _chanCode: any;

  constructor(
    public helper: HelpersAbsService,
    public dialogRef: MdDialogRef<ULOSPInfoTradeLimitWinComponent>,
    public snackBar: MdSnackBar,
    public sPDetailDBService: SPDetailDBService,
    public sidenavSrvice: ISidenavSrvice,
    @Inject(MD_DIALOG_DATA) public data: any,
  ) {
  }

  ngOnInit() {
    if(this.data){
      this._chanCode = this.data['chanCode'];
      this.loadData(this._chanCode);
    }
  }

  /**
   * 载入数据
   */
  loadData(data){
    if(data){
      this.sPDetailDBService.loadTradeLimit({ chanCode: data })
        .subscribe( res => {
          if(res && res['status'] == 200 && res['data'] && res['data']['totalFeeLimit']){
            this.tradeLimit = res['data']['totalFeeLimit'];
          }
        })
    }
  }

  /**
   * 表单提交
   */
  onSubmit() {
    if(this._chanCode){
      if(this.tradeLimit < 0){
        this.snackBar.alert('金额不能为负数');
      }else{
        let str = '' + this.tradeLimit;
        let ind = str.indexOf('.');
        if(ind > 0 && str.length > 2){
          let _fl = str.split('.')[1];
          if(_fl.length > 2){
            this.snackBar.alert('不能超过2位小数');
            return;
          }
        }
        this.sPDetailDBService.saveTradeLimit({ chanCode: this._chanCode, totalFeeLimit: this.tradeLimit })
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

}
