import {Component, OnInit} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {ISidenavSrvice} from "../../../../../common/services/isidenav.service";
import {MdSnackBar} from "@angular/material";
import {ULODetailContainer} from "../../../../../common/components/detail/detail-container";
import {StaffAllocationRoleModel} from "../../../../../common/models/system-manage.models/staff.add.allocationrole.model";
import {StaffAddBaseInfoModel} from "../../../../../common/models/system-manage.models/staff.add.baseinfo.model";
import {HelpersAbsService} from "../../../../../common/services/helpers.abs.service";
import {StaffFormDBLoad} from "../staffmanage.list.db.service";


@Component({
  selector:'addstaff-allocationrole-form',
  templateUrl:'addstaff.allocationrole.form.component.html',
  styles: [],
  providers:[StaffFormDBLoad]
})
export class AddStaffAllocationRoleComponent implements OnInit{
  public ctr:ULODetailContainer;
  public form:StaffAllocationRoleModel = new StaffAllocationRoleModel();
  public stffInfo:StaffAddBaseInfoModel
  public roles:Array<any> = new Array<any>();
  constructor( public fb: FormBuilder,public helper:HelpersAbsService,public staffDb:StaffFormDBLoad,
               public sidenavSrvice:ISidenavSrvice, public snackBar: MdSnackBar){

  }

  ngOnInit(){
    this.stffInfo = this.ctr.params;
    this.form.id = this.stffInfo.id;
    this.staffDb.loadRoleList({id:this.stffInfo.id,username:this.stffInfo.userName,parentIds:99})
    .subscribe( _res =>{
      if(_res && _res['status'] == 200){
        this.roles = _res['data'];
        this.roles.forEach((role)=>{
          if(role.checked){
            this.form.roleIds.push(role.id);
          }
        });
      }
    })
  }

  onSubmit() {
    if(this.form.id && this.form.roleIds.length > 0){
      this.staffDb.loadStaffAllot({id:this.form.id,roleIds:this.form.roleIds })
        .subscribe((_res)=>{
          if(_res && _res['status'] == 200){
            this.snackBar.alert('角色分配成功');
            this.sidenavSrvice.onNavigate('/admin/staffmanage','员工管理',[],true);
          }else{
            this.snackBar.alert(_res['message']);
          }
        });
    }else{
      this.snackBar.alert('至少需要分配一个角色');
    }

  }
  Cancel():void{
    this.sidenavSrvice.onNavigate('/admin/staffmanage','员工管理',[],true);
  }
  public onRoleChecked(role,checked){
    if(checked){
      this.form.roleIds.push(role['id']);
    }else{
      let roleIds = this.form.roleIds;
      let roleInd = roleIds.findIndex((value)=>{
        if(value == role['id']){
          return true;
        }
        return false;
      });
      roleIds.splice(roleInd,1);
    }
  }


}


