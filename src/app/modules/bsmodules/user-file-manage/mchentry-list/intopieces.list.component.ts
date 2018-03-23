import {Component, ViewChild, OnInit} from "@angular/core";
import {
  intoDBService, intoPiecesDBService, IntoPiecesListDBService,
  LoadBank1OrgDBService
} from "./intopieces.list.db.service";
import {ISidenavSrvice} from "../../../../common/services/isidenav.service";
import {Column} from "../../../../common/components/table/table-extend-config";
import {Confirm, MdDialog, MdPupop, MdSelectChange, MdSnackBar} from "@angular/material";
import {IntoPiecesListForm} from "../../../../common/search.form/user-file-manage/intopieces.list.form";
import {MdTableExtend} from "../../../../common/components/table/table-extend";
import {HelpersAbsService} from "../../../../common/services/helpers.abs.service";
import {
  CommonDBService, LoadAgentAndSPDBService,
  LoadAgentDBService, LoadBankOrgDBService,
  LoadMerchantDBService
} from "../../../../common/db-service/common.db.service";
import {InputSearchDatasource} from "../../../../common/services/impl/input.search.datasource";
import {IntopiecesAddWinComponent} from "./intopieces.add.win.component";
import {Observable} from "rxjs/Observable";


@Component({
  selector:'intopieces-list-component',
  templateUrl:'./intopieces.list.component.html',
  providers:[IntoPiecesListDBService,LoadMerchantDBService,LoadAgentAndSPDBService,LoadBank1OrgDBService,LoadBankOrgDBService,CommonDBService,intoPiecesDBService,intoDBService]
})
export class IntoPiecesListComponent implements  OnInit{
  /**
   * 查询表单
   * @type {IntoPiecesListForm}
   */
public form:IntoPiecesListForm =new IntoPiecesListForm();
  @ViewChild('IntoPiecesTable') IntoPiecesTable:MdTableExtend;
  /**
   * 所属机构配置
   */
  public mchBnakFilterFields:Array<string>= ["orgNo","name"];
  /**
   * 银行配置
   */
  public mchBnak1FilterFields:Array<string>= ["orgNo","name"];

  /**
   * 所属上级配置
   */
  public mchAgentFilterFields:Array<string>= ["chanCode","name"];
  /**
   * 商户信息配置
   */
  public merchantFilterFields:Array<string>= ["merchantNo","name"];

