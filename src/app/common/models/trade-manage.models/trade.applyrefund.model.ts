import {BaseModel} from "../base.model";
export class TradeApplyRefundModel extends BaseModel{
  /**
   * 申请退款表单字段
   * @author hsz
   * @date 2017-8-11
   */
  public orderNo :string;//订单单号
  public merchantNo  :string; //商户编号
  public refundFee  :number;//退款总额
  public mchRefuseReason    :string; //商户退款理由
}
