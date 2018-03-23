import {Component, OnInit} from "@angular/core";
import {ULODetailContainer} from "../../../../../common/components/detail/detail-container";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ISidenavSrvice} from "../../../../../common/services/isidenav.service";
import {MdSnackBar} from "@angular/material";
import {StaffAddBaseInfoModel} from "app/common/models/system-manage.models/staff.add.baseinfo.model";
import {HelpersAbsService} from "../../../../../common/services/helpers.abs.service";
import {StaffFormDBLoad} from "../staffmanage.list.db.service";

@Component({
  selector:'addstaff-baseinfo-form',
  templateUrl:'addstaff.baseinfo.form.component.html',
  providers:[StaffFormDBLoad]
})
export class AddStaffBaseInfoComponent implements OnInit{
  public ctr:ULODetailContainer;
  public model:StaffAddBaseInfoModel = new StaffAddBaseInfoModel();
  public showPwd = true;
  public staffAdd: FormGroup;
  constructor(protected fb: FormBuilder, protected helper:HelpersAbsService,public staffDB:StaffFormDBLoad,
              public sidenavSrvice:ISidenavSrvice, public snackBar: MdSnackBar){}
  ngOnInit(){
    this.staffAdd = this.fb.group({
      userName: [this.model.userName,[Validators.required,Validators.pattern(/^[A-Za-z0-9]+/)]],
      userPwd: [this.model.userPwd,[ Validators.minLength(6)]],
      realName: [this.model.realName,[Validators.required]],
      phone: [this.model.phone ,[Validators.minLength(7),Validators.maxLength(11)]]
    });

    let params = this.sidenavSrvice.getPageParams();
    if(params && !this.helper.isEmpty(params['id'])){
        this.showPwd = false;
      document.getElementById("userName").setAttribute("readonly", "readonly");
      this.staffDB.loadStaff({id:params['id']}) .subscribe(res=>{
        if(res && res['status'] == 200){
          this.model.resetValue(res['data']);
          this.model.userName = this.model['userName'].split("@")[0]
        }
      });
    }
  }

  onSubmit() {
    this.staffDB.saveStaffInfo(this.model).subscribe(res=>{
      if(res && res['status'] == 200){
        this.snackBar.alert('保存成功！');
        this.sidenavSrvice.onNavigate('/admin/staffmanage','员工管理',[],true);
      }else {
        this.snackBar.alert(res['message']);
      }
    })
  }
  onNextSetp(){
    this.staffDB.saveStaffInfo(this.model).subscribe(res=>{
      if(res && res['status'] == 200){
        this.snackBar.alert('保存成功！');
        this.ctr.params = res.data;
        this.ctr.onStep(1);
      }else {
        this.snackBar.alert(res['message']);
      }
    })
  }
  Cancel():void{
    this.sidenavSrvice.onNavigate('/admin/staffmanage','员工管理',[],true);
  }
}




