import {Component, Inject, OnInit} from "@angular/core";
import {MD_DIALOG_DATA, MdDialogRef, MdSnackBar} from "@angular/material";
import {RefundAuthorityModel} from "../../../../../common/models/user-file-manage/refund.authority.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpService} from "../../../../../common/services/impl/http.service";
import {HelpersAbsService} from "../../../../../common/services/helpers.abs.service";
import {CommonDBService} from "../../../../../common/db-service/common.db.service";
import {AuthOtherDBLoad} from "./refund.authority.list.db.service";
import {ISidenavSrvice} from "../../../../../common/services/isidenav.service";
import {Observable} from "rxjs/Observable";
export interface Task {
  value:string;
  name: string;
  completed: boolean;
  subtasks?: Task[];
}
@Component({
  selector: 'refund-authority-list-editbtn-win',
  templateUrl: 'refund.authority.list.editbtn.win.component.html',
  providers: [CommonDBService, AuthOtherDBLoad]
})

export class RefundAuthorityListEditbtnWinComponent implements OnInit{
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
    @Inject(MD_DIALOG_DATA) public data: any,
    public dialogRef: MdDialogRef<RefundAuthorityListEditbtnWinComponent>,
    public authOtherDBLoad: AuthOtherDBLoad,
    public sidenavService: ISidenavSrvice
  ) {
    this.CommonDB.loadTransApi({transId:""}).subscribe(res =>{
      this.payTypes = res
    });//支付类型
    this.formGroup = new FormGroup({
      merchantNo: new FormControl(this.model.merchantNo, Validators.required),
      name: new FormControl({value: this.model.name, disabled: true}, Validators.required),
      transId: new FormControl(this.model.transId),
      transType: new FormControl(this.model.transType),
      // refundAuth: new FormControl(this.model.refundAuth, Validators.required),
      examType: new FormControl(this.model.examType, Validators.required),
    });

    this.model.authId = data.authId;
    this.authOtherDBLoad.loadAuthInfo({authId: this.model.authId}).subscribe(res=>{
      if(res && res['status'] == 200){
        // this.model = res.data;
        this.model.resetValue(res['data']);
        this.model.name = data.name;//name取上一个页面通过路由参数带过来的（res.data里没有）
        let _auth = res.data['refundAuth'].split(',');
        this.refundAuthAny.forEach((item,ind)=>{
          if(_auth.find((sourceAuth)=>{return item.id == sourceAuth;}) != undefined){
            this.refundAuthAny[ind]['checked'] = true;
          }
        });
      }
    });


  }
  ngOnInit(){
    this.approvalTypes = this.helper.getDictByKey('REFUND_EXAMINE_TYPE');//审核类型
    this.refundAuthAny = this.helper.getDictByKey('MCH_REFUND_AUTH_REFUND_AUTH'); //退款权限
    this.refundAuthAny.forEach((item,ind)=>{
          this.refundAuthAny[ind] = _.extend(item,{checked:false});
    });

  }
  /**
   * 退款权限
   */
  public onChecked(val:any,checked:boolean){
    val['checked'] = checked;
    this.refundAuthAnyJoin(val,checked);
  }
  public refundAuthAnyJoin(val:any,flag:boolean){
    let refundAuthAny = this.model.refundAuth;
    let _refundAuthAny:Array<any> = !this.helper.isEmpty(refundAuthAny) ? refundAuthAny.split(',') : new Array<any>();
    let _arrIndx = jQuery.inArray(''+val.id,_refundAuthAny);
    if(_arrIndx == -1 && flag){
      _refundAuthAny.push(val.id);
    }else if(_arrIndx != -1 && !flag){
      let _ind = _refundAuthAny.findIndex((item)=>{return val.id == item;});
      _refundAuthAny.splice(_ind,1);
    }
    this.model.refundAuth = _refundAuthAny.length > 0 ? _refundAuthAny.join(',') : '';
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
    this.editAuthority();
  }

  editAuthority(){
    this.authOtherDBLoad.loadEdit(this.model)
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
