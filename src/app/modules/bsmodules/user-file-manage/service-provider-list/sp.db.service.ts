import {Database} from "../../../../common/components/table/table-extend-data-source";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/of';
import {HttpService} from "../../../../common/services/impl/http.service";
import {HelpersAbsService} from "../../../../common/services/helpers.abs.service";

/**
 * 服务商列表
 */
@Injectable()
export class ServiceProviderListDBService extends Database{

  constructor(public http:HttpService){
    super();
  }

  loadData(res):Observable<any>{
    if(res == null){
      this.pageIndex = this.params['page'];
    }else {
      this.params['page'] = this.pageIndex;
    }
    return this.http.post("/servicepro/search/page",this.params);
  }
}

/**
 * 下属商户
 * @param params{
 *  chanCode : string 代理商编号 *
 *  chanType : string 渠道类型（0为代理商，1为服务商）
 * }
 */
@Injectable()
export class SubMchDBService extends Database{
  constructor(public http:HttpService){
    super();
  }

  loadData():Observable<any>{
    this.params['page'] = this.pageIndex;
    this.params['size'] = this.pageSize;
    return this.http.post("/agentInfo/childMch",this.params);
  }
}

/**
 * 下属代理
 * @param params{
 *    parentChanCode : string 上级代理商编号    *
 * }
 */
@Injectable()
export class SubChannelDBService extends Database{
  constructor(public http:HttpService){
    super();
  }

  loadData():Observable<any>{
    this.params['page'] = this.pageIndex;
    this.params['size'] = this.pageSize;
    return this.http.post("/agentInfo/childAgent",this.params);
  }
}

/**
 * 帐户信息数据源
 */
@Injectable()
export class SPDetailDBService {
  constructor(public http:HttpService,public helper:HelpersAbsService){
  }

  /**
   * 加载服务商基础信息
   * @param params {
   *  id:number 服务商信息主键ID
   * }
   * @return {Observable<any>}
   */
  loadSPBaseInfoData(params:any):Observable<any>{
    return this.http.post('/servicepro/detailServiceProvider',params);
  }

  /**
   * 加载帐户信息
   * @param params {
   *   orgId: number 机构编号
   * }
   * @returns {Observable<any>}
   */
  loadAccountData(params:any):Observable<any>{
    return this.http.post('/servicepro/getBankActList',params);
  }

  /**
   * 查询审核日志
   * @param params
   * @returns {Observable<any>}
   */
  loadExamLog(params:any){
    return this.http.post('/servicepro/getExamLogList',params);
  }

  /**
   * 加载服务商产品信息
   * @param params {
   *  userNo: string  用户编号
   * }
   * @returns {Observable<any>}
   */
  loadSPProdData(params:any){
    return this.http.post('/serviceproProduct/list',params);
  }

  /**
   * 加载服务商产品配置信息
   * @param params {
   *  id: number  产品编号
   *  state: number   开通状态
   * }
   * @returns {Observable<any>}
   */
  loadSPProdPayTypeData(params:any){
    return this.http.post('/serviceproProduct/listTradeType',params);
  }

  /**
   * 审核服务商
   * @param params {
   *  id: number        服务商主键ID
   *  examState: number   审核状态
   *  examIllu: string    审核状态修改说明
   * }
   * @returns {Observable<any>}
   */
  examineSP(params:any){
    return this.http.post('/servicepro/examine',params);
  }

  /**
   * 发送邮件与短信
   * @param params
   */
  sendEmailAndSTM(params:any){
    return this.http.post('/servicepro/sendMsgAndEmail',params);
  }

  /**
   * 批量保存服务商帐户信息
   * @param params [{
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
   *  bankActId: string       账户信息关联ID（不能修改）
   * },...]
   * @returns {Observable<any>}
   */
  saveAccountInfos(params:any){
    return this.http.post('/servicepro/addBankActList', params);
  }

  /**
   * 查询服务商总通道信息
   * @param params [{
   *  proNo: string 服务商编号 *
   * },...]
   * @returns {Observable<any>}
   */
  loadTotalChannels(params: any) {
    return this.http.post('/cloud/chanproapply/searchlist', params);
  }

  /**
   * 添加服务商总通道信息配置(多条)
   * @param params [{
   *  proNo: string 服务商编号 *
   *  bankNo: string 所属银行编号 *
   *  bankName: string 所属银行名称 *
   * },...]
   * @returns {Observable<any>}
   */
  saveTotalChannels(params: any): Observable<any> {
    return this.http.post('/cloud/chanproapply/addlinkbatch', params);
  }

  /**
   * 新增或修改服务商总通道信息（单条）
   * @param params [{
   *  proNo: string 服务商编号 *
   *  bankNo: string 所属银行编号 *
   *  bankName: string 所属银行名称 *
   * },...]
   * @returns {Observable<any>}
   */
  editTotalChannel(params: any): Observable<any> {
    return this.http.post('/cloud/chanproapply/editlink', params);
  }

