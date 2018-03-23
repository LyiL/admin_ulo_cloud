import {AuthAbsService} from "../auth.abs.service";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {HttpService} from "./http.service";
import {InitDataAbsService} from "../init.data.abs.service";
import {CommonEnumConst} from "./common.enum.const";
@Injectable()
export class AuthService extends AuthAbsService{

  constructor(private http:HttpService,private initDataService:InitDataAbsService){
    super();
  }

  login(param: any,callbak:Function): Observable<any> {
    return this.http.post('/loginAuth/login',param).map((res)=>{
      if(res && res['status'] == 200){
          sessionStorage.setItem(CommonEnumConst.AUTH_SESSION_STORAGE_KEY.USER_INFO,JSON.stringify(res['data']));
          this.loadMenuData().subscribe(menuRes=>{
            if(menuRes && menuRes['status'] == 200 && menuRes['data']){
              let data = menuRes['data'];
              let _trees = data['trees'];
              let _funcs = data['funcs'];
              this.initDataService.menuDataSubject.next(_trees);
              this.initDataService.funcDataSubject.next(_funcs);
              if(!this.isEmpty(_trees)){
                sessionStorage.setItem(CommonEnumConst.INIT_DATA_SESSION_STORAGE_KEY.TREES,JSON.stringify(_trees));
              }
              if(!this.isEmpty(_funcs)){
                sessionStorage.setItem(CommonEnumConst.INIT_DATA_SESSION_STORAGE_KEY.FUNCS,JSON.stringify(_funcs));
              }
              if(callbak){
                callbak();
              }
            }
          });
      }
      return res;
    });
  }

  isEmpty(param:any):boolean{
    if(param === '' || param == undefined || param == null || param == 'null'){
      return true;
    }
    return false;
  }

  getUserInfo(): any {
    let curUserInfo = sessionStorage.getItem(CommonEnumConst.AUTH_SESSION_STORAGE_KEY.USER_INFO);
    if(curUserInfo){
      return JSON.parse(curUserInfo);
    }
    return null;
  }

  quit(): any {
    return this.http.post('/loginAuth/loginOut').map(res=>{
      let keys:Array<any> = [];
      if(res && res['status'] == 200){
        for(let i=0,key = undefined; i<sessionStorage.length; i++){
           key = sessionStorage.key(i);
           if((key != CommonEnumConst.INIT_DATA_SESSION_STORAGE_KEY.DOMAIN_CFG && key != CommonEnumConst.INIT_DATA_SESSION_STORAGE_KEY.SYSTEM_CFG)){
              keys.push(key);
           }
        }
        keys.forEach((key)=>{
          sessionStorage.removeItem(key);
        });
      }
      return res;
    });
  }

  /**
   * 获取菜单信息
   * @returns {Observable<R>}
   */
  private loadMenuData(): Observable<any> {
    return this.http.post('/loginAuth/getTree');
  }

}
