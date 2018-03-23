import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/of';
import {Database} from "../../../../common/components/table/table-extend-data-source";
import {HttpService} from "../../../../common/services/impl/http.service";

@Injectable()
export class HitMoneyDbService extends Database {
  constructor(private http: HttpService) {
    super();
  }
  loadData(res): Observable <any> {
    if(res == null){
      this.pageIndex = this.params['page'];
    }else {
      this.params['page'] = this.pageIndex;
    }
    return this.http.post("/paymentCheckTradeCash/searchForPage",this.params);
  }

  /**
   * 获取打款批次号
   * @param params
   * acntId,name
   */
  loadSettleBatch(params:any): Observable<any> {
    return this.http.post('/paymentCheckTradeCashBank/listsettlebatch',params).map(res=>{
      if(res && res['status'] == 200){
        return res['data'];
      }
      return [];
    });
  }
}

@Injectable()
export class HitMoneyDBLoad {
  constructor(private http: HttpService) {
  }

  /**
   * 结算打款统计接口请求
   */
  loadCount(params): Observable<any> {
    return this.http.post('/paymentCheckTradeCash/count', params);
  }

  /**
   * 导出报表接口请求
   */
  loadExport(params): Observable<any> {
    return this.http.download('/paymentCheckTradeCash/export', params);
  }
}
