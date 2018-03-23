import {Component, OnInit} from "@angular/core";
import {SidenavItem} from "../../common/models/sidenav.item.model";
import {Subscription} from "rxjs";
import {Router, NavigationEnd, NavigationStart} from "@angular/router";
import {ISidenavSrvice} from "../../common/services/isidenav.service";
import {HelpersAbsService} from "../../common/services/helpers.abs.service";
@Component({
  selector:'app-sidenav',
  templateUrl:'./sidenav.component.html',
  styleUrls:['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit{
  items: SidenavItem[] = [];
  public _itemsSubscription: Subscription;
  public _url:string;
  public STATUS:any;

  constructor(public service:ISidenavSrvice,public helper:HelpersAbsService,
              public router: Router) {
    this.STATUS = service.STATUS;
  }

  ngOnInit() {
    this._itemsSubscription = this.service.items$.subscribe((items: SidenavItem[]) => {
      this.items = items;
    });
    this._url = this.router.url;
    this.router.events.subscribe((event) => {
      if(event instanceof NavigationStart){
          this._url = event.url;
      }
      if (event instanceof NavigationEnd) {
          this._url = event.url;
      }
      let _menu = this.service.getByUrl(this._url);
      if(_menu){
        _menu.setSelected();
      }
    });
    //当菜单初始化加载完成后，跳转到对应的地址
    this.service.statuSubject.subscribe((res)=>{
      if(res == this.STATUS.INIT_FINISH){
        let sessionHeadNav = sessionStorage.getItem(this.service.HEAD_NAV_SESSION_STORAGE_KEY);
        let path = '';
        if(sessionHeadNav){
          sessionHeadNav = JSON.parse(sessionHeadNav);
          path = sessionHeadNav[sessionHeadNav.length - 1]['path'];
          this._url = sessionHeadNav[1]['path'];
          let _menu = this.service.getByUrl(this._url);
          if(_menu){
            this.service.toggleCurrentlyOpen(_menu);
            _menu.setSelected();
          }
          this.service.onNavigate(path,'',this.service.getPageParams(path));
        }else{
          this.service.onMenuNavigate(this._url);
        }
      }
    });

  }

  toggleIconSidenav() {
  }

  isIconSidenav() {
  }
}
