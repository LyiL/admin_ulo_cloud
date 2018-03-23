import {Injectable} from "@angular/core";
import {HttpService} from "../services/impl/http.service";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/map';
import {Database} from "../components/table/table-extend-data-source";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Data} from "@angular/router";

/**
 * 加载受理机构数据
 * @param params {
   *   name：string 受理机构名称 | 受理机构编号（模糊匹配）
   *   preEnName：string 受理机构缩写
   *   notOrgNo：string 不显示的机构编号
   *   }
 */
@Injectable()
export class LoadBankOrgDBService extends Database{
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
 * 加载服务商数据
 * @param params{
   *   parentChanCode：string 上级代理商编号
   *   name：string 服务商名称 | 服务商编号（模糊匹配）
   *   examState：number 审核状态，默认已审核 [{"id":0,"name":"待审核"},{"id":1,"name":"通过"},{"id":2,"name":"未通过"},{"id":3,"name":"冻结"},{"id":4,"name":"接口"}]
   *   activeState：number 激活状态，默认已激活 [{"id":0,"name":"冻结"},{"id":1,"name":"正常"}]
   *   bankCode：string 所属受理机构编号
   * }
 */
@Injectable()
export class LoadServiceProviderDBService extends Database{
  constructor(private http:HttpService){
    super();
  }

  loadData():Observable<any>{
    if(_.size(this.params) <= 0){
      return Observable.of([]);
    }
    this.params = _.extend({
      // examState:1,
      // activeState:1,
      chanType:1
    },this.params);
    return this.http.post('/query/chanInfo',this.params).map(res=>{
      if(res && res['status'] == 200){
        return res['data'];
      }
      return [];
    });
  }
}

/**
 * 加载代理商数据
 * @param params{
   *   parentChanCode：string 上级代理商编号
   *   name：string 代理商名称 | 代理商编号（模糊匹配）
   *   examState：number 审核状态，默认已审核 [{"id":0,"name":"待审核"},{"id":1,"name":"通过"},{"id":2,"name":"未通过"},{"id":3,"name":"冻结"},{"id":4,"name":"接口"}]
   *   activeState：number 激活状态，默认已激活 [{"id":0,"name":"冻结"},{"id":1,"name":"正常"}]
   *   bankCode：string 所属受理机构编号
   * }
 */
@Injectable()
export class LoadAgentDBService extends Database{
  constructor(private http:HttpService){
    super();
  }

  loadData():Observable<any>{
    if(_.size(this.params) <= 0){
      return Observable.of([]);
    }
    this.params = _.extend({
      // examState:1,
      // activeState:1,
      chanType:0
    },this.params);
    return this.http.post('/query/chanInfo',this.params).map(res=>{
      if(res && res['status'] == 200){
        return res['data'];
      }
      return [];
    });
  }
}

/**
 * 加载代理商与服务商数据
 * @param params{
   *   parentChanCode：string 上级代理商编号
   *   name：string 代理商名称 | 代理商编号（模糊匹配）
   *   examState：number 审核状态，默认已审核 [{"id":0,"name":"待审核"},{"id":1,"name":"通过"},{"id":2,"name":"未通过"},{"id":3,"name":"冻结"},{"id":4,"name":"接口"}]
   *   activeState：number 激活状态，默认已激活 [{"id":0,"name":"冻结"},{"id":1,"name":"正常"}]
   *   bankCode：string 所属受理机构编号
   * }
 */
@Injectable()
export class LoadAgentAndSPDBService extends Database{
  constructor(private http:HttpService){
    super();
  }

  loadData():Observable<any>{
    if(_.size(this.params) <= 0){
      return Observable.of([]);
    }
    // this.params = _.extend({
      // examState:1,
      // activeState:1
    // },this.params);
    return this.http.post('/query/chanInfo',this.params).map(res=>{
      if(res && res['status'] == 200){
        return res['data'];
      }
      return [];
    });
  }
}
/**
 * 加载商户数据
 * @param params{
   *    chanNo：string 所属代理商编号
   *    name：string 商户名称| 商户编号（模糊匹配）
   *    examState：number 审核状态，默认已审核 [{"id":0,"name":"待审核"},{"id":1,"name":"通过"},{"id":2,"name":"未通过"},{"id":3,"name":"冻结"},{"id":4,"name":"接口"}]
   *    activeState：number 激活状态，默认已激活 [{"id":0,"name":"冻结"},{"id":1,"name":"正常"}]
   *    bankNo：string 所属受理机构编号
   *    mchRole:number 商户类型(0:线上商户 1：线下商户 2：门店)
   *    isStore:是否门店(0：查询线上、现在下商户 1：查询门店)
   * }
 */
@Injectable()
export class LoadMerchantDBService extends Database{
  constructor(private http:HttpService){
    super();
  }

