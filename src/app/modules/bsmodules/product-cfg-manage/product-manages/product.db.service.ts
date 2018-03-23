import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/of';
import {Database} from "../../../../common/components/table/table-extend-data-source";
import {HttpService} from "../../../../common/services/impl/http.service";

/**
 * 产品列表表格数据源
 */
@Injectable()
export class ProductDbService extends Database {
  constructor(public http: HttpService) {
    super();
  }

  loadData(res): Observable <any> {
    if(res == null){
      this.pageIndex = this.params['page'];
    }else {
      this.params['page'] = this.pageIndex;
    }
    return this.http.post("/productManage/findByPage",this.params);
  }
}

/**
 * 产品明细表格数据
 */
@Injectable()
export class ProductCfgDBService extends Database{

  loadData():Observable<any>{
    return Observable.of(null);
  }
}

/**
 * 加载产品信息
 */
@Injectable()
export class ProdFormDBLoad{
  constructor(public http:HttpService){}

  /**
   * 加载产品基础信息
    */
  loadProdInfo(id:number):Observable<any>{
    return this.http.post('/productManage/findById',{id:id});
  }

  /**
   * 加载产品支付配置
   * @param id
   * @returns {Observable<any>}
   */
  loadProdCfg(id:number):Observable<any>{
    return this.http.post('/productManage/findConfig',{combindId:id});
  }

  /**
   * 保存产品配置信息
   * @param data
   * @returns {Observable<any>}
   */
  saveProdCfg(data:any){
    return this.http.post('/productManage/saveConfigure',data);
  }

  /**
   * 作废产品
   * @param id 产品ID
   * @returns {Observable<any>}
   */
  toVoid(id:number):Observable<any>{
    return this.http.post('/productManage/invalid',{id:id});
  }

  /**
   * 获取产品审核记录
   */

  loadExmineLog(params:any):Observable<any>{
    return this.http.post('/productManage/getExmineLog',params);
  }

  /**
   * 查询配置记录
   *   int combindId     *
   */
  loadFindConfig(params:any):Observable<any>{
    return this.http.post('/productManage/findConfig',params);
  }

  /**
   * 产品审核
   *  int         id              产品主键   *
   int         productState    审核状态   *
   String      exmineDes       审核说明   *
   */
  loadPorExamine(params:any):Observable<any>{
    return this.http.post('/productManage/examine',params);
  }
  /**
   * 保存产品基础信息
   * @param data
   * @returns {Observable<any>}
   */
  saveProdInfo(data:any){
    return this.http.post('/productManage/save',data);
  }
}
