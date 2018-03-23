import {Component, Inject, OnInit} from '@angular/core';
import {HelpersAbsService} from '../../../../common/services/helpers.abs.service';
import {MD_DIALOG_DATA, MdDialogRef, MdSnackBar} from '@angular/material';
import {SPDetailDBService} from './sp.db.service';
import {ISidenavSrvice} from '../../../../common/services/isidenav.service';

@Component({
  selector: 'ulo-sp-tradeRule-win',
  templateUrl: './sp.tradeRule.win.component.html',
  styles: ['md-radio-button{margin:10px 30px }'],
  providers: [SPDetailDBService]
})

export class ULOSpTradeRuleWinComponent implements OnInit {
  public tradeTypes: Array<any>;
  public tradeTypeChecked: any;
  public parentNo:any;
  public ruleState:any;
  public tradeType:any;
  public params:any;

  constructor(
    public helper: HelpersAbsService,
    public dialogRef: MdDialogRef<ULOSpTradeRuleWinComponent>,
    public snackBar: MdSnackBar,
    public sPDetailDBService: SPDetailDBService,
    @Inject(MD_DIALOG_DATA) public data: any,
    public sidenavSrvice: ISidenavSrvice
  ) {
    this.parentNo = this.data && this.data['parentNo'];
  }

  ngOnInit() {
    this.tradeTypes = this.helper.getDictByKey('TRADERULECONFTRADETYPE');
  }

  /**
   * 表单提交
   */
  onSubmit() {
    let _tradeType = this.helper.dictTrans('TRADERULECONFTRADETYPE',this.tradeTypeChecked);
    if(this.data && this.data['step']){
      this.dialogRef.close({ parentNo: this.parentNo, ruleState:0,tradeId:this.tradeTypeChecked,tradeType:_tradeType });
    }else{
      this.sPDetailDBService.saveTradeRule({ parentNo: this.parentNo, ruleState:0, tradeId:this.tradeTypeChecked, tradeType:_tradeType })
        .subscribe( res => {
          if (res && res['status'] == 200) {
            this.snackBar.alert('停用成功！');
            this.dialogRef.close(res);
          } else {
            this.snackBar.alert(res['message']);
          }
        })
    }
  }
}
