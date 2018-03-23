/**
 * Created by lenovo on 2017/8/1.
 */
import {Database} from "../../../../common/components/table/table-extend-data-source";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/of';
import {HttpService} from "../../../../common/services/impl/http.service";

@Injectable()
export class CashManageListService extends Database{

  constructor(private http:HttpService){
    super();
  }

  loadData(res):Observable<any>{
    if(res == null){
      this.pageIndex = this.params['page'];
    }else {
      this.params['page'] = this.pageIndex;
    }
    return this.http.post("/cashPool/pager",this.params);
  }
}

@Injectable()
export class CashPoolOtherDBLoad {
  constructor(private http: HttpService) {
  }

  /**
   * 修改状态
   */
  loadUseState(params): Observable<any> {
    return this.http.post('/cashPool/updataUseState', params);
  }
  /**
   * 新增
   */
  loadAdd(params): Observable<any> {
    return this.http.post('/cashPool/add', params);
  }
  /**
   * 编辑
   */
  loadEdit(params): Observable<any> {
    return this.http.post('/cashPool/updata', params);
  }
  /**
   * 资金池(单条查询)
   */
  loadCashPoolInfo(data): Observable<any> {
    return this.http.post('/cashPool/detail', data);
  }
}

@Injectable()
export class CashManageAccountdetailService extends Database{

  constructor(private http:HttpService){
    super();
  }
  /**
   * 入账明细
   */
  loadData(res):Observable<any>{
    if(res == null){
      this.pageIndex = this.params['page'];
    }else {
      this.params['page'] = this.pageIndex;
    }
    return this.http.post("/cashPool/searchCashPoolChange",this.params);
  }
}
