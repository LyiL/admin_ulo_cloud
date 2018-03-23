import {BaseSearchForm} from "../base.search.form";
/**
 * 服务商查询表单
 */
export class ServiceProviderForm extends BaseSearchForm{
  private _bankCode: string;       //受理机构编号
  public _bankName:string;
  public name:string //服务商名称
  public chanCode:string; //服务商编号
  public examState:number; //用户状态
  private _parentChanCode:string;//所属上级编号
  public _parentChanName:string;//所属上级
  constructor(){
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
