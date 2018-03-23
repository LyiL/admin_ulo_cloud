import {BaseModel} from "../base.model";
/**
 * 服务商基础类型
 */
export class spChannelModel extends BaseModel{
  merchantId:string; // 服务商编号
  transId:string;// 支付类型编码 *
  transType: string; // 支付类型名称 *
  agencyCode:string;  // 所属银行 *
  agencyName:string; // 所属银行名称
  ptCenterId:string;  // 通道类型 *
  providerNo:string;  // 渠道编号
  thirdMchId:string;  //  第三方平台商户号
  pcmPartkey:string;  // 第三方平台商户号密钥
  used:string;  // 启用状态 *
  limitDay:number;  //  单日限额
  limitSingle:number;  //  单笔限额最大值
  limitSingleMin:number; // 单笔限额最小值
  thirdAppid:string;  //  商户APPID
  settleCycle:string;  //  结算周期
  settleRate:number;// 结算费率

  constructor() {
    super();
  }
}
