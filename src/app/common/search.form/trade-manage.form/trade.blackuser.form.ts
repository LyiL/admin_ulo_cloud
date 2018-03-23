
import {BaseSearchForm} from "../base.search.form";
/**
 * 交易黑名单查询表单字段
 * @author zuoq
 * @date 2018-01-23
 */
export class TradeBlackuserForm extends BaseSearchForm{
  public openId:string;
  public appid:string;
  constructor(){
    super();
  }
}
