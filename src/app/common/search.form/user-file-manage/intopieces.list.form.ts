import {BaseSearchForm} from "../base.search.form";
/**
 * 进件列表查询表单字段
 * @author hsz
 * @date 2017-08-16
 */
export class IntoPiecesListForm extends BaseSearchForm{
  public name: string;  //商户名(筛选条件)
  public merchantNo: string; //商户编号(筛选条件)
  private _bankNo: string; //机构编码
  public _bankName:string;//机构编码名称
  public applyState: number; //进件状态(筛选条件)0:待进件、1:处理中、2:进件成功、3:进件失败、 4:被风控
  private _superior: string; //所属上级 — 对应“代理商编号”或“服务商编号”(筛选条件)
  public _superiorName:string;//所属上级名称
  constructor() {
    super();
  }
  get bankNo():string{
    return this._bankNo;
  }
  set bankNo(_bankNo:string){
    if(this.isEmpty(_bankNo)){
      this._bankName = '';
    }
    this._bankNo = _bankNo;
  }
  get superior():string{
    return this._superior;
  }
  set superior(_superior:string){
    if(this.isEmpty(_superior)){
      this._superiorName = '';
    }
    this._superior = _superior;
  }
}
