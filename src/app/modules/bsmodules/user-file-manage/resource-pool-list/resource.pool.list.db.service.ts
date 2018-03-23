import {Database} from "../../../../common/components/table/table-extend-data-source";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/of';
import {HttpService} from "../../../../common/services/impl/http.service";
import {HelpersAbsService} from "../../../../common/services/helpers.abs.service";

@Injectable()
export class ResourcePoolListDBService extends Database{
  constructor(private http:HttpService){
    super();
  }
  loadData(res):Observable<any>{
    if(res == null){
      this.pageIndex = this.params['page'];
    }else {
      this.params['page'] = this.pageIndex;
    }
    return this.http.post("/cloud/dealersubmchpool/search",this.params);
  }
}


/**
 * 信息数据源
 * AgencyDetailDBService
 */
@Injectable()
export class ResourcePoolOtherDBService {
  constructor(private http: HttpService, private helper: HelpersAbsService) {
  }

  /**
   *新增子商户资源池
   * String  mchNo  商户编号
   String  chanNo  服务商编号
   String  bankMchno  银行商户编号
   String  partner  微信受理机构号  *
   String  subPartner  微信交易识别码  *
   String  chanPartner  微信渠道编号
   String  tradeType  支付类型
   int  payState  支付权限
   int  useState  启用状态
   * @param params
   * @return {Observable<any>}
   */
  addResourcePool(params:any):Observable<any>{
    return this.http.post('/cloud/dealersubmchpool/create',params);
  }
  /**
   *变更子商户资源池状态
   * int  id  主键ID  *
   *int  useState  启用状态  *
   * @param params
   * @return {Observable<any>}
   */
  changeResPoolUseState(params:any):Observable<any>{
    return this.http.post('/cloud/dealersubmchpool/changeusestate',params);
  }
  /**
   *批量变更支付权限状态
   String  mchNo  商户编号
   String  chanNo  服务商编号
   String  bankMchno  银行商户编号
   String  partner  微信受理机构号
   String  subPartner  微信交易识别码
   String  chanPartner  微信渠道编号
   String  tradeType  支付类型
   int  payState  支付权限  *
   int  useState  启用状态
   int  startSuRate  开始成功率
   int  endSuRate  结束成功率
   Date  startDate 开始日期 yyyy-mm-dd  *
   Date  endDate 结束日期 时间格式 yyyy-mm-dd  *
   * @return {Observable<any>}
   */
  changePayAuthority(params:any):Observable<any>{
    return this.http.post('/cloud/dealersubmchpool/batchchangepaystate',params);
  }
  /**
   *导出报表
   * String  mchNo  商户编号
   String  chanNo  服务商编号
   String  bankMchno  银行商户编号
   String  partner  微信受理机构号
   String  subPartner  微信交易识别码
   String  chanPartner  微信渠道编号
   String  tradeType  支付类型
   int  payState  支付权限
   int  useState  启用状态
   int  startSuRate  开始成功率
   int  endSuRate  结束成功率
   Date  startDate 开始日期 yyyy-mm-dd  *
   Date  endDate 结束日期 时间格式 yyyy-mm-dd  *
   */
  loadExport(params):Observable<any>{
    return this.http.download("/cloud/dealersubmchpool/export",params);
  }

  getAppDetail(params: any): Observable<any> {
    return this.http.post(' /cloud/dealersubmchpool/detail', params);
  }

  updateResourcePool (params: any): Observable<any> {
    return this.http.post('/cloud/dealersubmchpool/edit', params);
  }
}


