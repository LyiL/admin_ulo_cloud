import {BaseModel} from "../base.model";
export class VersionAddManageModel extends BaseModel{
  /**
   * 版本管理新增列表字段
   * @author hsz
   * @date 2017-9-6
   */
  public id:string;
  public platform:string; //客户端编号
  public versionName:string; //版本名称
  public version:string;//版本号
  public versionRemark:string;//版本说明
}