  public mchBankDataSource:InputSearchDatasource;//机构控件数据源
  public mchBank1DataSource:InputSearchDatasource;//银行控件数据源
  public mchAgentDataSource:InputSearchDatasource;//所属上级数据源
  public merchantDataSource:InputSearchDatasource;//获取商户信息数据源
  public  UloCode:any;//优络编码
  /**
   * 进件状态
   */
  public applyState:Array<any> = [];
  /**
   * 进件表格列
   */
  public IntoPiecesListColumns:Array<Column>=
    [
      {
        name:"name",
        title:"商户名称",
        width:'90px',
        otherOpts:{
          disabled:true
        }
      },{
      name:"merchantCode",  //根据接收参数
      title:"商户编号",
      otherOpts:{
        disabled:true
      }
    },{
      name:"chanName",
      title:"所属上级",
      width:'50px',
      otherOpts:{
        disabled:true
      }
    },{
      name:"orgName",
      title:"所属机构",
      width:'140px',
      otherOpts:{
        disabled:true
      }
    },
      {
      name:"ptCenterId",
      title:"通道类型",
      type:'select',
      width:'160px',
      otherOpts:{
        valueField:'id',
        displayField:'name',
        data:this.commonDBService.syncLoadCenter(),
        onChange:(function (row,change:MdSelectChange) {
          let result = change.source.selected;
          row['ptCenterId'] = result['value'];
          row['centerName'] = change.source.triggerValue;
        }).bind(this)
      },
      render:(function(row:any,name:string){
        if(row['centerName']){
          return row['centerName'];
        }else {
          return "/"
        }

      }).bind(this)
    },{
      name:"agencyName",
      title:"所属银行",
      width:'140px',
      type:'inputSearch',
      otherOpts:{
        disabled:((row:any,cell:any,e:any,)=>{

          if(this.helper.hasConfigValueMatch('CLOUD_ULO_BANK_NO',row['bankNo'])){
            return false;
          }
          return row['isEdit'] && !row['isNew'];
        }).bind(this),
        displayFn:(function(value:any){
          return value && value['name'];
        }).bind(this),
        optionDisplayFn:(function(value:any){
          return value && value['name'] +'('+value['orgNo']+')';
        }).bind(this),
        filterField:["orgNo","name"],
        valueField:'orgNo',
        onBeforClick:(function(value:any){
          let flag:boolean = true;
          if(this.helper.isEmpty(value)){
            this.snackBar.alert('请输入关键字！');
            flag = false;
          }
          // this.mckBankOrganDb.params = {name:value};
          this.mckBankOrganDb.params =_.extend(this.mckBankOrganDb.params,{name:value});
          return flag;
        }).bind(this),
        onSelected:(function(row:any,data: any){
          if(data &&　data.value){
            row['agencyName'] = data.value.name;
            row['agencyCode'] = data.value.orgNo;
            this.commonDBService.reload.next({type:'loadCenter',params:{bankNo:data.value.orgNo,transId:row["transId"]}});
          }
        }).bind(this),
        dataSource:new InputSearchDatasource(this.mckBankOrganDb)
      },
      render:(function(row:any){
        if( row['agencyName']){
          return row['agencyName'];
        }else {
          return "/"
        }
      }).bind(this)
    },{
      name:"providerNo",
      title:"渠道编号"
    },{
      name:"applyState",
      title:"进件状态",
      type:'select',
      otherOpts:{
        valueField:'id',
        displayField:'name',
        data:Observable.of(this.helper.getDictByKey('APPLY_STATE').filter((item=>{
          return item['id'] != 1;
        })))
      },
      render:(function(row:any,name:string,cell:any){
        let _status = row[name];
        switch(_status){
          case 0:
          case 3:
          case 4:
            cell.bgColor = 'danger-bg';
            break;
          case 2:
            cell.bgColor = 'success-bg';
            break;
          case 1:
            cell.bgColor = 'warning-bg';
            break;
        }
        return this.helper.dictTrans('APPLY_STATE',_status);
      }).bind(this)
    },{
      name:"ally",
      title:"商户识别码",
      width:'70px'
    }
    ];
  /**
   * 表格按钮配置
   */

  public tableActionCfg: any = {
    width:'135px',
    actions:[
      {
        btnName:'del',
        hide:(function(row:any){
          return true;
        }).bind(this)
      },
      {
        btnName:'edit',
        hide:((row:any)=>{
          if(this.helper.btnRole('INTOEDIT')  && !row['isEdit']){
            if(row['applyState'] == 1 || row['applyState'] == 4){
              return true;
            }
            if((row['applyState'] == 2 || row['applyState'] ==0 || row['applyState'] ==3)   && !row['isEdit']){
              return false;
            }
          }
          return true;
        }).bind(this)
      },
      {
        btnDisplay:"进件",
        hide:((row:any)=>{


          if(!this.helper.btnRole('INTOPIECES') ){
            return true;
          }
          if(row['applyState'] == 0){
            return false;
          }
          return  true;
        }),
        disabled:((row:any)=> {
          if (row['isEdit']) {
            return true
          }
        }),
        click:this.onInto.bind(this)
      },{
        btnDisplay:"重新进件",
        hide:((row:any)=>{

          if(!this.helper.btnRole('INTOPIECESRESET')){
            return true;
          }
          if(row['applyState'] == 3 ){
            return false;
          }
          return  true;
        }),
        disabled:((row:any)=> {
          if (row['isEdit']) {
            return true
          }
        }),
        click:this.onInto.bind(this)
    }
    ]
  };
  constructor(public intopiecesDB:IntoPiecesListDBService ,public sidenavService:ISidenavSrvice,
              public dialog: MdDialog,public helper:HelpersAbsService,
              public  intoPiecesDb: intoPiecesDBService,
              public mckBankOrganDb:LoadBankOrgDBService,
              public merchantOrganDb:LoadMerchantDBService,
              public mckAgentOrganDb:LoadAgentAndSPDBService,
              public snackBar:MdSnackBar,public commonDBService:CommonDBService,
              public pupop:MdPupop,
              public intoDB:intoDBService,
              public  bankDB:LoadBank1OrgDBService
  ){
  this.mchBank1DataSource = new InputSearchDatasource(bankDB);
    this.mchBankDataSource = new InputSearchDatasource(mckBankOrganDb);
    this.mchAgentDataSource = new InputSearchDatasource(mckAgentOrganDb);
  this.merchantDataSource = new InputSearchDatasource(merchantOrganDb);
}

