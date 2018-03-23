import {BaseSearchForm} from "../base.search.form";
/**
 * 商户列表查询表单字段
 * @author hsz
 * @date 2017-08-16 14:15
 */
export class SubmerchantListForm extends BaseSearchForm{
  public name: string;  //子商户名
  public merchantNo: string; //子商户编号
  public outerBatchId:string;//进件批次号（外部批次号）
  private _bankNo: string; //所属机构
  public _bankName:string;//所属机构名称
  public examState: number; //状态（审核状态）
  private _chanNo: string; //所属上级
  public _chanName: string; //所属上级
  // public ally: string; //识别码
  constructor() {
    super();
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
  get chanNo():string{
    return this._chanNo;
  }
  set chanNo(_chanNo:string){
    if(this.isEmpty(_chanNo)){
      this._chanName = '';
    }
    this._chanNo = _chanNo;
  }
}

