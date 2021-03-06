import {Component, OnInit,AfterContentChecked, ChangeDetectorRef} from "@angular/core";
import {HelpersAbsService} from "../../../../common/services/helpers.abs.service";
import { LoadMerchantDBService} from "../../../../common/db-service/common.db.service";
import {InputSearchDatasource} from "../../../../common/services/impl/input.search.datasource";
import {MdDialogRef, MdSnackBar} from "@angular/material";
import {TradeNoticeBatchNoticeModel} from "../../../../common/models/trade-manage.models/trade.notice.batchnotice.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {TradeNoticeDBService} from "./trade.notice.list.db.service";

@Component({
  selector:"trade-notice-batchnotice",
  templateUrl:"./trade.notice.batchnotice.win.component.html",
  providers:[LoadMerchantDBService,TradeNoticeDBService]
})
export class TradeNoticeBatchnoticeComponent implements OnInit,AfterContentChecked{
  /**
   * 通知状态
   */
  public notifyState:Array<any> = [];
  /**
   * 商户信息配置
   */

  public merchantFilterFields:Array<string>= ["merchantNo","name"];
  public merchantDataSource:InputSearchDatasource;//获取商户信息数据源
  public model:TradeNoticeBatchNoticeModel = new TradeNoticeBatchNoticeModel();
  public batchnotice: FormGroup;
  public dateOpts:any = {
    lastMinDate:this.model.tradeTimeStart
  }
  constructor(public helper:HelpersAbsService, public dialogRef: MdDialogRef<TradeNoticeBatchnoticeComponent>,
              public fb: FormBuilder,public tradeNoticeDb:TradeNoticeDBService,private changeDetectorRef:ChangeDetectorRef,
              public merchantOrganDb:LoadMerchantDBService,
              public snackBar: MdSnackBar){
    this.merchantDataSource = new InputSearchDatasource(merchantOrganDb);
  }
  ngAfterContentChecked(){
    if(this.model.tradeTimeStart){
      this.dateOpts = {
        lastMinDate:this.model.tradeTimeStart
      };
    }
  }
  ngOnInit(){
    this.notifyState = this.helper.getDictByKey('ORDER_NOTIFY_STATE');
    this.batchnotice = this.fb.group({
      tradeTimeStart: [this.model.tradeTimeStart ,[Validators.required]],
      tradeTimeEnd: [this.model.tradeTimeEnd ,[Validators.required]],
      mchNo: [this.model.mchNo ,[Validators.required]],
      notifyState: [this.model.notifyState]
    });
    this.changeDetectorRef.detectChanges();
  }
 public onSubmit():void{
    if(this.batchnotice.valid){
      if(this.helper.isEmpty(this.model['_tradeTimeEnd'])) {
        this.snackBar.alert('请选择结束日期!') ;
      }else{
        this.tradeNoticeDb.loadBatchNotify(this.model).subscribe(res=>{
          if(res && res['status'] == 200){
            // console.log(res);
            this.snackBar.alert("正在通知中，请耐心等待...");
            this.dialogRef.close(res);
          }else{
            this.snackBar.alert(res['message']);
          }
        });
      }
    }


  }

  /**
   * 商户名称控件显示函数
   */
  public merchantDisplayFn(value: any):string{
    return value && value['name'];
  }
  /**
   * 商户名称控件选项显示函数
   */
  public merchantOptionDisplayFn(value:any):string{
    return value && value['name'] +'('+value['merchantNo']+')';
  }

  public merchantBeforClickFunc(value:any):boolean{
    if(this.helper.isEmpty(value)){
      this.snackBar.alert('请先输入过滤值！');
      return false;
    }
    this.merchantOrganDb.params = {name:value};
  }
}
