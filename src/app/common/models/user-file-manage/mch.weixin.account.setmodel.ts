import {BaseModel} from "../base.model";
/**
 * 商户列表新增表单字段
 * @author hsz
 * @date 2017-08-24
 */
export class MerchantWeixinAccountSet extends BaseModel{
    public mchId ;//商户ID
  public jsapiPath;  //授权目录
  public  subAppid ;//关联APPID
  public  subscribeAppid // 推荐关注APPID
  constructor() {
    super();
  }
}













