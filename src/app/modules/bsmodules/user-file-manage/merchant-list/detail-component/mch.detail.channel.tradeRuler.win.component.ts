import { OnInit, Component, Inject} from '@angular/core';
import { MdDialogRef, MdSnackBar, MD_DIALOG_DATA } from '@angular/material';
import {MchDetailDBService} from "./mch.detail.list.db.service";
import {HelpersAbsService} from "app/common/services/helpers.abs.service";
import {ISidenavSrvice} from "app/common/services/isidenav.service";

@Component({
  selector: 'mch-detail-channel-tradeRuler-win',
  templateUrl: './mch.detail.channel.tradeRuler.win.component.html',
  styles: ['md-radio-button{margin:10px 30px }'],
  providers: [MchDetailDBService]
})

export class mchDetailChannelTradeRulerWinComponent  implements OnInit {
  public tradeTypes: Array<any>;
  public tradeTypeChecked: any;
  public parentNo:any;
  public ruleState:any;
  public tradeType:any;
  public params:any;
  constructor(
    public helper: HelpersAbsService,
    public dialogRef: MdDialogRef<mchDetailChannelTradeRulerWinComponent>,
    public snackBar: MdSnackBar,
    public mchDetailDBService:MchDetailDBService,
    @Inject(MD_DIALOG_DATA) public data: any,
    public sidenavSrvice: ISidenavSrvice
  ) {
    this.parentNo = data.merchantNo;
    // this.ruleState = data.ruleState;
    this.params =data._params;
    // console.log(this.params);
  }

  ngOnInit() {
    this.tradeTypes = this.helper.getDictByKey('TRADERULECONFTRADETYPE');
  }


  /**
   * 表单提交
   */
  public onSubmit() {
    let _tradeType = this.helper.dictTrans('TRADERULECONFTRADETYPE',this.tradeTypeChecked);
    if(this.params ||this.params && !this.helper.isEmpty(this.params['source'])){
      this.dialogRef.close({ parentNo: this.parentNo, ruleState:0,tradeId:this.tradeTypeChecked,tradeType:_tradeType });
    }else{
      // let _tradeType = this.helper.dictTrans('TRADERULECONFTRADETYPE',this.tradeTypeChecked);
      // console.log(this.tradeTypeChecked ,_tradeType);
      this.mchDetailDBService.tradeRuleSave({ parentNo: this.parentNo, ruleState:0,tradeId:this.tradeTypeChecked,tradeType:_tradeType })
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
