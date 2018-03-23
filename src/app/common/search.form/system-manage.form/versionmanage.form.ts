import {BaseSearchForm} from "../base.search.form";
export class VersionManageForm extends BaseSearchForm{
  public platform:string; //客户端编号
  public version:string; //版本号


  constructor(){
    super();
  }
}
