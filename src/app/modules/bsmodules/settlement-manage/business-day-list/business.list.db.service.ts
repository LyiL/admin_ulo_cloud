import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/of';
import {Database} from "../../../../common/components/table/table-extend-data-source";
import {HttpService} from "../../../../common/services/impl/http.service";

@Injectable()
export class BusinessDbService extends Database {
  constructor(private http: HttpService) {
    super();
  }
  loadData(res): Observable <any> {
    if(res == null){
      this.pageIndex = this.params['page'];
    }else {
      this.params['page'] = this.pageIndex;
    }
    return this.http.post("/paymentCheckTradeBigmch/searchForPage",this.params);
  }

}

@Injectable()
export class BusinessDBLoad {
  constructor(private http: HttpService) {
  }

  /**
   * 商户日结统计接口请求
   */
  loadCount(params): Observable<any> {
    return this.http.post('/paymentCheckTradeBigmch/count', params);
  }
  /**
   * 结算打款接口请求
   */
  loadSettle(params): Observable<any> {
    return this.http.post('/settle/mch', params);
  }

  /**
   * 导出报表接口请求
   */
  loadExport(params): Observable<any> {
    return this.http.download('/paymentCheckTradeBigmch/export', params);
  }
}
