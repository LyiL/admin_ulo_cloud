import {Component, Inject, OnInit, ViewChild} from "@angular/core";
import {LuoAppListDbService, LuoAppService} from "./luoluo.application.list.service";
import {Column} from "../../../../common/components/table/table-extend-config";
import {ULODetail} from "app/common/components/detail";
import {DetailField} from "../../../../common/components/detail/detail";
import {ISidenavSrvice} from "../../../../common/services/isidenav.service";
import {MD_DIALOG_DATA} from "@angular/material";
import {HelpersAbsService} from "../../../../common/services/helpers.abs.service";

@Component({
  selector: 'luo-application-detail',
  templateUrl: 'luoluo.application.detail.component.html',
  providers: [LuoAppListDbService, LuoAppService]
})
export class LuoApplicationDetailComponent implements OnInit {

  @ViewChild('luoAppDetail') luoAppDetail: ULODetail;

  public LuoAppDetailReqParam: any;

  // 络络应用详情页
  public LuoAppDetailFields: Array<DetailField> = [
    {
      title: '应用名称：',
      field: 'appName'
    },
    {
      title: '开发者名称：',
      field: 'devName'
    },
    {
      title: '下载量：',
      field: 'downloadNum'
    },
    {
      title: '下载地址：',
      field: 'downloadUrl'
    },
    {
      title: '创建时间：',
      field: 'createdTime',
      type: 'datetime'
    },
    {
      title: '发布时间：',
      field: 'releaseTime',
      type: 'datetime'
    },
    {
      title: '应用Logo：',
      field: 'appLogo',
      type: 'image'
    },
    {
      title: '应用图片1：',
      field: 'appImg1',
      type: 'image'
    },
    {
      title: '应用图片2：',
      field: 'appImg2',
      type: 'image'
    },
    {
      title: '应用图片3：',
      field: 'appImg3',
      type: 'image'
    },
    {
      title: '应用系统：',
      field: 'platform',
      render:(function(row:any,name:string, cell?: any){
        return this.helper.isEmpty(row[name]) ? '/' : this.helper.dictTrans('CLOUD_PLATFORM_DATA', row[name]);
      }).bind(this)
    },
    {
      title: '软件说明：',
      field: 'remark',
      render: (function (row) {
        return row['remark'];
      }).bind(this)
    }
  ]

  constructor(public sidenavService: ISidenavSrvice,
              public helper: HelpersAbsService) {
  }

  ngOnInit() {
    let params = this.sidenavService.getPageParams();
    this.LuoAppDetailReqParam = {
      url: '/otoAppRelease/detail',
      params: params
    };
  }

  public onEdit() {
    let params = this.sidenavService.getPageParams();
    this.sidenavService.onNavigate('/admin/luoadd', '络络应用编辑', {id: params['id']}, true);
  }

  public onBack(row: any) {
    this.sidenavService.onNavigate('/admin/luoapplication', '络络应用', null, true);
  }
}
