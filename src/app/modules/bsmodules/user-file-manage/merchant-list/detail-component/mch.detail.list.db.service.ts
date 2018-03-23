import {Injectable} from "@angular/core";
import {Database} from "../../../../../common/components/table/table-extend-data-source";
import {Observable} from 'rxjs/Observable';
import {HttpService} from "../../../../../common/services/impl/http.service";
import {HelpersAbsService} from "../../../../../common/services/helpers.abs.service";

@Injectable()
export class MchCfgAccountDBService extends Database{

  loadData():Observable<any>{
    return Observable.of(null);
  }
}

/**
 * 渠道信息数据源
 */
@Injectable()
export class MchChannelDBService extends Database{
  loadData():Observable<any>{
    return Observable.of(null);
  }
}


/**
 * 帐户信息数据源
 */
@Injectable()
export class MchDetailDBService {
  constructor (private http:HttpService,private helper:HelpersAbsService) {}

  /**
   * 加载商户产品信息
   * @param params {
   *  userNo: string  用户编号
   * }
   * @returns {Observable<any>}
   */
  loadMchProdData(params:any){
    return this.http.post('/mchManager/searchProductList',params);
  }
  /**
   * 保存产品信息
   * @param params {
   * String  userNo    商户编号
   * String  userName  商户名称
   * String  combName  产品名称
   *  TradetypeTmepForm  []  tradetypes   产品配置集合
   * TradetypeTmepForm:
   *  String  transId  支付类型
   * String  transType  支付类型名称
   * int  ptCenterId  支付中心ID
   * BigDecimal  settleRate  费率 结算比例
   * int  limitSingle  单笔限额
   * int  limitDay  单日限额
   * int  limitSingleMin  单笔最小限额
   * int  shareRule  分润规则
   * int  settleCycle  结算周期
   *
   *
   * }
   * @returns {Observable<any>}
   */

  saveMchProdInfo(params:any){
    return this.http.post('/mchManager/addProductCfg ',params);
  }


  /**
   * 加载帐户信息
   * @param params {
   *   orgId: number 机构编号
   * }
   * @returns {Observable<any>}
   */
  loadAccountData(params:any):Observable<any>{
    return this.http.post('/mchManager/search/bankAccount',params);
  }
  /**
   * 加载渠道信息数据源
   * @param params
   * merchantId:number 商户编号
   * @returns {Observable<any>}
   */
  loadChannelData(params:any):Observable<any>{
    return this.http.post('/mchManager/search/payTypeList',params);
  }


  /**
   * 查询审核日志
   * @param params
   * @returns {Observable<any>}
   */
  loadExamLog(params:any){
    return this.http.post('/mchManager/search/examineLog',params);
  }
  /**
   * 批量保存商户帐户信息
   * @param params [{以下参数均为必填
   *  BankActForm:array   数组
   *  acntId: number         账户信息ID
   *  orgId: number           机构ID        *
   *  name: string            开户名称    *
   *  type: string            账户类型    *
   *  bankCardno: string      银行帐号    *
   *  bankCode: string        开户行编号   *
   *  bankName: string        开户行名称   *
   *  subbranchName: string   开户支行    *
   *  subbanrchCode: string   联行号     *
   *  cardType: string       卡类型     *
   *  transId: string         支付类型（不可修改）*
   *
   * },...]
   * @returns {Observable<any>}
   */
  saveAccountInfos(params:any){
    return this.http.post('/mchManager/saveBankAccountBatch',params);
  }

  /**
   * 保存商户渠道信息
   * @param params [{
   *  chanNo : string 服务商编号
   *  merchantId : number 商户编号
   *  transId: string     支付类型编号      *
   *  transType: string   支付类型名称    *
   *  agencyCode: string    银行编号      *
   *  ptCenterId: number  通道类型编号    *
   *  providerNo: string  渠道编号
   * DefrCenterMchForm：array
   *
   * },...]
   * @returns {Observable<any>}
   */
  //批量新增
  saveChannelInfos(params:any){
    return this.http.post('/mchManager/savePayTypeBatch',params);

  }
  //单个新增
 saveChannelSingle(params:any){
   return this.http.post('/mchManager/savePayType',params);
 }
  /**
   * 进件
   * @param params {
   *  id: number        渠道编号  *
   *  merchantId : string   渠道的商户编号  *
   *  agencyCode: string    银行编号  *
   * }
   */
  loadOnInto(params:any){
    return this.http.post('/mchManager/mchApply',params);
  }



  /**
   * 发送邮件与短信
   * @param params
   */
  sendEmailAndSTM(params:any){
    return this.http.post(' /mchManager/sendEmailAndSms',params);
  }

  /**
   * 审核服务商
   * @param params {
   *  id: number        商户编号
   *  examState: number   审核状态
   *  examIllu: string    审核状态修改说明
   * }
   * @returns {Observable<any>}
   */
  examineSP(params:any){
    return this.http.post('/mchManager/examineMch',params);
  }
  /**
   * 保存产品配置
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
  saveMchProdCfgs(params:any){
    return this.http.post('/mchManager/modifyBacthPayType',params);
  }

  /**
   * 关闭产品
   * @param params
   * @return {Observable<any>}
   */
  saveMchProdClose(params:any){
    return this.http.post('/mchManager/closeProduct',params);
  }

