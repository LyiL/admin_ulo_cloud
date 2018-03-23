import {BaseSearchForm} from "../base.search.form";
export class OperationLogForm extends BaseSearchForm{
  /**
   * 操作日志表单字段
   * @author hsz
   * @date 2017-9-5
   */
  public userName:string; //用户名
  private _createdTime:string;//开始时间
  private _lastCreated:string;//结束时间
  constructor(){
    super();
  }
  get createdTime(){
    return this.isEmpty(this._createdTime) ? this.defTime(0,'YYYY-MM-DD 00:00:00') : this.format(this._createdTime);
  }
  set createdTime(_createdTime:string){
    this._createdTime = _createdTime;
  }
  get lastCreated(){
    if(this._lastCreated == ''){
      return '';
    }
    return this.isEmpty(this._lastCreated) ? this.defTime(0,'YYYY-MM-DD 23:59:59') : this.format(this._lastCreated);
  }
  set lastCreated(_lastCreated:string){
    this._lastCreated = _lastCreated;
  }
}
