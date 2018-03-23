import { NgModule } from '@angular/core';
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {
  MdButtonModule, MdCardModule, MdInputModule, MdInputSearchModule, MdOptionModule, MdSelectModule, MdTabsModule,
  MdDialogModule, MdCheckboxModule, MdTreeModule, MdDatepickerModule, MdNativeDateModule
} from "@angular/material";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MdTableExtendModule} from "../../../common/components/table/index";
import {ULODetailModule} from "../../../common/components/detail/index";
import {LoginLogComponent} from "./loginlog-list/loginlog.list.component";
import {OperationLogComponent} from "app/modules/bsmodules/system-manage/operationlog-list/operationlog.list.component";
import {
  RoleManageComponent
} from "app/modules/bsmodules/system-manage/rolemanage-list/rolemanage.list.component";
import {
  StaffManageComponent
} from "app/modules/bsmodules/system-manage/staffmanage-list/staffmanage.list.component";
import {VersionManageComponent} from "app/modules/bsmodules/system-manage/versionmanage-list/versionmanage.list.component";
import {RoleAddManageComponent} from "./rolemanage-list/role.add.manage.form.component";
import {StaffManageAddStaffComponent} from "app/modules/bsmodules/system-manage/staffmanage-list/staffmanage.addstaff.form.component";
import {AddStaffBaseInfoComponent} from "./staffmanage-list/staffadd-component/addstaff.baseinfo.form.component";
import {AddStaffAllocationRoleComponent} from "./staffmanage-list/staffadd-component/addstaff.allocationrole.form.component";
import {RoleAddBaseInfoComponent} from "app/modules/bsmodules/system-manage/rolemanage-list/addrole-component/role.add.baseinfo.form.component";
import {RoleAddRoleMenuPermissionComponent} from "./rolemanage-list/addrole-component/role.add.rolemenupermission.component";
import {RoleAddFuncPermissionComponent} from "./rolemanage-list/addrole-component/role.add.funcpermission.component";
import {staffManageModifyPwdComponent} from "./staffmanage-list/staffmanage.modifypwd.win.component";
import {VersionAddManageComponent} from "./versionmanage-list/version.add.manage.form.component";
import {CommonDirectiveModule} from "../../../common/directives/index";
import {VersionUploadeComponent} from "./versionmanage-list/version.upload.win.component";
import {UloFileUploaderModule} from "../../../common/components/file-update/index";
@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    MdInputModule,
    MdCardModule,
    FlexLayoutModule,
    MdTableExtendModule,
    MdInputSearchModule,
    MdSelectModule,
    MdOptionModule,
    MdButtonModule,
    ULODetailModule,
    MdTabsModule,
    MdDialogModule,
    MdCheckboxModule,
    CommonDirectiveModule,
    MdTreeModule,
    UloFileUploaderModule,
    MdDatepickerModule,
    MdNativeDateModule
  ],
  declarations: [
    LoginLogComponent,
    OperationLogComponent,
    RoleManageComponent,
    RoleAddManageComponent,
    StaffManageComponent,
    VersionManageComponent,
    VersionAddManageComponent,
    StaffManageAddStaffComponent,
    AddStaffBaseInfoComponent,
    AddStaffAllocationRoleComponent,
    RoleAddBaseInfoComponent,
    RoleAddRoleMenuPermissionComponent,
    RoleAddFuncPermissionComponent,
    staffManageModifyPwdComponent,
    VersionUploadeComponent
  ],
  entryComponents: [
    VersionAddManageComponent,
    staffManageModifyPwdComponent,
      VersionUploadeComponent
  ]

})
export class SystemManageModule { }
