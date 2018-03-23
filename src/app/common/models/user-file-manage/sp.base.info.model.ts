import {BaseModel} from "../base.model";
/**
 * 服务商基础类型
 */
export class SPBaseInfoModel extends BaseModel{
  id:number;//服务商ID
  name:string;  //企业名称
  bankCode:string;  // 所属银行 (更新时不可编辑)
  bankName:string;  // 所属银行 (添加)
  shortName:string;  //  企业简称
  orgEmail:string;  //企业邮箱
  orgWebsite:string;  //企业网站
  province:string;  //  省份编码
  provinceName:string;  //  省份名称
  provinceAdCode:string; // 省份国际码
  city:string;  //  城市编码
  cityName:string;  //  城市名称
  cityAdCode:string;//城市国际码
  county:string;  //区县编码
  countyName:string;  //区县名称
  countyAdCode:string;//区县国际码
  address:string;  //经营地址
  certificateType:string;  //商户证件类型
  linenceNo:string;  //商户证件号码
  private _linenceTermStart:string;  //证件有效期开始时间
  private _linenceTermEnd:string;  //证件有效期结束时间
  categoryTypeGroup:number;
  categoryType:string;  //所属行业
  customerPhone:string;  //客服电话
  salesmanNo:string;  //所属业务员
  operator:string;  //  负责人姓名
  operatorIdno:string;  //负责人身份证号码
  operatorPhone:string;  //负责人手机
  operatorEmail:string;  //负责人邮箱
  contactsType:string;  //负责人类型
  linkman:string;  //联系人姓名
  phone:string;  //联系人手机
  email:string;  //联系人邮箱
  linenceImg:string;  //营业执照
  orgAccountImg:string;  //开户许可证
  indentityImg:string;  //身份证正面
  indentityBackImg:string;  //身份证背面
  bankCardImg:string;  //银行卡照片
  parentChanCode:string;  // 所属上级编号
  shareRule:number;//分润规则，0否1是
  settleStyle:number; //结算方式

  constructor() {
    super();
  }

  get linenceTermStart():string{
    return this.format(this._linenceTermStart,'YYYY-MM-DD');
  }
  set linenceTermStart(_linenceTermStart:string){
    this._linenceTermStart = _linenceTermStart;
  }

  get linenceTermEnd():string{
    return this.format(this._linenceTermEnd,'YYYY-MM-DD');
  }
  set linenceTermEnd(_linenceTermEnd:string){
    this._linenceTermEnd = _linenceTermEnd;
  }
}
