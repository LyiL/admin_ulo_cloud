import {Component, Inject, OnInit} from "@angular/core";
import {MD_DIALOG_DATA, MdDialogRef, MdSnackBar} from "@angular/material";
import {RefundAuthorityModel} from "../../../../../common/models/user-file-manage/refund.authority.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpService} from "../../../../../common/services/impl/http.service";
import {HelpersAbsService} from "../../../../../common/services/helpers.abs.service";
import {CommonDBService} from "../../../../../common/db-service/common.db.service";
import {AuthOtherDBLoad} from "./refund.authority.list.db.service";
export interface Task {
  value:string;
  name: string;
  completed: boolean;
  subtasks?: Task[];
}
@Component({
  selector: 'refund-authority-list-addbtn-win',
  templateUrl: 'refund.authority.list.addbtn.win.component.html',
  providers: [CommonDBService,AuthOtherDBLoad]
})

export class RefundAuthorityListAddbtnWinComponent implements OnInit{
  public formGroup: FormGroup;
  public model: RefundAuthorityModel = new RefundAuthorityModel();
  /**
   * 退款权限
   */
  public refundAuthAny:Array<any> = [];
  public refundAuths:Array<any> = [];
  /**
   * 审核类型
   */
  public approvalTypes:Array<any> = [];
  /**
   * 支付类型配置
   */
  public payTypes:Array<string>= [];

  constructor(
    public snackBar: MdSnackBar,
    public http: HttpService,
    public helper: HelpersAbsService,
    protected CommonDB: CommonDBService,
    public dialogRef: MdDialogRef<RefundAuthorityListAddbtnWinComponent>,
    public authOtherDBLoad: AuthOtherDBLoad,
    @Inject(MD_DIALOG_DATA) public data: any,
  ) {
    this.CommonDB.loadTransApi({transId:""}).subscribe(res =>{
      this.payTypes = res;
    });//支付类型
    this.formGroup = new FormGroup({
      merchantNo: new FormControl(this.model.merchantNo, Validators.required),
      name: new FormControl({value: this.model.name, disabled: true}, Validators.required),
      transId: new FormControl(this.model.transId),
      transType: new FormControl(this.model.transType),
      refundAuth: new FormControl(this.model.refundAuth, Validators.required),
      examType: new FormControl(this.model.examType, Validators.required),
    });
    this.model.name = data.name;
    this.model.merchantNo = data.merchantNo;
  }
  ngOnInit(){
    this.approvalTypes = this.helper.getDictByKey('REFUND_EXAMINE_TYPE');//审核类型
    this.refundAuthAny = this.helper.getDictByKey('MCH_REFUND_AUTH_REFUND_AUTH'); //退款权限
    /**
     * 退款权限（复选框）
     */
    this.refundAuthAny.forEach((auth)=>{
      auth['checked'] = false;
    });
    if(this.model.refundAuth){
      let auths = this.model.refundAuth.split(',');
      this.refundAuths = auths;
      this.refundAuthAny.forEach((authAny)=>{
        if(jQuery.inArray(authAny['id'],auths) != -1){
          authAny['checked'] = true;
        }
      })
    }
  }
  /**
   * 退款权限
   */
  public onChecked(auth,checked){
    if(checked){
      if(!this.refundAuths.find((value)=>{
          if(value == auth['id']){
            return true;
          }else{
            return false;
          }
        })){
        this.refundAuths.push(auth['id']);
      }
    }else{
      let roleIds = this.refundAuths;
      let roleInd = roleIds.findIndex((value)=>{
        if(value == auth['id']){
          return true;
        }
        return false;
      });
      roleIds.splice(roleInd,1);
    }
    this.model.refundAuth = this.refundAuths.join(',');
  }
  /**
   *获取支付类型名称
   */
  getTradeName(result) {
    this.model.transType = result.source.triggerValue;
  }
  /**
   * 保存按钮点击事件（提示信息）
   */
   onSave() {
    if(this.helper.isEmpty(this.model.refundAuth)) {
      this.snackBar.alert('请选择退款权限！');
      return;
    }
    this.addAuthority();
  }

  addAuthority(){
    this.authOtherDBLoad.loadAdd(this.model)
      .subscribe((res) => {
        if(res && res['status'] == 200){
          this.snackBar.alert('保存成功！');
          this.dialogRef.close();
        }else {
          this.snackBar.alert(res['message']);
        }
      });
  }

}
