/**
 * Created by lenovo on 2017/8/1.
 */
import {Database} from "../../../../common/components/table/table-extend-data-source";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/of';
import {HttpService} from "../../../../common/services/impl/http.service";

@Injectable()
export class AccountTaskService extends Database{

  constructor(private http:HttpService){
    super();
  }

  loadData(res):Observable<any>{
    if (res == null) {
      this.pageIndex = this.pageIndex;
    }else {
      this.params['page'] = this.pageIndex;
    }
    return this.http.post("/paymentCheckTradeTask/searchPage",this.params);
  }
}

@Injectable()
export class AccountTaskDBLoad {
  constructor(private http: HttpService) {
  }
  /**
   * 重置任务接口请求
   */
  loadReset(params): Observable<any> {
    return this.http.post('/paymentCheckTradeTask/reset', params);
  }
  /**
   * 执行任务接口请求
   */
  loadProcess(params): Observable<any> {
    return this.http.post('/paymentCheckTradeTask/process', params);
  }
  /**
   * 对账任务编辑接口请求
   */
  loadEdit(params): Observable<any> {
    return this.http.post('/paymentCheckTradeTask/update', params);
  }

}


