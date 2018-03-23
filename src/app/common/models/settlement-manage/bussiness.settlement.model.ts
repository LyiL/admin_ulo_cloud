/**
 * Created by lenovo on 2017/8/11.
 */
import {BaseModel} from "../base.model";

export class BussinessSettlementModel extends BaseModel{
  public remark: string; //总体备注
  public settleTitle: string; //打款标题
  public agencyCode:string;// 受理机构
  public beginTime:string;//开始时间
  public endTime:string;//结束时间
  public ally:string;//结算账户
  public searchType:string;//查询类型：1--按结算日期查询  2--按交易日期查询
}
