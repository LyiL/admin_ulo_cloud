import {Database} from "../../../../common/components/table/table-extend-data-source";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/of';
import {HttpService} from "../../../../common/services/impl/http.service";

@Injectable()
export class  TradeQueryOrderListDBService extends Database{
  constructor(private http:HttpService){
    super();
  }
  loadData(res):Observable<any>{
    if(res == null){
      this.pageIndex = this.params['page'];
    }else {
      this.params['page'] = this.pageIndex;
    }
    return this.http.post("/tradeoffQuery/orderNoQueryByCloud",this.params);
  }
}
@Injectable()
export class TradeQueryDbService{
  constructor(private http:HttpService){
  }
  /**
   * 数据统计
   * @param params {
   *  tradeTimeStart:string 交易开始时间（不能为空） * 格式yyyy-MM-dd HH:mm:ss
   *  tradeTimeEnd:string  交易结束时间（不能为空） * 格式yyyy-MM-dd HH:mm:ss
   *   merchantNo:number  商户编号
   *  bankNo:number    受理机构
   * tradeState:number   交易状态
   * secondMchNo:string 下属门店
   * centerId:number 支付中心
   * transId:string 支付类型
   *
   *
   * }
   * @return {Observable<any>}
   */
  loadTradeCount(params:any):Observable<any>{
    return this.http.post(' /tradeoffQuery/summaryQueryByCloud',params);
  }


}
