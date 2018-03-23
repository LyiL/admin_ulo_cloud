import {BaseModel} from "../base.model";

export class ResourcePoolAddModel extends BaseModel{
  public id:number;
  public mchNo: string; //商户编号
  public chanNo: string; //服务商编号
  public bankMchno: string; //银行侧商户编号
  public partner: string; //微信受理机构号
  public subPartner: string; //微信交易识别码
  public chanPartner: string; //微信渠道编号
  public tradeId: string; //支付类型
  public tradeType: string; //支付类型
  public payState: number; //支付权限
  public useState: number; //启用状态，0未启用，1启用
  constructor() {
    super();
  }
}
