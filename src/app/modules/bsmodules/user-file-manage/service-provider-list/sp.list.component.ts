import {Component, ElementRef, ViewChild, OnInit} from "@angular/core";
import {Column} from "../../../../common/components/table/table-extend-config";
import {ServiceProviderListDBService, SubMchDBService} from "./sp.db.service";
import {ISidenavSrvice} from "../../../../common/services/isidenav.service";
import {HelpersAbsService} from "../../../../common/services/helpers.abs.service";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/of';
import {ServiceProviderForm} from "../../../../common/search.form/user-file-manage/service.provider.form";
import {MdSnackBar, MdTab, MdPupop} from "@angular/material";
import {LoadAgentDBService, LoadBankOrgDBService} from "../../../../common/db-service/common.db.service";
import {InputSearchDatasource} from "../../../../common/services/impl/input.search.datasource";
import {MdTableExtend} from "../../../../common/components/table/table-extend";
import {UloSubContainer} from "../../../../common/components/sub-mch-channel/sub.container";

@Component({
  selector:"ulo-bs-service-provider-list",
  templateUrl:"sp.list.component.html",
  providers:[ServiceProviderListDBService,LoadBankOrgDBService,SubMchDBService,LoadAgentDBService]
})
export class ULOServiceProviderComponent implements OnInit{
  public examineStatus:Observable<any>;//用户状态
  public form:ServiceProviderForm = new ServiceProviderForm();
  /**
   * 所属机构配置
   */
  public spFilterFields:Array<string>= ["orgNo","name"];
  public spDataSource:InputSearchDatasource;
  /**
   * 上级配置
   */
  public agencyChanFilterFields: Array<string>= ["chanCode","name"];
  public agencyChanDataSource: InputSearchDatasource;
  @ViewChild('spTable') spTable:MdTableExtend;
  public UloCode: any;
  public serviceProviderColumns:Array<Column>=[{
    name:"name",
    title:"服务商名称"
  },{
    name:"chanCode",
    title:"服务商编号"
  },{
    name:"dealerInfoCount",
    title:"下属商户",
    render:this.subMerchant.bind(this)
  },{
    name:"bankName",
    title:"所属机构"
  },{
    name:"parentChanName",
    title:"所属上级",
    render:(function(row:any,name:string){
      if(row[name]){
        return row[name];
      }else{
        return "/";
      }
    }).bind(this)
  },{
    name:"isConfigChanRate",
    title:"渠道信息",
    render:(function(row:any,name:string){
      return row[name] == true ? '已配置' : '/';
    }).bind(this)
  },{
    name:"examState",
    title:"用户状态",//[{"id":0,"name":"待审核"},{"id":1,"name":"通过"},{"id":2,"name":"未通过"},{"id":3,"name":"冻结"},{"id":4,"name":"接口"}]
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
  }];

  public tableActionCfg: any = {
    actions:[{
      btnName:"del",
      hide:true
    },{
      btnName:'edit',
      hide:true
    },{
      btnDisplay:"详情",
      hide:(()=>{
        if(this.helper.btnRole('SPDETAIL')){
          return false;
        }
        return true;
      }).bind(this),
      click:this.onDetailHendler.bind(this)
    }]
  };

  constructor(public _spDBService:ServiceProviderListDBService,
              public sidenavService:ISidenavSrvice,
              public helper:HelpersAbsService,
              public snackBar:MdSnackBar,
              public loadBankOrgDBService:LoadBankOrgDBService,
              public pupop:MdPupop,
              public subMchDBService:SubMchDBService,
              protected agencyLoadAgentOrgDB: LoadAgentDBService,
  ){
    this.examineStatus = Observable.of(this.helper.getDictByKey('EXAMINE_STATUS'));
    this.spDataSource = new InputSearchDatasource(loadBankOrgDBService);//所属机构
    this.agencyChanDataSource = new InputSearchDatasource(agencyLoadAgentOrgDB);//上级代理
  }

  ngOnInit():void{
    this._spDBService.params = this.form;
    this.UloCode = this.helper.getDictByKey('CLOUD_ULO_BANK_NO');
  }

