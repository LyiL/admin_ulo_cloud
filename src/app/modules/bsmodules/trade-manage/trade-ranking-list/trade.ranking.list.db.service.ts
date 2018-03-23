import {Database} from "../../../../common/components/table/table-extend-data-source";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/of';
import {HttpService} from "../../../../common/services/impl/http.service";

@Injectable()
export class TradeRankingListDBService extends Database{

  constructor(private http:HttpService){
    super();
  }

  /**
   * 商户排名数据源
   * @returns {Observable<any>}
   */
  loadData(res):Observable<any>{
    if(res == null){
      this.pageIndex = this.params['page'];
    }else {
      this.params['page'] = this.pageIndex;
    }
    // this.params['billTime'] = "2017-7-31";
    return this.http.post("/mchDayBillSort/query",this.params);
  }
}
