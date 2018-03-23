import {BaseSearchForm} from "../base.search.form";
/**
 * 开通产品表单
 */
export class OpenProductForm extends BaseSearchForm{
  public combName:string;  //产品名
  public userNo:string;    //商家编号
  public userName:string;  //商家名称
  public userType:number;  //商家类型
  public state:number;     //产品开通状态
  constructor() {
    super();
  }
}