  onSearch(){
    this.form.doSearch(this._spDBService);
    this.spTable.refresh();
  }

  onDetailHendler(row: any, e: MouseEvent): void{
    this.sidenavService.onNavigate('/admin/spdetail','详情',{
      id: row['id'],
      orgId: row['orgId'],
      chanCode: row['chanCode'],
      name: row['name']
    });
  }

  onNewSp(){
    this.sidenavService.onNavigate('/admin/spedit','添加');
  }

  /**
   * 下属商户渲染方法
   * @param row
   * @param name
   * @param cell
   * @param cellEl
   */
  public subMerchant(row:any,name:string,cell:Column,cellEl:ElementRef){
    let _cellEl = cellEl.nativeElement;
    if(_cellEl.childElementCount > 0){
      return;
    }
    let a = jQuery('<a href="#">'+row[name]+'</a>');
    if(this.helper.btnRole('SPSUBMCH')){//角色权限
      a.bind('click',this.onSubMchHeandler.bind(this,row,name,cell));
    }
    jQuery(_cellEl).html('').empty().append(a);
  }

  /**
   * 查询下属商户
   * @returns {boolean}
   */
  public onSubMchHeandler(row:any){
    this.subMchDBService.pageSize = 5;
    this.subMchDBService.pageIndex = 0;
    this.subMchDBService.params = {chanCode:row['chanCode'],chanType:1};
    this.pupop.openWin(UloSubContainer,{
      title:'信息',
      width:'1000px',
      height:'440px',
      data:{
        selectedIndex:0,
        tabs:[{
          label:'下属商户',
          database:this.subMchDBService,
          count:row['dealerInfoCount'],
          columns:[{
            title:'商户名称',
            name:'name'
          },{
            title:'商户编号',
            name:'merchantNo'
          },{
            title:'商户简称',
            name:'shortName'
          },{
            title:'用户状态',
            name:'examState',
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
          }]
        }]
      }
    });
    return false;
  }

  /**
   * 所属机构查询前处理方法
   */
  public beforClickFunc(value:any){
    let flag:boolean = true;
    if(this.helper.isEmpty(value)){
      this.snackBar.alert('请输入关键字！');
      flag = false;
    }
    this.loadBankOrgDBService.params = {name:value};
    return flag;
  }

  /**
   * 机构控件显示函数
   */
  public displayFn(value: any):string{
    if(!this.helper.isEmpty(this.form._bankName)){
      return this.form._bankName;
    }
    let name = value && value['name'];
    if(name){
      this.form._bankName = name;
    }
    return name;
  }

  public bankSelected(res){
    this.agencyLoadAgentOrgDB.params = {};
    this.agencyLoadAgentOrgDB.refreshChange.next(true);
    if(res) {
      this.form._bankName = res['value']['name'];
    }
  }

  /**
   * 机构控件选项显示函数
   */
  public spOptionDisplayFn(value:any):string{
    return value && value['name'] +'('+value['orgNo']+')';
  }
  /**
   * 上级代理查询前处理方法
   */
  public agencyChanbeforClickFunc(value:any){
    let flag:boolean = true;
    if(this.helper.isEmpty(value)){
      this.snackBar.alert('请输入关键字！');
      flag = false;
    }
    if(this.form.bankCode){
      this.agencyLoadAgentOrgDB.params = {name: value, bankCode: this.form.bankCode};
    }else {
      this.agencyLoadAgentOrgDB.params = {name: value, bankCode: this.UloCode};
    }
    return flag;
  }

  /**
   * 上级代理控件显示函数
   */
  public agencyChandisplayFn(value: any):string{
    if(!this.helper.isEmpty(this.form._parentChanName)){
      return this.form._parentChanName;
    }
    let name = value && value['name'];
    if(name){
      this.form._parentChanName = name;
    }
    return name;
  }

  public agencySelected(res){
    if(res) {
      this.form._parentChanName = res['value']['name'];
    }
  }
  /**
   * 上级代理控件选项显示函数
   */
  public agencyChanOptionDisplayFn(value:any):string{
    return value && value['name'] +'('+value['chanCode']+')';
  }
}
