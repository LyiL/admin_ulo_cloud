/**
 * Created by lenovo on 2017/8/1.
 */
import {Component, OnInit, ViewChild} from '@angular/core';
import {Confirm, MdDialog, MdPupop, MdSnackBar} from '@angular/material';
import {Column} from "../../../../../common/components/table/table-extend-config";
import {ISidenavSrvice} from "../../../../../common/services/isidenav.service";
import {AuthOtherDBLoad, RefundAuthorityListService} from "./refund.authority.list.db.service";
import {RefundAuthorityListAddbtnWinComponent} from "./refund.authority.list.addbtn.win.component";
import {MdTableExtend} from "../../../../../common/components/table/table-extend";
import {RefundSettingsSearchForm} from "../../../../../common/search.form/user-file-manage/refund.settings.search.form";
import {ActivatedRoute} from "@angular/router";
import {HttpService} from "../../../../../common/services/impl/http.service";
import {HelpersAbsService} from "../../../../../common/services/helpers.abs.service";
import {RefundAuthorityListEditbtnWinComponent} from "./refund.authority.list.editbtn.win.component";
import {BaseSearchForm} from "../../../../../common/search.form/base.search.form";

@Component({
  selector: 'refund-authority-list',
  templateUrl: "./refund.authority.list.component.html",
  providers: [RefundAuthorityListService,AuthOtherDBLoad]
})
export class RefundAuthorityListComponent implements OnInit{
  public form: BaseSearchForm = new BaseSearchForm();
  @ViewChild('refundAuthorityListTable') refundAuthorityListTable: MdTableExtend;

  //表格
  public refundAuthorityColumns:Array<Column>=[{
    name:"merchantNo",
    title:"商户编号",
  },{
    name:"transType",
    title:"支付类型"
  },{
    name:"refundAuth",
    title:"退款权限",
    render:(function(row:any,name:string){
      let strs=row[name].split(',');
      let value='';
      for(var i=0;i<strs.length;i++){
        var temp=this.helper.dictTrans('MCH_REFUND_AUTH_REFUND_AUTH',strs[i].trim());
        if(temp!=""){
          value+=temp;
          if(i<strs.length-1){
            value+=",";
          }
        }
      }
      return value;
    }).bind(this)
  },{
    name:"examType",
    title:"审核类型",
    render:(function(row:any,name:string){
      if(this.helper.isEmpty(row[name])){
        return '/';
      }else{
        return this.helper.dictTrans('REFUND_EXAMINE_TYPE',row[name]);
      }
    }).bind(this)
  },{
    name:"addTime",
    title:"创建时间",
    xtype:"datetime"
  },{
    name:"isEnabled",
    title:"使用状态",
    render:this.onUseState.bind(this),
  }];
  public tableActionCfg: any = {
    actions:[{
      btnName:"del",
      hide:true,
    },{
      btnName:"edit",
      hide:(()=>{
        if(this.helper.btnRole('REFUNDAUTHSETTINGEDIT')){
          return false;
        }
        return true;
      }).bind(this),
      click:this.openEditDialog.bind(this)
    }]
  };

  constructor(
    public refundAuthorityDBService: RefundAuthorityListService,
    public sidenavService: ISidenavSrvice, public dialog: MdDialog,
    public http: HttpService,
    public helper: HelpersAbsService,
    public pupop: MdPupop,
    public snackBar: MdSnackBar,
    public authOtherDBLoad:AuthOtherDBLoad
  ) {}

  ngOnInit():void{
    let params = this.sidenavService.getPageParams();
    this.form['merchantNo'] = params['merchantNo']
    //加载退款权限列表里的数据
    this.refundAuthorityDBService.params = this.form;
  }
  /**
   *使用状态列
   * 0禁用,1启用
   * @author lyl
   * @date 2017-08-15
   */
  onChangeStatus(row: any, e: MouseEvent): void {
    let _confirm = this.pupop.confirm({
      message: "您确认要变更当前【"+ row['transType']+"】状态吗？",
      confirmBtn: "确认",
      cancelBtn: "取消"
    })
    _confirm.afterClosed().subscribe(res => {
      if (res == Confirm.YES) {
        if(row['isEnabled'] == 1){
          row['isEnabled'] = 0;
        }else if(row['isEnabled'] == 0) {
          row['isEnabled'] = 1
        }
        this.authOtherDBLoad.loadUpdateStatus({authId: row['authId'], isEnabled: row['isEnabled']}).subscribe((_res) => {
          if (_res && _res['status'] == 200) {
            this.snackBar.alert('操作成功!');
            this.refundAuthorityListTable.refresh(this.form.page);
          } else {
            this.snackBar.alert(_res['message']);
          }
        });
      }
    });
  }
  onUseState(row:any,name:string,cell:any,cellEl:any) {
    let _cellEl = cellEl.nativeElement;
    if(_cellEl.childElementCount > 0){
      return;
    }
    let _span = jQuery('<span></span>');
    let _i = jQuery('<i class="fa"></i>');
    if(row[name] == 1){
      _span.html('已启用');
      _i.addClass('fa-pause');
      cell.bgColor = 'success-bg';
    }else if(row[name] == 0){
      _span.html('已禁用');
      _i.addClass('fa-toggle-right');
      cell.bgColor = 'danger-bg';
    }else{
      cell.bgColor = 'none';
      return '/';
    }
    if(this.helper.btnRole('REFUNDAUTHSETTINGCHANGE')){
      _i.bind('click',this.onChangeStatus.bind(this,row,name,cell,_span,_i));
    }
    jQuery(_cellEl).html('').empty().append(_span ,_i);
  }

  /**
   * 添加退款权限按钮
   */
  onAddAuthority() {
    let params = this.sidenavService.getPageParams();//路由参数
    let addDialog = this.pupop.openWin(RefundAuthorityListAddbtnWinComponent, {
      title:'新增退款权限',
      width:'470px',
      height:'380px',
      data:{
        name:params['name'],
        merchantNo:params['merchantNo']
      }
    });
    addDialog.afterClosed().subscribe(result => {
      this.refundAuthorityListTable.refresh(this.form.page);
    });
  }

  /**
   * 编辑按钮点击事件
   */
  openEditDialog(row:any,e:MouseEvent) {
    let params = this.sidenavService.getPageParams();//路由参数
    let editDialog = this.pupop.openWin(RefundAuthorityListEditbtnWinComponent, {
      title:'编辑退款权限',
      width:'470px',
      height:'380px',
      data: {
        authId: row['authId'],
        name:params['name']
      },
    });
    editDialog.afterClosed().subscribe(result => {
      this.refundAuthorityListTable.refresh(this.form.page);
    });
  }

}





