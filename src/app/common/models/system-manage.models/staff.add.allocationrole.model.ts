import {BaseModel} from "../base.model";
export class StaffAllocationRoleModel extends BaseModel{
  /**
   * 分配角色字段
   * @author hsz
   * @date 2017-9-7
   */
  public userName:string;
  public id:number;
  public roleIds:Array<number> = new Array<any>();
}
