/**
 * Created by lenovo on 2017/8/1.
 */
import {Database} from "../../../../common/components/table/table-extend-data-source";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/of';
import {HttpService} from "../../../../common/services/impl/http.service";

@Injectable()
export class ToPayTradeListService extends Database{

  constructor(private http:HttpService){
    super();
  }

  loadData(res):Observable<any>{
    if(res == null){
      this.pageIndex = this.params['page'];
    }else {
      this.params['page'] = this.pageIndex;
    }
    return this.http.post("/cashTrans/search",this.params);
  }
}

@Injectable()
export class ToPayTradeOtherDBLoad {

  constructor(private http:HttpService){
  }
  /**
   *代付交易统计
   */
  loadCount(params):Observable<any>{
    return this.http.post("/cashTrans/queryCount",params);
  }
  /**
   *同步
   */
  loadSynch(params):Observable<any>{
    return this.http.post("/cashTrans/synch",params);
  }
  /**
   *导出报表
   */
  loadExport(params):Observable<any>{
    return this.http.download("/cashTrans/export",params);
  }
}
