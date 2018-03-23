import {Database} from "../../../../common/components/table/table-extend-data-source";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {HttpService} from "../../../../common/services/impl/http.service";

/**
 * 退款审核 - 订单号列表
 */

@Injectable()
export class TradeRefundOrderListDbService extends Database {
  constructor(private http:HttpService){
    super();
  }
  loadData(res):Observable<any>{
    if(res == null){
      this.pageIndex = this.params['page'];
    }else {
      this.params['page'] = this.pageIndex;
    }
    return this.http.post("/refund/exactQuery",this.params);
  }
}
