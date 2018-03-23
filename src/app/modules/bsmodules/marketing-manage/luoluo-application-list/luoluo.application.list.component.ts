import {Component, ViewChild, OnInit} from '@angular/core';
import {Column} from '../../../../common/components/table/table-extend-config';
import {MdTableExtend} from '../../../../common/components/table/table-extend';

import {LuoLuoListForm} from "../../../../common/search.form/marketing-manage/luoluo.list.form";
import {LuoAppListDbService, LuoAppService} from "./luoluo.application.list.service";
import {HelpersAbsService} from "../../../../common/services/helpers.abs.service";
import {ISidenavSrvice} from "../../../../common/services/isidenav.service";
import {Confirm, MdPupop, MdSnackBar} from "@angular/material";
import {DetailField} from "../../../../common/components/detail/detail";
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'luo-application',
  templateUrl: 'luoluo.application.list.component.html',
  providers: [LuoAppListDbService, LuoAppService]
})
export class LuoApplicationComponent implements OnInit {

  public form: LuoLuoListForm = new LuoLuoListForm();

  @ViewChild ('luoAppTable') luoAppTable: MdTableExtend;

  public releaseKey: Observable<any>; // 发布链接


  /**
   *
   * @type {[{name: string; title: string} , {name: string; title: string} , {name: string; title: string} , {name: string; title: string} , {name: string; title: string}]}
   * 列表数据
   */
  public luoAppColumns: Array<Column> = [
    {
      title: '应用名称',
      name: 'appName'
    },
    {
      title: '下载量',
      name: 'downloadNum'
    },
    {
      title: '开发者名称',
      name: 'devName'
    },
    {
      title: '应用系统',
      name: 'platform',
      render:(function(row:any,name:string, cell?: any){
        return this.helper.isEmpty(row[name]) ? '/' : this.helper.dictTrans('CLOUD_PLATFORM_DATA', row[name]);
      }).bind(this)
    },
    {
      title: '发布时间',
      name: 'releaseTime',
      xtype: "datetime"
      // render: ( (row: any) => {
      //   return this.helper.isEmpty(row['releaseTime']) ? '/' : this.helper.format(row['releaseTime'])
      // }).bind(this)
    },
    {
      title: '创建时间',
      name: 'createdTime',
      xtype: "datetime"
      // render: ( (row: any) => {
      //   return this.helper.isEmpty(row['createdTime']) ? '/' : this.helper.format(row['createdTime'])
      // }).bind(this)
    }
  ];

  /**
   * 表格按钮配置
   */
  public tableActionCfg: any = {
    actions:[
      {
        btnDisplay: '详情',
        hide: ( () => {
          if (this.helper.btnRole('LUOAPPINFO')){
            return false;
          }
          return true;
        }).bind(this),
        click: this.onDetail.bind(this)
      },
      {
        btnName: 'edit',
        hide: ( () => {
          if (this.helper.btnRole('LUOAPPEDIT')){
            return false;
          }
          return true;
        }).bind(this),
        click: this.onEdit.bind(this)
      },
      {
        btnDisplay: '生成发布链接',
        hide: ( () => {
          if (this.helper.btnRole('LUOAPPCREATEURL')){
            return false;
          }
          return true;
        }).bind(this),
        click: this.onCreateLink.bind(this)
      },
      {
        btnName: 'del',
        hide: ( () => {
          if (this.helper.btnRole('LUOAPPDEL')){
            return false;
          }
          return true;
        }).bind(this),
        click: this.onDel.bind(this)
      }
    ]
  }

  constructor(public luoAppDB: LuoAppListDbService,
              public luoAppService: LuoAppService,
              public helper: HelpersAbsService,
              public sidenavService: ISidenavSrvice,
              public snackBar: MdSnackBar,
              public pupop: MdPupop
  ) {

  }



  ngOnInit() {
    this.luoAppDB.params = this.form;
    this.releaseKey = Observable.of(this.helper.getDictByKey('CLOUD_OTO_RELEASE_APP_DOWNLOAD')); // 获取发布链接
  }

  public addApp(row: any) {
    this.sidenavService.onNavigate('/admin/luoadd', '络络应用添加');
  }

  public onDetail(row: any) {
    this.sidenavService.onNavigate('/admin/luodetail', '络络应用详情', {id: row['id']});
  }

  public onEdit(row: any) {
    this.sidenavService.onNavigate('/admin/luoadd', '络络应用编辑', {id: row['id']});
  }

  public onCreateLink(row: any) {
    let _confirm = this.pupop.confirm({
      message: this.releaseKey['value'] + "index?id=" + row['id'],
      confirmBtn: '是',
      cancelBtn: '否'
    });
  }

  // CLOUD_OTO_RELEASE_APP_DOWNLOAD

  /**
   * 删除业务员
   * @param row
   * @param e
   */
  public onDel(row: any, e: MouseEvent): void {
    let _confirm = this.pupop.confirm({
      message: '您确认要删除当前【' + row['appName'] + '】吗？',
      confirmBtn: '是',
      cancelBtn: '否'
    });
    _confirm.afterClosed().subscribe(res => {
      if (res == Confirm.YES) {
        this.luoAppService.deleteApp({id: row['id']}).subscribe((_res) => {
          if (_res && _res['status'] == 200) {
            this.snackBar.alert('删除成功');
            this.luoAppTable.refresh(this.form.page);
          } else {
            this.snackBar.alert(_res['message']);
          }
        });
      }
    });
  }

  public onSearch() {
    this.form.doSearch(this.luoAppDB);
    this.luoAppTable.refresh();
  }
}

