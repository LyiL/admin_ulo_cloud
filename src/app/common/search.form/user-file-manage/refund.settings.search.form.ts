import {BaseSearchForm} from "../base.search.form";

export class RefundSettingsSearchForm extends BaseSearchForm{
  public name: string;       //商户名称
  public merchantNo: string; //商户编号
  constructor() {
    super('refund_setting_search_form');
  }
}
