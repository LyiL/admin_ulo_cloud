import {BaseModel} from "../base.model";

export class ElectronicAccountListDistributionModel extends BaseModel{
  public accountNo:string; //电子账户ID
  public externalAccount:string; //账号
  public externalPassword:string; //密码
}
