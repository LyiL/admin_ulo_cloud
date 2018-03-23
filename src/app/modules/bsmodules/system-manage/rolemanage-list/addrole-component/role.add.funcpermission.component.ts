import {Component, OnInit} from "@angular/core";
import {RoleFunPermissionModel} from "../../../../../common/models/system-manage.models/rolefunpermission.model";
import {ULODetailContainer} from "../../../../../common/components/detail/detail-container";
import {ISidenavSrvice} from "../../../../../common/services/isidenav.service";
import {MdSnackBar} from "@angular/material";
import {RoleFormDBLoad} from "../rolemanage.list.db.service";
import {HelpersAbsService} from "../../../../../common/services/helpers.abs.service";

@Component({
  selector:'role-add-funcpermission',
  styles: [],
  templateUrl:'role.add.funcpermission.component.html',
  providers:[RoleFormDBLoad]
})
export class RoleAddFuncPermissionComponent implements OnInit{
  public form:RoleFunPermissionModel = new RoleFunPermissionModel();
  public ctr:ULODetailContainer;
  public funcs:Array<any> = new Array<any>();

  constructor(public sidenavSrvice:ISidenavSrvice,public helper:HelpersAbsService,
              public snackBar: MdSnackBar,public loadDB:RoleFormDBLoad){
  }

  ngOnInit(){

    this.form = this.ctr.params;
    this.loadDB.loadGetAllFunc({roleId:this.form.id,appId:this.form["appId"],parentRoleId:this.form["parentIds"],organNo:this.form["orgNo"]})
      .subscribe(res =>{
        if(res && res["status"] == 200){
          this.funcs = res.data
        }
      })

  }
  /**
   * 全选当前页面的所有功能
   * @param childs
   * @param checked
   * @returns {boolean}
   */
  setItemAllChecked(childs,checked:boolean){
    if(!childs){
      return false;
    }
    childs.forEach(c=>{
      c.checked = checked;
    });
  }

  itemAllChecked(item){
    let childs = item['children'];
    return childs.every(c=>c.checked) ? true : childs.every(c=> !c.checked) ? false : item.checked;
  }

  itemAllIndeterminate(item:Array<any>) : boolean{
    const numComplete = item.filter(t => t.checked).length;
    return numComplete > 0 && numComplete < item.length;
  }

  onSubmit(){
    this.funcChecked();
    if(this.form.nodeIds.length == 0){
      this.snackBar.alert('请选择功能权限');
      return false;
    }
    this.loadDB.loadSaveRoleFunc(this.form).subscribe(_res=>{
      if(_res && _res['status'] == 200){
        this.snackBar.alert('保存成功');
        this.sidenavSrvice.onNavigate('/admin/rolemanage','角色管理',[],true);
      }else{
        this.snackBar.alert(_res['message']);
      }
    });
  }

  public funcChecked(){
    let funcIds = [];
    this.funcs.forEach((value)=>{
      _.forEach(value['children'],(val)=>{
        if(val['checked']){
          funcIds.push(val['id']);
        }
      })
    });

    this.form.nodeIds = funcIds;
  }

  public hasDisabled(){
    let flag = false;
    this.funcs.forEach((value)=>{
      _.forEach(value['children'],(val)=>{
        if(val['checked']){
          flag = true;
        }
      })
    });
    return this.form.id && !flag;
  }
  Cancel():void{
    this.sidenavSrvice.onNavigate('/admin/rolemanage','角色管理',[],true);
  }


}
