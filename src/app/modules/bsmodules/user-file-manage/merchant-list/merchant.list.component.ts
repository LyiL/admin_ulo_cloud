import {Component, ElementRef, ViewChild,OnInit} from "@angular/core";
import {ISidenavSrvice} from "../../../../common/services/isidenav.service";
import {mchListDBService} from "./mch.list.db.service";
import {Column} from "../../../../common/components/table/table-extend-config";
import {MerchantListForm} from "app/common/search.form/user-file-manage/merchant.list.form";
import {MdTableExtend} from "../../../../common/components/table/table-extend";
import {HelpersAbsService} from "../../../../common/services/helpers.abs.service";
import {
  LoadAgentAndSPDBService,
  LoadAgentDBService, LoadBankOrgDBService,
  LoadMerchantDBService, LoadPayCenterDBService
} from "../../../../common/db-service/common.db.service";
import {InputSearchDatasource} from "../../../../common/services/impl/input.search.datasource";
import {Confirm, MdPupop, MdSnackBar} from "@angular/material";
import {HttpService} from "../../../../common/services/impl/http.service";
import {MchDetailDBService} from "./detail-component/mch.detail.list.db.service";
import {MerchantWeixinAccountSetComponent} from "./merchant.weixinAccountSet.win.component";

@Component({
  selector:'merchant-list-component',
  templateUrl:'merchant.list.component.html',
  providers:[mchListDBService,LoadMerchantDBService,LoadBankOrgDBService,LoadAgentAndSPDBService,MchDetailDBService,LoadPayCenterDBService]
})

export class MerchantListComponent implements OnInit{
  /**
   * 查询表单
   * @type {MerchantListForm}
   */
public form:MerchantListForm = new MerchantListForm();
  @ViewChild('mchlistTable') mchlistTable:MdTableExtend;

  /**
   * 所属机构配置
   */
  public mchBnakFilterFields:Array<string>= ["orgNo","name"];
  /**
   * 所属上级配置
   */
  public mchAgentFilterFields:Array<string>= ["chanCode","name"];
  /**
   * 商户信息配置
   */
  public merchantFilterFields:Array<string>= ["merchantNo","name"];
  /**
   * 通道配置
   */
  public mchCenterFilterFields:Array<string>= ["name"];

  public mchCenterDataSource:InputSearchDatasource;//支付中心信息数据源
  public mchBankDataSource:InputSearchDatasource;//机构控件数据源
  public mchAgentDataSource:InputSearchDatasource;//所属上级数据源
  public merchantDataSource:InputSearchDatasource;//获取商户信息数据源

  /**
   * 用户状态
   */
  public examState:Array<any> = [];
  /**
   * 支付权限
   */
  public tradeAuth:Array<any> = [];

