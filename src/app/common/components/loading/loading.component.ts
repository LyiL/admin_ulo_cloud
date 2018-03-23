import {Component, ChangeDetectorRef, ElementRef, Renderer2, OnInit} from "@angular/core";
import {LoadingService} from "./loading.service";
import "rxjs/add/observable/timer";
import "rxjs/add/operator/auditTime";
import {Subject} from "rxjs/Subject";
import {Observable} from "rxjs/Observable";

@Component({
  selector:'ulo-loading',
  templateUrl:'./loading.component.html',
  styleUrls:['./loading.scss']
})
export class LoadingComponent implements OnInit{

  private open$:Subject<any> = new Subject();

  constructor(private loadingService:LoadingService,private changeRef:ChangeDetectorRef,private el:ElementRef,private ren2:Renderer2){
    this.loadingService.loadingStatu.subscribe((res)=>{
      let addClass = res ? "show":"hide",
           rmClass = res ? "hide":"show",
           _el = el.nativeElement.lastElementChild;
      this.ren2.removeClass(_el,rmClass);
      this.ren2.addClass(_el,addClass);

      this.open$.next(res);
    });

    this.open$.auditTime(3000).subscribe(()=>{
      let _el = this.el.nativeElement.lastElementChild;
      if(_el.classList[_el.classList.length -1] == 'show'){
        Observable.timer(60 * 1000).subscribe(()=>{
          if(_el.classList[_el.classList.length -1] == 'show') {
            this.ren2.removeClass(_el, "show");
            this.ren2.addClass(_el, "hide");
          }
        });
      }
    });
  }

  ngOnInit(){
    let pEl = this.el.nativeElement.parentNode.parentNode;
    this.ren2.setStyle(pEl,'z-index','9999');
  }
}
