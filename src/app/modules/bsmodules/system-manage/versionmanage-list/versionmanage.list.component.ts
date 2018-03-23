import { Component, OnInit, ViewChild } from "@angular/core";
import { VersionManageListDBService } from "./versionmanage.list.db.service";
import { Column } from "../../../../common/components/table/table-extend-config";
import { MdPupop } from "@angular/material";
import { VersionManageForm } from "../../../../common/search.form/system-manage.form/versionmanage.form";
import { MdTableExtend } from "../../../../common/components/table/table-extend";
import { VersionAddManageComponent } from "./version.add.manage.form.component";
import { VersionUploadeComponent } from "./version.upload.win.component";
import { HelpersAbsService } from '../../../../common/services/helpers.abs.service';


@Component({
  selector: 'versionmanage-list',
  templateUrl: 'versionmanage.list.component.html',
  providers: [VersionManageListDBService]
})
export class VersionManageComponent implements OnInit {
  public form: VersionManageForm = new VersionManageForm();
  @ViewChild('VersionManageTable') VersionManageTable: MdTableExtend;
  public VersionManageColumns: Array<Column> = [
    {
      name: "platform",
      title: "客户端编号"
    }, {
      name: "versionName",
      title: "版本名称"
    }, {
      name: "version",
      title: "版本号"
    }, {
      name: "path",
      title: "文件路径"
    }, {
      name: "versionRemark",
      title: "更新说明"
    }, {
      name: "createTime",
      title: "更新日期"
    }
  ];
  public tableActionCfg: any = {
    actions: [{
      btnName: "del",
      hide: true
    }, {
      btnDisplay: "上传",
      hide: (() => { // 版本管理 - 上传
        if (this.helper.btnRole('VERSIONUPLOAD')) {
          return false;
        }
        return true;
      }).bind(this),
      click: this.onUpload.bind(this)
    }, {
      btnName: "edit",
      hide: (() => { // 版本管理 - 编辑
        if (this.helper.btnRole('VERSIONEDIT')) {
          return false;
        }
        return true;
      }).bind(this),
      click: this.onEdit.bind(this)
    }
    ]
  };
  constructor(public versionManageDB: VersionManageListDBService, public pupop: MdPupop, public helper: HelpersAbsService) { }

  ngOnInit(){
    this.versionManageDB.params = this.form;
  }
  public onSearch() {
    this.form.doSearch(this.versionManageDB);
    this.VersionManageTable.refresh();
  }


  /**
   * 新增版本弹窗
   * @param row
   * @param e
   */

  public versionAdd(e: MouseEvent) {
    let VersionAdd = this.pupop.openWin(VersionAddManageComponent, { title: '新增版本', width: '550px', height: '440px' }, );
    VersionAdd.afterClosed().subscribe(result => {
      this.VersionManageTable.refresh(this.form.page);
    });
  }

  /**
   * 编辑按钮点击事件
   */
  public onEdit(row: any) {
    let editDialog = this.pupop.openWin(VersionAddManageComponent, {
      title: '编辑版本',
      width: '550px',
      height: '440px',
      data: {
        id: row['id']
      }
    });
    editDialog.afterClosed().subscribe(result => {
      this.VersionManageTable.refresh(this.form.page);
    });
  }
  /**
   * 上传按钮点击事件
   */
  public onUpload(row) {
    let uploadWin = this.pupop.openWin(VersionUploadeComponent, {
      title: '证书上传', width: '400px', height: '300px',
      data: {
        id: row['id']
      },
    });
    uploadWin.afterClosed().subscribe(result => {
      this.VersionManageTable.refresh(this.form.page);
    });
  }


}



