import {BaseModel} from "../base.model";
/**
 * 商户列表新增表单字段
 * @author hsz
 * @date 2017-08-24
 */
export class MerchantAddModel extends BaseModel{
  shareRule:number;//分润规则，0否1是
  public chanNo:string; //所属上级
  public creator: string; //收银员(业务员)
  public linenceNo: string; //营业执照号
  public bankNo: string; //所属受理机构
  public bankName: string; //所属受理机构
  public name: string;//企业名
  public shortName:string    //商家简称
  public orgEmail: string; //公司邮箱
  public orgWebsite: string; //网站地址
  public province: string; //省份编码
  public provinceCode: string; //省份编码
  public city: string; //城市编码
  public cityCode: string; //城市编码
  public county: string; //区县编码
  public countyCode :string ;   //区县编码
  public provinceName: string; //省份名称
  public cityName: string; //城市名称
  public countyName: string; //区县名字
  public comAddress: string; //经营地址
  // address:string;  //经营地址
  public mchRole: number; //行业类型线上、线下
  public agentGroup: string; //行业类别实体、虚拟
  public categoryType: string; //行业名称
  public certificateType: string; //证件类型
  public customerPhone: string; //客服电话
  // private linenceTermStart: string; //证件有效期开始时间
  // private linenceTermEnd: string; //证件有效期结束时间
  public   categoryTypeGroup:number;
  private _linenceTermStart:string;  //证件有效期开始时间
  private _linenceTermEnd:string;  //证件有效期结束时间
//负责人信息
  public operator: string; //负责人
  public operatorIdno: string; //负责人身份证号码
  public contactsType: string; //负责人类型
  public operatorPhone: string; //负责人手机
  public operatorEmail: string; //负责人邮箱
//联系人信息
  public phone: string; //联系人电话
  public email: string; //联系人邮箱
  public linkman: string; //联系人
 // 附件信息
  public linenceImg: string; //营业执照图片
  public indentityImg: string; //身份证正面照
  public indentityBackImg: string; //身份证背面照片
  public bankCardImg: string; //银行卡照片
  public orgAccountImg: string; //开户许可证或企业结算账户照片
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
  constructor() {
    super();
  }
}