    ngOnInit(){
      this.intopiecesDB.params = this.form;
      this.applyState = this.helper.getDictByKey('APPLY_STATE');
      this.UloCode = this.helper.getDictByKey('CLOUD_ULO_BANK_NO');
    }

  public onSearch(){
    if(this.helper.isEmpty(this.form.name) && this.helper.isEmpty(this.form.merchantNo) && this.helper.isEmpty(this.form._superiorName) && this.helper.isEmpty(this.form.superior)){
      this.snackBar.alert('商户名称、商户编号、所属上级至少填一项');
      return;
    }
    this.form.doSearch(this.intopiecesDB);
    this.IntoPiecesTable.refresh();
  }
  //编辑保存
  public onSaveIntoPieces(row:any){
    this.intoPiecesDb.loadEditInto({id:row['id'],
      agencyCode:row['agencyCode'],
      ptCenterId:row['ptCenterId'],
      providerNo:row['providerNo'],
      ally:row['ally'],
      applyState:row['applyState']}).subscribe(res=>{
      if(res && res['status'] == 200){
        this.snackBar.alert('保存进件信息成功！');
        this.IntoPiecesTable.refresh(this.form.page);
      }else{
        this.snackBar.alert(res['message']);
        this.IntoPiecesTable.refresh(this.form.page);
      }
    });
    this.mckBankOrganDb.params = {};
  }
//进件事件
    public onInto(row:any,e:MouseEvent):void{
      if(this.helper.isEmpty(row["agencyName"])){
        this.snackBar.alert('请输入所属银行');
        return;
      }
      if(row['ptCenterId'] == 0){
        this.snackBar.alert('请输入通道类型');
      }else {
        let _confirm = this.pupop.confirm({
          message:  row["providerNo"]? "是否确认商户" + "【"+row["name"]+"】" + "以渠道编号" + "【"+ row["providerNo"]+"】" + "进件？" : "当前商户"+"【"+row["name"]+"】"+"无渠道编号,您确认要进件吗？",
          confirmBtn: "确认",
          cancelBtn: "取消",
          width:"580px"
        });
        _confirm.afterClosed().subscribe((res) => {
          if (res == Confirm.YES) {
            this.intoPiecesDb.loadOnInto({
              providerNo: row['providerNo'],
              ptCenterId: row['ptCenterId'],
              id: row["id"],
              agencyCode: row['agencyCode'],
              merchantId: row["merchantId"]
            }).subscribe(_res => {
              if (_res && _res['status'] == 200) {
                this.snackBar.alert('进件成功');
                this.IntoPiecesTable.refresh(this.form.page);
              } else {
                this.snackBar.alert(_res["message"]);

              }

            })
          }
        })
      }
  }
  /**
   * 点击编辑信息按钮触发前事件
   * @param row
   */
  public onEditIntoPieces(row:any) {
    if (this.helper.isEmpty(row['agencyName'])) {
      this.IntoPiecesListColumns[5].otherOpts['disabled'] = this.disableFnF;

    } else {
      this.IntoPiecesListColumns[5].otherOpts['disabled'] = this.disableFn;
      this.mckBankOrganDb.params = {name:row['agencyCode']};
      this.mckBankOrganDb.refreshChange.next(true);
      this.commonDBService.reload.next({
        type: 'loadCenter',
        params: {bankNo: row['agencyCode'], transId: row['transId']}
      });
    }
  }
  disableFn(){
    return true;
  }
  disableFnF(){
    return false  ;
  }
  /**
   * 表格点击取消事件
   */
  onCancel(){
    this.mckBankOrganDb.params = {};
    this.IntoPiecesTable.refresh(this.form.page);
  }



