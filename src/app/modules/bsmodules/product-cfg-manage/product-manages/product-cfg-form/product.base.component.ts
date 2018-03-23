import {Component, OnInit} from "@angular/core";
import {HelpersAbsService} from "../../../../../common/services/helpers.abs.service";
import {HttpService} from "../../../../../common/services/impl/http.service";
import {ULODetailContainer} from "../../../../../common/components/detail/detail-container";
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {ProductModel} from "../../../../../common/models/product-cfg-manage/product.model";
import {MdSnackBar} from "@angular/material";
import {ProdFormDBLoad} from "../product.db.service";
import {InputSearchDatasource} from "../../../../../common/services/impl/input.search.datasource";
import {ISidenavSrvice} from "../../../../../common/services/isidenav.service";
import {LoadBankOrgDBService} from "../../../../../common/db-service/common.db.service";
/**
 * 产品配置-基本信息
 */
@Component({
  selector:'ulo-product-base',
  templateUrl:'./product.base.component.html',
  providers:[LoadBankOrgDBService,ProdFormDBLoad]
})
export class ProductBaseComponent implements OnInit{
  public productType:any[] = [];
  public productUserType:any[] = [];
  public ctr:ULODetailContainer;
  public formGroup:FormGroup;
  public model:ProductModel = new ProductModel();

  /**
   * 所属机构配置
   */
  public prodFilterFields:Array<string>= ["orgNo","name"];
  public prodDataSource:InputSearchDatasource;

  constructor(public helper:HelpersAbsService,public http:HttpService,public snackBar:MdSnackBar,
              public prodOrganDb:LoadBankOrgDBService,public sidenavService:ISidenavSrvice,public loadDB:ProdFormDBLoad){
    this.formGroup = new FormGroup({
      'bankNo':new FormControl(this.model.bankNo,Validators.required),
      'combName':new FormControl(this.model.combName,Validators.required),
      'productType':new FormControl(this.model.productType,Validators.required),
      'applyType':new FormControl(this.model.applyType),
      'productDepicts':new FormControl(this.model.productDepicts),
      'defaultUsed':new FormControl(this.model.defaultUsed)
    });
    this.prodDataSource = new InputSearchDatasource(prodOrganDb);
  }

  ngOnInit():void{
    this.productType = this.helper.getDictByKey('PRODUCT_TYPE');
    this.productUserType = this.helper.getDictByKey('PRODUCT_USER_TYPE');
    this.productUserType.forEach((res,ind)=>{
      this.productUserType[ind] = _.extend(res,{completed:false});
    });
    let params = this.sidenavService.getPageParams();
    if(params && !this.helper.isEmpty(params['id'])){
      this.loadDB.loadProdInfo(params['id']).subscribe(res=>{
        if(res && res['status'] == 200){
          // this.model = res['data'];
          this.model.resetValue(res['data']);
          this.prodOrganDb.params = {name:this.model.bankNo};
          this.prodOrganDb.refreshChange.next(true);
          this.productUserType.forEach((type,ind)=>{
            if(this.model.applyType.indexOf(type.id) != -1){
              this.productUserType[ind]['completed'] = true;
            }
          });
        }
      });
    }
  }

  onSubmit():void{
    if(this.helper.isEmpty(this.model.applyType)){
      this.snackBar.alert('请选择适用商家！');
      return;
    }
    this.loadDB.saveProdInfo(this.model).subscribe(res=>{
       if(res && res['status'] == 200){
         let params = this.sidenavService.getPageParams();
         if(params && params['source'] && params['source'] == 'detail'){
           this.ctr.params =  _.extend(res['data'],{source:'detail,base'});
         }else {
           this.ctr.params = res['data'];
         }
         this.ctr.onStep(1);
       }else{
          this.snackBar.alert(res['message']);
       }
    });
  }
  /**
   * 保存
   */
  onSave(){
    if(this.helper.isEmpty(this.model.applyType)){
      this.snackBar.alert('请选择适用商家！');
      return;
    }
    this.loadDB.saveProdInfo(this.model).subscribe(res=>{
      if(res && res['status'] == 200){
        this.snackBar.alert('保存成功！');
        let _data = res['data'];
        this.sidenavService.onNavigate('/admin/productdetail','详情',{id:_data['id']});
      }else{
        this.snackBar.alert(res['message']);
      }
    });
  }
  /**
   * 返回
   */
  onGoBack(){
    let params = this.sidenavService.getPageParams();
    this.sidenavService.onNavigate('/admin/productdetail','详情',{id:params['id']});
  }

  public onProdUserTypeChange(val:any,checked:boolean){
    val['completed'] = checked;
    this.prodUserTypeJoin(val,checked);
  }

  /**
   * 处理适用用户数据
   * @param val
   * @param flag
   */
  public prodUserTypeJoin(val:any,flag:boolean){
    let prodUserType = this.model.applyType;
    let _prodUserTypes:Array<any> = !this.helper.isEmpty(prodUserType) ? prodUserType.split(',') : new Array<any>();
    let _arrIndx = jQuery.inArray(''+val.id,_prodUserTypes);
    if(_arrIndx == -1 && flag){
      _prodUserTypes.push(val.id);
    }else if(_arrIndx != -1 && !flag){
      let _ind = _prodUserTypes.findIndex((item)=>{return val.id == item;});
      _prodUserTypes.splice(_ind,1);
    }
    this.model.applyType = _prodUserTypes.length > 0 ? _prodUserTypes.join(',') : '';
  }

  public prodOptionDisplayFn(value:any):string{
    return value && value['name'] +'('+value['orgNo']+')';
  }

  /**
   * 所属机构过滤前掉用方法
   * @param value
   */
  public beforClickFunc(value:any):boolean{
    let flag:boolean = true;
    if(this.helper.isEmpty(value)){
      this.snackBar.alert('请先输入过滤值！');
      flag = false;
    }
    this.prodOrganDb.params = {name:value};
    return flag;
  }

  public displayFn(value: any):string{
    return value && value['name'];
  }
}