  /**
   * 开通产品
   * @param params {
   *   userNo : string     服务商用户编号          *
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
   *
   * @return {Observable<any>}
   */
  saveMchProdOpen(params:any){
    return this.http.post('/mchManager/openProduct',params);
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
  saveMchProdExamine(params:any){
    return this.http.post('/mchManager/examine ',params);
  }
  /**
   * 重新开通产品
   * @param params {
    *
    * }
   * @return {Observable<any>}
   */
  saveMchProdResetOpen(params:any){
    return this.http.post('/mchManager/openProductAgain',params);
  }
  /**
   * 加载商户产品配置信息
   * @param params {
   *  id: number  产品编号
   *  state: number   开通状态
   * }
   * @returns {Observable<any>}
   */
  loadMchProdPayTypeData(params:any){
    return this.http.post('/mchManager/getTradeTypes',params);
  }
  /**
   * 加载商户基础信息
   * @param params {
   *  id:number 商户编号
   * }
   * @return {Observable<any>}
   */
  loadMchBaseInfoData(params:any):Observable<any>{
    return this.http.post('/mchManager/search/mchInfo',params);
  }



  /**
   * 保存商户基础信息
   * @param params ：MchBaseInfoModel
   * @returns {Observable<any>}
   */
  saveMchBaseInfo(params:any){
    let url = '/mchManager/saveMchInfo';
    // if(params && params['id']){
    //   url = '/mchManager/saveMchInfo';
    // }
    params = this.helper.filterPrivateParam(params);
    return this.http.post(url,params);
  }

  /**
   * 查询这个商户的支付宝的等级
   *  String id 商户编号（主键）
   */
  aliPayMchLiveFind(params:any):Observable<any>{
    return this.http.post('/mchManager/getAlipayMchLive',params);
  }
  /**
   * 查询商户支付类型列表
   *      Int  merchantId     商户ID   *
   */
  centerMirJspFind(params:any):Observable<any>{
    return this.http.post(' /mchManager/search/centerMirJsp',params);
  }
  /**
   * 配置商户微信公众号
   *    String  mchId  商户ID         *
   String   jsapiPath   授权目录
   String   subAppid   关联APPID
   String   subscribeAppid   推荐关注APPID
   */
  accountConfig(params:any):Observable<any>{
    return this.http.post('/mchManager/accountConfig',params);
  }
  /**
   * 查询微信公众帐号配置
   * String  mchId  商户ID
   */
  accountConfigFind(params:any):Observable<any>{
    return this.http.post(' /mchManager/searchAccountConfig',params);
  }
  /**
   * 商户微信支付权限确认
   *  String id 商户编号（主键）
   */
  mchwxConfrim(params:any):Observable<any>{
    return this.http.post(' /mchManager/changeTradeAuth',params);
  }
  /**
   * 批量认证商户
   * String chanNo 所属上级 *
   int examState   用户状态 *
   String name 商户名称
   String merchantNo 商户编号
   String bankNo 所属机构
   String ally 商户识别码
   */
  batchAuthentication(params:any):Observable<any>{
    return this.http.post('/mchManager/batchApproveMchByCloud',params);
  }
  /**
   * 获取支付类型根据产品过滤
   * @param params{
   *    bankNo：string 所属受理机构
   *    transId：string 支付类型编码
   *    transType：string 支付类型名称
   * }
   * @returns {Observable<any>}
   */
  loadTransApi(params:any):Observable<any>{
    return this.http.post('/query/getTradeType',params).map(res=>{
      if(res && res['status'] == 200){
        return res['data'];
      }
      return [];
    });
  }
  /**
   *  根据商家编号或主键查询交易路由配置
   * @param params{
   *    String parentNo;   //商户编号
   * }
   * @returns {Observable<any>}
   */

  tradeRuleConf(params:any):Observable<any>{
    return this.http.post('/tradeRuleConf/findUnique',params);
  }
  /**
   *  交易路由-保存
   * @param params{
   *   Integer id;   //主键
String parentNo;   //商户编号
Integer ruleState;   //启用状态：0=否 1:=是
String tradeId;   //支付类型编号
String tradeType;   //支付类型名称
Date updateTime;   //更新时间

   * }
   * @returns {Observable<any>}
   */
  tradeRuleSave(params:any):Observable<any> {
    return this.http.post('/tradeRuleConf/save', params);
  }
  /**
   *  交易限额查询
   * @param params{
   *
   * String  merchantNo   商户编号        *

   * }
   * @returns {Observable<any>}
   */
  queryMchLimit(params:any):Observable<any> {
    return this.http.post('/mchManager/queryMchLimit', params);
  }
  /**
   *  交易限额设置
   * @param params{
   *    String  merchantNo   商户编号        *
    Double totalFeeLimit 单日总限额(元) *

   * }
   * @returns {Observable<any>}
   */
  setMchLimit(params:any):Observable<any> {
    return this.http.post('/mchManager/setMchLimit', params);
  }

  /**
   * 查询机构rsa公钥
   * @param params
   * @returns {Observable<any>}
   */
  queryOrgRsakey(params:any):Observable<any> {
    return this.http.post("/cloud/queryrsaconfig", params);
  }

  /**
   * 添加机构rsa公钥
   * @param params
   * @returns {Observable<any>}
   */
  addOrgRsakey(params:any):Observable<any> {
    return this.http.post("/cloud/addrsaconfig", params);
  }
}

