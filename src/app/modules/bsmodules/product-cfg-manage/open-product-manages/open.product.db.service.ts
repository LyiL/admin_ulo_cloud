import {Injectable} from "@angular/core";
import {Database} from "../../../../common/components/table/table-extend-data-source";
import {HttpService} from "../../../../common/services/impl/http.service";
import {Observable} from "rxjs/Observable";

/**
 * 产品列表表格数据源
 */
@Injectable()
export class OpenProductDbTableService extends Database {
  constructor(public http: HttpService) {
    super();
  }

  loadData(res): Observable <any> {
    if(res == null){
      this.pageIndex = this.params['page'];
    }else {
      this.params['page'] = this.pageIndex;
    }
    return this.http.post("/productOpen/findByPage",this.params);
  }
}

/**
 * 产品数据操作类
 */
@Injectable()
export class OpenProductDBService{

  constructor(public http:HttpService){}

  /**
   * 审核产品
   * @param params
   * @returns {Observable<any>}
   */
  auditedProd(params:any):Observable<any>{
    return this.http.post('/productOpen/examine',params);
  }

  /**
   * 修改产品配置
   * @param params
   * @returns {Observable<any>}
   */
  modifyProdCfg(params:any){
    return this.http.post('/productOpen/modifyOne',params);
  }
}
