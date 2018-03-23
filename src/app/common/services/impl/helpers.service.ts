import {Injectable} from "@angular/core";
import {HelpersAbsService} from "../helpers.abs.service";
import {InitDataAbsService} from "../init.data.abs.service";
import {DateFormatter} from "./intl";
import {Observable} from "rxjs/Observable";
import {CommonEnumConst} from "./common.enum.const";
import {MdDateFormats} from "@angular/material";

@Injectable()
export class HelpersService extends HelpersAbsService{

  constructor(private initDataService:InitDataAbsService,private _locale: string){
    super(initDataService, _locale);
  }

  dictTrans(key: string, val: any, transField?:string,transReturnField?:string): any {
    let _transValue = '';
    transField = transField ? transField : 'id';
    transReturnField = transReturnField ? transReturnField : 'name';
    this.initDataService.systemConfigSubject.subscribe(res=>{
      if(res){
        let keyDict = res[key];
        if(keyDict && (keyDict instanceof Array)){
          keyDict.forEach((item)=>{
              if(item[transField] == val){
                _transValue = item[transReturnField];
              }
            });
        }
      }
    });
    return _transValue;
  }

  getDictByKey(key: string): any {
    let dict:any;
    this.initDataService.systemConfigSubject.subscribe(res=>{
      if(res){
        dict = res[key];
      }
    });
    return dict;
  }

  getDomainCfgVal(key:string):any{
    let domainCfgVal:any;
    this.initDataService.domainCfgSubject.subscribe(res=>{
      if(res && res[key]){
        domainCfgVal = res[key]['confContent'];
      }
    });
    return domainCfgVal;
  }

  domainId(): number {
    let domainCfgVal:any;
    this.initDataService.domainCfgSubject.subscribe(res=>{
      if(res){
        domainCfgVal = res['DOMAIN_ID'];
      }
    });
    return domainCfgVal;
  }

  appid():any{
    return this.getDomainCfgVal('APPID');
  }

  menuData():any[]{
    if(this.initDataService.menuData && this.initDataService.menuData.length == 0){
      let _trees = sessionStorage.getItem(CommonEnumConst.INIT_DATA_SESSION_STORAGE_KEY.TREES);
      if(!this.isEmpty(_trees)){
        return JSON.parse(_trees);
      }
      return [];
    }
    return this.initDataService.menuData;
  }

  funcsData():any[]{
    if(this.initDataService.funcData && this.initDataService.funcData.length == 0){
      let _func = sessionStorage.getItem(CommonEnumConst.INIT_DATA_SESSION_STORAGE_KEY.FUNCS);
      if(!this.isEmpty(_func)){
        return JSON.parse(_func);
      }
      return [];
    }
    return this.initDataService.funcData;
  }

  isEmpty(param:any):boolean{
    if(param === '' || param == undefined || param == null || param == 'null'){
      return true;
    }
    return false;
  }

  clone(obj:any,filters?:any[]):any{
    let o:any;
    if (typeof obj == "object") {
      if (obj === null) {
        o = null;
      } else {
        if (obj instanceof Array) {
          o = [];
          for (var i = 0, len = obj.length; i < len; i++) {
            o.push(this.clone(obj[i]));
          }
        } else {
          o = {};
          for (var j in obj) {
            if(filters && filters.findIndex((filter)=>{return filter == j;}) != -1){
              continue;
            }
            o[j] = this.clone(obj[j]);
          }
        }
      }
    } else {
      o = obj;
    }
    return o;
  }

  format(val:any,format:string = 'yyyy-MM-dd HH:mm:ss',type:string='datetime'):any{
    if(this.isEmpty(val)){
      return ' / ';
    }
    let _val = '';
    if(type == 'datetime'){
      _val = DateFormatter.format(val,this._locale,format);
    }
    return _val;
  }

  /**
   * 获取数据源中的选定值
   * @param data 数据源
   * @param val 判断值
   * @param contrastKey 对比KEY
   * @param returnKey 返回KEY
   */
  getSourceValue(data:Observable<any>,val:any,contrastKey:string, returnKey:string):any{
    let setVal:any;
    data.subscribe(res=>{
      if(res && res.length > 0){
        res.find((optVal:any,ind:number)=>{
          if(optVal[contrastKey] == val){
            setVal = optVal[returnKey];
            return true;
          }
          return false;
        });
      }
    });
    return setVal;
  }

  filterPrivateParam(data:any){
    let newData:any = {};
    for(let key in data){
      if(key.indexOf('_') == -1){
        newData[key] = data[key];
      }
    }
    return newData;
  }

  toPrivateParam(data:any,fields:string[]):any{
    for(let key in data){
      let ind = fields && fields.findIndex((item)=>{return item == key;});
      if(ind != -1){
        data['_'+key] = data[key];
        delete data[key];
      }
    }
    return this.clone(data);
  }

  btnRole(btnKey:string):boolean{
    let _funcDatas = this.funcsData();
    if(_funcDatas && _funcDatas[btnKey]){
      return true;
    }
    return false;
  }

  priceFormat(str:any,{limit=2,thousandsSeparator=","} = {}):string{
    let newStr = String(str).replace(/\d+(?:\.\d+)*/g,function(price){
      var arr=price.split('.');
      if(arr.length>2){
        return price;
      }
      arr[0]=arr[0].replace(/(\d{1,3})(?=(\d{3})+$)/g, '$1'+thousandsSeparator);
      if(arr[1] && arr[1].length > limit){
        arr[1]=(""+Number("0."+arr[1]).toFixed(limit)).substring(2);
      }
      return arr.join('.');
    });
    return newStr.indexOf('-') != -1 && Number(newStr) == 0 ? newStr.substring(1) : newStr;
  }

  shuntElement(val:number):number{
    if(this.isEmpty(val)){
      return val;
    }
    return (val * 100) / (100 * 100);
  }

  hasConfigValueMatch(cfgKey:string,val:any):boolean{
    let _cfgVal = this.getDictByKey(cfgKey);
    if(_cfgVal && typeof _cfgVal === 'string'){
      let _cfgVals = _cfgVal.split(',');
      if(_cfgVals.findIndex((item)=>{return item == val}) != -1){
        return true;
      }
    }
    return false;
  }

  mergeObj(s:any,t:any,filters?:any[],mappingField?:any):any{
    for(let key in t){
      if(this.has(t,key) && !this.isEmpty(t[key]) && ((filters && filters.findIndex((item)=>{return item == key;}) == -1) || !filters)){
        if(mappingField && this.has(mappingField,key)){//如果存在需要映射的key，将其调整，否则取原始key
          let tKey = mappingField[key];
          s[tKey] = t[key];
        }else{
          s[key] = t[key];
        }
      }
    }
    return s;
  }

  private has(obj,key):boolean{
    return Object.prototype.hasOwnProperty.call(obj,key);
  }

  stringReplace(s:string,dict:Array<any>):string{
    let _mchTypeNames:Array<string> = [];
    dict && dict.forEach((item)=>{
      _mchTypeNames.push(item['name']);
    });
    _mchTypeNames.forEach((name)=>{
      s = s.replace('('+name+')','');
    });
    return s;
  }

}


export const DATE_FORMATS_YMD: MdDateFormats = {
  parse: {
    dateInput: null,
  },
  display: {
    dateInput: {year: 'numeric', month: 'numeric', day: 'numeric'},
    monthYearLabel: {year: 'numeric', month: 'short'},
    dateA11yLabel: {year: 'numeric', month: 'long', day: 'numeric'},
    monthYearA11yLabel: {year: 'numeric', month: 'long'},
  }
};
