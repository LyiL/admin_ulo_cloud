import {Component, OnInit, ViewChild} from "@angular/core";
import {OpenProductForm} from "../../../../common/search.form/product-config-manage/open.product.form";
import {HelpersAbsService} from "../../../../common/services/helpers.abs.service";
import {Column} from "../../../../common/components/table/table-extend-config";
import {OpenProductDbTableService} from "./open.product.db.service";
import {MdPupop} from "@angular/material";
import {OpenProductDetailComponent} from "./open.product.detail.component";
import {MdTableExtend} from "../../../../common/components/table/table-extend";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/of';
@Component({
  selector:'ulo-open-product',
  templateUrl:'./open.product.list.component.html',
  providers:[OpenProductDbTableService]
})
export class OpenProductListComponent implements OnInit{
  public form:OpenProductForm = new OpenProductForm();
  public userTypes:Observable<any>;//用户类型
  public states:Observable<any>;//开通状态

  @ViewChild('prodOpenTable') prodOpenTable:MdTableExtend;

  public openProdColumns:Array<Column> = [{
    name:'userName',
    title:'用户名称'
  },{
    name:'userNo',
    title:'用户编号'
  },{
    name:'userType',
    title:'用户类型',
    render:(function(row,name){
      return this.helper.dictTrans('PRODUCT_USER_TYPE',row[name]);
    }).bind(this)
  },{
    name:'combName',
    title:'产品名称'
  },{
    name:'combNo',
    title:'产品代码'
  },{
    name:'state',
    title:'开通状态',//[{"id":0,"name":"待审核"},{"id":1,"name":"已开通"},{"id":2,"name":"已关闭"},{"id":3,"name":"未开通"}]
    render:(function(row:any,name:string,cell:any){
      let _status = row[name];
      switch(_status){
        case 0:
          cell.bgColor = "warning-bg";
          break;
        case 2:
        case 4:
          cell.bgColor = 'danger-bg';
          break;
        case 1:
          cell.bgColor = 'success-bg';
          break;
      }
      return this.helper.dictTrans('PRODUCT_OPEN_STATE',_status);
    }).bind(this)
  }];

  public openProdActionCfg:any={
    actions:[{
      btnName:'del',
      hide:true
    },{
      btnName:'edit',
      hide:true
    },{
      btnDisplay:'详情',
      hide:(()=>{
        if(this.helper.btnRole('OPENPRODDETAIL')){
          return false;
        }
        return true;
      }).bind(this),
      click:this.onOpenProdDetail.bind(this)
    }]
  };

  constructor(public helper:HelpersAbsService,public openProdDB:OpenProductDbTableService,public pupop:MdPupop){
    this.userTypes = Observable.of(this.helper.getDictByKey('PRODUCT_USER_TYPE'));
    let prodOpenStates = this.helper.getDictByKey('PRODUCT_OPEN_STATE');
    this.states = Observable.of(prodOpenStates.filter((item,ind)=>{
      return (ind < prodOpenStates.length - 1);
    }));
  }
  ngOnInit(){
    this.openProdDB.params = this.form;
  }
  /**
   * 开通产品详情
   * @param row
   */
  public onOpenProdDetail(row){
    let openProdDetailWin = this.pupop.openWin(OpenProductDetailComponent,{
      title: '产品开通详情',
      width: '1460px',
      // height: '570px',
      height: '0',
      data: {id: row['id'],usertype:row['userType']}
    });
    openProdDetailWin.afterClosed().subscribe(res=>{
      if(res && res['status'] == 200){
        this.prodOpenTable.refresh(this.form.page);
      }
    });
  }

  /**
   * 查询
   */
  public onSearch(){
    this.form.doSearch(this.openProdDB);
    this.prodOpenTable.refresh();
  }
}
