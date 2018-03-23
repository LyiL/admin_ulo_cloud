import {Database} from "../../../../common/components/table/table-extend-data-source";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/of';
import {HttpService} from "../../../../common/services/impl/http.service";
/**
 * 交易比率数据源
 */
@Injectable()
export class TradeRatioListDBService extends Database{

  constructor(private http:HttpService){
    super();
  }
  loadData(res):Observable<any>{
    if(res == null){
      this.pageIndex = this.params['page'];
    }else {
      this.params['page'] = this.pageIndex;
    }
    return this.http.post("/paymentOrderSuccessRatio/search/page",this.params);
  }
}

/**
 * 交易比率图
 * @param {
 *  tradeTimeStart:string  统计开始时间    * 时间格式yyyy-MM-dd
 *  tradeTimeEnd:string    统计结束时间    * 时间格式yyyy-MM-dd
 *  merchantId:number     商户ID
 * }
 */
@Injectable()
export class TradeRationCharts{
  constructor(private http:HttpService){}

  loadChartsData(params:any){
    return this.http.post('/paymentOrderSuccessRatio/getSuccessRatioMap',params);
  }

  loadChartsDataHour(params:any){
    return this.http.post('/paymentOrderSuccessRatio/getSuccessRatioMapByHour',params);
  }
}