  /**
   * 商户表格列
   */
  public mchListColumns:Array<Column>=
    [
      {
        name:"name",
        title:"商户名称",
        width:'60px'
      },{
      name:"merchantNo",
      title:"商户编号"
    },{
      name:"outerBatchId",
      title:"进件批次号"
    },{
      name:"shortName",
      title:"商户简称",
    },{
      name:"chanName",
      title:"所属上级"
    },{
      name:"bankName",
      title:"所属机构",
      width:'65px'
    },{
      name:"examState",
      title:"用户状态",
      render:(function(row:any,name:string,cell:any){
        let _examState = row[name];
        switch(_examState){
          case 0:
            cell.bgColor = 'warning-bg';
            break;
          case 1:
            cell.bgColor = 'success-bg';
            break;
          case 2:
            cell.bgColor = 'danger-bg';
            break;
          case 3:
          case 4:
            cell.bgColor = 'disables-bg';
            break;
        }
        return this.helper.dictTrans('EXAMINE_STATUS',_examState);
      }).bind(this)
    },
      {
      name:"alipayMchLive",
      title:"支付宝等级",
      render: (function (row: any, name: string) {

        if (row['alipayMchLive']) {
          return row['alipayMchLive'].split("_")[2];
        }else {
          return '/';
        }
      }).bind(this)
    },{
      name:"aliPayMchLiveSearch",
      title:"支付宝等级查询",
      render: (function (row: any, name: string, cell: Column, cellEl: ElementRef) {
        // let data = this.helper.getDictByKey('CLOUD_ULO_BANK_NO');
        // if(row['bankNo'] == data){
          if(this.helper.hasConfigValueMatch('CLOUD_ULO_BANK_NO',row['bankNo'])){
          return  '/';
        }
        if (!this.helper.btnRole('ALIPAYRANK')) {//角色权限
          return '/';
        }
        let _cellEl = cellEl.nativeElement;
        if(_cellEl.childElementCount>0){
          return;
        }
        let _cellHtml = '查询';
        let a = jQuery('<a href="#">' + _cellHtml + '</a>');
        a.bind('click', this.aliPayMchLiveSearch.bind(this, row, name, cell));
        jQuery(_cellEl).html("").empty().append(a);
      }).bind(this)
    },{
      name:"tradeAuth",
      title:"微信支付权限",
      render:this.onAuthority.bind(this)
    },{
      name:"weixinAccountSet",
      title:"微信公众帐号配置",
      width:'10px',
      render: (function (row: any, name: string, cell: Column, cellEl: ElementRef) {
        let match:boolean = !this.helper.hasConfigValueMatch('CLOUD_ULO_BANK_NO',row['bankNo']);
        let _cellEl = cellEl.nativeElement;
        if(_cellEl.childElementCount>0){
          return;
        }
        let _cfgHtml = '配置', _queryHtml = '查询', _cfgBtnHtml, _queryBtnHtml;
        if (this.helper.btnRole('QUERYWECHATACT') &&  match) {//角色权限
          _queryBtnHtml = jQuery('<a href="#">' + _queryHtml + '</a>');
          _queryBtnHtml.bind('click', this.onSearchW.bind(this, row, name, cell));
        }else{
          _queryBtnHtml = jQuery('<span> / </span>');
        }
        if (this.helper.btnRole('EDITWECHATACT') &&  match) {//角色权限
          _cfgBtnHtml = jQuery('<a href="#">' + _cfgHtml + '</a>');
          _cfgBtnHtml.bind('click', this.onConfig.bind(this, row, name, cell));
        }else{
          _cfgBtnHtml = jQuery('<span> / </span>');
        }
        jQuery(_cellEl).html("").empty().append(_cfgBtnHtml).append('&nbsp;&nbsp;&nbsp;&nbsp;').append(_queryBtnHtml);
      }).bind(this)
    }
    ];
  /**
   * 表格按钮配置
   */
  public tableActionCfg: any = {
    actions:[
      {
      btnName:"edit",
      hide:true
    },{
      btnName:"del",
      hide:true
    },{
      btnDisplay:"详情",
        hide:(()=>{
          if(this.helper.btnRole('MCHDETAIL')){
            return false;
          }
          return true;
        }).bind(this),
      click:this.onDetailHendler.bind(this)
    }]
  };
public  UloCode:any;//优络编码
  constructor(public mchDB:mchListDBService ,
              public sidenavService:ISidenavSrvice,
              public helper:HelpersAbsService,
              public http:HttpService,
              public MchDB:MchDetailDBService,
              public mckBankOrganDb:LoadBankOrgDBService,
              public merchantOrganDb:LoadMerchantDBService,
              public mckAgentOrganDb:LoadAgentAndSPDBService,
              public snackBar:MdSnackBar,
              public pupop: MdPupop,
              public CenterDb:LoadPayCenterDBService
  ){
    this.mchBankDataSource = new InputSearchDatasource(mckBankOrganDb);
    this.mchAgentDataSource = new InputSearchDatasource(mckAgentOrganDb);
    this.mchCenterDataSource = new  InputSearchDatasource(CenterDb);
    this.merchantDataSource = new InputSearchDatasource(merchantOrganDb);
  }
  ngOnInit(){
    this.mchDB.params = this.form;
    this.examState = this.helper.getDictByKey('EXAMINE_STATUS');
    this.tradeAuth = this.helper.getDictByKey('MCH_WECHAT_TRADE_AUTH');
    this.UloCode = this.helper.getDictByKey('CLOUD_ULO_BANK_NO');
  }
  public onSearch(){
    this.form.doSearch(this.mchDB);
    this.mchlistTable.refresh();
  }

  /**
   * 详情事件
   * @param row
   * @param e
   */
  public onDetailHendler(row:any,e:MouseEvent):void{
    this.sidenavService.onNavigate('/admin/merchantdetail','详情',{id:row['id'],orgId : row['orgId'],merchantNo:row['merchantNo'],chanNo:row['chanNo']});
  }

