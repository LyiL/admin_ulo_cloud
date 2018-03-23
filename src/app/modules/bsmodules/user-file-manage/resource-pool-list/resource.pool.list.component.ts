import {Component, ViewChild, OnInit, AfterContentChecked} from "@angular/core";
import {ISidenavSrvice} from "../../../../common/services/isidenav.service";
import {Column} from "../../../../common/components/table/table-extend-config";
import {Confirm, MdDialog, MdPupop, MdSelectChange, MdSnackBar} from "@angular/material";
import {MdTableExtend} from "../../../../common/components/table/table-extend";
import {HelpersAbsService} from "../../../../common/services/helpers.abs.service";
import {InputSearchDatasource} from "../../../../common/services/impl/input.search.datasource";
import {Observable} from "rxjs/Observable";
import {ResourcePoolListDBService, ResourcePoolOtherDBService} from "./resource.pool.list.db.service";
import {ResourcePoolListForm} from "../../../../common/search.form/user-file-manage/resource.pool.list.form";
import {CommonDBService} from "../../../../common/db-service/common.db.service";
import {ResourcePoolNumberForm} from "../../../../common/search.form/user-file-manage/resource.pool.number.form";
import {ResourcePoolAccurateDbService} from "./resource.pool.accurate.db.service";


@Component({
  selector:'resource-pool-list-component',
  templateUrl:'./resource.pool.list.component.html',
  providers:[ResourcePoolListDBService,CommonDBService,ResourcePoolOtherDBService,ResourcePoolAccurateDbService]
})
export class ResourcePoolListComponent implements  OnInit,AfterContentChecked{
  public form:ResourcePoolListForm =new ResourcePoolListForm();
  public formNumber:ResourcePoolNumberForm=new ResourcePoolNumberForm();
  @ViewChild('resPoolListTable') resPoolListTable:MdTableExtend;
  @ViewChild('accuratePoolListTable') accuratePoolListTable:MdTableExtend;
  public useStates:Array<any> = [];//用户状态
  public payTypes:Array<string>= []; //支付类型
  public payStates:Array<string>= []; // 支付权限
  public uloCode:any;
  public resPoolFlag:boolean;
  public count:any ={};
  public resPoolListColumns:Array<Column>=
    [{
      name:"mchNo",
      title:"商户编号",
      },{
      name:"chanNo",
      title:"服务商编号",
    },{
      name:"bankMchno",
      title:"银行商户号",
    },{
      name:"partner",
      title:"微信受理机构号",
    },{
      name:"subPartner",
      title:"微信交易识别码"
    },{
      name:"chanPartner",
      title:"微信渠道编号",
    },{
      name:"tradeType",
      title:"支付类型",
      render:(function(row:any,name:string){
        if(this.helper.isEmpty(row[name])){
          return '/';
        }else{
         let tradetype = this.payTypes && this.payTypes.find((item) =>{
           return item['transId'] == row[name];
         });
         return tradetype ? tradetype['transType'] : '/';
        }
      }).bind(this)
    },{
      name:"payState",
      title:"支付权限",
      render:(function(row:any,name:string){
        if(this.helper.isEmpty(row[name])){
          return '/';
        }else{
          return this.helper.dictTrans('RES_POOL_STATUS',row[name]);
        }
      }).bind(this)
    },{
      name:"useState",
      title:"启用状态",
      render:this.onUseState.bind(this),
    },{
      name:"success",
      title:"成功笔数（笔）",
    },{
      name:"totalcount",
      title:"总交易笔数（笔）",
    },{
      name:"suRate",
      title:"成功率（%）",
    },{
      name:"amount",
      title:"交易金额（元）",
      render:(function(row:any,name:string){
        let _amount = row[name];
        if (this.helper.isEmpty(_amount)) {
          _amount = '/';
        } else {
          _amount = this.helper.shuntElement(_amount);
        }
        return _amount;
      }).bind(this)
    }];
  /**
   * 表格按钮配置
   */
  public tableActionCfg: any = {
    width:"80px",
    actions:[{
      btnName:"detail",
      btnDisplay:"详情",
      hide:(()=>{
        if(this.helper.btnRole('IDENTIFIERINFO')){
          return false;
        }
        return true;
      }).bind(this),
      click:this.onDetail.bind(this)
    },{
      btnName:"del",
      hide:true,
    },{
      btnName:"edit",
      hide:(()=>{
        if(this.helper.btnRole('IDENTIFIEREDIT')){
          return false;
        }
        return true;
      }).bind(this),
      click:this.onEdit.bind(this)
    }]
  };


  /**
   * 表格按钮配置
   */
  public accurateTableActionCfg: any = {
    width:"80px",
    actions:[{
      btnName:"detail",
      btnDisplay:"详情",
      hide:(()=>{
        if(this.helper.btnRole('IDENTIFIERINFO')){
          return false;
        }
        return true;
      }).bind(this),
      click:this.onDetail.bind(this)
    },{
      btnName:"del",
      hide:true,
    },{
      btnName:"edit",
      hide:true,
    }]
  };



  /**
   *时间配置
   */
  public dateOpts:any = {
    format:'yyyy-MM-dd',
    lastMinDate:this.form.startDate
  };
  constructor(public resPoolListDB:ResourcePoolListDBService ,
              public accuratePoolDB:ResourcePoolAccurateDbService,
              public sidenavService:ISidenavSrvice,
              public dialog: MdDialog,
              public helper:HelpersAbsService,
              public snackBar:MdSnackBar,
              public pupop:MdPupop,
              protected CommonDB: CommonDBService,
              protected resPoolOtherDB:ResourcePoolOtherDBService
  ){
    this.uloCode = this.helper.getDictByKey('CLOUD_ULO_BANK_NO');
    this.CommonDB.loadTransApi({bankNo:this.uloCode}).subscribe(res =>{
      this.payTypes = res;
    });//支付类型
    this.useStates = this.helper.getDictByKey('RES_POOL_STATUS');//启用状态
    this.payStates = this.helper.getDictByKey('RES_POOL_STATUS'); // 支付权限
  }