  /**
   * 同步服务商总通道信息
   * @param params [{
   *  proNo: string 服务商编号 *
   *  bankNo: string 所属银行编号 *
   * },...]
   * @returns {Observable<any>}
   */
  syncTotalChannel(params: any): Observable<any> {
    return this.http.post('/cloud/chanproapply/proapplybank', params);
  }

  /**
   * 查询服务商通道信息列表
   * @param params [{
   *  merchantId : string 服务商编号 *
   * },...]
   * @returns {Observable<any>}
   */
  loadChannelInfos(params: any) {
    return this.http.post('/cloud/procentermch/search', params);
  }

  /**
   * 保存服务商通道信息 (多条)
   * @param params [{
   *  merchantId : string 服务商编号 *
   *  agencyCode : string 所属银行 *
   *  transId: string     支付类型编码    *
   *  transType: string   支付类型名称    *
   *  ptCenterId: string    通道类型id    *
   *  bankNo: string  所属银行    *
   *  ally: string  第三方平台商户号
   *  pcmPartKey: string  第三方平台商户号密钥
   *  providerNo: string 渠道编号
   *  used: Interger 启用状态 *
   * },...]
   * @returns {Observable<any>}
   */
  saveChannelInfos(params: any) {
    return this.http.post('/cloud/procentermch/addcentermchbatch', params);
  }

  /**
   * 添加服务商通道信息（单条）
   * @param params [{
   *  merchantId : string 服务商编号 *
   *  agencyCode : string 所属银行 *
   *  transId: string     支付类型编码    *
   *  transType: string   支付类型名称    *
   *  ptCenterId: string    通道类型id    *
   *  ally: string  第三方平台商户号
   *  pcmPartKey: string  第三方平台商户号密钥
   *  providerNo: string 渠道编号
   *  used: Interger 启用状态 *
   * },...]
   * @returns {Observable<any>}
   */
  saveSigChannleInfo(params: any) {
    return this.http.post('/cloud/procentermch/addcentermch', params);
  }

  /**
   * 修改服务商通道信息（单条）
   * @param params [{
   *  id : string 渠道信息主键编号 *
   *  merchantId : string 服务商编号 *
   *  agencyCode : string 所属银行 *
   *  transId: string     支付类型编码    *
   *  transType: string   支付类型名称    *
   *  ptCenterId: string    通道类型id    *
   *  bankNo: string  所属银行    *
   *  ally: string  第三方平台商户号
   *  pcmPartKey: string  第三方平台商户号密钥
   *  providerNo: string 渠道编号
   *  used: Interger 启用状态 *
   * },...]
   * @returns {Observable<any>}
   */
  updateSigChannleInfo(params: any) {
    return this.http.post('/cloud/procentermch/updatecentermch', params);
  }

  /**
   * 删除服务商渠道信息 (单条)
   * @param params {
   *  id:  string 渠道信息主键编号 *
   *  merchantId： string 服务商编号 *
   *  transId: string 支付类型编码 *
   * }
   * @returns {Observable<any>}
   */
  deleteChannelInfo(params: any): Observable<any> {
    return this.http.post('/cloud/procentermch/delcentermch', params);
  }

