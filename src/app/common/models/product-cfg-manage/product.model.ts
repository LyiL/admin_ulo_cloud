import {BaseModel} from "../base.model";
/**
 * 产品模型
 */
export class ProductModel extends BaseModel{
  public combName:string;      //产品名
  public productType:number;   //产品类型
  public applyType:string;     //适用商户(0.服务商 1.代理商 2.商户)
  public defaultUsed:number = 0;   //是否默认开通(0:否 1:是) 暂未使用
  public productState:number;  //产品状态
  public bankNo:string;          //银行编号
  public productDepicts:string; //产品描述
}
