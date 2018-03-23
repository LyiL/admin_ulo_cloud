import {Database} from "../../../../common/components/table/table-extend-data-source";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/of';
import {HttpService} from "../../../../common/services/impl/http.service";

@Injectable()
export class IntoPiecesListDBService extends Database{
  constructor(private http:HttpService){
    super();
  }
  loadData(res):Observable<any>{
    if(res == null){
      this.pageIndex = this.params['page'];
    }else {
      this.params['page'] = this.pageIndex;
    }
    return this.http.post("/apply/search/page",this.params);
  }
}

/**
 * 加载受理机构数据
 * @param params {
   *   name：string 受理机构名称 | 受理机构编号（模糊匹配）
   *   preEnName：string 受理机构缩写
   *   notOrgNo：string 不显示的机构编号
   *   }
 */
@Injectable()
export class LoadBank1OrgDBService extends Database{
  constructor(private http:HttpService){
    super();
  }

  loadData():Observable<any>{
    if(_.size(this.params) <= 0){
      return Observable.of([]);
    }
    return this.http.post('/query/bankOrg',this.params).map(res=>{
      if(res && res['status'] == 200){
        return res['data'];
      }
      return [];
    });
  }
}
/**
 * 进件明细表格数据
 */
@Injectable()
export class intoDBService extends Database{

  loadData():Observable<any>{
    return Observable.of(null);
  }
}

@Injectable()
export class intoPiecesDBService{
  constructor(private http:HttpService){
  }
  /**
   * 新增进件
   * @param params {
   *  merchantId:number  商户id号    *
   *  merchantCode:string  商户编号   *
   *   transId:string  支付类型   *
   *  ptCenterId:number  支付接口主键   *
   * agencyCode:string   银行编码   *
   * providerNo:string  渠道商编号（上游分配的服务商编号）
   *
   *
   * }
   * @return {Observable<any>}
   */
  loadAddInto(params:any){
    let url ='/apply/add';
    if(params && params['id']){
      url = '/apply/mchApply';
    }
    // console.log(params);
    return this.http.post(url,params);
  }

  /**
   * 编辑进件
   * @param params {
   *  id:number  商户支付类型id号(不可编辑)   *
   *  ptCenterId:number 支付接口主键    *
   *   providerNo:string  渠道商编号（上游分配的服务商编号）
   *
   * }
   * @return {Observable<any>}
   */
  loadEditInto(params:any):Observable<any>{
    return this.http.post('/apply/update',params);
  }
  /**
   * 进件
   * @param params {
   *  id: number        支付类型id号 *
   *  merchantId : string  商户id号 *
   *  agencyCode: string     所属银行 *
   * }
   */
  loadOnInto(params:any){
    return this.http.post('/apply/mchApply',params);
  }

  /**
   * 获取单个进件信息
   *   int  id:商户支付类型id号    *
   */
  loadIntoPieceInfo(params:any){
    return this.http.post('/apply/findById',params);
  }


  /**
   * 批量进件
   * @param params {
   * name: string 商户名
   * merchantNo: string 商户号
   * bankNo: string 所属机构（不能是银行）*
   * superior: string 所属上级 *
   * applyState: number 进件状态 *
   * }
   * @returns {Observable<any>}
   * @constructor
   */
  BatchInto(params:any):Observable<any>{
    return this.http.post('/cloud/batchMchApply',params);
  }
}

