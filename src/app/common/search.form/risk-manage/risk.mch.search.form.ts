import {BaseSearchForm} from "../base.search.form";

export class RiskMchSearchForm extends BaseSearchForm{
  private _createStartTime: string; //  接收开始时间
  private _createEndTime: string;   //  接收结束时间
  public smid:string;               //  识别码
  // private _ally: string;            //对账账户号
  // public _allyName: string;
  public merchantName:string;       //  商户名称
  public merchantNo:string;         //  商户编号
  private _chanNo: string;          //  所属上级编号
  public _chanName: string;         //  所属上级名称
  public risktype: string;          //  风险类型
  public processCode:string;        //  处理结果

  get createStartTime():string{
    return this.isEmpty(this._createStartTime) ? this.defTime(0,'YYYY-MM-DD 00:00:00') : this.format(this._createStartTime);
  }
  set createStartTime(_createStartTime:string){
    this._createStartTime = _createStartTime;
  }

  get createEndTime():string{
    if(this._createEndTime == ''){
      return '';
    }
    return this.isEmpty(this._createEndTime) ? this.defTime(0,'YYYY-MM-DD 23:59:59') : this.format(this._createEndTime);
  }
  set createEndTime(_createEndTime:string){
    this._createEndTime = _createEndTime;
  }

  get chanNo():string{
    return this._chanNo;
  }
  set chanNo(_chanNo:string){
    if(this.isEmpty(_chanNo)){
      this._chanName = '';
    }
    this._chanNo = _chanNo;
  }

  constructor() {
    super();
  }
}
