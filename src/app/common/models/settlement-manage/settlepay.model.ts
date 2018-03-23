/**
 * Created by lenovo on 2017/8/11.
 */
import {BaseModel} from "../base.model";

export class settlePayModel extends BaseModel{
  public settleTitle:string; //打款标题*
  public agencyCode:string;
  public beginTime:string;
  public endTime:string;
  public ally:string;
  public remark :string ; //总体备注
  public cashType:number;
  public merchantNo:string;
  public canalNo:string;//渠道编号
  public transId:string;
  public chanProNo:string; //服务商
}
