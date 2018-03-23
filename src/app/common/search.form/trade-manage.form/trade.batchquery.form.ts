import {BaseSearchForm} from "../base.search.form";
/**
 * 交易列表批量查询表单字段
 * @author hsz
 * @date 2017-08-16 14:15
 */
export class TradeBatchQueryForm extends BaseSearchForm{
  private _tradeTimeStart:string;//开始时间
  private _tradeTimeEnd:string;//结束时间
  private _merchantNo:number;//商户编号
  public _merchantNoName: string; // 商户编号名称
  private _agentno:string;// 所属渠道
  public _agentnoName: string; // 所属渠道名称
  private _bankNo:number;//受理机构
  public _bankNoName: string; // 受理机构名称
  public tradeState:number;//交易状态
  private _secondMchNo:string;//下属门店
  public _secondMchNoName: string; // 下属门店名称
  private _centerId:number;//支付中心
  public _centerName:string;// 支付名称
  public transId:string;//支付类型
  constructor(){
    super();
  }

  get secondMchNo():string {
    return this._secondMchNo;
  }

  set secondMchNo(_secondMchNo: string) {
    if(this.isEmpty(_secondMchNo)){
      this._secondMchNoName = '';
    }
    this._secondMchNo = _secondMchNo;
  }

  get merchantNo():number {
    return this._merchantNo;
  }

  set merchantNo(_merchantNo) {
    if(this.isEmpty(_merchantNo)){
      this._merchantNoName = '';
    }
    this._merchantNo = _merchantNo;
  }

  get agentno():string {
    return this._agentno;
  }

  set agentno(_agentno: string) {
    if(this.isEmpty(_agentno)){
      this._agentnoName = '';
    }
    this._agentno = _agentno;
  }

  get bankNo():number {
    return this._bankNo;
  }

  set bankNo(_bankNo: number) {
    if(this.isEmpty(_bankNo)) {
      this._bankNoName = '';
    }
    this._bankNo = _bankNo;
  }

  get centerId():number{
    return this._centerId;
  }
  set centerId(_centerId:number){
    if(this.isEmpty(_centerId)){
      this._centerName = '';
    }
    this._centerId = _centerId;
  }

  get tradeTimeStart():string{
    return this.isEmpty(this._tradeTimeStart) ? this.defTime(0,'YYYY-MM-DD 00:00:00') : this.format(this._tradeTimeStart);
  }
  set tradeTimeStart(_tradeTimeStart:string){
    this._tradeTimeStart = _tradeTimeStart;
  }
  get tradeTimeEnd():string{
    if(this._tradeTimeEnd == ''){
      return '';
    }
    return this.isEmpty(this._tradeTimeEnd) ? this.defTime(0,'YYYY-MM-DD 23:59:59') : this.format(this._tradeTimeEnd);
  }
  set tradeTimeEnd(_tradeTimeEnd:string){
    this._tradeTimeEnd = _tradeTimeEnd;
  }
}
