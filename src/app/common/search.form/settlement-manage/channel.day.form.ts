import {BaseSearchForm} from "../base.search.form";
export class ChannelDayForm extends BaseSearchForm{
  public cashType:number;
  private  _ally:string;
  public _allyName:string;
  // public billTimeStart:string;
  // public billTimeEnd:string;
  private _billTimeStart:string; //清算开始时间
  private _billTimeEnd:string; //清算结束时间
  private _merchantNo:string;
  public _merchantName:string;
  private _canalNo:string;//渠道编号
  public  _canalName:string;//渠道名称
  public transId:string;
  private _agencyCode:string;
  public _agencyName:string;
  private _chanProNo: string;       //服务商
  public _chanProName: string;
  constructor(){
    super();
  }
  get merchantNo():string{
    return this._merchantNo;
  }
  set merchantNo(_merchantNo:string){
    if(this.isEmpty(_merchantNo)){
      this._merchantName = '';
    }
    this._merchantNo = _merchantNo;
  }
  get canalNo():string{
    return this._canalNo;
  }
  set canalNo(_canalNo:string){
    if(this.isEmpty(_canalNo)){
      this._canalName = '';
    }
    this._canalNo = _canalNo;
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
  get ally():string{
    return this._ally;
  }
  set ally(_ally:string){
    if(this.isEmpty(_ally)){
      this._allyName = '';
    }
    this._ally = _ally;
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

  get billTimeStart(){
    return this.isEmpty(this._billTimeStart) ? this.defTime('YYYY-MM-DD') : this.format(this._billTimeStart,'YYYY-MM-DD');
  }
  set billTimeStart(_billTimeStart:string){
    this._billTimeStart = _billTimeStart;
  }
  get billTimeEnd(){
    if(this._billTimeEnd == ''){
      return '';
    }
    return this.isEmpty(this._billTimeEnd) ? this.defTime('YYYY-MM-DD') : this.format(this._billTimeEnd,'YYYY-MM-DD');
  }
  set billTimeEnd(_billTimeEnd:string){
    this._billTimeEnd = _billTimeEnd;
  }


}
