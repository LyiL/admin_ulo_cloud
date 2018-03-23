/**
 * @Class 基础模型类
 */
export class BaseModel{

  /**
   * 数据格式化
   * @param val
   * @param format
   * @returns {any}
   */
  protected  format(val:any,format:string='YYYY-MM-DD HH:mm:ss'){
    if(val == undefined || val == '' || val == null || val == 'null'){
      return val;
    }
    return moment(val).format(format);
  }

  /**
   * 设置默认值
   * @param day | format 如果取当前时间，可以直接转入所需格式
   * @param format 时间格式
   * @returns {any|string}
   */
  protected defTime(day?:number | string,format:string = 'YYYY-MM-DD HH:mm:ss'){
    let _moment = moment();
    if(day){
      if(typeof day == 'number'){
        _moment.add(day,'days');
      }else if(typeof day == 'string'){
        format = day;
      }
    }
    return _moment.format(format);
  }

  /**
   * 判断是否为空
   * @param val
   * @returns {boolean}
   */
  protected isEmpty(val:any){
    if(val == null  || val == undefined || val == '' || val == 'null'){
      return true;
    }
    return false;
  }

  /**
   * 重置model数据
   * @param vals
   */
  public resetValue(vals:any){
    for(let key in vals){
      if(this.has(vals,key)){
        this[key] = vals[key];
      }
    }
  }

  private has(obj,key){
    return Object.prototype.hasOwnProperty.call(obj,key);
  }
}
