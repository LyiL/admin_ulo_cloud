import {Component, Inject, EventEmitter, OnDestroy} from "@angular/core";
import {Column} from "../table-extend-config";
import {DOCUMENT} from "@angular/common";
import {MdDialogRef, MD_DIALOG_DATA} from "@angular/material";
import {Observable} from "rxjs/Observable";
import {Subscription} from "rxjs";

@Component({
  selector:'ulo-table-edit-win',
  templateUrl:'table-edit-win.html',
  styleUrls:['table-edit-win.scss'],
  host:{
    'class':'table_edit_win'
  }
})
export class MdTableEditWin implements OnDestroy{
  private columns:Array<Column>;
  private confirmFn:Function;
  private _rowData:any;
  public rows:Array<Array<Column>> = [];
  get rowData():any{
    return this._rowData;
  }
  set rowData(_rowData:any){
    this._rowData = _rowData;
    this.rowDataChange.emit(_rowData);
  }
  rowDataChange:EventEmitter<any> = new EventEmitter();
  private subscription:Subscription;

  constructor(private tableRef:MdDialogRef<MdTableEditWin>,
              @Inject(MD_DIALOG_DATA) public data: any,
              @Inject(DOCUMENT) public _doc:any){
    this.columns = data.columns;
    this.rowData = data.rowData;
    this.confirmFn = data.confirm;
    //将列转为行
    let tmpArr:Array<Column> = [];
    this.columns.forEach((val,index)=>{
      if(((index + 1) % 2) == 0 || index == this.columns.length - 1){
        tmpArr.push(val);
        this.rows.push(tmpArr);
        tmpArr = [];
      }else{
        tmpArr.push(val);
      }
    });
  }

  public onSubmit(){
    if(this.confirmFn){
      let confirmFnRes = this.confirmFn(this.rowData,true);
      if(confirmFnRes === false){
        return false;
      }
      if(confirmFnRes instanceof Observable){
        this.subscription = confirmFnRes.subscribe((res)=>{
          if(res !== undefined){
            this.tableRef.close(this.rowData);
          }
        });
      }else if(confirmFnRes === true){
        this.tableRef.close(this.rowData);
      }
    }

  }

  public onCancel(){
    this.tableRef.close();
  }

  ngOnDestroy(){
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }
}
