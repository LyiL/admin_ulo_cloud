import {BaseSearchForm} from "../base.search.form";
export class LoginLogForm extends BaseSearchForm{
  /**
   * 登陆日志表单字段
   * @author hsz
   * @date 2017-09-5
   */
  public userName:string;  //用户名
  private _loginTime:string; //开始时间
  private _loginTimeAt:string; //结束时间
  constructor(){
    super();
  }
  get loginTime(){
    return this.isEmpty(this._loginTime) ? this.defTime(0,'YYYY-MM-DD 00:00:00') : this.format(this._loginTime);
  }
  set loginTime(_loginTime:string){
    this._loginTime = _loginTime;
  }
  get loginTimeAt(){
    if(this._loginTimeAt == ''){
      return '';
    }
    return this.isEmpty(this._loginTimeAt) ? this.defTime(0,'YYYY-MM-DD 23:59:59') : this.format(this._loginTimeAt);
  }
  set loginTimeAt(_loginTimeAt:string){
    this._loginTimeAt = _loginTimeAt;
  }

}