  /**
   * 保存产品信息
   * @param params {
   * userNo: string   服务商编号
   * userName: string  服务商名称
   * combName:string  产品名称
   * tradetypes:Array<any>   产品配置集合
   *     transId: string  支付类型
   *     transType: string  支付类型名称
   *     ptCenterId: number  支付中心ID
   *     settleRate: number  费率 结算比例
   *     limitSingle:number  单笔限额
   *     limitDay: number  单日限额
   *     limitSingleMin: number  单笔最小限额
   *     settleCycle: number  结算周期
   *     shareRule: number  分润规则
   * }
   * @returns {Observable<any>}
   */
  saveSPProdInfo(params:any){
    return this.http.post('/serviceproProduct/add',params);
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
  saveSPProdCfgs(params:any){
    return this.http.post('/serviceproProduct/updateTradetypeList',params);
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
   * @return {Observable<any>}
   */
  saveSPProdOpen(params:any){
    return this.http.post('/serviceproProduct/open',params);
  }

  /**
   * 重新开能产品
    * @param params {
    *
    * }
   * @return {Observable<any>}
   */
  saveSPProdResetOpen(params:any){
    return this.http.post('/serviceproProduct/openAgain',params);
  }

  /**
   * 关闭产品
   * @param params
   * @return {Observable<any>}
   */
  saveSPProdClose(params:any){
    return this.http.post('/serviceproProduct/close',params);
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
  saveSPProdExamine(params:any){
    return this.http.post('/serviceproProduct/examine',params);
  }

  /**
   * 保存服务商基础信息
   * @param params ：SPBaseInfoModel
   * @returns {Observable<any>}
   */
  saveSPBaseInfo(params:any){
    let url = '/servicepro/addServiceProvider';
    if(params && params['id']){
      url = '/servicepro/updateServiceProvider';
    }
    return this.http.post(url,params);
  }

  /**
   * 添加服务商微信公众号配置
   * @param params ：{
   *  chanCode: string 服务商编号
   *  subAppid: string 公众号对应的appid
   *  jsapiPath: string 商户公众号api支付授权目录
   *  subscribeAppid: string 微信分配的服务商公众号APPID
   * }
   * @returns {Observable<any>}
   */
  addSPWxConfig(params: any): Observable<any> {
    return this.http.post('/servicepro/addWxConfig', params);
  }

  /**
   * 查询服务商微信公众号配置
   * @param params ：{
   *  chanCode: string 服务商编号
   * }
   * @returns {Observable<any>}
   */
  querySPWxConfig(params: any): Observable<any> {
    return this.http.post('/servicepro/queryWxConfig', params);
  }

  /**
   * 修改服务商微信公众号配置信息
   * @param params ：{
   *  id: Integer 服务商公众号信息id
   *  chanCode: string 服务商编号
   *  subAppid: string 公众号对应的appid
   *  jsapiPath: string 商户公众号api支付授权目录
   *  subscribeAppid: string 微信分配的服务商公众号APPID
   * }
   * @returns {Observable<any>}
   */
  updateSPWxConfig(params: any): Observable<any> {
    return this.http.post('/servicepro/updateWxConfig', params);
  }

  /**
   * 查询服务商子商户模式配置
   * @param params ：{
   * chanCode: string 服务商编号 *
   * }
   * @returns {Observable<any>}
   */
  loadSubMchType(params: any): Observable<any> {
    return this.http.post('servicepro/getChanProExamStyle', params);
  }

  /**
   * 新增或修改服务商子商户模式配置信息
   * @param params ：{
   * chanCode: string 服务商编号 *
   * examStyle: string 审核状态 *
   * }
   * @returns {Observable<any>}
   */
  editSubMchType(params: any): Observable<any> {
    return this.http.post('servicepro/editChanProExamStyle', params);
  }

  /**
   * 获取服务商交易路由
   * @param params ：{
   * parentNo: string 服务商编号 *
   * }
   * @returns {Observable<any>}
   */
  loadTradeRule(params: any): Observable<any> {
    return this.http.post('/tradeRuleConf/findUnique', params);
  }

  /**
   * 变更启用服务商交易路由启用状态
   * @param params ：{
   * parentNo: string 服务商编号 *
   * ruleState: integer   启用状态：0=否 1:=是 *
   * tradeId: string 支付类型编号（启用切换成禁用状态必传）
   * tradeType: string 支付类型名称 （启用切换成禁用状态必传）
   * }
   * @returns {Observable<any>}
   */
  saveTradeRule(params: any): Observable<any> {
    return this.http.post('/tradeRuleConf/save', params);
  }

  /**
   * 变更服务商轮询配置
   * @param params ：{
   * chanCode: string 服务商编号 *
   * }
   * @returns {Observable<any>}
   */
  loadpoil(params: any): Observable<any> {
    return this.http.post('/cloud/servicepro/getusepolling', params);
  }

  /**
   * 变更服务商轮询配置
   * @param params ：{
   * chanCode: string 服务商编号 *
   * usePolling: integer   启用状态：0=否 1:=是 *
   * }
   * @returns {Observable<any>}
   */
  updatepoil(params: any): Observable<any> {
    return this.http.post('/cloud/servicepro/updateusepolling', params);
  }

  /**
   * 获取服务商交易限额
   * @param params: {
   * chanCode: string 服务商编号 *
   * }
   * @returns {Observable<any>}
   */
  loadTradeLimit(params: any): Observable<any> {
    return this.http.post('/cloud/servicepro/searchTotalFeeLimit', params);
  }

  /**
   * 保存服务商交易限额
   * @param params: {
   * chanCode: string 服务商编号 *
   * totalFeeLimit:
   * }
   * @returns {Observable<any>}
   */
  saveTradeLimit(params: any): Observable<any> {
    return this.http.post('/cloud/servicepro/updateTotalFeeLimit', params);
  }

  /**
   * 变更服务商渠道信息启用状态
   * @param params：{
   * id: Integer 主键 *
   * used: Integer 启用状态 *
   * }
   * @returns {Observable<any>}
   */
  saveState(params: any): Observable<any> {
    return this.http.post('/cloud/procentermch/updatestate', params);
  }
}

