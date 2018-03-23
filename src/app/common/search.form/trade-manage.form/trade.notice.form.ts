import {BaseSearchForm} from "../base.search.form";
import {Database} from "../../components/table/table-extend-data-source";
/**
 * 交易通知查询表单字段
 * @author hsz
 * @date 2017-08-16
 */
export class TradeNoticeForm extends BaseSearchForm{
  public orderNo:string;//平台单号
  public outTradeNo:string;//商户单号
  public transactionId:string;//支付单号
  constructor(){
    super();
  }
}
