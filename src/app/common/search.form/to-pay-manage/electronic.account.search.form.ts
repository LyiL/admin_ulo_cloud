/**
 * Created by lenovo on 2017/8/8.
 */
import {BaseSearchForm} from "../base.search.form";

export class ElectronicAccountSearchForm extends BaseSearchForm{
  public accountName: string; //账户名称
  public useState: number;    //启用状态：0未启用,1启用
  private _organNo: string;     //所属商户编号
  public _organName:string;
  constructor() {
    super('electronic_account_search_form');
  }
  get organNo():string{
    return this._organNo;
  }
  set organNo(_organNo:string){
    if(this.isEmpty(_organNo)){
      this._organName = '';
    }
    this._organNo = _organNo;
  }
}