  /**
   * 新建进件事件
   * @param e
   */
  public onAddIntopiece(e:MouseEvent){
   let addWin =this.pupop.openWin(IntopiecesAddWinComponent,{title:'新建进件单',width:'800px',height:'350px'});
    addWin.afterClosed().subscribe(result => {
      this.IntoPiecesTable.refresh(this.form.page);
    });
  }

/**
 * 机构控件显示函数
 */
public mchBank1displayFn(value: any):string{
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
public mchBank1OptionDisplayFn(value:any):string{
  return value && value['name'] +'('+value['orgNo']+')';
}

public mchBank1beforClickFunc(value:any):boolean{
  let flag:boolean = true;
  if(this.helper.isEmpty(value)){
    this.snackBar.alert('请输入关键字！');
    flag = false;
  }
  this.bankDB.params = {name:value};
  return flag;
}


/**
 * 所属上级控件显示函数
 */
public mchAgentDisplayFn(value: any):string{
  if(!this.helper.isEmpty(this.form._superiorName)){
    return this.form._superiorName
  }
  let name = value && value['name'];
  if(name){
    this.form._superiorName = name;
  }
  return name;
}
  public chanSelected(res){
    if(res){
      this.form["_superiorName"] = res["value"]["name"];
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
  if(this.form.bankNo){
    this.mckAgentOrganDb.params = {name:value,bankCode:this.form.bankNo};
  }else {
    this.mckAgentOrganDb.params = {name:value,bankCode:this.UloCode};
  }
  return flag;
}
  public onSelectPtBankno(value:any) {
  }

  /**
   * 批量进件
   */
  public onBatchIntopiece() {
    if(this.helper.isEmpty(this.form._bankName) || this.helper.isEmpty(this.form.bankNo)){
      this.snackBar.alert('请选择所属机构');
      return;
    }
    if(!this.helper.hasConfigValueMatch('CLOUD_ULO_BANK_NO',this.form.bankNo)){
      this.snackBar.alert('所属机构不能是银行');
      return;
    }
    if(this.helper.isEmpty(this.form._superiorName) || this.helper.isEmpty(this.form.superior)){
      this.snackBar.alert('请选择所属上级');
      return;
    }
    // 进件状态(筛选条件)0:待进件、1:处理中、2:进件成功、3:进件失败、 4:被风控
    // if(this.helper.isEmpty(this.form.applyState)){
    if(this.form.applyState == null  || this.form.applyState == undefined){
      this.snackBar.alert('请选择进件状态');
      return;
    }
    if(!(this.form.applyState === 0 || this.form.applyState === 3)){
      this.snackBar.alert('只对进件状态为“待进件”和“进件失败”的信息进行操作!');
      return;
    }
    this.intoPiecesDb.BatchInto(this.form).subscribe(res => {
      if(res && res['status'] == 200){
        this.snackBar.alert('批量进件中，稍后请在列表中自行查询进件结果！');
        this.IntoPiecesTable.refresh(this.form.page);
      }else{
        this.snackBar.alert(res['message']);
      }
    })
  }
}


