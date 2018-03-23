import {BaseSearchForm} from "../base.search.form";

export class AccountErrorSearchForm extends BaseSearchForm{
  // public checkTimeStart: string;  //开始日期
  // public checkTimeEnd: string;    //结束日期
  private _checkTimeStart: string;  //开始日期
  private _checkTimeEnd: string;    //结束日期
  private _partner: string;         //结算账户
  public _partnerName: string;
  public handleState: number;     //处理状态
  public orderNo: string;         //平台单号
  public transactionId: string;   //第三方订单号
  public refundNo: string;        //退款单号
  public refundId: string;        //第三方退款单号

  get checkTimeStart():string{
    return this.isEmpty(this._checkTimeStart) ? this.defTime(-1,'YYYY-MM-DD') : this.format(this._checkTimeStart,'YYYY-MM-DD');
  }
  set checkTimeStart(_checkTimeStart:string){
    this._checkTimeStart = _checkTimeStart;
  }

  get checkTimeEnd():string{
    if(this._checkTimeEnd == ''){
      return '';
    }
    return this.isEmpty(this._checkTimeEnd) ? this.defTime(-1,'YYYY-MM-DD') : this.format(this._checkTimeEnd,'YYYY-MM-DD');
  }
  set checkTimeEnd(_checkTimeEnd:string){
    this._checkTimeEnd = _checkTimeEnd;
  }

  get partner(): string {
    return this._partner;
  }
  set partner(_partner: string) {
    if (this.isEmpty(_partner)) {
      this._partnerName = '';
    }
    this._partner = _partner;
  }

  constructor() {
    super();
  }
}
