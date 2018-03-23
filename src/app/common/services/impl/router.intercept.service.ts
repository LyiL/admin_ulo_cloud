import {Injectable} from "@angular/core";
import {CanActivateChild, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {AuthAbsService} from "../auth.abs.service";
import {HelpersAbsService} from "../helpers.abs.service";
import {MdSnackBar} from "@angular/material";

@Injectable()
export class RouterInterceptService implements CanActivate, CanActivateChild{
  constructor(private autoService:AuthAbsService,private helper:HelpersAbsService,private snackBar:MdSnackBar){
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|Promise<boolean>|boolean {
    if(this.autoService.getUserInfo() == null){
      return false;
    }
    return true;
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|Promise<boolean>|boolean {
    if(this.autoService.getUserInfo() == null){
      return false;
    }

    if(!this.checkRouterAuth(state)){
      this.snackBar.alert('您没有权限访问此功能！');
      return false;
    }
    return true;
  }

  /**
   * 交验路由地址
   * @param state
   */
  private checkRouterAuth(state: RouterStateSnapshot){
    const _menuData:Array<any> = this.helper.menuData();
    const _funcsData:Array<any> = this.helper.funcsData();
    let _url:string = state.url;
    let flag:boolean = false;
    //先检查菜单路由是否存在
    _menuData.forEach((menu)=>{
      if(menu.path == _url) {
        flag = true;
        return;
      }
      menu.childrens && menu.childrens.forEach((cMenu)=>{
        if(cMenu.path == _url){
          flag = true;
        }
      });
    });

    //在检查按钮路由是否存在
    for(let key in _funcsData){
      if(_funcsData[key] != '-' && _funcsData[key] == _url){
        flag = true;
      }
    }
    return flag;
  }

}
