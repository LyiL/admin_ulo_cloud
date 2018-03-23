import { BaseModel } from '../base.model';
export class SpWeixinModel extends BaseModel {
  /**
   * 新增业务员表单字段
   * @author hux
   */
  public id: number; // 服务商公众号信息id
  public chanCode: string; // 服务商编号
  public subAppid: string; // 关联公众号appid
  public jsapiPath: string; // 支付授权目录
  public subscribeAppid: string; // 推荐关注公众号APPID

  constructor() {
    super();
  }
}
