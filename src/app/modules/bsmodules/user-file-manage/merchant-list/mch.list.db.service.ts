import {Database} from "../../../../common/components/table/table-extend-data-source";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/of';
import {HttpService} from "../../../../common/services/impl/http.service";
import {HelpersAbsService} from "../../../../common/services/helpers.abs.service";

@Injectable()
export class mchListDBService extends Database{
  constructor(private http:HttpService){
    super();
  }

  loadData(res):Observable<any>{
    if(res == null){
      this.pageIndex = this.params['page'];
    }else {
      this.params['page'] = this.pageIndex;
    }
    return this.http.post("/mchManager/searchMchPager",this.params);
  }
}

@Injectable()
export class mchAddListDBService extends Database{
  constructor(private http:HttpService){
    super();
  }

  loadData():Observable<any>{
    return this.http.post("/mchManager/saveBankAccount",this.params);
  }
}

/**
 * 新增商户所属机构数据源
 */
@Injectable()
export class mchAddOrganDBService extends Database{

  constructor(private http:HttpService){
    super();
  }

  loadData():Observable<any>{
    return this.http.post('/query/bankOrg',this.params);
  }
}

/**
 * Edi信息数据源
 */
@Injectable()
export class mchEditDBService{
  constructor(private http:HttpService,private helper:HelpersAbsService){
  }

  /**
   * 加载商户基础信息
   * @param params {
   *  id:number 商户编号
   * }
   * @return {Observable<any>}
   */
  loadMchBaseInfoData(params:any):Observable<any>{
    return this.http.post('/mchManager/search/mchInfo',params);
  }



//   /**
//    * 保存服务商基础信息
//    * @param params ：SPBaseInfoModel
//    * @returns {Observable<any>}
//    */
//   saveSPBaseInfo(params:any){
//     let url = '/servicepro/addServiceProvider';
//     if(params && params['id']){
//       url = '/servicepro/updateServiceProvider';
//     }
//     params = this.helper.filterPrivateParam(params);
//     return this.http.post(url,params);
//   }
}
