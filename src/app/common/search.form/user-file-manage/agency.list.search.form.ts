import {BaseSearchForm} from "../base.search.form";

export class AgencyListSearchForm extends BaseSearchForm{
  public name: string;           //代理商名称
  public chanCode: string;       //代理商编号
  private _bankCode: string;       //代理商所属机构
  public _bankName:string;
  public examState: number;      //代理商审核状态
  private _parentChanCode: string; //上级代理商编号
  public _parentChanName: string; //上级代理商名称（添加）
  public appCode:string;         //代理类型
  constructor() {
    super();
  }
  get bankCode():string{
    return this._bankCode;
  }
  set bankCode(_bankCode:string){
    if(this.isEmpty(_bankCode)){
      this._bankName = '';
    }
    this._bankCode = _bankCode;
  }

  get parentChanCode():string{
    return this._parentChanCode;
  }
  set parentChanCode(_parentChanCode:string){
    if(this.isEmpty(_parentChanCode)){
      this._parentChanName = '';
    }
    this._parentChanCode = _parentChanCode;
  }


}
