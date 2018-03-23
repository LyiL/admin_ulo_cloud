import {BaseSearchForm} from "../base.search.form";

export class ResourcePoolNumberForm extends BaseSearchForm{
  public mchNo: string;       //商户编号
  public subPartner: string;        //交易识别码
  public bankMchno: string;      //银行商户号
  constructor(){
    super();
  }
}
