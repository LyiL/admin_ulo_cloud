import {BaseSearchForm} from "../base.search.form";

export class BussinessAccountCheckSearchForm extends BaseSearchForm{
  // public startAt: string;     //对账开始日期
  // public finishAt: string;    //对账结束日期
  private _startAt: string;     //对账开始日期
  private _finishAt: string;    //对账结束日期
  private _ally: string;        //结算账户
  public _allyName: string;
  public reconState: number;  //对账状态
  private _merchantNo: string;  //商户编号
  public _merchantName: string;
  private _agencyCode: string;  //受理机构
  public _agencyName: string;
  public transId: string;     //支付类型
  private _centerId: number;    //支付中心
  public _centerName: string;
  private _secondMchNo: string; //下属门店
  public _secondMchName: string;

  get startAt():string{
    return this.isEmpty(this._startAt) ? this.defTime(-1,'YYYY-MM-DD') : this.format(this._startAt,'YYYY-MM-DD');
  }
  set startAt(_startAt:string){
    this._startAt = _startAt;
  }

  get finishAt():string{
    if(this._finishAt == ''){
      return '';
    }
    return this.isEmpty(this._finishAt) ? this.defTime(-1,'YYYY-MM-DD') : this.format(this._finishAt,'YYYY-MM-DD');
  }
  set finishAt(_finishAt:string){
    this._finishAt = _finishAt;
  }

  get ally(): string {
    return this._ally;
  }
  set ally(_ally: string) {
    if (this.isEmpty(_ally)) {
      this._allyName = '';
    }
    this._ally = _ally;
  }

  get merchantNo(): string {
    return this._merchantNo;
  }
  set merchantNo(_merchantNo: string) {
    if (this.isEmpty(_merchantNo)) {
      this._merchantName = '';
    }
    this._merchantNo = _merchantNo;
  }

  get agencyCode(): string {
    return this._agencyCode;
  }
  set agencyCode(_agencyCode: string) {
    if (this.isEmpty(_agencyCode)) {
      this._agencyName = '';
    }
    this._agencyCode = _agencyCode;
  }

  get centerId(): number {
    return this._centerId;
  }
  set centerId(_centerId: number) {
    if (this.isEmpty(_centerId)) {
      this._centerName = '';
    }
    this._centerId = _centerId;
  }

  get secondMchNo(): string {
    return this._secondMchNo;
  }
  set secondMchNo(_secondMchNo: string) {
    if (this.isEmpty(_secondMchNo)) {
      this._secondMchName = '';
    }
    this._secondMchNo = _secondMchNo;
  }

  constructor() {
    super();
  }
}