  /**
   * 新增商户
   * @param e
   */
  public onAddmch(e:MouseEvent){
    this.sidenavService.onNavigate('/admin/merchantadd','新增商户');
  }

  /**
   * 批量认证
   */
public onAuthentication(e:MouseEvent){
      if(!this.form.chanNo){
        this.snackBar.alert("必须选择未审核状态且所属上级不能为空！");
        return false;
      }
    if(this.form.examState !== 0){
      this.snackBar.alert("必须选择未审核状态且所属上级不能为空！");
      return false;
    }
    let _confirm = this.pupop.confirm({
      message: "您确定对"+"【"+this.form._chanName+"】"+"下的商户进行批量认证操作？",
      confirmBtn: "是",
      cancelBtn: "否",
      width:"560px"
    });
    _confirm.afterClosed().subscribe(res => {
      if (res == Confirm.YES) {
        this.MchDB.batchAuthentication(this.form).subscribe(_res => {
          if (_res && _res['status'] == 200) {
            this.snackBar.alert("批量认证中，稍后请自行查询认证结果！");
            this.mchlistTable.refresh();
          } else {
            this.snackBar.alert(_res['message']);
          }
        })
      }
    })
  }
  /**
   *  编辑按钮事件
   */
  public onEdit():void{
    this.sidenavService.onNavigate('/admin/merchantadd','编辑商户');
  }

  //查询这个商户的支付宝的等级事件
  public aliPayMchLiveSearch(row:any){
    this.MchDB.aliPayMchLiveFind({id:row['id']}).subscribe((res)=>{
    if(res && res['status'] == 200){
      this.snackBar.alert("查询成功!");
      this.mchlistTable.refresh();
    }else {
      this.snackBar.alert(res['message']);
    }

  });
  return false;
}
//微信公众帐号配置
  public onConfig(row:any):void{

      if(row['examState'] != 1){
        this.snackBar.alert("商户审核审核未通过，无需配置!");
        return
      }
      this.MchDB.centerMirJspFind({merchantId:row['id']}).subscribe((res)=>{
        if(res && res['status'] == 200){
          let Win = this.pupop.openWin(MerchantWeixinAccountSetComponent,{title:'微信公众帐号配置',width:'610px',height:'350px',
            data: {
              id: row['id']
            }});
          Win.afterClosed().subscribe(result => {
            this.mchlistTable.refresh();
          });
        }else {
          this.snackBar.alert(res['message']);
        }
      });

  }
  public onSearchW(row):void{
  this.MchDB.accountConfigFind({mchId:row['id']}).subscribe((res)=>{
  if(res && res['status'] == 200){
    this.sidenavService.onNavigate('/admin/merchantweixincfgdetail','配置信息',{mchId:row['id']});
  }else {
    this.snackBar.alert(res['message']);
  }
});
  }
  public onAuthority(row:any,name:string,cell:any,cellEl:any){
    let _cellEl = jQuery(cellEl.nativeElement);
    if(_cellEl.childElementCount>0){
      return;
    }
    let _span = jQuery('<span></span>');
    let _i = jQuery('<i class="fa"></i>');
    if(row[name] == 1){
      _span.html('正常');
      _i.addClass('fa-pause');
      cell.bgColor = 'success-bg';
    }else if(row[name] == 0){
      _span.html('无权限');
      _i.addClass('fa-toggle-right');
      cell.bgColor = 'danger-bg';
    }else{
      cell.bgColor = '';
     return "/"
    }
    if(this.helper.btnRole('WECHATPAYAUTH')) {
      _i.bind('click',this.onChangeStatus.bind(this,row,name,cell,_span,_i));
    }
    _cellEl.html("").empty().append(_span);
    // let _data = this.helper.getDictByKey('CLOUD_ULO_BANK_NO');
    // if(row['bankNo'] !=_data) {
      if(!this.helper.hasConfigValueMatch('CLOUD_ULO_BANK_NO',row['bankNo'])){
      _cellEl.html("").empty().append(_span,_i);
    }
  }

