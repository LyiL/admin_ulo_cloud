/**
 * Created by lenovo on 2017/8/1.
 */
import {Component, OnInit, ViewChild} from '@angular/core';
import {Column} from '../../../../common/components/table/table-extend-config';
import {ISidenavSrvice} from "../../../../common/services/isidenav.service";
import {MdDialog} from '@angular/material';
import {RefundSettingsListService} from "./refund.settings.list.db.service";
import {RefundSettingsSearchForm} from "../../../../common/search.form/user-file-manage/refund.settings.search.form";
import {MdTableExtend} from "../../../../common/components/table/table-extend";
import {HelpersAbsService} from "../../../../common/services/helpers.abs.service";


@Component({
  selector: 'refund-settings-list',
  templateUrl: "refund.settings.list.component.html",
  providers: [RefundSettingsListService]
})
export class RefundSettingsListComponent implements OnInit{

  public form: RefundSettingsSearchForm = new RefundSettingsSearchForm();
  @ViewChild('refundSettingsListTable') refundSettingsListTable: MdTableExtend;

  //表格
  public refundSettingsColumns:Array<Column>=[{
    name:"name",
    title:"商户名称"
  },{
    name:"merchantNo",
    title:"商户编号"
  },{
    name:"chanName",
    title:"所属渠道"
  },{
    name:"examState",
    title:"审核状态",
    render:(function(row:any,name:string){
      if(this.helper.isEmpty(row[name])){
        return '/';
      }else{
        return this.helper.dictTrans('EXAMINE_STATUS',row[name]);
      }
    }).bind(this)
  },{
    name:"activeState",
    title:"激活状态",
    render:(function(row:any,name:string){
      if(this.helper.isEmpty(row[name])){
        return '/';
      }else{
        return this.helper.dictTrans('MCH_ACTIVATE_STATUS',row[name]);
      }
    }).bind(this)
  }];
  public tableActionCfg: any = {
    actions:[{
      btnName:"refundStrategy",
      btnDisplay:"退款策略",
      hide:(()=>{
        if(this.helper.btnRole('REFUNDPOLICYSETTING')){
          return false;
        }
        return true;
      }).bind(this),
      click:this.onRefundStrategy.bind(this)
    },{
      btnName:"refundAuthority",
      btnDisplay:"退款权限",
      hide:(()=>{
        if(this.helper.btnRole('REFUNDAUTHSETTING')){
          return false;
        }
        return true;
      }).bind(this),
      click:this.onrRefundAuthority.bind(this)
    },{
      btnName:"del",
      hide:true,
    },{
      btnName:"edit",
      hide:true,
    }]
  };
  constructor(
    public refundSettingsListDBService: RefundSettingsListService,
    public sidenavService: ISidenavSrvice,
    public dialog: MdDialog,
    public helper: HelpersAbsService
  ) {

  }
  ngOnInit(){
    this.refundSettingsListDBService.params = this.form;
  }
  /**
   * 退款策略按钮点击事件
   */
  onRefundStrategy(row:any,e:MouseEvent):void{
    this.sidenavService.onNavigate('/admin/refundstrategy', '退款策略', {merchantNo:row['merchantNo'],name:row['name']});
  }

  /**
   * 退款权限按钮点击事件
   */
  onrRefundAuthority(row:any,e:MouseEvent):void{
    this.sidenavService.onNavigate('/admin/refundauthority', '退款权限', {merchantNo:row['merchantNo'],name:row['name']});
  }

  /**
   * 查询按钮
   * @param value
   */
  onSearch() {
    this.form.doSearch(this.refundSettingsListDBService);
    this.refundSettingsListTable.refresh();
  }
}





