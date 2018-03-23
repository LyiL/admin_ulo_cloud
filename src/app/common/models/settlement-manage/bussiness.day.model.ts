/**
 * Created by lenovo on 2017/8/11.
 */
import {BaseModel} from "../base.model";

export class BussinessDayModel extends BaseModel{
  public createTime: number; //创建日期
  public settleNo: number; //打款批次号
  public actType: string; //账户类型
  public merchantName: string; //商户名称
  public ally: string; //结算商户号
  public agencyCode: string; //受理机构编号
}
