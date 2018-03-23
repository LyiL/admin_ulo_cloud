import {Component, Output, EventEmitter, Inject} from "@angular/core";
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/of";
import {MdDialogRef, MD_DIALOG_DATA, MdTabChangeEvent} from "@angular/material";
@Component({
  selector:'ulo-sub-container',
  template:`
    <md-tab-group [(selectedIndex)]="selectedIndex" (selectChange)="onSelectChangeHendler($event)">
      <md-tab *ngFor="let tab of tabs | async;let ind=index;let len=length;" label="{{tab.label}}">
        <div class="sub-count">{{tab.label}}总计数：{{tab.count}}</div>
        <md-table-extend [columns]="tab.columns" [actionCfg]="actionCfg" [database]="tab.database"></md-table-extend>
      </md-tab>
    </md-tab-group>
  `,
  styles:[`
    md-tab-group{
      margin:0 20px;
    }
    .sub-count{
      height: 30px;
      line-height: 30px;
    }
  `]
})
export class UloSubContainer{
  get selectedIndex():number{
    return this._selectedIndex;
  }
  set selectedIndex(_selectedIndex:number){
    this._selectedIndex = _selectedIndex;
  }
  private _selectedIndex:number = 0;

  get tabs():Observable<any>{
    return this._tabs;
  }
  set tabs(_tabs:Observable<any>){
    this._tabs = _tabs;
  }
  private _tabs:Observable<any>;

  private actionCfg:any = {
    hide:true
  };

  @Output()
  onSelectChange:EventEmitter<any> = new EventEmitter<any>();

  constructor(private dialog: MdDialogRef<UloSubContainer>,@Inject(MD_DIALOG_DATA) public data: any){
    if(data){
      this.selectedIndex = data.selectedIndex;
      this.tabs = Observable.of(data.tabs);
      if(data.onSelectionChange){
        this.onSelectChange = data.onSelectionChange;
      }
    }
  }

  public onSelectChangeHendler(e:MdTabChangeEvent){
    if(this.onSelectChange){
      this.onSelectChange.emit(e);
    }
  }
}
