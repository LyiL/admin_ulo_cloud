import {BaseSearchForm} from "../base.search.form";
/**
 * 交易比率查询表单字段
 * @author hsz
 * @date 2017-08-16
 */
export class TradeRatioForm extends BaseSearchForm{

  private _statisticTime:string;// 统计时间    * 时间格式yyyy-MM-dd
  private _merchantId:string;//商户编号
  public _merchantName: string; // 商户名称
  private _agentno:string;//所属渠道编号
  public _agentName:string;//所属渠道编号
  public transId:string;//支付类型
  constructor(){
    super();
  }

  get merchantId():string {
    return this._merchantId;
  }

  set merchantId(_merchantId: string) {
    if(this.isEmpty(_merchantId)){
      this._merchantName = '';
    }
    this._merchantId = _merchantId;
  }
  get agentno():string {
    return this._agentno;
  }

  set agentno(_agentno: string) {
    if(this.isEmpty(_agentno)){
      this._agentName = '';
    }
    this._agentno = _agentno;
  }

  get statisticTime():string{
    return this.isEmpty(this._statisticTime) ? this.defTime(-1,'YYYY-MM-DD') : this.format(this._statisticTime,'YYYY-MM-DD');
  }
  set statisticTime(_statisticTime:string){
    this._statisticTime = _statisticTime;
  }

}
