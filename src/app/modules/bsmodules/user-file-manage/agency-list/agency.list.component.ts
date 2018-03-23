import {Component, ElementRef, Input, OnInit, ViewChild} from "@angular/core";
import {Column} from "../../../../common/components/table/table-extend-config";
import {ISidenavSrvice} from "../../../../common/services/isidenav.service";
import {AgencyListService, ChildAgentService, ChildMchService} from "./agency.list.db.service";
import {AgencyListSearchForm} from "../../../../common/search.form/user-file-manage/agency.list.search.form";
import {MdTableExtend} from "../../../../common/components/table/table-extend";
import {HelpersAbsService} from "../../../../common/services/helpers.abs.service";
import {MdDialog, MdPupop, MdSnackBar} from "@angular/material";
import {LoadAgentDBService, LoadBankOrgDBService} from "../../../../common/db-service/common.db.service";
import {InputSearchDatasource} from "../../../../common/services/impl/input.search.datasource";
import {UloSubContainer} from "app/common/components/sub-mch-channel/sub.container";
@Component({
  selector: "agency-list",
  templateUrl: "agency.list.component.html",
  providers: [AgencyListService, LoadBankOrgDBService, ChildMchService, ChildAgentService, LoadAgentDBService]
})
export class AgencyListComponent implements OnInit{
  /**
   * 用户状态
   */
  public userStates: Array<any> = [];
  /**
   * 代理类型
   */
  public agencyTypes: Array<any> = [];
  /**
   * 所属机构配置
   */
  public agencyBankFilterFields: Array<string>= ["orgNo","name"];
  public agencyBankDataSource: InputSearchDatasource;
  /**
   * 上级代理配置
   */
  public agencyChanFilterFields: Array<string>= ["chanCode","name"];
  public agencyChanDataSource: InputSearchDatasource;
  /**
   * 查询表单
   * @type {AgencyListSearchForm}
   */
  public form: AgencyListSearchForm = new AgencyListSearchForm();
  @ViewChild('agencyListTable') agencyListTable: MdTableExtend;
  public uloCode:any;

