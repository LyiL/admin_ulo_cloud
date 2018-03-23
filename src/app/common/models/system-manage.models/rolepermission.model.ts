import {BaseModel} from "../base.model";
export class RolePermissionModel extends BaseModel{
  /**
   * 角色菜单权限列表字段
   * @author hsz
   * @date 2017-9-5
   */
  public id:number;
  public roleId:string;//角色主键
  public appId:string;//领域id
  public organNo:string;//组织机构编号
  public subAppid:string;//子应用编码
  public parentRoleId:number;//组织机构编号
  public nodeIds:Array<number> = new Array<any>();
}

export class RoleGroupPerModel extends BaseModel{
  public id:number;
  public appId:string;
  public nodeIds:Array<number> = new Array<any>();
  public organNo:string;


}
