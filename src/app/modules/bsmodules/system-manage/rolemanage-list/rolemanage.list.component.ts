import { Component, OnInit, ViewChild } from "@angular/core";
import {RoleFormDBLoad, RoleManageListDBService} from "./rolemanage.list.db.service";
import { Column } from "../../../../common/components/table/table-extend-config";
import { ISidenavSrvice } from "../../../../common/services/isidenav.service";
import { Confirm, MdPupop, MdSnackBar } from "@angular/material";
import { RoleManageForm } from "../../../../common/search.form/system-manage.form/rolemanage.form";
import { MdTableExtend } from "../../../../common/components/table/table-extend";
import { HelpersAbsService } from '../../../../common/services/helpers.abs.service';

@Component({
  selector: 'rolemanage-list',
  templateUrl: 'rolemanage.list.component.html',
  providers: [RoleManageListDBService,RoleFormDBLoad]
})
export class RoleManageComponent implements OnInit {
  public form: RoleManageForm = new RoleManageForm();
  @ViewChild('RoleManageTable') RoleManageTable: MdTableExtend;

  public RoleManageColumns: Array<Column> = [{
    name: "roleName",
    title: "角色名称"
  }, {
    name: "description",
    title: "角色描述"
  }, {
    name: "parentName",
    title: "所属角色组",

  }, {
    name: "createdTime",
    title: "创建时间",
    xtype: "datetime"
  }
  ];
  public tableActionCfg: any = {
    width: "500px",
    actions: [
      {
        btnDisplay: "关联菜单权限",
        // 角色管理 - 关联菜单权限
        hide: (() => {
          if (this.helper.btnRole('ROLEALLOTMENU')) {
            return false;
          }
          return true;
        }).bind(this),
        click: this.onMenuPermission.bind(this)
      }, {
        btnDisplay: "关联功能权限",
        // 角色管理 - 关联功能权限
        hide: (() => {
          if (this.helper.btnRole('ROLEALLOTFUN')) {
            return false;
          }
          return true;
        }).bind(this),
        click: this.onFuncPermission.bind(this)
      }, {
        btnName: "del",
        // 角色管理 - 删除
        hide: (() => {
          if (this.helper.btnRole('ROLEDEL')) {
            return false;
          }
          return true;
        }).bind(this),
        click: this.onDelete.bind(this)
      }, {
        btnName: "edit",
        // 角色管理 - 编辑
        hide: (() => {
          if (this.helper.btnRole('ROLEEDIT')) {
            return false;
          }
          return true;
        }).bind(this),
        click: this.Onedit.bind(this)
      }
    ]
  };

  constructor(public RoleManageDB: RoleManageListDBService, public sidenavService: ISidenavSrvice, public snackBar: MdSnackBar
    , public pupop: MdPupop, public helper: HelpersAbsService,public roleFormDb:RoleFormDBLoad
  ) { }
  ngOnInit() {
    this.RoleManageDB.params = this.form;
  }
  /**
   * 新增角色
   * @constructor
   */
  Onaddrole(): void {
    this.sidenavService.onNavigate('/admin/roleaddmanage', '新增角色');
  }

  /**
   * 查询
   */
  public onSearch() {
    this.form.doSearch(this.RoleManageDB);
    this.RoleManageTable.refresh();
  }

  /**
   * 删除角色
   * @param row
   * @param e
   */
  public onDelete(row: any, e: MouseEvent): void {
    let _confirm = this.pupop.confirm({
      message: "您确认要删除该用户吗？",
      confirmBtn: "是",
      cancelBtn: "否"
    })
    _confirm.afterClosed().subscribe(res => {
      if (res == Confirm.YES) {
        this.roleFormDb.loadRoleDel({id:row['id']}).subscribe((_res) => {
          if (_res && _res['status'] == 200) {
            this.snackBar.alert('删除成功');
            this.RoleManageTable.refresh(this.form.page);
          } else {
            this.snackBar.alert(_res['message']);
          }
        });
      }
    });
  }

  /**
   * 编辑角色
   * @constructor
   */
  public Onedit(row: any, e: MouseEvent): void {
    this.sidenavService.onNavigate('/admin/roleaddmanage', '编辑角色', { isEdit: true, step: 0, id: row['id'] });
  }

  /**
   * 关联菜单权限
   */
  public onMenuPermission(row: any, e: MouseEvent): void {
    this.sidenavService.onNavigate('/admin/roleaddmanage', '关联菜单权限', { isEdit: true, step: 1, id: row['id'], appId: row['appId'], orgNo: row['orgNo'], parentIds: row['parentIds'], roleId: row['id'] });
  }

  /**
   * 关联功能权限
   */
  public onFuncPermission(row: any, e: MouseEvent): void {
    this.sidenavService.onNavigate('/admin/roleaddmanage', '关联功能权限', { isEdit: true, step: 2, id: row['id'], appId: row['appId'], orgNo: row['orgNo'], parentIds: row['parentIds'], roleId: row['id'] })
  }

}
