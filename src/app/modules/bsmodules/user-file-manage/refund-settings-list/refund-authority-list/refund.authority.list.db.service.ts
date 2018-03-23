/**
 * Created by lenovo on 2017/8/1.
 */
import {Database} from "../../../../../common/components/table/table-extend-data-source";
import {HttpService} from "../../../../../common/services/impl/http.service";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/of';

@Injectable()
export class RefundAuthorityListService extends Database{

  constructor(private http: HttpService){
    super();
  }

  loadData(res):Observable<any>{
    if(res == null){
      this.pageIndex = this.params['page'];
    }else {
      this.params['page'] = this.pageIndex;
    }
    return this.http.post("/mchRefundSetting/authFindPage",this.params);
  }

}


@Injectable()
export class AuthOtherDBLoad {
  constructor(private http: HttpService) {
  }
  /**
   * 修改状态
   */
  loadUpdateStatus(params): Observable<any> {
    return this.http.post('/mchRefundSetting/updateAuthStatus', params);
  }
  /**
   * 新增
   */
  loadAdd(params): Observable<any> {
    return this.http.post('/mchRefundSetting/saveAuth', params);
  }
  /**
   * 编辑
   */
  loadEdit(params): Observable<any> {
    return this.http.post('/mchRefundSetting/saveAuth', params);
  }
  /**
   * 退款权限信息(单条查询)
   */
  loadAuthInfo(params): Observable<any> {
    return this.http.post('/mchRefundSetting/findAuthById', params);
  }
}
