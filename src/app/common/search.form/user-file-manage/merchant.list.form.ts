import {BaseSearchForm} from "../base.search.form";
/**
 * 商户列表查询表单字段
 * @author hsz
 * @date 2017-08-16 14:15
 */
export class MerchantListForm extends BaseSearchForm{
  public name: string;  //商户名
  public merchantNo: string; //商户编号
  public outerBatchId:string;//进件批次号
  private _bankNo: string; //所属机构
  public _bankName:string;//所属机构名称
  public examState: number; //状态
  private _chanNo: string; //所属上级
  public _chanName: string; //所属上级
  public ally: string; //识别码
  private _centerId:number;//通道
  public _centerName:string;// 通道名称
  public tradeAuth:number;//支付权限 0:无权限 1:正常
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
  get centerId():number{
    return this._centerId;
  }
  set centerId(_centerId:number){
    if(this.isEmpty(_centerId)){
      this._centerName = '';
    }
    this._centerId = _centerId;
  }
}

