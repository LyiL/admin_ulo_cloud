/**
 * Created by lenovo on 2017/8/8.
 */
import {BaseSearchForm} from "../base.search.form";

export class ElectronicAccountAccountdetailSearchForm extends BaseSearchForm{
  public accountNo: string;  //电子账户ID
  // public startDate: number;  //交易开始时间
  // public endDate: number;    //交易结束时间
  private _startDate:string;  //交易开始时间
  private _endDate:string;  //交易结束时间
  private _mchNo: string;      //商户编号
  public _mchName: string;
  public incash: number;     //记账类型
  constructor() {
    super('electronic_account_detail_search_form');
  }
  get mchNo():string{
    return this._mchNo;
  }
  set mchNo(_mchNo:string){
    if(this.isEmpty(_mchNo)){
      this._mchName = '';
    }
    this._mchNo = _mchNo;
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
