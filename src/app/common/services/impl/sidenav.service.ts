import {Injectable} from "@angular/core";
import {SidenavItem} from "../../models/sidenav.item.model";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {ISidenavSrvice} from "../isidenav.service";
import {Router} from "@angular/router";

@Injectable()
export class SidenavService extends ISidenavSrvice{

  _itemsSubject: BehaviorSubject<SidenavItem[]> = new BehaviorSubject<SidenavItem[]>([]);
  _items: SidenavItem[] = [];
  items$: Observable<SidenavItem[]> = this._itemsSubject.asObservable();
  _currentlyOpenSubject: BehaviorSubject<SidenavItem[]> = new BehaviorSubject<SidenavItem[]>([]);
  _currentlyOpen: SidenavItem[] = [];
  currentlyOpen$: Observable<SidenavItem[]> = this._currentlyOpenSubject.asObservable();
  statuSubject:Subject<any> = new Subject<any>();

  getHeadNav(){
    if(!this.headNav || this.headNav && this.headNav.length <= 0){
      let tmp = sessionStorage.getItem(this.HEAD_NAV_SESSION_STORAGE_KEY);
      if(tmp){
        return JSON.parse(tmp);
      }
    }else{
      return this.headNav;
    }
  }

  constructor(private _router:Router) {
    super();
  }

  addItem(name: string, icon: string, route: string, position: number, badge?: string, badgeColor?: string):SidenavItem {
    let item = new SidenavItem({
      name: name,
      iconClass: icon,
      route: route,
      subItems: [],
      position: position || 99,
      badge: badge || null,
      badgeColor: badgeColor || null
    });

    this._items.push(item);
    this._itemsSubject.next(this._items);

    return item;
  }

  addSubItem(parent: SidenavItem, name: string, route: string, position: number) {
    let item = new SidenavItem({
      name: name,
      route: route,
      parent: parent,
      subItems: [],
      position: position || 99
    });

    parent.subItems.push(item);
    this._itemsSubject.next(this._items);

    return item;
  }

  isOpen(item: SidenavItem) {
    return (this._currentlyOpen.indexOf(item) != -1);
  }

  /**
   * 通过url获取菜单项
   * @param url
   * @returns {any}
   */
  getByUrl(url:string){
    if(this._items && this._items.length <= 0){
      return null;
    }
    let _itemIndex:number = -1;
    let _itemSubIndex:number = -1;
    this._items.forEach((item,index)=>{
      if(item.route == url){
        _itemIndex = index;
      }
      if(item.subItems && item.subItems.length > 0){
        item.subItems.forEach((subItem,subIndex)=>{
          if(subItem.route == url){
            _itemIndex = index;
            _itemSubIndex = subIndex;
          }
        });
      }
    });

    if(_itemIndex != -1 && _itemSubIndex != -1){
      return this._items[_itemIndex]['subItems'][_itemSubIndex];
    }else if(_itemIndex != -1 && _itemSubIndex == -1){
      return this._items[_itemIndex];
    }else{
      return null;
    }
  }

  /**
   * 判断菜单数据是否一致
   * @param data
   * @returns {boolean}
   */
  hasNewMenu(data:Array<any>){
    if(!this._items || (this._items && this._items.length == 0)){
      return false;
    }
    let flag:boolean = true;
    this._items.forEach((item)=>{
      if(item.route && !data.find((source)=>{return source['path'] == item.route && source['name'] == item.name})){
        flag = false;
      }
      if(item.subItems){
        item.subItems.forEach((subItem)=>{
          if(subItem.route && !data.find((source)=>{return source['path'] == subItem.route && source['name'] == subItem.name})){
            flag = false;
          }
        });
      }
    });
    return flag;
  }

  /**
   * 打开对应菜单项
   * @param item
   */
  toggleCurrentlyOpen(item: SidenavItem) {
    let currentlyOpen = this._currentlyOpen;
    if (!this.isOpen(item)) {
    //   if (currentlyOpen.length > 1) {
    //     console.log('--->',_.clone(currentlyOpen.length),_.clone(this._currentlyOpen.indexOf(item)));
    //     currentlyOpen.length = this._currentlyOpen.indexOf(item);
    //   } else {
    //     currentlyOpen = [];
    //   }
    // } else {
      currentlyOpen = this.getAllParents(item);
    }
    this._currentlyOpen = currentlyOpen;
    this._currentlyOpenSubject.next(currentlyOpen);
  }

