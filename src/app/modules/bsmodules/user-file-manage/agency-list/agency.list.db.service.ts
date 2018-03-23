/**
 * Created by lenovo on 2017/8/1.
 */
import {Database} from "../../../../common/components/table/table-extend-data-source";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/of';
import {HttpService} from "../../../../common/services/impl/http.service";
import {HelpersAbsService} from "../../../../common/services/helpers.abs.service";

/**
 * 代理商列表
 */
@Injectable()
export class AgencyListService extends Database{

  constructor(private http:HttpService){
    super();
  }

  loadData(res):Observable<any>{
    if(res == null){
      this.pageIndex = this.params['page'];
    }else {
      this.params['page'] = this.pageIndex;
    }
    return this.http.post("/agentInfo/searchPage",this.params);
  }
}

/**
 * 下级代理
 * ChildAgentService
 * parentChanCode : string 上级代理商编号    *
 */
@Injectable()
export class ChildAgentService extends Database{

  constructor(private http:HttpService){
    super();
  }

  loadData():Observable<any>{
    this.params['page'] = this.pageIndex;
    this.params['size'] = this.pageSize;
    return this.http.post("/agentInfo/childAgent",this.params);
  }
}
/**
 * 下级商户
 * ChildMchService
 * chanCode : string 代理商编号 *
 * chanType : string 渠道类型（0为代理商，1为服务商）
 */
@Injectable()
export class ChildMchService extends Database{

  constructor(private http:HttpService){
    super();
  }

  loadData():Observable<any>{
    this.params['page'] = this.pageIndex;
    this.params['size'] = this.pageSize;
    return this.http.post("/agentInfo/childMch",this.params);
  }
}

/**
 * 信息数据源
 * AgencyDetailDBService
 */
@Injectable()
export class AgencyDetailDBService{
  constructor(private http: HttpService, private helper: HelpersAbsService){
  }

  /**
   * 加载代理商基本信息
   * @param params {
   *  id:number 服务商信息主键ID
   * }
   * @return {Observable<any>}
   */
  loadAgencyBaseInfoData(params:any):Observable<any>{
    return this.http.post('/agentInfo/getAgentDetail',params);
  }

  /**
   * 加载账户信息
   * @param params {
   *   orgId: number 机构编号
   * }
   * @returns {Observable<any>}
   */
  loadAccountData(params:any):Observable<any>{
    return this.http.post('/agentInfo/getAgentAct',params);
  }

  /**
   * 加载渠道信息数据源
   * @param params
   * @returns {Observable<any>}
   */
  loadChannelData(params:any):Observable<any>{
    return this.http.post('/agentInfo/getAgentRate',params);
  }

  /**
   * 查询审核日志
   * @param params
   * @returns {Observable<any>}
   */
  loadExamLog(params:any){
    return this.http.post('/agentInfo/getExamLogList',params);
  }

  /**
   * 加载代理商产品信息
   * @param params {
   *  userNo:string       代理商编号
   * }
   * @returns {Observable<any>}
   */
  loadAgencyProdData(params:any){
    return this.http.post('/agentManager/searchProduct',params);
  }

  /**
   * 加载代理商产品配置信息
   * @param params {
   *  userNo: string  用户编号
   *  state: number   开通状态
   * }
   * @returns {Observable<any>}
   */
  loadAgencyProdPayTypeData(params:any){
    return this.http.post('/agentManager/listTradeType',params);
  }

  /**
   * 审核代理商
   * @param params {
   *  id: number        主键ID
   *  chanCode :string  代理商编号
   *  examState: number   审核状态
   *  examIllu: string    审核状态修改说明
   * }
   * @returns {Observable<any>}
   */
  examineAgency(params:any){
    return this.http.post('/agentManager/auditAgent',params);
  }

  /**
   * 发送邮件与短信
   * @param params
   */
  sendEmailAndSTM(params:any){
    return this.http.post('/agentManager/sendMsgAndEmail',params);
  }

  /**
   * 批量保存代理商账户信息
   * @param params [{
   *  name             账户名(开户名称)        *
   *  type             账户类型 0个人  1企业
   *  bankCode         银行代号                *
   *  bankName         银行名称(开户行)        *
   *  subbanrchCode    支行编码(联行号)        *
   *  subbranchName    开户支行名称            *
   *  bankCardno       银行卡号
   *  province         省份
   *  provinceName     省份名称
   *  city             城市
   *  cityName         城市名称
   *  transId          支付类型，接口代码      *
   * },...]
   * @returns {Observable<any>}
   */
  saveAccountInfos(params:any){
    return this.http.post(' /agentInfo/agentAccountManager',params);
  }

