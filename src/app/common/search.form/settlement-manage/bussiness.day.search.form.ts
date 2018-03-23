import {BaseSearchForm} from "../base.search.form";

export class BussinessDaySearchForm extends BaseSearchForm{
  public searchType: string;    //查询类型
  private _beginTime: string;
  private _endTime: string;
  // public beginTime: string;     //开始时间
  // public endTime: string;       //结束时间
  private _merchantNo: string;
  public _merchantName:string;
  private _ally: string;          //结算账户
  public _allyName: string;
  private _centerId: number;      //支付中心
  public _centerName: string;
  public transId: string;       //支付类型
  private _agencyCode: string;    //受理机构
  public _agencyName: string;
  public cashState: string;     //付款状态
  public cashCycle: string;     //结算周期
  private _agentno: string;       //渠道名称
  public _agentName: string;
  private _chanProNo: string;       //服务商
  public _chanProName: string;
  constructor() {
    super();
  }
  get beginTime():string{
    return this.isEmpty(this._beginTime) ? this.defTime('YYYY-MM-DD') : this.format(this._beginTime,'YYYY-MM-DD');
  }
  set beginTime(_beginTime:string){
    this._beginTime = _beginTime;
  }

  get endTime():string{
    if(this._endTime == ''){
      return '';
    }
    return this.isEmpty(this._endTime) ? this.defTime('YYYY-MM-DD') : this.format(this._endTime,'YYYY-MM-DD');
  }
  set endTime(_endTime:string){
    this._endTime = _endTime;
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

  get agentno(): string {
    return this._agentno;
  }
  set agentno(_agentno: string) {
    if (this.isEmpty(_agentno)) {
      this._agentName = '';
    }
    this._agentno = _agentno;
  }

  get chanProNo(): string {
    return this._chanProNo;
  }
  set chanProNo(_chanProNo: string) {
    if (this.isEmpty(_chanProNo)) {
      this._chanProName = '';
    }
    this._chanProNo = _chanProNo;
  }
}
