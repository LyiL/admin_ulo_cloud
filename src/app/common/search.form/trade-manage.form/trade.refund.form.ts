import {BaseSearchForm} from "../base.search.form";
/**
 * 退款审核查询表单字段
 * @author hsz
 * @date 2017-08-16
 */
export class TradeRefundForm extends BaseSearchForm{
  private _tradeTimeStart:string;//开始时间
  private _tradeTimeEnd:string;//结束时间
  private _refundTimeStart:string;//退款开始时间
  private _refundTimeEnd:string;//退款结束时间
  public merchantExam:number;//商户审核状态
  public daemonAudit:number;//平台审核状态
  public refundState:number;//退款状态
  public refundSource:number;//退款来源
  public transactionId:string;//第三方单号
  public refundNo:string;//退款单号
  public orderNo:string;//平台单号
  public transId:string;//支付类型
  private _merchantNo:string;//商户编号
  public _merchantNoName: string; // 商户名称
  public agentNo:string;//层级编号
  constructor(){
    super();
  }

  get merchantNo():string {
    return this._merchantNo;
  }

  set merchantNo(_merchantNo: string) {
    if(this.isEmpty(_merchantNo)){
      this._merchantNoName = '';
    }
    this._merchantNo = _merchantNo;
  }

  get tradeTimeStart(){
    return this.isEmpty(this._tradeTimeStart) ? this.defTime(-6,'YYYY-MM-DD 00:00:00') : this.format(this._tradeTimeStart);
  }
  set tradeTimeStart(_tradeTimeStart:string){
    this._tradeTimeStart = _tradeTimeStart;
  }
  get tradeTimeEnd(){
    if(this._tradeTimeEnd == ''){
      return '';
    }
    return this.isEmpty(this._tradeTimeEnd) ? this.defTime(0,'YYYY-MM-DD 23:59:59') : this.format(this._tradeTimeEnd);
  }
  set tradeTimeEnd(_tradeTimeEnd:string){
    this._tradeTimeEnd = _tradeTimeEnd;
  }

  get refundTimeStart(){
    return  this.format(this._refundTimeStart);

  }
  set refundTimeStart(_refundTimeStart:string){
    this._refundTimeStart = _refundTimeStart;
  }

  get refundTimeEnd(){
    return this.format(this._refundTimeEnd);
  }
  set refundTimeEnd(_refundTimeEnd:string){
    this._refundTimeEnd = _refundTimeEnd;
  }
}
