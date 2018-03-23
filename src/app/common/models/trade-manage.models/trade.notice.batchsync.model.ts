import {BaseModel} from "../base.model";
export class TradeNoticeBatchSyncModel extends BaseModel{
  /**
   * 批量同步表单字段
   * @author hsz
   * @date 2017-8-11
   */
  private _tradeTimeStart  :string;//交易开始时间
  private _tradeTimeEnd  :string;//交易结束时间
  public mchNo  :string;//商户编号
  public orderStatus   :string;//订单状态
  constructor(){
    super();
  }

  get tradeTimeStart(){
    return this.isEmpty(this._tradeTimeStart) ? this.defTime(0,'YYYY-MM-DD 00:00:00') : this.format(this._tradeTimeStart);
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





}
