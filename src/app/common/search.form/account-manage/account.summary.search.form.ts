import {BaseSearchForm} from "../base.search.form";

export class AccountSummarySearchForm extends BaseSearchForm{
  // public billTimeStart: string; //开始日期
  // public billTimeEnd: string;   //结束日期
  private _billTimeStart: string; //开始日期
  private _billTimeEnd: string;   //结束日期
  private _ally: string;          //结算账户
  public _allyName: string;
  public reconState: number;    //对账状态
  public transId: string;       //支付类型
  private _centerId: number;      //支付中心
  public _centerName: string;
  private _agencyCode: string;    //银行编码
  public _agencyName: string;

  get billTimeStart():string{
    return this.isEmpty(this._billTimeStart) ? this.defTime(-1,'YYYY-MM-DD') : this.format(this._billTimeStart,'YYYY-MM-DD');
  }
  set billTimeStart(_billTimeStart:string){
    this._billTimeStart = _billTimeStart;
  }

  get billTimeEnd():string{
    if(this._billTimeEnd == ''){
      return '';
    }
    return this.isEmpty(this._billTimeEnd) ? this.defTime(-1,'YYYY-MM-DD') : this.format(this._billTimeEnd,'YYYY-MM-DD');
  }
  set billTimeEnd(_billTimeEnd:string){
    this._billTimeEnd = _billTimeEnd;
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

  get centerId(): number {
    return this._centerId;
  }
  set centerId(_centerId: number) {
    if (this.isEmpty(_centerId)) {
      this._centerName = '';
    }
    this._centerId = _centerId;
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

  constructor() {
    super();
  }
}
