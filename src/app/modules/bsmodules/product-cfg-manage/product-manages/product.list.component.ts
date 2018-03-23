import {Component, OnInit, ViewChild} from "@angular/core";
import {Column} from "../../../../common/components/table/table-extend-config";
import {ProductDbService, ProdFormDBLoad} from "./product.db.service";
import {ISidenavSrvice} from "../../../../common/services/isidenav.service";
import {HelpersAbsService} from "../../../../common/services/helpers.abs.service";
import {ProductListForm} from "../../../../common/search.form/product-config-manage/product.list.form";
import {MdTableExtend} from "../../../../common/components/table/table-extend";
import {InputSearchDatasource} from "../../../../common/services/impl/input.search.datasource";
import {LoadBankOrgDBService} from "../../../../common/db-service/common.db.service";
import {MdSnackBar, MdPupop, Confirm} from "@angular/material";
@Component({
  selector:'ulo-product-list',
  templateUrl:'./product.list.component.html',
  providers:[ProductDbService,LoadBankOrgDBService,ProdFormDBLoad]
})
export class ProductListComponent implements OnInit{
  /**
   * 产品类型
   */
  public prodTypes:Array<any> = [];
  /**
   * 产品状态
   */
  public prodStates:Array<any> = [];
  /**
   * 适用商家
   */
  public applyTypes:Array<any> = [];
  /**
   * 查询表单
   * @type {ProductListForm}
   */
  public form:ProductListForm = new ProductListForm();
  @ViewChild('prodTable') prodTable:MdTableExtend;

  public prodDataSource:InputSearchDatasource;//机构控件数据源
  /**
   * 所属机构配置
   */
  public prodFilterFields:Array<string>= ["orgNo","name"];

  /**
   * 产品表格列
   */
  public prodColumns:Array<Column> = [{
    name:"combNo",
    title:"产品代码"
  },{
    name:"combName",
    title:"产品名称"
  },{
    name:"bankName",
    title:"所属机构"
  },{
    name:"productType",
    title:"产品类型",
    render:(function(row:any,name:string){
      return this.helper.dictTrans('PRODUCT_TYPE',row[name]);
    }).bind(this)
  },{
    name:"applyType",
    title:"适用商家",
    render:(function(row:any,name:string){
      let applyTypes = row[name] && row[name].split(',');
      let applyTypeNames = [];
      applyTypes.forEach((res)=>{
        applyTypeNames.push(this.helper.dictTrans('PRODUCT_USER_TYPE',res));
      });
      return applyTypeNames.join(',');
    }).bind(this)
  },{
    name:"defaultUsed",
    title:"是否默认开通",
    hide:true
  },{
    name:"productState",
    title:"产品状态",
    render:(function(row:any,name:string,cell:any){
      let _status = row[name];//[{"id":"0","name":"待审核"},{"id":"1","name":"生效"},{"id":"2","name":"未通过"},{"id":"3","name":"作废"}]
      switch(_status){
        case 0:
          cell.bgColor = 'warning-bg';
          break;
        case 1:
          cell.bgColor = 'success-bg';
          break;
        case 2:
          cell.bgColor= 'danger-bg'
          break;
        case 3:
          cell.bgColor = 'disables-bg';
          break;
      }
      return this.helper.dictTrans('PRODUCT_EXAMINE_STATUS',_status);
    }).bind(this)
  }];

  /**
   * 表格按钮配置
   */
  public prodActionCfg = {
    actions:[{
      btnName:'del',
      hide:true
    },{
      btnName:'edit',
      hide:true
    },{
      btnDisplay:'详情',
      hide:(()=>{
        if(this.helper.btnRole('PRODDETAIL')){
          return false;
        }
        return true;
      }).bind(this),
      click:this.onDetailProdInfo.bind(this)
    },{
      btnDisplay:'作废',
      hide:(function(row:any){
        if(!this.helper.btnRole('PRODDEL')){
          return true;
        }
        if(row['productState'] == 1){
          return false;
        }
        return true;
      }).bind(this),
      click:this.onDelProd.bind(this)
    }]
  };

  constructor(public prodDB:ProductDbService,public sidenavService:ISidenavSrvice,public helper:HelpersAbsService,public prodOrganDb:LoadBankOrgDBService,
              public snackBar:MdSnackBar,public pupop:MdPupop,public prodFormDB:ProdFormDBLoad){
    this.prodDataSource = new InputSearchDatasource(prodOrganDb);
  }

  ngOnInit(){
    this.prodDB.params = this.form;
    this.prodTypes = this.helper.getDictByKey('PRODUCT_TYPE');
    this.prodStates = this.helper.getDictByKey('PRODUCT_EXAMINE_STATUS');
    this.applyTypes = this.helper.getDictByKey('PRODUCT_USER_TYPE');
  }

  public onSearch(){
    this.form.doSearch(this.prodDB);
    this.prodTable.refresh();
  }

  /**
   * 详情事件
   * @param row
   * @param e
   */
  public onDetailProdInfo(row:any,e:Event){
    this.sidenavService.onNavigate('/admin/productdetail','详情',{id:row['id']});
  }

  /**
   * 作废按钮事件
   * @param row
   * @param e
   */
  public onDelProd(row:any,e:Event){
    let _confirm = this.pupop.confirm({message:'您确定要作废【'+row['combName']+'('+row['combNo']+')】这个产品吗'});
    _confirm.afterClosed().subscribe(res=>{
      if(res == Confirm.YES){
        this.prodFormDB.toVoid(row['id']).subscribe(res=>{
          if(res && res['status'] == 200){
            this.snackBar.alert('【'+row['combName']+'('+row['combNo']+')】产品已经作废。');
          }else{
            this.snackBar.alert(res['message']);
          }
        });
      }
    });
  }

  public onNewProd(){
    this.sidenavService.onNavigate('/admin/productform','新增产品');
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
    if(res) {
      this.form._bankName = res['value']['name'];
    }
  }
  /**
   * 机构控件选项显示函数
   */
  public prodOptionDisplayFn(value:any):string{
    return value && value['name'] +'('+value['orgNo']+')';
  }

  public beforClickFunc(value:any):boolean{
    let flag:boolean = true;
    if(this.helper.isEmpty(value)){
      this.snackBar.alert('请先输入过滤值！');
      flag = false;
    }
    this.prodOrganDb.params = {name:value};
    return flag;
  }
}
