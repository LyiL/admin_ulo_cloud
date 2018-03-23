import {Database} from "../../../../common/components/table/table-extend-data-source";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/of';
import {HttpService} from "../../../../common/services/impl/http.service";

/**
 * 交易黑名单服务类
 */
@Injectable()
export class TradeBlackuserListDBService extends Database {
  constructor(private http: HttpService) {
    super();
  }
  loadData(res):Observable<any>{
    if(res == null){
      this.pageIndex = this.params['page'];
    }else {
      this.params['page'] = this.pageIndex;
    }

    return this.http.post("/cloud/tradeblackuser/search",this.params);
  }
}
@Injectable()
export class TradeBlackuserDBService {
  constructor(private http: HttpService) {
  }
  /**
   * 添加
   * @param params
   * @return {Observable<any>}
   */
  add(params:any):Observable<any>{
    return this.http.post('/cloud/tradeblackuser/add',params);
  }

  /**
   * 删除
   * @param params
   * @return {Observable<any>}
   */
  delete(params:any):Observable<any>{
    return this.http.post('/cloud/tradeblackuser/delete',params);
  }
}
