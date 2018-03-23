import {BaseModel} from "../base.model";

export class CashManageModel extends BaseModel{
  public poolNo:string; //资金池编号
  public accountName:string; //账户名称
  public bankNo:string; //受理机构编号
  public bankName:string; //受理机构名称
  public singleProcsFee:string; //代付手续费
  public apiCode:string; //接口编号
  public poolType:number; //资金池类型
  public advanceProcsFee:number; //垫资手续费
}
