import {Subject} from "rxjs/Subject";
import {MdTableExtendContainer} from "./table-extend-container";
import {Observable} from "rxjs/Observable";
import {OverlayRef} from "@angular/material";

export class MDTableRef<T>{
  /** Subject for notifying the user that the dialog has finished closing. */
  private _afterClosed: Subject<any> = new Subject();

  componentInstance: T;

  constructor(private _overlayRef: OverlayRef, private tableContainer:MdTableExtendContainer){}

  public close(res?:any):void{
    this._afterClosed.next(res);
    this._afterClosed.complete();
    this.tableContainer.stateChange.next('exit');
    this._overlayRef.dispose();
    this.componentInstance = null!;
  }

  public afterClosed(): Observable<any> {
    return this._afterClosed.asObservable();
  }
}