  loadData():Observable<any>{
    if(_.size(this.params) <= 0){
      return Observable.of([]);
    }
    this.params = _.extend({
      isStore:0
    },this.params);

    return this.http.post('/query/dealerInfo',this.params).map(res=>{
      if(res && res['status'] == 200){
        return res['data'];
      }
      return [];
    });
  }
}

/**
 * 加载门店数据
 * @param params{
   *    chanNo：string 所属代理商编号
   *    name：string 门店名称| 门店编号（模糊匹配）
   *    examState：number 审核状态，默认已审核 [{"id":0,"name":"待审核"},{"id":1,"name":"通过"},{"id":2,"name":"未通过"},{"id":3,"name":"冻结"},{"id":4,"name":"接口"}]
   *    activeState：number 激活状态，默认已激活 [{"id":0,"name":"冻结"},{"id":1,"name":"正常"}]
   *    bankNo：string 所属受理机构编号
   *    mchRole:number 商户类型(0:线上商户 1：线下商户 2：门店)
   * }
 */
@Injectable()
export class LoadStoreBService extends Database{
  constructor(private http:HttpService){
    super();
  }

  loadData():Observable<any>{
    if(_.size(this.params) <= 0){
      return Observable.of([]);
    }
    this.params = _.extend({
      // examState:1,
      // activeState:1,
      mchRole:2
    },this.params);
    return this.http.post('/query/dealerInfo',this.params).map(res=>{
      if(res && res['status'] == 200){
        return res['data'];
      }
      return [];
    });
  }
}

/**
 * 获取支付中心
 * @param params{
   *    name：string 支付中心名称
   *    settleParty：string 结算方
   *    bankNo：string 所属受理机构
   *    transId：string 支付类型编码
   * }
 */
@Injectable()
export class LoadPayCenterDBService extends Database{
  constructor(private http:HttpService){
    super();
  }

  loadData():Observable<any>{
    if(_.size(this.params) <= 0){
      return Observable.of([]);
    }
    return this.http.post('/query/getCenter',this.params).map(res=>{
      if(res && res['status'] == 200){
        return res['data'];
      }
      return [];
    });
  }
}

/**
 * 加载业务员
 * @param params {
 *  channelId：string 所属代理商编号
 *  realName：string 业务员名称
 *  bankNo：string 受理机构编号（银行平台调用些方法时，不需要转）
 * }
 */
@Injectable()
export class LoadSalesmanDBService extends Database{
  constructor(private http:HttpService){
    super();
  }

  loadData():Observable<any>{
    if(_.size(this.params) <= 0){
      return Observable.of([]);
    }
    return this.http.post('/query/getSalesman',this.params).map(res=>{
      if(res && res['status'] == 200){
        return res['data'];
      }
      return [];
    });
  }
}

/**
 * 获取结算账户（对账）
 * @param params {
 *  bankNo：string 所属代理商编号
    name：string 结算账户名称
    companion：string 父商户号（第三方商户号）
 * }
 */
@Injectable()
export class LoadCompanionForBank extends Database{
  constructor(private http:HttpService){
    super();
  }

  loadData():Observable<any>{
    if(_.size(this.params) <= 0){
      return Observable.of([]);
    }
    return this.http.post('/query/getCompanionForBank',this.params).map(res=>{
      if(res && res['status'] == 200){
        return res['data'];
      }
      return [];
    });
  }
}

/**
 * 获取联行号
 * @param params {
 *  subBankName：string 支行名称
 * }
 */
@Injectable()
export class LoadBankLinkNo extends Database{
  constructor(private http:HttpService){
    super();
  }