  public agencyListColumns: Array<Column>=[{
    name:"name",
    title:"代理商名称"
  },{
    name:"chanCode",
    title:"代理商编号"
  },{
    name:"appCode",
    title:"代理类型",
    render:(function(row:any,name:string,cell:any){
      return this.helper.dictTrans('PROXY_TYPE',row[name]);
    }).bind(this)
  },{
    name:"agentRank",
    title:"级别"
  },{
    name:"parentAgentName",
    title:"上级代理",
    render:(function(row:any,name:string){
      if(row[name]){
        return row[name];
      }else{
        return "/";
      }
    }).bind(this)
  },{
    name:"childAgentCount",
    title:"下级代理",
    render:this.onChildAgent.bind(this)
  },{
    name:"mchCount",
    title:"下属商户",
    render:this.onChildMch.bind(this)
  },{
    name:"bankName",
    title:"所属机构"
  },{
    name:"examState",
    title:"用户状态",
    // render:this.onExamState.bind(this),
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
    hide:(()=>{
      if(this.helper.btnRole('AGENTDETAIL')){
        return false;
      }
      return true;
    }).bind(this),
    width:"80px",
    actions:[{
      btnName:"del",
      hide:true
    },{
      btnName:"edit",
      hide:true
    },{
      btnDisplay:"详情",
      click:this.onDetailHendler.bind(this)
    }]
  };

  constructor(
    public agencyListDB: AgencyListService,
    public sidenavService: ISidenavSrvice,
    public helper: HelpersAbsService,
    public dialog: MdDialog,
    protected agencyLoadBankOrgDB: LoadBankOrgDBService,
    public snackBar: MdSnackBar,
    public childMchService: ChildMchService,
    public pupop: MdPupop,
    public childAgentService: ChildAgentService,
    protected agencyLoadAgentOrgDB: LoadAgentDBService,
  ){
    this.agencyBankDataSource = new InputSearchDatasource(agencyLoadBankOrgDB);//所属机构
    this.agencyChanDataSource = new InputSearchDatasource(agencyLoadAgentOrgDB);//上级代理
  }

  ngOnInit() {
    this.userStates = this.helper.getDictByKey('EXAMINE_STATUS');//用户状态
    this.agencyTypes = this.helper.getDictByKey('PROXY_TYPE');//代理类型
    this.uloCode = this.helper.getDictByKey('CLOUD_ULO_BANK_NO');
    this.agencyListDB.params = this.form;
  }
  /**
   * 所属机构查询前处理方法
   */
  public agencyBankbeforClickFunc(value:any){
    let flag:boolean = true;
    if(this.helper.isEmpty(value)){
      this.snackBar.alert('请输入关键字！');
      flag = false;
    }
    this.agencyLoadBankOrgDB.params = {name:value};
    return flag;
  }

  /**
   * 所属机构机构控件显示函数
   */
  public agencyBankdisplayFn(value: any):string{
    // return value && value['name'];
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
    if(res) {
      this.form._bankName = res['value']['name'];
    }
    //在选择所属机构时，把所属上级控件中的值清空
    this.agencyLoadAgentOrgDB.params = {};
    this.agencyLoadAgentOrgDB.refreshChange.next(true);
  }
  /**
   * 所属机构控件选项显示函数
   */
  public agencyBankOptionDisplayFn(value:any):string{
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
    // this.agencyLoadAgentOrgDB.params = {name:value};
    if(this.form.bankCode){
      this.agencyLoadAgentOrgDB.params = {name:value,bankCode:this.form.bankCode};
    }else {
      this.agencyLoadAgentOrgDB.params = {name:value,bankCode:this.uloCode};
    }
    return flag;
  }

  /**
   * 上级代理控件显示函数
   */
  public agencyChandisplayFn(value: any):string{
    // return value && value['name'];
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
  /**
   *详情
   */
  onDetailHendler(row:any,e:MouseEvent):void{
    this.sidenavService.onNavigate('/admin/agencydetail','查看代理商详情',{id:row['id'],chanCode:row['chanCode'],name:row['name'],orgId: row['orgId']});
  }
  /**
   *新增
   */
  onAddAgency() {
    this.sidenavService.onNavigate('/admin/agencyedit','新增代理商');
  }
  /**
   * 查询
   * @author lyl
   */
  onSearch(value: any) {
    this.form.doSearch(this.agencyListDB);
    this.agencyListTable.refresh();
  }

  /**
   * 下级代理
   * @author lyl
   */
  public onChildAgent(row:any,name:string,cell:Column,cellEl:ElementRef){
    let _cellEl = cellEl.nativeElement;
    if(_cellEl.childElementCount > 0){
      return;
    }
    let a = jQuery('<a href="#">'+row[name]+'</a>');
    if(this.helper.btnRole('AGENTSUBCHANNEL')){
      a.bind('click',this.onChildAgentHeandler.bind(this,row,name,cell));
    }
    jQuery(_cellEl).html('').empty().append(a);
  }

  /**
   * 查询下级代理
   * @returns {boolean}
   */
  public onChildAgentHeandler(row:any){
    this.childAgentService.pageSize = 5;
    this.childAgentService.pageIndex = 0;
    this.childAgentService.params = {chanCode:row['chanCode'],chanType:0};
    this.childMchService.pageSize = 5;
    this.childMchService.pageIndex = 0;
    this.childMchService.params = {chanCode:row['chanCode'],chanType:0};
    this.pupop.openWin(UloSubContainer,{
      title:'信息',
      width:'1000px',
      height:'440px',
      data:{
        selectedIndex:0,
        tabs:[{
          label:'下级代理',
          database:this.childAgentService,
          count:row['childAgentCount'],
          columns:[{
            name:"name",
            title:"代理商名称"
          },{
            name:"chanCode",
            title:"代理商编号"
          },{
            name:"appCode",
            title:"代理类型",
            render:(function(row:any,name:string,cell:any){
              return this.helper.dictTrans('PROXY_TYPE',row[name]);
            }).bind(this)
          },{
            name:"agentRank",
            title:"级别"
          },{
            name:"childAgentCount",
            title:"下级代理",
          },{
            name:"mchCount",
            title:"下属商户",
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
        },{
          label:'下属商户',
          database:this.childMchService,
          count:row['mchCount'],
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
      },
    });
    return false;
  }

  /**
   * 下属商户
   * @author lyl
   */
  public onChildMch(row:any,name:string,cell:Column,cellEl:ElementRef){
    let _cellEl = cellEl.nativeElement;
    if(_cellEl.childElementCount > 0){
      return;
    }
    let a = jQuery('<a href="#">'+row[name]+'</a>');
    if(this.helper.btnRole('AGENTSUBMCH')){
      a.bind('click',this.onChildMchHeandler.bind(this,row,name,cell));
    }
    jQuery(_cellEl).html('').empty().append(a);
  }
  /**
   * 查询下属商户
   * @returns {boolean}
   */
  public onChildMchHeandler(row:any){
    this.childAgentService.pageSize = 5;
    this.childAgentService.pageIndex = 0;
    this.childAgentService.params = {chanCode:row['chanCode'],chanType:0};
    this.childMchService.pageSize = 5;
    this.childMchService.pageIndex = 0;
    this.childMchService.params = {chanCode:row['chanCode'],chanType:0};
    this.pupop.openWin(UloSubContainer,{
      title:'信息',
      width:'1000px',
      height:'440px',
      data:{
        selectedIndex:1,
        tabs:[{
          label:'下级代理',
          database:this.childAgentService,
          count:row['childAgentCount'],
          columns:[{
            name:"name",
            title:"代理商名称"
          },{
            name:"chanCode",
            title:"代理商编号"
          },{
            name:"appCode",
            title:"代理类型",
            render:(function(row:any,name:string,cell:any){
              return this.helper.dictTrans('PROXY_TYPE',row[name]);
            }).bind(this)
          },{
            name:"agentRank",
            title:"级别"
          },{
            name:"childAgentCount",
            title:"下级代理",
          },{
            name:"mchCount",
            title:"下属商户",
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
        },{
          label:'下属商户',
          database:this.childMchService,
          count:row['mchCount'],
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
      },
    });
    return false;
  }
}
