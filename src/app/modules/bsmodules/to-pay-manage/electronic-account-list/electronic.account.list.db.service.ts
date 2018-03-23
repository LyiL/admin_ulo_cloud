/**
 * Created by lenovo on 2017/8/1.
 */
import {Database} from "../../../../common/components/table/table-extend-data-source";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/of';
import {HttpService} from "../../../../common/services/impl/http.service";

@Injectable()
export class ElectronicAccountListService extends Database{

  constructor(private http:HttpService){
    super();
  }

  loadData(res):Observable<any>{
    if(res == null){
      this.pageIndex = this.params['page'];
    }else {
      this.params['page'] = this.pageIndex;
    }
    return this.http.post("/cashAccount/search",this.params);
  }
}

@Injectable()
export class AccountOtherDBLoad {
  constructor(private http: HttpService) {
  }
  /**
   * 修改状态
   */
  loadUseState(params): Observable<any> {
    return this.http.post('/cashAccount/changeState', params);
  }
  /**
   * 查询余额
   */
  loadSearchMoney(params): Observable<any> {
    return this.http.post('/cashAccount/searchBalance', params);
  }
  /**
   * 提现
   */
  loadTakeCash(params): Observable<any> {
    return this.http.post('/cashAccount/extractOperation', params);
  }
  /**
   * 分配
   */
  loadDistribution(params): Observable<any> {
    return this.http.post('/cashAccount/updataAccount', params);
  }
  /**
   * 新增
   */
  loadAdd(params): Observable<any> {
    return this.http.post('/cashAccount/add', params);
  }
  /**
   * 编辑
   */
  loadEdit(params): Observable<any> {
    return this.http.post('/cashAccount/updata', params);
  }
  /**
   * 电子账户(单条查询)
   */
  loadAccountInfo(data): Observable<any> {
    return this.http.post('/cashAccount/detail', data);
  }
}

@Injectable()
export class ElectronicAccountAccountdetailService extends Database{

  constructor(private http:HttpService){
    super();
  }

  loadData(res):Observable<any>{
    if(res == null){
      this.pageIndex = this.params['page'];
    }else {
      this.params['page'] = this.pageIndex;
    }
    return this.http.post("/cashAccount/searchCashRecord",this.params);
  }

}


@Injectable()
export class ElectronicCommonDBService extends Database {

  constructor(private http: HttpService) {
    super()
  }

  /**
   * 获取资金池账户
   * @returns {Observable<any>}
   * String  accountName 账户名称
   * String  bankNo      受理机构编号
   * int  useState    启用状态
   */
  loadCashPoolAccount(params:any): Observable<any> {
    return this.http.post('/cashPool/search',params).map(res=>{
      if(res && res['status'] == 200){
        return res['data'];
      }
      return [];
    });
  }

  /**
   * 获取银行账户
   * @param params
   * acntId,name
   */
  loadCashPoolBank(params:any): Observable<any> {
    return this.http.post('/bankAccount/getAccount',params).map(res=>{
      if(res && res['status'] == 200){
        return res['data'];
      }
      return [];
    });
  }

}
