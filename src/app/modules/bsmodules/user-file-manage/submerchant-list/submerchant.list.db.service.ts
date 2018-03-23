import {Database} from "../../../../common/components/table/table-extend-data-source";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/of';
import {HttpService} from "../../../../common/services/impl/http.service";
import {HelpersAbsService} from "../../../../common/services/helpers.abs.service";

@Injectable()
export class SubmerchantListDBService extends Database{
  constructor(private http:HttpService){
    super();
  }
  loadData(res):Observable<any>{
    if(res == null){
      this.pageIndex = this.params['page'];
    }else {
      this.params['page'] = this.pageIndex;
    }
    return this.http.post("/cloud/dealercodesubmch/searchpagelist",this.params);
  }
}


/**
 * 信息数据源
 * AgencyDetailDBService
 */
@Injectable()
export class SubmerchantDetailDBService {
  constructor(private http: HttpService, private helper: HelpersAbsService) {
  }
  /**
   * 操作日志
   * @param params
   * @returns {Observable<any>}
   */
  // loadExamLog(params: any) {
  //   return this.http.post('/agentInfo/getExamLogList', params);
  // }
  /**
   * 批量认证商户
   * Integer  examState      审核状态 *
   * String  chanNo          所属上级*
   * String  merchantNo      子商户编号
   * String  name            子商户名称
   * String  outerBatchId		外部批次号
   * String  bankNo          所属机构编号
   */
  batchIdentification(params:any):Observable<any>{
    return this.http.post('/cloud/batchexamsubmch',params);
  }
  /**
   * 批量退回
   * Integer  examState      审核状态 *
   * String  chanNo          所属上级*
   * String  merchantNo      子商户编号
   * String  name            子商户名称
   * String  outerBatchId		外部批次号
   * String  bankNo          所属机构编号
   */
  batchSendBack(params:any):Observable<any>{
    return this.http.post('/cloud/batchbacksubmch',params);
  }
  /**
   * 审核子商户
   * @param params {
   * String  merchantNo 子商户编号*
   * String  examState   审核状态 *
   * String  examIllu 审核备注信息 *
   * }
   * @returns {Observable<any>}
   */
  examineSubMch(params:any){
    return this.http.post('/cloud/examsubmch',params);
  }

  /**
   * 加载商户识别码信息数据源  报备信息
   * @param params
   * String  merchantNo子商户编号
   * @returns {Observable<any>}
   */
  loadIdcodeData(params:any):Observable<any>{
    // return this.http.post('/dealerCodeSubMch/searchMchUptaskList',params);
    return this.http.post('/cloud/dealercodesubmch/searchuptask',params);
  }

}


