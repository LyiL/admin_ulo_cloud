import {BaseSearchForm} from "../base.search.form";

export class HitMoneySearchForm extends BaseSearchForm{
  // public createTime: string;    //创建日期
  private _createTime: string;    //创建日期
  public settleNo: number;      //打款批次号
  public actType: string;       //账户类型
  private _specNo: string;  //商户名称
  public _specName:string;
  private _ally: string;          //结算商户号
  public _allyName:string;
  private _agencyCode: string;    //受理机构编号
  public _agencyName:string;
  constructor() {
    super();
  }
  get specNo():string{
    return this._specNo;
  }
  set specNo(_specNo:string){
    if(this.isEmpty(_specNo)){
      this._specName = '';
    }
    this._specNo = _specNo;
  }

  get ally():string{
    return this._ally;
  }
  set ally(_ally:string){
    if(this.isEmpty(_ally)){
      this._allyName = '';
    }
    this._ally = _ally;
  }

  get agencyCode():string{
    return this._agencyCode;
  }
  set agencyCode(_agencyCode:string){
    if(this.isEmpty(_agencyCode)){
      this._agencyName = '';
    }
    this._agencyCode = _agencyCode;
  }

  get createTime():string{
    return this.isEmpty(this._createTime) ? this.defTime('YYYY-MM-DD') : this.format(this._createTime,'YYYY-MM-DD');
  }
  set createTime(_createTime:string){
    this._createTime = _createTime;
  }
}
