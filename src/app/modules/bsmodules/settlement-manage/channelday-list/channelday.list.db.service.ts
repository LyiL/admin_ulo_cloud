import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/of';
import {Database} from "../../../../common/components/table/table-extend-data-source";
import {HttpService} from "../../../../common/services/impl/http.service";

@Injectable()
export class  ChannelDayDBService extends Database{
  constructor(private http:HttpService){
    super();
  }
  loadData(res):Observable<any>{
    if(res == null){
      this.pageIndex = this.params['page'];
    }else {
      this.params['page'] = this.pageIndex;
    }

    return this.http.post("/paymentCheckTradeChan/searchForPage",this.params);
  }
}

@Injectable()
export class  ChannelDayDetailDBService extends Database{
  constructor(private http:HttpService){
    super();
  }
  loadData(res):Observable<any>{
    if(res == null){
      this.pageIndex = this.params['page'];
    }else {
      this.params['page'] = this.pageIndex;
    }
    // this.params['billTimeStart'] = "2017-3-30 0:22:20";
    // this.params['billTimeEnd'] = "2017-04-28 18:22:20";
    // this.params['orderNo'] = "2610125020170718100000946";
    return this.http.post("/paymentCheckTradeChan/searchForPage/detail",this.params);
  }
}

@Injectable()
export class ChannelDBService{
  constructor(private http:HttpService){
  }
  /**
   * 渠道日结统计
   * @param params {
   *  billTimeStart:string  清算开始时间  *
   *  billTimeEnd:string  清算结束时间  *
   *  canalName:string  渠道名称
   *  ally:string    第三方商户号 (结算账户)
   *  transId:string 支付类型
   *  agencyCode:string 受理机构编码
   *  actId:number  结算账户ID
   * }
   *
   *
   * @return {Observable<any>}
   */
  loadChannelDayCount(params:any):Observable<any>{
    return this.http.post('/paymentCheckTradeChan/count',params);
  }


  /**
   * 渠道日结详情统计
   * @param params {
   *   billTimeStart:string  清算开始时间  *
   *  billTimeEnd:string  清算结束时间  *
   *  canalName:string  渠道名称
   *  ally:string    第三方商户号 (结算账户)
   *  transId:string 支付类型
   *  agencyCode:string 受理机构编码
   *  actId:number  结算账户ID
   * merchantNo:string 商户编号
   *
   * }
   * @return {Observable<any>}
   */
  loadChannelDayCountDetail(params:any):Observable<any>{
    return this.http.post('/paymentCheckTradeChan/count/detail',params);
  }
  /**
   *结算打款
   * @param params {
   *  settleTitle:string   打款标题        *
   *  ally:string  结算账户        *
   *   remark:string  总体备注
   *  beginTime：string 开始时间    *
   *   endTime：string 结束时间    *
   * }
   * @return {Observable<any>}
   */
  loadSettle(params:any):Observable<any>{
    return this.http.post('/settle/cha',params);
  }
}
