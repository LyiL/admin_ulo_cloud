import {BaseSearchForm} from "../base.search.form";

export class ToPayTradeSearchOrderForm extends BaseSearchForm{
  public transNo: string;      //代付单号
  public outTradeNo: string;   //商户单号
  constructor() {
    super();
  }
}
