import {BaseSearchForm} from "../base.search.form";
/**
 * 服务商查询表单
 */
export class ResourcePoolListForm extends BaseSearchForm{
  private _startDate : string; //页面查询开始时间
  private _endDate : string;   // 页面查询结束时间
  public mchNo: string;       //商户编号
  public chanNo: string;        //服务商/渠道编号
  public bankMchno: string      //银行商户号
  public partner: string;       //微信受理机构号
  public subPartner: string;    //微信交易识别码
  public chanPartner: string;  //微信渠道编号
  public tradeType: string;    //支付类型
  public tradeId: string;
  public payState: number;    //支付权限
  public useState: number;    //启用状态
  public startSuRate: number; //开始成功率
  public endSuRate: string;    //结束成功率
  constructor(){
    super();
  }
  get startDate():string{
    return this.isEmpty(this._startDate) ? this.defTime(0,'YYYY-MM-DD') : this.format(this._startDate,'YYYY-MM-DD');
  }
  set startDate(_startDate:string){
    this._startDate = _startDate;
  }

  get endDate():string{
    if(this._endDate == ''){
      return '';
    }
    return this.isEmpty(this._endDate) ? this.defTime(0,'YYYY-MM-DD') : this.format(this._endDate,'YYYY-MM-DD');
  }
  set endDate(_endDate:string){
    this._endDate = _endDate;
  }
}