  getAllParents(item: SidenavItem, currentlyOpen: SidenavItem[] = []) {
    currentlyOpen.unshift(item);
    if (item && item.hasParent()) {
      return this.getAllParents(item.parent, currentlyOpen);
    } else {
      return currentlyOpen;
    }
  }

  getCurrentMenu(): any{
      let curNav:any[] = [];
      if(this._currentlyOpen && this._currentlyOpen.length > 0){
        this._currentlyOpen.forEach((item)=>{
          if(item){
            curNav.push({name:item.name,path:item.route});
            if(item.subItems && item.subItems.length > 0){
              item.subItems.forEach((item)=>{
                if(item.selected && this._currentlyOpen.findIndex((curItem)=>{return item.route == curItem.route}) == -1){
                  curNav.push({name:item.name,path:item.route});
                }
              });
            }
          }
        });
      }
      return curNav;
  }

  /**
   * 初始化导航栏
   */
  initHeadNav():void{
    sessionStorage.removeItem(this.HEAD_NAV_SESSION_STORAGE_KEY);
    this.headNav = this.getCurrentMenu();
    this.statuSubject.next(this.STATUS.INIT_HEADNAV);
    sessionStorage.setItem(this.HEAD_NAV_SESSION_STORAGE_KEY,JSON.stringify(this.headNav));
  }

  /**
   * 追加导航栏
   */
  appendHeadNav(nav:{name:string,path:string}={name:"",path:""},isRemove:boolean = false):void{
    if(!this.headNav ||(this.headNav && this.headNav.length <= 0)){
      return;
    }
    let curHeadNavInd = this.headNav.findIndex((item:any)=>{
      if(item.path == nav.path){
        return true;
      }
      return false;
    });

    if(curHeadNavInd > -1){
      if(isRemove){
        this.headNav.splice(curHeadNavInd + 1, (this.headNav.length - 1 - curHeadNavInd));
      }
    }else{
      if(isRemove){
        this.headNav.splice(_.clone(this.headNav).length - 1,1);
      }
      this.headNav.push(nav);
    }

    sessionStorage.setItem(this.HEAD_NAV_SESSION_STORAGE_KEY,JSON.stringify(this.headNav));
    this.statuSubject.next(this.STATUS.APPEND_HEADNAV);
  }

  onMenuNavigate(url: string, params?: any[]) {
    let _menu:SidenavItem = this.getByUrl(url);
    if(!_menu){
      return false;
    }
    if(_menu.subItems && _menu.subItems.length > 0){
      _menu = _menu.subItems.find((subItem)=>{
        return subItem.selected;
      });
    }

    if(params){
      _menu.params = params;
    }
    this.toggleCurrentlyOpen(_menu);
    this.initHeadNav();
    this.onNavigate(_menu.route,'',_menu.params);
  }

  /**
   * 路由跳转
   * @param url 路由地址
   * @param title 标题
   * @param params 参数
   * @param isRemove 是否从导航栏中删除当前地址
   */
  onNavigate(url: string,title:string, params?: any,isRemove?:boolean) {
    if(title != ''){
      this.appendHeadNav({name:title,path:url},isRemove);
    }
    this.setPageParams(url,params);
    this._router.navigate([url]);
  }

  /**
   * 获取当前页参数
   * @param pageUrl
   */
  getPageParams(pageUrl?:string){
    let paramKey:string = pageUrl;
    if(!pageUrl){
      paramKey = this._router.url;
    }
    let navParams = sessionStorage.getItem(this.NAV_PARAMS_SESSION_STORAGE_KEY);
    if(navParams){
      navParams = JSON.parse(navParams);
    }
    return navParams && navParams[paramKey];
  }

  /**
   * 重置当前页参数
   * @param params
   */
  resetPageParams(params:any){
    let _url = this._router.url;
    this.setPageParams(_url,params);
  }

  private setPageParams(pageUrl:string,params:any){
    let _params:any = sessionStorage.getItem(this.NAV_PARAMS_SESSION_STORAGE_KEY);
    if(_params){
      _params = JSON.parse(_params);
    }else{
      _params = {};
    }
    _params[pageUrl] = params;
    sessionStorage.setItem(this.NAV_PARAMS_SESSION_STORAGE_KEY, JSON.stringify(_params));
  }
}
