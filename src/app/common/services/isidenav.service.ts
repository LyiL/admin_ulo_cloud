import {BehaviorSubject, Observable, Subject} from "rxjs";
import {SidenavItem} from "../models/sidenav.item.model";
import {Router} from "@angular/router";
/**
 *
 */
export abstract class ISidenavSrvice{
  _itemsSubject: BehaviorSubject<SidenavItem[]>;
  _items: SidenavItem[];
  items$: Observable<SidenavItem[]>;
  _funcsSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  get funcs():any[] {return this._funcsSubject.getValue();};
  _currentlyOpenSubject: BehaviorSubject<SidenavItem[]>;
  _currentlyOpen: SidenavItem[];
  statuSubject:Subject<any>;//菜单状态
  headNav:Array<any> = new Array<any>();//导航栏信息
  STATUS:any = {
    "INIT_FINISH":"init_finish",
    "INIT_HEADNAV":"init_headNav",
    "APPEND_HEADNAV":"append_headNav"
  };

  HEAD_NAV_SESSION_STORAGE_KEY:string = "head_nav";
  NAV_PARAMS_SESSION_STORAGE_KEY:string = "nav_param";

  addItem(name: string, icon: string, route: string, position: number, badge?: string, badgeColor?: string):any{};

  addSubItem(parent: SidenavItem, name: string, route: string, position: number):any{};

  isOpen(item: SidenavItem):any{};

  getByUrl(url:string):any{}

  toggleCurrentlyOpen(item: SidenavItem){};

  getAllParents(item: SidenavItem, currentlyOpen: SidenavItem[] = []){};

  getCurrentMenu():any{}

  initHeadNav():void{}

  appendHeadNav():void{}

  onNavigate(url:string,title:string,params?:any,isRemove?:boolean){}

  onMenuNavigate(url:string,params?:any[]){}

  getPageParams(pageUrl?:string){}

  resetPageParams(params:any){}
}
