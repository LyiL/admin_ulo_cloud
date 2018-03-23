import {BaseSearchForm} from "../base.search.form";
/**
 * 商户排名查询表单字段
 * @author hsz
 * @date 2017-08-16
 */
export class TradeRankingForm extends BaseSearchForm{
  // public billTime:string;//日结时间
  private _billTime:string;
  constructor(){
    super();
  }
  get billTime():string{
    return this.isEmpty(this._billTime) ? this.defTime(-1,'YYYY-MM-DD') : this.format(this._billTime,'YYYY-MM-DD');
  }
  set billTime(_billTime:string){
    this._billTime = _billTime;
  }
}
