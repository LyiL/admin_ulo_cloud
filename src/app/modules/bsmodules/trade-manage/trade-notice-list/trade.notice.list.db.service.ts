import {Database} from "../../../../common/components/table/table-extend-data-source";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/of';
import {HttpService} from "../../../../common/services/impl/http.service";

@Injectable()
export class TradeNoticeListDBService extends Database{

  constructor(private http:HttpService){
    super();
  }
  loadData(res):Observable<any>{
    if(res == null){
      this.pageIndex = this.params['page'];
    }else {
      this.params['page'] = this.pageIndex;
    }

    return this.http.post("/orderNotify/search/page",this.params);
  }
}
@Injectable()
export class TradeNoticeDBService{
  constructor(private http:HttpService){
  }
  /**
   * 同步
   * @param params {
   *   以下参数至少传一个
   *  orderNo:string平台单号
   *  outTradeNo:string 商户单号
   *   transactionId:string  支付单号
   * }
   * @return {Observable<any>}
   */
  loadSync(params:any):Observable<any>{
    return this.http.post(' /orderNotify/orderSyn',params);
  }
  /**
   * 补单
   * @param params {
   *   以下参数至少传一个
   *  orderNo:string平台单号
   *  outTradeNo:string 商户单号
   *   transactionId:string  支付单号
   * }
   * @return {Observable<any>}
   */
  loadNotify(params:any):Observable<any>{
    return this.http.post('/orderNotify/orderNotify',params);
  }
  /**
   * 批量同步
   * @param params {
   *  tradeTimeStart:string  交易开始时间    * 格式yyyy-MM-dd HH:mm:ss
   *  tradeTimeEnd:string  交易结束时间    * 格式yyyy-MM-dd HH:mm:ss
   *   mchNo:string  商户编号        *
   *  orderStatus：string 订单状态
   *
   * }
   * @return {Observable<any>}
   */
  loadBatchSync(params:any):Observable<any>{
    return this.http.post('/orderNotify/batchOrderSyn',params);
  }
  /**
   * 批量通知
   * @param params {
   *  tradeTimeStart:string  交易开始时间    * 格式yyyy-MM-dd HH:mm:ss
   *  tradeTimeEnd:string  交易结束时间    * 格式yyyy-MM-dd HH:mm:ss
   *   mchNo:string  商户编号        *
   *  notifyStatus ：string 订单状态
   *
   * }
   * @return {Observable<any>}
   */
  loadBatchNotify(params:any):Observable<any>{
    return this.http.post('/orderNotify/batchOrderNotify',params);
  }

}
