import {BaseSearchForm} from "../base.search.form";

export class AccountTaskSearchForm extends BaseSearchForm{
  private _searchStartTime: string; //页面查询开始时间
  private _searchEndTime: string;   //页面查询结束时间
  // public searchStartTime: string; //页面查询开始时间
  // public searchEndTime: string;   //页面查询结束时间
  private _ally: string;            //对账账户号
  public _allyName: string;
  public treatState: string;      //对账状态

  get searchStartTime():string{
    return this.isEmpty(this._searchStartTime) ? this.defTime(-1,'YYYY-MM-DD') : this.format(this._searchStartTime,'YYYY-MM-DD');
  }
  set searchStartTime(_searchStartTime:string){
    this._searchStartTime = _searchStartTime;
  }

  get searchEndTime():string{
    if(this._searchEndTime == ''){
      return '';
    }
    return this.isEmpty(this._searchEndTime) ? this.defTime(-1,'YYYY-MM-DD') : this.format(this._searchEndTime,'YYYY-MM-DD');
  }
  set searchEndTime(_searchEndTime:string){
    this._searchEndTime = _searchEndTime;
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

  constructor() {
    super();
  }
}
