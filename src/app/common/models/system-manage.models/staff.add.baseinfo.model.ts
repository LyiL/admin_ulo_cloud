import {BaseModel} from "../base.model";
export class StaffAddBaseInfoModel extends BaseModel{
  /**
   * 新增员工字段
   * @author hsz
   * @date 2017-9-7
   */
  public id:number;
  public userName:string;
  public userPwd:string;
  public realName:string;
  public phone:number;
  public deptName:string;
}
