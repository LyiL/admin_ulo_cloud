import {BaseSearchForm} from "../base.search.form";
/**
 * 交易列表订单号查询表单字段
 * @author hsz
 * @date 2017-08-16
 */
export class TradeOrderQueryForm extends BaseSearchForm{
  public orderNo:string;//平台单号
  public outTradeNo:string;//商户单号
  public transactionId:string;//支付单号
  public bankTypeNo:string;//付款单号
  public refundNo: string; // 退款单号
  constructor(){
    super();
  }
}
