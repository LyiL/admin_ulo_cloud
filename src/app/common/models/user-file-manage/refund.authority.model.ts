import {BaseModel} from "../base.model";

export class RefundAuthorityModel extends BaseModel{
  public authId: string; //退款权限主键   修改时必传
  public merchantNo: string; //商户编号
  public name: string; //商户名称（添加）
  public transId: string; //支付类型，对应service的交易接口
  public transType: string; //支付类型名称
  public refundAuth: string; //退款权限 使用’,’分割
  public examType: string; //审核类型,大概值为：商户审核，平台审核
  public isEnabled: number; //使用状态（添加）
  constructor() {
    super();
  }
}
