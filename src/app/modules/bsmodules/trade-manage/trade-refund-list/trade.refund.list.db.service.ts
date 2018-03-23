import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/of';
import {Database} from "../../../../common/components/table/table-extend-data-source";
import {HttpService} from "../../../../common/services/impl/http.service";

/**
 * 退款审核 - 批量查询列表
 */

@Injectable()
export class TradeRefundListDbService extends Database {
  constructor (private http: HttpService) {
    super();
  }
  loadData(res):Observable<any>{
    if(res == null){
      this.pageIndex = this.params['page'];
    }else {
      this.params['page'] = this.pageIndex;
    }
    // this.params['tradeTimeStart'] = "2017-04-01 0:22:20";
    // this.params['tradeTimeEnd'] = "2017-04-30 18:22:20";
    return this.http.post("/refund/query",this.params);
  }
}

@Injectable()
export class TradeRefundDBService{
  constructor(private http:HttpService){
  }
  /**
   * 退款单号查询
   * @param params {
   *  refundNo:string  退款单号    *
   *
   * }
   * @return {Observable<any>}
   */
  loadRefundNo(params:any):Observable<any>{
    return this.http.post('/refund/findById',params);
  }
  /**
   * 订单可退金额查询
   * @param params {
   *
   *  orderNo:string   订单单号    *
   *  bankNo:string 银行编号    *

   * }
   * @return {Observable<any>}
   */
  loadMayRefundFee(params:any):Observable<any>{
    return this.http.post('/refund/queryRefundFee',params);
  }
  /**
   *发起订单退款申请
   * @param params {
   *  orderNo:string   订单单号        *
   *  merchantNo:string  商户银行编号        *
   *   refundFee:number  退款总额        *
   *  mchRefuseReason：string 商户退款理由    *
   *
   *
   * }
   * @return {Observable<any>}
   */
  loadReqRefund(params:any):Observable<any>{
    return this.http.post('/refund/reqRefund',params);
  }
  /**
   * 退款信息汇总
   * @param params {
   *  tradeTimeStart:string     申请开始时间    *
   *  tradeTimeEnd:string   申请结束时间    *
   *  refundTimeStart:string    退款开始时间
   *  refundTimeEnd:string   退款结束时间
   *  merchantExam:number 商户审核状态
   *  daemonAudit:number 平台审核状态
   *  refundState:number 退款状态
   *  refundSource:number 退款来源
   *  transactionId:string 第三方单号
   *  refundNo:string 退款单号
   *   orderNo:string  平台单号
   *  transId ：string 支付类型
   *   merchantNo:string  商户编号
   *  agentNo ：string 层级编号
   *
   *
   *
   * }
   * @return {Observable<any>}
   */
  loadRefundCount(params:any):Observable<any>{
    return this.http.post('/refund/queryCount',params);
  }

  /**
   *重新发起退款
   * @param params {
   *  refundNo:string    退款单号        *
   *  refundUser:string     退款操作人      *
   *  mchRefuseReason：string 商户退款理由    *
   *
   *
   * }
   * @return {Observable<any>}
   */
  loadRefundNotsure(params:any):Observable<any>{
    return this.http.post('/refund/refundNotsure',params);
  }

  /**
   *退回退款申请
   * @param params {
   *  refundNo:string    退款单号    *
   *  refuseReason：string 退款理由    *
   *
   *
   * }
   * @return {Observable<any>}
   */
  loadRefundBack(params:any):Observable<any>{
    return this.http.post('/refund/refundBack',params);
  }
  /**
   *审核通过退款申请
   * @param params {
   *  refundNo:string    退款单号    *
   *  refuseReason：string 退款理由    *
   *
   *
   * }
   * @return {Observable<any>}
   */
  loadRefundPass(params:any):Observable<any>{
    return this.http.post('/refund/refundPass',params);
  }

}