  ngOnInit(){
    let params = this.sidenavService.getPageParams();
    //从新增页面回到列表需默认查询，其他情况不去默认查询
    if(params && params['resPoolAdd']){
      this.resPoolFlag = true;
      let accurateParams = {    //数据置空
        mchNo:null,
        bankMchno:null,
        subPartner:null};

      // let _formNumber=_.extend(this.formNumber,accurateParams);
      // this.formNumber=_formNumber;
      // console.log('_formNumber',_formNumber);
      let _form = _.extend(this.form,accurateParams);

      this.resPoolListDB.params =_form;
      // this.resPoolListDB.params = this.form;
      //重置路由参数
      this.sidenavService.resetPageParams({});
    }else{
      this.resPoolFlag = false;
    }
  }
  ngAfterContentChecked(){
    if(this.form.startDate){
      this.dateOpts = {
        format:'yyyy-MM-dd',
        lastMinDate:this.form.startDate
      };
    }
  }
  /**
   *使用状态列
   * 0禁用,1启用
   * @author lyl
   * @date 2017-08-15
   */
  onChangeStatus(row: any, e: MouseEvent): void {
    let _confirm = this.pupop.confirm({
      message: "您确认要变更当前状态吗？",
      confirmBtn: "确认",
      cancelBtn: "取消"
    })
    _confirm.afterClosed().subscribe(res => {
      if (res == Confirm.YES) {
        let _uState = row['useState'];
        if(_uState == 1){
          _uState = 0;
        }else if(_uState == 0) {
          _uState = 1
        }
        this.resPoolOtherDB.changeResPoolUseState({id: row['id'], useState: _uState}).subscribe((_res) => {
          if (_res && _res['status'] == 200) {
            this.snackBar.alert('操作成功!');
            this.resPoolListTable.refresh(this.form.page);
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
      _span.html('是');
      _i.addClass('fa-pause');
      cell.bgColor = 'success-bg';
    }else if(row[name] == 0){
      _span.html('否');
      _i.addClass('fa-toggle-right');
      cell.bgColor = 'danger-bg';
    }else{
      cell.bgColor = 'none';
      return '/';
    }
    if(this.helper.btnRole('CLOUDDEALERSUBMCHPOOLCHANGEUSESTATE')){
      _i.bind('click',this.onChangeStatus.bind(this,row,name,cell,_span,_i));
    }
    jQuery(_cellEl).html('').empty().append(_span ,_i);
  }
  /**
   *新增
   */
  onNew(row:any,e:MouseEvent):void{
    this.sidenavService.onNavigate('/admin/resourcepooladd','新增识别码管理');
  }

  /**
   *详情
   */
  public onDetail(row: any) {
    this.sidenavService.onNavigate('/admin/resourcepooldetail', '识别码管理详情', {id: row['id']});
  }
  /**
   *编辑
   */
  public onEdit(row: any) {
    this.sidenavService.onNavigate('/admin/resourcepooladd', '识别码管理编辑', {id: row['id']});
  }

  /**
   * 批量变更支付权限
   */
  public onChangePayAuth(){
    if(this.helper.isEmpty(this.form.endDate)){
      this.snackBar.alert("请选择结束日期！");
      return false;
    }
    if(this.helper.isEmpty(this.form.payState)){
      this.snackBar.alert("请选择支付权限！");
      return false;
    }
    let _confirm = this.pupop.confirm({
      message: "您确认进行批量变更支付权限操作？",
      confirmBtn: "是",
      cancelBtn: "否",
    });
    _confirm.afterClosed().subscribe(res => {
      if (res == Confirm.YES) {
        this.resPoolOtherDB.changePayAuthority(this.form).subscribe(_res => {
          if (_res && _res['status'] == 200) {
            this.snackBar.alert("批量变更支付权限中，稍后请自行查询结果！");
            this.resPoolListTable.refresh();
          } else {
            this.snackBar.alert(_res['message']);
          }
        })
      }
    })
  }

  /**
   * 导出报表按钮
   * @author lyl
   */
  onExport() {
    if(this.helper.isEmpty(this.form.endDate)){
      this.snackBar.alert("请选择结束日期！");
      return false;
    }
    let params = _.clone(this.form);
    this.resPoolOtherDB.loadExport(params).subscribe(res => {
      if(res instanceof FileReader){
        res.onloadend=(function(){
          let _res = JSON.parse(res.result);
          this.snackBar.alert(_res['message']);
        }).bind(this);
      }else{
        this.downloadFile(res.fileName, res.blob); //导出报表
      }
    });
  }
  downloadFile(fileName, content){
    var aLink = document.createElement('a');
    var blob = content;
    aLink.download = fileName;
    aLink.href = URL.createObjectURL(blob);
    aLink.click()
  }
  /**
   *查询
   */
  public onSearch(){
    if(this.helper.isEmpty(this.form.endDate)) {
      this.snackBar.alert('请选择结束日期!') ;
    }else {
      this.form.doSearch(this.resPoolListDB);
      this.resPoolListTable.refresh();
    }
  }

  /**
   * 精确查询
   * @returns {boolean}
   */
  public onSearchAccurate(){
    if(!this.formNumber.mchNo  && !this.formNumber.bankMchno  && !this.formNumber.subPartner ){
      this.snackBar.alert("至少输入一个查询条件");
      return false;
    }else {
      this.formNumber.doSearch(this.accuratePoolDB);
      this.accuratePoolListTable.refresh();
    }
  }

}


