import {BaseModel} from "../base.model";
/**
 * 进件管理新增进件表单字段
 * @author hsz
 * @date 2017-08-24
 */
export class IntoPiecesAddModel extends BaseModel{
  public merchantId:number;
  public id:number ;
  public _id:number;//商户id号
  public name:string; //商户名
  public merchantNo:number; //商户号
  public merchantCode: string; //商户编号
  public transId: string; //支付类型
  public ptCenterId: number; //支付接口主键
  public centerId :number;//
  public agencyCode: string; //银行编码
  public orgNo:string;
  public providerNo: string; //渠道商编号（上游分配的服务商编号）
  constructor() {
    super();
  }
}
