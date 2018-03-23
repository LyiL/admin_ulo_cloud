import {
  Directive, ElementRef, Renderer2, OnInit, Input, OnDestroy, AfterViewInit, EventEmitter,
  Output
} from "@angular/core";
import {TimeIntervalMovedService} from "./moved.service";
import {Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";
import "rxjs/observable/timer";
import {HelpersAbsService} from "../../services/helpers.abs.service";

@Directive({
  selector:'[timeMoved]'
})
export class TimeIntervalMovedDirective implements AfterViewInit,OnDestroy{

  @Input("timeMoved")
  get equalParts():number{
    return this._equalParts;
  }
  set equalParts(equalParts:number){
    this._equalParts = equalParts;
  }
  private _equalParts:number=1;

  private movedSubscription:Subscription;
  private resetSubscription:Subscription;

  @Output()
  public movedChange:EventEmitter<any> = new EventEmitter();

  constructor(private el:ElementRef,private ran2:Renderer2,private movedService:TimeIntervalMovedService){}

  ngAfterViewInit(){
      this.movedSubscription = this.movedService.moveEvent.subscribe((res)=>{
        let _el = this.el.nativeElement;
        let pW = _el.parentNode.clientWidth;
        let eW = pW / (this._equalParts+1);
        this.ran2.setStyle(_el,'width', eW+'px');
        this.moved(res,_el,eW,pW);
      });

      this.resetSubscription = this.movedService.resetIntervalEvent.subscribe((res)=>{
        if(res === true){
          let _el = this.el.nativeElement;
          this.reset(_el);
        }
      });
  }

  ngOnDestroy(){
    if(this.movedSubscription){
      this.movedSubscription.unsubscribe();
    }
    if(this.resetSubscription){
      this.resetSubscription.unsubscribe();
    }
  }

  private moved(res:{before:boolean,after:boolean},el:any,eW:number,pW:number):void{
      let offsetLeft:number = 0;
      if(res.before){
        let beforeLeft = el.offsetLeft - eW;
        let lackPW = beforeLeft > eW;
        if(beforeLeft >= 0 && lackPW){
          offsetLeft = beforeLeft;
        }else{
          offsetLeft = 0;
        }
      }else if(res.after){
        let afterLeft = el.offsetLeft + eW;
        let lackPW = (pW - (afterLeft + eW)) > eW;
        if((afterLeft + eW) <= pW && lackPW){
          offsetLeft = afterLeft;
        }else{
          offsetLeft = pW - eW;
        }
      }

      this.ran2.setStyle(el,'left',offsetLeft+'px');
      this.movedChange.emit(res);
  }

  private reset(el:any){
    this.ran2.setStyle(el,'left','0px');
    this.movedChange.emit({before:true,after:false});
  }
}
