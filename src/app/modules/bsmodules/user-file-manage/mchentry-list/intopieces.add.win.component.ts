import {Component, Inject} from "@angular/core"
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {IntoPiecesAddModel} from "../../../../common/models/user-file-manage/intopieces.add.model";
import {ISidenavSrvice} from "../../../../common/services/isidenav.service";
import {MD_DIALOG_DATA, MdDialogRef, MdSnackBar} from "@angular/material";
import {HelpersAbsService} from "../../../../common/services/helpers.abs.service";
import {Observable} from "rxjs";
import {
  CommonDBService, LoadBankOrgDBService, LoadMerchantDBService,
  LoadPayCenterDBService
} from "../../../../common/db-service/common.db.service";
import {InputSearchDatasource} from "../../../../common/services/impl/input.search.datasource";
import {intoPiecesDBService} from "./intopieces.list.db.service";


@Component({
  selector:"intopieces-add-win",
  templateUrl:"./intopieces.add.win.component.html",
  providers:[CommonDBService,LoadBankOrgDBService,LoadPayCenterDBService,LoadMerchantDBService,intoPiecesDBService]
})
export class IntopiecesAddWinComponent{

  /**
   * 支付类型配置
   */
  public tradeTypes:Array<string>= [];
  /**
   * 通道类型
   */
  public mchCenterFilterFields:Array<string>= ["name"];
  /**
   * 所属银行配置
   */
  public mchBnakFilterFields:Array<string>= ["orgNo","name"];
  /**
   * 商户信息配置
   */
  public merchantFilterFields:Array<string>= ["merchantNo","name"];
  public mchBankDataSource:InputSearchDatasource;//所属银行数据源
  public mchCenterDataSource:InputSearchDatasource;//通道类型数据源
  public merchantDataSource:InputSearchDatasource;//获取商户信息数据源

  public model:IntoPiecesAddModel = new IntoPiecesAddModel();
  public intopieces: FormGroup;
  constructor(public sidenavSrvice:ISidenavSrvice,public snackBar: MdSnackBar,public helper:HelpersAbsService,
              public commonDB:CommonDBService, public mckBankOrganDb:LoadBankOrgDBService,  public CenterDb:LoadPayCenterDBService, public intoPiecesDb:intoPiecesDBService,
              public merchantOrganDb:LoadMerchantDBService,  public dialogRef: MdDialogRef<IntopiecesAddWinComponent>,   @Inject(MD_DIALOG_DATA) public data: any,
              public fb: FormBuilder){
    this.commonDB.loadTransApi({transType:""}).subscribe(res =>{
      this.tradeTypes = res
        // console.log(res);
    });
    this.mchBankDataSource = new InputSearchDatasource(mckBankOrganDb);
    this.mchCenterDataSource = new  InputSearchDatasource(CenterDb);
    this.merchantDataSource = new InputSearchDatasource(merchantOrganDb);
  }
  ngOnInit() {

    this.intopieces = this.fb.group({
      merchantId: [this.model.merchantId,[Validators.required]],
      merchantCode:[this.model.merchantCode],
      transId: [this.model.transId,[Validators.required]],
      ptCenterId: [this.model.ptCenterId,[Validators.required]],
      agencyCode:[this.model.agencyCode,[Validators.required]],
      providerNo: [this.model.providerNo]
    });
  }
  onSubmit() {
    this.intoPiecesDb.loadAddInto({merchantId:this.model._id,merchantCode:this.model.merchantCode,transId:this.model.transId,ptCenterId:this.model.centerId,agencyCode:this.model.orgNo,providerNo:this.model.providerNo,id:this.model.id}).subscribe(res=>{
    if(res && res['status'] == 200){
        this.snackBar.alert("保存成功");
        this.dialogRef.close(res);
      }else {
        this.snackBar.alert(res['message']);
      }
    })
  }
  /**
   * 所属银行显示函数
   */
  public mchBankdisplayFn(value: any):string{
    return value && value['name'];
  }
  /**
   * 所属银行选项显示函数
   */
  public mchBankOptionDisplayFn(value:any):string{
    return value && value['name'] +'('+value['orgNo']+')';
  }

  public mchBankbeforClickFunc(value:any):boolean{
    let flag:boolean = true;
    if(this.helper.isEmpty(value)){
      this.snackBar.alert('请输入关键字！');
      flag = false;
    }
    this.mckBankOrganDb.params = {name:value};
    return flag;
  }
  /**
   * 通道类型控件显示函数
   */
  public mchCenterdisplayFn(value: any):string{
    return value && value['name'];
  }
  /**
   * 通道类型控件选项显示函数
   */
  public mchCenterOptionDisplayFn(value:any):string{
    return value && value['name'] ;
  }

  public mchCenterbeforClickFunc(value:any):boolean{
    let flag:boolean = true;
    if(this.helper.isEmpty(value)){
      this.snackBar.alert('请输入关键字！');
      flag = false;
    }
    if(!this.model.transId){
      this.snackBar.alert("请先选择支付类型！")
      return false;
    }
    if(!this.model.orgNo){
      this.snackBar.alert("请选择所属银行");
      return false;
    }
    // if(this.model.orgNo &&this.model.transId){
      this.CenterDb.params = {name:value,transId:this.model.transId,bankNo:this.model.orgNo};
    // }
    return flag;
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
    let flag:boolean = true;
    if(this.helper.isEmpty(value)){
      this.snackBar.alert('请输入关键字！');
      flag = false;
    }
    this.merchantOrganDb.params = {name:value,examState:1};
    return flag;
  }
  public onSelect(value:any){

    this.model._id =value.value.id;
    this.model.merchantCode =value.value.merchantNo
  }
  public onSelectPtCenterd(value:any){
    this.model.centerId =value.value.id
  }
  public onSelectPtBankno(value:any){
    this.model.orgNo =value.value.orgNo
  }
public onSelectTransId(value:any){


}
}

