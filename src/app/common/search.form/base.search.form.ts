
import {CommonEnumConst} from "../services/impl/common.enum.const";
import {Database} from "../components/table/table-extend-data-source";
export class BaseSearchForm{

  public _reqModel:string = 'query';
  public _reqFormName:string = 'base_form';
  public size:number = 10;
  public page:number = 0;

  constructor(_reqFormName:string = 'base_form'){
    this._reqFormName = _reqFormName;
    this.initParams();
  }

  public doSearch(d:Database){
    this.page = 0;
    this._reqModel = 'query';
    d.params = this;
  }

  /**
   * 初始化当前FORM的参数
   */
  private initParams(){
    let queryParams:any = sessionStorage.getItem(CommonEnumConst.QUERY_PARAMS_STORAGE_KEY+'_'+this._reqFormName);
    if(queryParams){
      queryParams = JSON.parse(queryParams);
      for(let key in queryParams){
        let _val = queryParams[key];
        if(_val != undefined && !(_val instanceof Function)){
          this[key] = queryParams[key];
        }
      }
    }
  }

  /**
   * 数据格式化
   * @param val
   * @param format
   * @returns {any}
   */
  public format(val:any,format:string='YYYY-MM-DD HH:mm:ss'){
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
    if(val == null  || val === undefined || val == '' || val == 'null'){
      return true;
    }
    return false;
  }

  /**
   * 判断form是否为空
   * @returns {boolean}
   */
  public isDataEmpty():boolean{
    let fal:boolean = true;
    for(let key in this){
      if(this[key] != undefined){
        fal = false;
      }
    }
    return fal;
  }
}
