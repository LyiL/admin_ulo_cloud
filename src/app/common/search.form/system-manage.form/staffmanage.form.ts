import {BaseSearchForm} from "../base.search.form";
export class StaffManageForm extends BaseSearchForm{
  public userName:string;//用户名、唯一
  public realName:string;//真实姓名
  public isEnabled:number; //是否启用

  constructor(){
    super();
  }
}
