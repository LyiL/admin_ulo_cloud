import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
@Injectable()
export abstract class AuthAbsService{
  /**
   * 登录
    */
  abstract login(param:any,callbak:Function):Observable<any>;

  /**
   * 获取用户信息
   */
  abstract getUserInfo():any;

  /**
   * 退出
   */
  abstract quit():any;
}
