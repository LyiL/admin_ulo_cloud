/**
 * Created by lenovo on 2017/8/1.
 */
import {Database} from "../../../../../common/components/table/table-extend-data-source";
import {HttpService} from "../../../../../common/services/impl/http.service";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/of';

@Injectable()
export class RefundStrategyListService extends Database{

  constructor(private http: HttpService){
    super();
  }
  loadData(res):Observable<any>{
    if(res == null){
      this.pageIndex = this.params['page'];
    }else {
      this.params['page'] = this.pageIndex;
    }
    return this.http.post("/mchRefundSetting/limitFindPage", this.params);
  }
}

@Injectable()
export class StrategyOtherDBLoad {
  constructor(private http: HttpService) {
  }
  /**
   * 新增
   */
  loadAdd(params): Observable<any> {
    return this.http.post('/mchRefundSetting/saveLimit', params);
  }
  /**
   * 编辑
   */
  loadEdit(params): Observable<any> {
    return this.http.post('/mchRefundSetting/saveLimit', params);
  }
  /**
   * 退款策略信息(单条查询)
   */
  loadStrategyInfo(data): Observable<any> {
    return this.http.post('/mchRefundSetting/findLimitById', data);
  }
}

