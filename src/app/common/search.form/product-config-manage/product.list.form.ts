import {BaseSearchForm} from "../base.search.form";
/**
 * 产品列表查询表单
 * @author lh
 * @date 2017-08-15 11:06
 */
export class ProductListForm extends BaseSearchForm{
  public combName:string;       //产品名
  public productType:number;    //产品类型
  public applyType:string;      //适用商户(0.服务商 1.代理商 2.商户)
  public defaultUsed:number     //是否默认开通(0:否 1:是)
  public productState:number;   //产品状态
  private _bankNo:string;          //银行编号
  public _bankName:string;
  constructor(){
    super()
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
