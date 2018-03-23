
import {Injectable} from "@angular/core";
import {InitDataAbsService} from "./init.data.abs.service";
import {Observable} from "rxjs/Observable";

@Injectable()
export abstract class HelpersAbsService{
  constructor(initData:InitDataAbsService,_locale: string){}
  /**
   * 字典翻译
   * @param key 字典KEY
   * @param val 翻译值
   * @param transField 翻译字段
   * @param transReturnField 翻译返回字段
   */
    abstract dictTrans(key:string,val:any, transField?:string, transReturnField?:string):any;

  /**
   * 通过字典KEY获取数据
   * @param key
   */
  abstract getDictByKey(key:string):any;

  /**
   * 获取领域中的值
   * @param key
   */
  abstract getDomainCfgVal(key:string):any;

  /**
   * 获取当前域ID
   */
  abstract domainId():number;

  /**
   * 获取系统应用ID
   */
  abstract appid():any;

  /**
   * 获取菜单信息
   */
  abstract menuData():any[];

  /**
   * 获取功能信息
   */
  abstract funcsData():any[];

  /**
   * 判断参数是否为空
   * @param param
   */
  abstract isEmpty(param:any):boolean;

  /**
   * 格式化函数
   * @param val 需要格式化的值
   * @param format 格式
   * @param type 格式类型（'datetime','price'）,默认为时间格式化
   */
  abstract format(val:any,format?:string,type?:string):any;

  /**
   * 获取数据源中的选定值
   * @param data 数据源
   * @param val 判断值
   * @param contrastKey 对比KEY
   * @param returnKey 返回KEY
   */
  abstract getSourceValue(data:Observable<any>,val:any,contrastKey:string, returnKey:string):any;

  /**
   * 过滤私有参数
   * @param data 数据源
   * @return 返回过滤后的数据
   */
  abstract filterPrivateParam(data:any):any;

  /**
   * 将后端数据处理为前端数据模式
   * @param data
   * @param fields
   */
  abstract toPrivateParam(data:any,fields:string[]):any;

  /**
   * 按钮权限判断
   * @param btnKey: string 按钮KEY，全局唯一
   * @return boolean 存在返回true,不存在返回 false
   */
  abstract btnRole(btnKey:string):boolean;

  /**
   * 金额格式化
   * @param str
   * @param number
   * @param string
   */
  abstract priceFormat(str:any,{limit:number,thousandsSeparator:string}?:any):string;

  /**
   * 分转元
   * @param val
   */
  abstract shuntElement(val:number):number;

  /**
   * 克隆数据
   * @param data 需要克隆的数据
   * @param filters 过滤字段
   */
  abstract clone(data:any,filters?:any[]):any;

  /**
   * 判断配置项是否匹配对应值
   * @param cfgKey  配置项key
   * @param val 匹配值
   * @return 匹配到返回true ,否 false
   */
  abstract hasConfigValueMatch(cfgKey:string,val:any):boolean;

  /**
   * 合并对象
   * @param s 合并源
   * @param t 合并目标
   * @param filters 过滤
   * @param mappingField 映射字段 {sKey:tKey,...}
   */
  abstract mergeObj(s:any,t:any,filters?:any[],mappingField?:any):any;

  /**
   * 剔除支付类型中括号与括号中的值
   * @param s 需要替换的目标
   * @param dict 替换的字典key值 [{id?:'',name:''},...]
   * @return {string}
   */
  abstract stringReplace(s:string,dictKey:Array<any>):string;
}
