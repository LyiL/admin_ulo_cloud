import {BaseModel} from "../base.model";

export class RefundStrategyModel extends BaseModel{
  public id: string; //主键
  public merchantNo: string; //商户编号
  public name: string; //商户名称（添加）
  public transId: string; //支付类型，对应service的交易接口
  public transType: string; //支付类型名称
  public refundDayRange: number; //支持退款天数范围,0表示当天退款
  public dayRefundCount: number; //当日退款笔数限制
  public singleRefundFee: number; //单笔退款金额限制
  public dayRefundFee: number; //当日退款金额限制
  public useState: number; //启用状态，0未启用，1启用
  constructor() {
    super();
  }
}
