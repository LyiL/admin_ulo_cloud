import {BaseModel} from "../base.model";
export class RoleFunPermissionModel extends BaseModel{
  /**
   * 角色功能权限列表字段
   * @author hsz
   * @date 2017-9-5
   */
  public id:number;
  public appId:string;
  public nodeIds:Array<number> = new Array<any>();
}
