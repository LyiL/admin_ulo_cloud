import {Component, OnInit, Inject, OnDestroy} from "@angular/core";
import {ISidenavSrvice} from "../../common/services/isidenav.service";
import {DOCUMENT} from "@angular/common";
import {HelpersAbsService} from "../../common/services/helpers.abs.service";
import {Title, ɵgetDOM as getDOM} from "@angular/platform-browser";
import {Observable} from "rxjs";
@Component({
  selector:'admin',
  templateUrl:'./admin.component.html',
  styleUrls:['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy{
  public _isMenuCollapsed:boolean = false;

  constructor(public sidenavService:ISidenavSrvice,public title:Title,@Inject(DOCUMENT) public _doc: any,
              public helpers:HelpersAbsService){}

  ngOnInit(){
    let _items = this.sidenavService._items;
    if(_items && _items.length <=0){
      Observable.timer(100).subscribe(()=>{//延时100秒，原因是本控件加载迅速比较前，statuSubject的监听器还没有创建好。
        this.helpers.menuData().forEach((item,ind)=>{
          let pMenu = this.sidenavService.addItem(item['name'],item['iconClass'],item['path'] || '',0);
          if(item['childrens'] && item['childrens'].length > 0){
            jQuery(item['childrens']).each((inde,subItem)=>{
              this.sidenavService.addSubItem(pMenu,subItem['name'],subItem['path'],inde);
            });
          }
          if(ind == this.helpers.menuData().length - 1){
            this.sidenavService.statuSubject.next(this.sidenavService.STATUS.INIT_FINISH);
          }
        });
      });
    }

    this.title.setTitle(this.helpers.getDomainCfgVal('TITLE'));
    this.setIconLink(this.helpers.getDomainCfgVal('ICON'));

    this.sidenavService.statuSubject.subscribe((res)=>{
      if(res == 'min'){
        this._isMenuCollapsed = true;
      }
    });
  }

  onActivate(scrollContainer) {
    scrollContainer.scrollTop = 0;
  }

  ngOnDestroy(){
    this.sidenavService._items = [];
  }

  public setIconLink(href:string){
    let link = getDOM().querySelector(this._doc,'link');
    if(getDOM().getAttribute(link,'type') == 'image/x-icon'){
      getDOM().setAttribute(link,'href',href);
    }
  }
}
