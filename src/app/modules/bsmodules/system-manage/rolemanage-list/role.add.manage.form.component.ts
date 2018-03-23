import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from "@angular/core";
import {RoleAddBaseInfoComponent} from "./addrole-component/role.add.baseinfo.form.component";
import {RoleAddRoleMenuPermissionComponent} from "./addrole-component/role.add.rolemenupermission.component";
import {RoleAddFuncPermissionComponent} from "./addrole-component/role.add.funcpermission.component";
import {ULODetailContainer} from "../../../../common/components/detail/detail-container";
import {ISidenavSrvice} from "../../../../common/services/isidenav.service";



@Component({
    selector:'roleadd-manage-form',
    templateUrl:'role.add.manage.form.component.html',
     providers:[],
    entryComponents:[RoleAddBaseInfoComponent,RoleAddRoleMenuPermissionComponent,RoleAddFuncPermissionComponent]
})
export class RoleAddManageComponent implements AfterViewInit{
  public roleAddCfgFormTabs:Array<any> = [
    {label:"基本信息",content:RoleAddBaseInfoComponent},
    {label:"关联菜单权限",content:RoleAddRoleMenuPermissionComponent},
    {label:"关联功能信息",content:RoleAddFuncPermissionComponent}
  ];
  @ViewChild('roleAddFormContainer') roleAddFormContainer:ULODetailContainer;
  constructor(public sidenavSrvice:ISidenavSrvice,public changeDetectorRef:ChangeDetectorRef){}
  ngAfterViewInit():void{
    let params = this.sidenavSrvice.getPageParams();
    let step = params && params['step'] || 0;
    if(params && params['isEdit'] && params['isEdit'] === true){
      this.roleAddFormContainer.params = params;
    }
    if(this.roleAddFormContainer.selectedIndex != step){
      this.roleAddFormContainer.selectedIndex = step;
      this.changeDetectorRef.detectChanges();
    }
  }


}
