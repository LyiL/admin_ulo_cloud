/**
 * Created by lenovo on 2017/8/8.
 */
import {BaseSearchForm} from "../base.search.form";

export class CashManageSearchForm extends BaseSearchForm{
  public accountName: string;  //账户名称
  public useState: number;     //启用状态
  private _bankNo: string;       //受理机构编号
  public _bankName: string;
  constructor() {
    super('cash_manage_search_form');
  }
  get bankNo():string{
    return this._bankNo;
  }
  set bankNo(_bankNo:string){
    if(this.isEmpty(_bankNo)){
      this._bankName = '';
    }
    this._bankNo = _bankNo;
  }
}