  /**
   * 保存代理商通道信息（渠道）---------》单条保存
   * @param params {
   *  String  transId         支付类型，对应service的交易接口（不可更改） *
   *  String  transType       支付类型名称（不可更改）
   *  String  bankNo          银行ID（不可更改）
   *  int     categoryType    商户类型，商户类型里面可以实体、虚拟 1,2（不可更改）  *
   *  int     orgId           渠道机构id（不可更改）  *
   *  String  chanNo          渠道编号（不可更改）    *
   *  int     centerId        支付中心编号
   *  String  centerName      支付中心名称
   *  String  providerNo      渠道商编号（上游分配的服务商编号）
   *  String otherCenterBank  关联其他支付中心所属银行
   *  Integer otherCenterId   关联其他中心id
   *  String ally             第三方平台商户号
   *  String pcmPartKey       第三方平台商户号密钥
   *  int         state           状态
   *  Integer     limitDay        单日限额
   *  Integer     limitSingleMin  单笔限额-最小
   *  Integer     limitSingleMax  单笔限额-最大
   *  Integer     settleCycle     结算周期
   *  Integer     combindId       产品临时表主键
   *  Integer     chanShareRule   分润规则
   *  BigDecimal  chanRate        渠道费率,千分之X为单位
   * }
   * @returns {Observable<any>}
   */
  saveChannelInfos(params:any){
    return this.http.post('/agentManager/addAgentRate',params);
  }
  /**
   * 保存代理商通道信息（渠道）---------》批量保存
   * @param params [{
   *  chanNo : string 服务商编号
   *  orgId : number 机构ID
   *  id: number          渠道信息主键ID  *
   *  transId: string     支付类型ID      *
   *  transType: string   支付类型名称    *
   *  centerId: string    渠道类型ID      *
   *  centerName: string  渠道类型名称    *
   *  bankNo: string      所属银行        *
   *  providerNo: string  渠道编号
   *  settleRate: string  结算费率        *
   * },...]
   * @returns {Observable<any>}
   */
  saveBatchChannelInfos(params:any){
    return this.http.post('/agentManager/addBatchAgentRate',params);
  }
  /**
   * 保存产品信息
   * @param params {
   * userNo: string   服务商编号*
   * userName: string  服务商名称
   * combName:string  产品名称*
   * tradetypes:Array<any>   产品配置集合（支付类型数组）*
   *     transId: string  支付类型
   *     transType: string  支付类型名称
   *     settleRate: number  费率 结算比例
   *     limitSingle:number  单笔限额
   *     limitDay: number  单日限额
   *     limitSingleMin: number  单笔最小限额
   *     settleCycle: number  结算周期
   *     shareRule: number  分润规则
   * }
   * @returns {Observable<any>}
   */
  saveAgencyProdInfo(params:any){
    return this.http.post('/agentManager/addProduct',params);
  }

  /**
   * 保存产品配置 代理商修改产品信息接口
   * @param params {
   *  id : number  产品配置临时表主键ID        *
   *  tradetypes:TradetypeTmepForm 支付类型数组，以下是支付类型的参数
   *     transId: string         支付类型        *
   *     transType: string       支付类型名称    *
   *     ptCenterId: number      支付中心ID      *
   *     settleRate: number      结算比例        *
   *     limitSingle: number     单笔限额
   *     limitDay: number        单日限额
   *     limitSingleMin: number  单笔最小限额
   *     settleCycle: number     结算周期        *
   *     shareRule: number       分润规则        *
   * }
   * @return {Observable<any>}
   */
  saveAgencyProdCfgs(params:any){
    return this.http.post('/agentManager/updateProductDetail',params);
  }

  /**
   * 开通产品
   * @param params {
   *   userNo : string     代理商用户编号          *
   *   combId : number      产品编号               *
   *   tradetypes:TradetypeTmepForm 支付类型数组，以下是支付类型的参数（当传tradetypes数组时，必须TradetypeTmepForm表单里面的必传参数）
   *       transId : string        支付类型        *
   *       transType : string      支付类型名称    *
   *       ptCenterId : number     支付中心ID      *
   *       settleRate : number    结算比例
   *       limitSingle : number     单笔限额
   *       limitDay : number       单日限额
   *       limitSingleMin : number 单笔最小限额
   *       settleCycle : number    结算周期        *
   *       shareRule : number       分润规则       *
   * }
   * @return {Observable<any>}
   */
  saveAgencyProdOpen(params:any){
    return this.http.post('/agentManager/agentOpenPro',params);
  }

  /**
   * 重新开通产品
   * @param params {
    *
    * }
   * @return {Observable<any>}
   */
  saveAgencyProdResetOpen(params:any){
    return this.http.post('/agentManager/agentOpenProAgain',params);
  }

  /**
   * 关闭产品
   * @param params
   * @return {Observable<any>}
   */
  saveAgencyProdClose(params:any){
    return this.http.post('/agentManager/agentClosePro',params);
  }

  /**
   * 审核产品
   * @param params {
   * String  userNo: string      用户编号    *
    Integer combId: number      产品编号
    String  userType    用户类型    *
   * }
   * @return {Observable<any>}
   */
  saveAgencyProdExamine(params:any){
    return this.http.post('/agentManager/agentAuditPro',params);
  }
  /**
   * 删除渠道信息
   * @param params {
   * Integer id: number      主键编号*
   * }
   * @return {Observable<any>}
   */
  deleteChannelInfos(params:any){
    return this.http.post('/agentManager/deleteAgentRate',params);
  }
  /**
   * 保存代理商基本信息
   * @param params ：SPBaseInfoModel
   * @returns {Observable<any>}
   */
  saveAgencyBaseInfo(params:any){
    let url = '/agentInfo/addAgentDetail';
    if(params && params['id']){
      url = '/agentManager/updateAgentDetail';
    }
    params = this.helper.filterPrivateParam(params);
    return this.http.post(url,params);
  }
}
