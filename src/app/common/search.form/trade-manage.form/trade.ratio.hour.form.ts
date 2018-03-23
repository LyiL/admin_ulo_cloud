import {BaseSearchForm} from "../base.search.form";

export class TradeRatioHourForm extends BaseSearchForm{
  get tradeTime():string{
    return this.isEmpty(this._tradeTime) ? this.defTime('YYYY-MM-DD') : this.format(this._tradeTime,'YYYY-MM-DD');
  }
  set tradeTime(_tradeTime:string){
    this._tradeTime = _tradeTime;
  }
  private  _tradeTime:string;       //统计时间    * 时间格式yyyy-MM-dd
  public merchantId:number;      //商户ID
  public bankNo:string;          //所属机构
  public agentno:string;         //所属渠道
  public _agentName:string;
  public _merchantName:string;
  public _bankName:string;

  constructor(){
    super("TradeRatioHourForm");
  }
}