  loadData():Observable<any>{
    if(_.size(this.params) <= 0){
      return Observable.of([]);
    }
    return this.http.post('/query/searchBankLinkno',this.params).map(res=>{
      if(res && res['status'] == 200){
        return res['data'];
      }
      return [];
    });
  }
}

/**
 * 公共方法数据加载类
 */
@Injectable()
export class CommonDBService{
  reload:BehaviorSubject<any> = new BehaviorSubject<any>({});
  reloadTradeType:BehaviorSubject<any> = new BehaviorSubject<any>({});
  constructor(private http:HttpService){}

  syncLoadCenter(){
    const reloads = [this.reload];
    return Observable.merge(...reloads).switchMap((res)=>{
      if(res.type=='loadCenter'){
        return this.loadCenter(res.params);
      }
      return [];
    });
  }

  syncLoadTradeType(){
    const reloads = [this.reloadTradeType];
    return Observable.merge(...reloads).switchMap((res)=>{
      if(res.type=='loadTradeType'){
        return this.loadTradeType(res.params);
      }
      return [];
    });
  }

  /**
   * 获取支付中心
   * @param params{
   *    name：string 支付中心名称
   *    settleParty：string 结算方
   *    bankNo：string 所属受理机构
   *    transId：string 支付类型编码
   * }
   * @returns {Observable<any>}
   */
  loadCenter(params:any){
    if(!params || (params && params['bankNo'] == '')){
      params = _.extend(params,{'bankNo':'-1'});
    }
    return this.http.post('/query/getCenter',params).map(res=>{
      if(res && res['status'] == 200){
        return res['data'];
      }
      return [];
    });
  }

  /**
   * 获取支付类型
   * @param params{
   *    bankNo：string 所属受理机构
   *    transId：string 支付类型编码
   *    transType：string 支付类型名称
   * }
   * @returns {Observable<any>}
   */
  loadTransApi(params:any):Observable<any>{
    return this.http.post('/query/getTransApi',params).map(res=>{
      if(res && res['status'] == 200){
        return res['data'];
      }
      return [];
    });
  }

  /**
   * 渠道配置获取支付类型
   * @param params{
   *    String  userNo：用户编号(服务商/代理商/商户编号)*
   *    String  transId：支付类型编码
   *    String  parentChanNo：所属上级编号
   *    String  categoryType：所属行业类别(商户)
   *    *    String  categoryTypeChan：所属行业类别（服务商、代理商）
   *    其它说明：当商户新增渠道信息时，须传parentChanNo与categoryType
   * }
   * @returns {Observable<any>}
   */
  loadTradeType(params:any):Observable<any>{
    return this.http.post('/query/getTradeType',params).map(res=>{
      if(res && res['status'] == 200){
        return res['data'];
      }
      return [];
    });
  }

  /**
   * 获取省份列表
   * @returns {Observable<any>}
   */
  loadProvince():Observable<any>{
    return this.http.post('/query/getProvinceList').map(res=>{
      if(res && res['status'] == 200){
        return res['data'];
      }
      return [];
    });
  }

  /**
   * 获取城市列表
   * @param proId：string 省份ID
   * @returns {Observable<any>}
   */
  loadCity(proId:string):Observable<any>{
    return this.http.post('/query/getCityList',{areaCode:proId}).map(res=>{
      if(res && res['status'] == 200){
        return res['data'];
      }
      return [];
    });
  }

  /**
   * 获取区县列表
   * @param cityId：string 城市ID
   */
  loadCounty(cityId:string):Observable<any>{
    return this.http.post('/query/getCountyList',{areaCode:cityId}).map(res=>{
      if(res && res['status'] == 200){
        return res['data'];
      }
      return [];
    });
  }

  /**
   * 加载行业类别
   * @param params {
   *  parent：number 父类(1：实体，2：虚拟)
   * }
   * @returns {Observable<any>}
   */
  loadIndustryData(params:any):Observable<any>{
    return this.http.post('/paymentMchType/findIndustry',params).map(res=>{
      if(res && res['status'] == 200){
        return res['data'];
      }
      return [];
    });
  }
}

/**
 * 使用本地数据的表格数据加载类
 */
@Injectable()
export class LoadTableDbService extends Database{

  loadData():Observable<any>{
    return Observable.of([]);
  }
}

/**
 * 使用本地数据的表格数据加载类
 */
@Injectable()
export class LoadTableDbService2 extends Database{

  loadData():Observable<any>{
    return Observable.of([]);
  }
}
