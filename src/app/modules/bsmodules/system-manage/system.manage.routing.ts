import {LoginLogComponent} from "./loginlog-list/loginlog.list.component";
import {OperationLogComponent} from "./operationlog-list/operationlog.list.component";
import {RoleManageComponent} from "./rolemanage-list/rolemanage.list.component";
import {StaffManageComponent} from "./staffmanage-list/staffmanage.list.component";
import {VersionManageComponent} from "./versionmanage-list/versionmanage.list.component";
import {RoleAddManageComponent} from "./rolemanage-list/role.add.manage.form.component";
import {StaffManageAddStaffComponent} from "./staffmanage-list/staffmanage.addstaff.form.component";
import {AddStaffAllocationRoleComponent} from "./staffmanage-list/staffadd-component/addstaff.allocationrole.form.component";
import {RoleAddRoleMenuPermissionComponent} from "./rolemanage-list/addrole-component/role.add.rolemenupermission.component";
import {RoleAddFuncPermissionComponent} from "./rolemanage-list/addrole-component/role.add.funcpermission.component";

export const systemmanagerouters = [
  {path: 'loginlog', component: LoginLogComponent},
  {path: 'operationlog', component: OperationLogComponent},
  {path: 'rolemanage', component:RoleManageComponent},
  {path: 'roleaddmanage', component:RoleAddManageComponent},
  {path: 'staffmanage', component:StaffManageComponent},
  {path: 'versionmanage', component:VersionManageComponent},
  {path: 'staffmanageaddstaff', component:StaffManageAddStaffComponent},
  {path: 'rolemanagefuncpermission', component:RoleAddFuncPermissionComponent},
  {path: 'rolemanagmemenupermission', component:RoleAddRoleMenuPermissionComponent}
  // {path: 'addstaffallocationrole', component:AddStaffAllocationRoleComponent}
];


