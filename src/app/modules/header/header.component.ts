import {Component, OnInit} from "@angular/core";
import {ISidenavSrvice} from "../../common/services/isidenav.service";
import {AuthAbsService} from "../../common/services/auth.abs.service";
import {Router} from "@angular/router";
import {MdPupop} from "@angular/material";
import {EditPwdComponent} from "./edit.pwd.component";
@Component({
  selector:"app-header",
  templateUrl:"./header.component.html",
  styleUrls:['./header.component.scss']
})
export class HeaderComponent implements OnInit{
    public homePath:string;
    public navs:any[];
    public STATUS:any;
    public userInfo:any;

    constructor(public sidenavServce:ISidenavSrvice,public authService:AuthAbsService,public router:Router,public pupop:MdPupop){
        this.STATUS = sidenavServce.STATUS;
        this.userInfo = authService.getUserInfo();
    }

    ngOnInit():void{
      this.sidenavServce._currentlyOpenSubject.subscribe((res)=>{

      });

      this.sidenavServce.statuSubject.subscribe(res=>{
        let _items = this.sidenavServce._items;
        if(res == this.STATUS.INIT_FINISH && _items && _items.length > 0){
            this.homePath = _items[0]['route'];
        }
        if(res == this.STATUS.INIT_HEADNAV || res == this.STATUS.APPEND_HEADNAV || res == this.STATUS.INIT_FINISH){
            let headNavSession = sessionStorage.getItem(this.sidenavServce.HEAD_NAV_SESSION_STORAGE_KEY);
            if(headNavSession){
                this.navs = JSON.parse(headNavSession);
            }else{
              this.navs = this.sidenavServce.headNav;
            }
        }
      });
    }

  onEdit(){
      this.pupop.openWin(EditPwdComponent,{
        title:'修改密码',
        height:'300px'
      });
  }

  onQuit(){
    this.authService.quit().subscribe(res=>{
      this.router.navigate(['/']);
    });
  }
}
