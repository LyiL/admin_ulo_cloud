import {BaseModel} from "../base.model";

export class ElectronicAccountListTakeCashModel extends BaseModel{
  public accountNo:string; //电子账户ID
  public accountId:string; //账户信息
  public organNo:string; //所属商户编号
  public organName: string;//所属商户编号名称（添加）
  public productType:string;  //产品类型
  public bankCity:string;  //收款银行所在城市
  public extractPrice:number;  //提现金额
}
