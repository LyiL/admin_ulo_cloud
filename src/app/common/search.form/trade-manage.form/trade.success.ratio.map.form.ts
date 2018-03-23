import {BaseSearchForm} from "../base.search.form";
export class TradeSuccessRatioMapForm extends BaseSearchForm{
  _tradeTimeStart:string;  //统计开始时间    * 时间格式yyyy-MM-dd
  _tradeTimeEnd:string;    //统计结束时间    * 时间格式yyyy-MM-dd
  private _merchantId:number;      //商户编号
  public _merchantName: string; // 商户名称
  transId:string;         //支付类型
  private _bankNo:string;//所属机构
  public _bankName: string; // 所属机构名称
  private _agentno:string;//所属渠道
  public _agentName: string; // 所属渠道名称

  
  get agentno():string {
    return this._agentno;
  }

  set agentno(_agentno: string) {
    if(this.isEmpty(_agentno)){
      this._agentName = '';
    }
    this._agentno = _agentno;
  }

  get bankNo():string {
    return this._bankNo;
  }

  set bankNo(_bankNo: string) {
    if(this.isEmpty(_bankNo)){
      this._bankName = '';
    }
    this._bankNo = _bankNo;
  }

  get merchantId():number {
    return this._merchantId;
  }

  set merchantId(_merchantId: number) {
    if(this.isEmpty(_merchantId)){
      this._merchantName = '';
    }
    this._merchantId = _merchantId;
  }

  get tradeTimeStart(){
    return this.isEmpty(this._tradeTimeStart) ? this.defTime(-7,'YYYY-MM-DD') : this.format(this._tradeTimeStart,'YYYY-MM-DD');
  }
  set tradeTimeStart(_tradeTimeStart:string){
    this._tradeTimeStart = _tradeTimeStart;
  }

  get tradeTimeEnd(){
    return  this.isEmpty(this._tradeTimeEnd) ? this.defTime('YYYY-MM-DD') : this.format(this._tradeTimeEnd,'YYYY-MM-DD');
  }
  set tradeTimeEnd(_tradeTimeEnd:string){
    this._tradeTimeEnd = _tradeTimeEnd;
  }
}
