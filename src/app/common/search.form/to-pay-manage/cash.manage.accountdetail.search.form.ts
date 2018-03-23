/**
 * Created by lenovo on 2017/8/8.
 */
import {BaseSearchForm} from "../base.search.form";

export class CashManageAccountdetailSearchForm extends BaseSearchForm{
  public poolNo: string;     //资金池编号
  // public startDate: number;  //交易开始时间
  // public endDate: number;    //交易结束时间
  private _startDate:string;  //交易开始时间
  private _endDate:string;  //交易结束时间
  constructor() {
    super('cash_manage_detail_search_form');
  }
  get startDate():string{
    return this.isEmpty(this._startDate) ? this.defTime(-6,'YYYY-MM-DD 00:00:00') : this.format(this._startDate);
  }
  set startDate(_startDate:string){
    this._startDate = _startDate;
  }

  get endDate():string{
    if(this._endDate == ''){
      return '';
    }
    return this.isEmpty(this._endDate) ? this.defTime(0,'YYYY-MM-DD 23:59:59') : this.format(this._endDate);
  }
  set endDate(_endDate:string){
    this._endDate = _endDate;
  }
}
