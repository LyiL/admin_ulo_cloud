import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import {StaffFormDBLoad, StaffManageListDBService} from "./staffmanage.list.db.service";
import { Column } from "../../../../common/components/table/table-extend-config";
import { Confirm, MdPupop, MdSnackBar } from "@angular/material";
import { ISidenavSrvice } from "../../../../common/services/isidenav.service";
import { staffManageModifyPwdComponent } from "./staffmanage.modifypwd.win.component";
import { StaffManageForm } from "../../../../common/search.form/system-manage.form/staffmanage.form";
import { MdTableExtend } from "../../../../common/components/table/table-extend";
import { HelpersAbsService } from "../../../../common/services/helpers.abs.service";

@Component({
  selector: 'staffmanage-list',
  templateUrl: 'staffmanage.list.component.html',
  providers: [StaffManageListDBService,StaffFormDBLoad]
})
export class StaffManageComponent implements OnInit {
  public form: StaffManageForm = new StaffManageForm();
  @ViewChild('StaffManageTable') StaffManageTable: MdTableExtend;
  /**
   * 使用状态
   */
  public isEnabled: Array<any> = [];
  public StaffManageColumns: Array<Column> =
  [
    {
      name: "userName",
      title: "用户名"
    }, {
      name: "b",
      title: "密码",
      render: (function (row: any, name: string, cell: Column, cellEl: ElementRef) {
        // 员工管理 - 密码
        if (!this.helper.btnRole('STAFFMODIFYPWD')) {//角色权限
          return '/';
        }
        let _cellEl = cellEl.nativeElement;
        if(_cellEl.childElementCount>0){
          return;
        }
        let _cellHtml = '修改密码';
        let a = jQuery('<a href="#">' + _cellHtml + '</a>');
        a.bind('click', this.onModifypwd.bind(this, row, name, cell));
        jQuery(_cellEl).html("").empty().append(a);
      }).bind(this)
    }, {
      name: "realName",
      title: "员工姓名"
    }, {
      name: "phone",
      title: "联系电话"
    }, {
      name: "allocation",
      title: "角色分配",
      render: (function (row: any, name: string, cell: Column, cellEl: ElementRef) {

        // 员工管理 - 角色分配
        if (!this.helper.btnRole('STAFFALLOTROLE')) {//角色权限
          return '/';
        }
        let _cellEl = cellEl.nativeElement;
        if(_cellEl.childElementCount>0){
          return;
        }
        let _cellHtml = '分配';
        let a = jQuery('<a href="#">' + _cellHtml + '</a>');
        a.bind('click', this.onAllocation.bind(this, row, name, cell));
        jQuery(_cellEl).html("").empty().append(a);
      }).bind(this)
    }, {
      name: "isEnabled",
      title: "使用状态",
      render: (function (row: any, name: string, cell: Column, cellEl: ElementRef) {

        // 员工管理 - 使用状态
        if (!this.helper.btnRole('STAFFSTATE')) {//角色权限
          return '/';
        }
        let _cellEl = cellEl.nativeElement;
        if(_cellEl.childElementCount>0){
          return;
        }
        let _cellHtml = row[name] == 1 ? '正常' : '冻结';
        let a = jQuery('<a href="#">' + _cellHtml + '</a>');
        a.bind('click', this.onUseStatus.bind(this, row, name, cell));
        jQuery(_cellEl).html("").empty().append(a);
      }).bind(this)

    }
  ];
  public tableActionCfg: any = {
    actions: [{
      btnName: "del",
      // 员工管理 - 删除按钮
      hide: (() => {
        if (this.helper.btnRole('STAFFDEL')) {
          return false;
        }
        return true;
      }).bind(this),
      click: this.onDelete.bind(this)
    }, {
      btnName: "edit",
      // 员工管理 - 编辑按钮
      hide: (() => {
        if (this.helper.btnRole('STAFFEDIT')) {
          return false;
        }
        return true;
      }).bind(this),
      click: this.OnEdit.bind(this)
    }
    ]
  };

  constructor(public StaffManageDB: StaffManageListDBService, public snackBar: MdSnackBar,
    public pupop: MdPupop, public sidenavService: ISidenavSrvice,public staffDB:StaffFormDBLoad,
    public helper: HelpersAbsService) {

  }
  ngOnInit() {
    this.isEnabled = this.helper.getDictByKey('ACTV_STATUS');
    this.StaffManageDB.params = this.form;
  }
  /**
   * 查询
   */
  public onSearch() {
    this.form.doSearch(this.StaffManageDB);
    this.StaffManageTable.refresh();
  }


  /**
   * 编辑
   * @param row
   * @param e
   * @constructor
   */
  OnEdit(row: any, e: MouseEvent): void {
    this.sidenavService.onNavigate('/admin/staffmanageaddstaff', '编辑员工', { isEdit: true, step: 0, id: row['id'] }, true);
  }
  /**
   * 分配角色
   */
  onAllocation(row: any, e: MouseEvent) {
    this.sidenavService.onNavigate('/admin/staffmanageaddstaff', '分配角色', { isEdit: true, step: 1, id: row['id'], userName: row['userName'], roleType: row['roleType'] }, true);
    return false;
  }


  /**
   * 删除
   * @param row
   * @param e
   */
  onDelete(row: any, e: MouseEvent) {
    let _confirm = this.pupop.confirm({
      message: "您确认要删除该用户吗？",
      confirmBtn: "是",
      cancelBtn: "否"
    });
    _confirm.afterClosed().subscribe(res => {
      if (res == Confirm.YES) {
        this.staffDB.loadUserDel( { id: row['id'] }).subscribe(_res => {
          if (_res && _res['status'] == 200) {
            this.snackBar.alert('删除成功');
            this.StaffManageTable.refresh(this.form.page);
          } else {
            this.snackBar.alert(_res['message']);
          }
        })
      }
    })
  }

  /**
   * 新增员工
   * @param e
   */
  public Onaddstaff(e: MouseEvent) {
    this.sidenavService.onNavigate('/admin/staffmanageaddstaff', '新增员工');
  }

  /**
   *修改密码
   */
  public onModifypwd(row: any, e: MouseEvent) {

    let pwdWin = this.pupop.openWin(staffManageModifyPwdComponent, {
      title: '密码修改', width: '450px', height: '280px',
      data: {
        id: row['id'],
      }
    });
    pwdWin.afterClosed().subscribe(result => {
      this.StaffManageTable.refresh(this.form.page);
    });

  }



  /**
   * 使用状态
   */
  public onUseStatus(row: any, e: MouseEvent) {

    let _confirm = this.pupop.confirm({
      message: "您确认要变更当前" + "【" + row['userName'] + "】" + (row['isEnabled'] == 0 ? '启用' : '禁用') + "状态吗？",
      confirmBtn: "确认",
      cancelBtn: "取消"
    });
    let _useStatus = row['isEnabled'];
    if (_useStatus == 0) {
      row['isEnabled'] = 1;
    } else {
      row['isEnabled'] = 0;
    }
    _confirm.afterClosed().subscribe((res) => {
      if (res == Confirm.YES) {
        this.staffDB.loadModifyStaff(row).subscribe(_res => {
          if (_res && _res['status'] == 200) {
            if (_res['data']['isEnabled'] == 1) {
              this.snackBar.alert('已启用');
            } else {
              this.snackBar.alert('已禁用');
            }
            this.StaffManageTable.refresh(this.form.page);
          } else {
            this.snackBar.alert(_res.message);
          }
        });
      }
    })
  }


}

