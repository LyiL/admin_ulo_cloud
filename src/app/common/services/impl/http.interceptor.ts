import {Injectable} from "@angular/core";
import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {Router} from "@angular/router";
import {MdSnackBar} from "@angular/material";
import 'rxjs/add/observable/timer';
import {LoadingService} from "../../components/loading/loading.service";
import {CommonEnumConst} from "./common.enum.const";

@Injectable()
export class UHttpInterceptor implements HttpInterceptor{

  constructor(private router:Router,private snackBar:MdSnackBar,private loadingService:LoadingService){}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).map(event=>{
      if (event instanceof HttpResponse) {
        let status = event.body && event.body.status;
        if ((''+status).startsWith('6')) {
          let m = status == 600 ? '验证失败' : (status == 601 ? '用户身份验证失败':'用户未经授权');
          this.snackBar.alert(m);
          this.loadingService.hide();
          Observable.timer(2200).subscribe({
            complete:(function(){
              let keys:Array<any> = [];
              for(let i=0,key = undefined; i<sessionStorage.length; i++){
                key = sessionStorage.key(i);
                if((key != CommonEnumConst.INIT_DATA_SESSION_STORAGE_KEY.DOMAIN_CFG && key != CommonEnumConst.INIT_DATA_SESSION_STORAGE_KEY.SYSTEM_CFG)){
                  keys.push(key);
                }
              }
              keys.forEach((key)=>{
                sessionStorage.removeItem(key);
              });
              this.router.navigate(['/login']);
            }).bind(this)
          });
        }
      }
      return event;
    });
  }

}