  onChangeStatus(row:any,name:string,cell:any,span:any,i:any){
    if(row['examState'] != 1){
      this.snackBar.alert('当前商户还未审核，无法变更微信支付权限状态');
      return false;
    }
    let _confirm = this.pupop.confirm({
      message: "您确认要变更当前微信基础支付权限状态吗？",
      confirmBtn: "确认",
      cancelBtn: "取消"
    });

    _confirm.afterClosed().subscribe((res)=>{
      if(res == Confirm.YES){
        this.MchDB.mchwxConfrim({id:row['id']})
          .subscribe((_res)=>{
          if(_res && _res['status'] == 200){
            let tradeAuth = row[name];
            tradeAuth = row[name] == 1?'0':'1';
            // console.log(11);
            this.mchlistTable.refresh();
          }else {
            this.snackBar.alert(_res['message']);
          }

          });
      }
    })

  }

  /**
   * 机构控件显示函数
   */
  public mchBankdisplayFn(value: any):string{
    if(!this.helper.isEmpty(this.form._bankName)){
      return this.form._bankName
    }
    let name = value && value['name'];
    if(name){
      this.form._bankName = name;
    }
    return name;
  }
  public bankSelected(res){
    if(res){
      this.form["_bankName"] = res["value"]["name"];
    }
    this.mckAgentOrganDb.params = {};
    this.mckAgentOrganDb.refreshChange.next(true);
  }
  /**
   * 机构控件选项显示函数
   */
  public mchBankOptionDisplayFn(value:any):string{
    return value && value['name'] +'('+value['orgNo']+')';
  }

  public mchBankbeforClickFunc(value:any):boolean{
    let flag:boolean = true;
    if(this.helper.isEmpty(value)){
      this.snackBar.alert('请输入关键字！');
      flag = false;
    }
    this.mckBankOrganDb.params = {name:value};
    return flag;
  }
  /**
   * 商户名称控件显示函数
   */
  public merchantDisplayFn(value: any):string{
    return value && value['name'];
  }
  /**
   * 商户名称控件选项显示函数
   */
  public merchantOptionDisplayFn(value:any):string{
    return value && value['name'] +'('+value['merchantNo']+')';
  }

  public merchantBeforClickFunc(value:any):boolean{
    if(this.helper.isEmpty(value)){
      this.snackBar.alert('请先输入过滤值！');
      return false;
    }
    this.merchantOrganDb.params = {name:value};
  }

  /**
   * 所属上级控件显示函数
   */
  public mchAgentDisplayFn(value: any):string{
    if(!this.helper.isEmpty(this.form._chanName)){
      return this.form._chanName
    }
    let name = value && value['name'];
    if(name){
      this.form._chanName = name;
    }
    return name;
  }
  public chanSelected(res){
    if(res){
      this.form["_chanName"] = res["value"]["name"];
    }
  }
  /**
   * 所属上级控件选项显示函数
   */
  public mchAgentOptionDisplayFn(value:any):string{
    return value && value['name'] +'('+value['chanCode']+')';
  }

  public mchAgentBeforClickFunc(value:any):boolean{
    let flag:boolean = true;
    if(this.helper.isEmpty(value)){
      this.snackBar.alert('请输入关键字！');
      flag = false;
    }
    // this.mckAgentOrganDb.params = {name:value};
    if(this.form.bankNo){
      this.mckAgentOrganDb.params = {name:value,bankCode:this.form.bankNo};
    }else {
      this.mckAgentOrganDb.params = {name:value,bankCode:this.UloCode};
    }
    return flag;
  }
  /**
   * 通道控件显示函数
   */
  public mchCenterdisplayFn(value: any):string{
    if(!this.helper.isEmpty(this.form._centerName)){
      return this.form._centerName;
    }
    let name = value && value['name'];
    if(name){
      this.form._centerName = name;
    }
    return name;
  }

  public centerSelected(res) {
    if(res) {
      this.form["_centerName"] = res["value"]["name"];
    }
  }

  /**
   * 通道控件选项显示函数
   */
  public mchCenterOptionDisplayFn(value:any):string{
    return value && value['name'] ;
  }

  public mchCenterbeforClickFunc(value:any):boolean{
    let flag: boolean = true;
    if(this.helper.isEmpty(value)){
      this.snackBar.alert('请先输入过滤值！');
      flag = false;
    }
    this.CenterDb.params = {name:value};
    return flag;
  }

}
