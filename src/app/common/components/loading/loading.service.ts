import {Subject, Observable} from "rxjs";
import "rxjs/add/observable/timer"
export class LoadingService{
  loadingStatu:Subject<boolean> = new Subject<boolean>();
  constructor(){}
  show(){
      Observable.timer(10).subscribe(()=>{
        this.loadingStatu.next(true);
      });
  }

  hide(){
      Observable.timer(10).subscribe(()=> {
        this.loadingStatu.next(false);
      });
  }
}
