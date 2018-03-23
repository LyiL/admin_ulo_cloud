import {Component, OnInit, Renderer2, ViewChild, ViewContainerRef, Inject} from "@angular/core";
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {HttpService} from "../../common/services/impl/http.service";
import {AuthAbsService} from "../../common/services/auth.abs.service";
import {MdSnackBar} from "@angular/material";
import {HelpersAbsService} from "../../common/services/helpers.abs.service";
import {Router} from "@angular/router";
import {Title,ɵgetDOM as getDOM} from "@angular/platform-browser";
import {DOCUMENT} from "@angular/common";
@Component({
  selector:'login',
  templateUrl:'./login.component.html',
  styleUrls:['./login.component.scss']
})
export class LoginComponent implements OnInit{
  public loginUser;
  public loginPass;
  public captcha;
  public isChecked: boolean;
  public formGroup:FormGroup;
  public captchaPath:string = '/captcha/getKaptchaImage';
  @ViewChild('yzm',{ read: ViewContainerRef }) yzm:ViewContainerRef;

  constructor(public http:HttpService,public render2:Renderer2,public authService:AuthAbsService,
              public snackBar:MdSnackBar,public helpers:HelpersAbsService,
              public router:Router,public title:Title,@Inject(DOCUMENT) public _doc: any){}

  ngOnInit():void{
    this.formGroup = new FormGroup({'userName':new FormControl(this.loginUser,[Validators.required]),
      'userPwd':new FormControl(this.loginPass,[Validators.required]),
      'captcha':new FormControl(this.captcha,[Validators.required]),
    });
    this.title.setTitle(this.helpers.getDomainCfgVal('TITLE'));
    this.setIconLink(this.helpers.getDomainCfgVal('ICON'));
    this.initYzm();

    if(localStorage.isChecked){
      if( localStorage.isChecked === 'true'){
        this.isChecked = true;
      }else{
        this.isChecked = false;
      }
    }else {
      this.isChecked = false;
    }
    this.loginUser = localStorage.userName;
    this.loginPass = localStorage.userPwd;
  }

  public onForChecked(checked){
    if(checked){
      this.isChecked = true;
    }else{
      this.isChecked = false;
    }
  }

  /**
   * 登录
   * @param value
   */
  public onSubmit(value:any){
    value['appId'] = this.helpers.appid();
    this.authService.login(value,(function(){
      this.router.navigate([this.toOnePath()]);
    }).bind(this)).subscribe(res=>{
      if(!res || (res && res['status'] != 200)){
        this.snackBar.alert(res['message']);
      }else{
        localStorage.isChecked = this.isChecked;
        if(this.isChecked){
          localStorage.userName = this.loginUser;
          localStorage.userPwd = this.loginPass;
        }else{
          localStorage.userName = '';
          localStorage.userPwd = '';
        }
      }
    });

  }

  public onCaptchaHandler(event:any){
    let target = event.target;
    let src = target.currentSrc;
    let random = String(Math.random()).substring(2);
    let DOMURL = window.URL || window['webkitURL'] || window;
    this.http.download(this.captchaPath+'?'+random).subscribe(res=>{
      target.src = DOMURL.createObjectURL(res.blob);
    });

  }

  public initYzm(){
    let random = String(Math.random()).substring(2);
    let DOMURL = window.URL || window['webkitURL'] || window;
    this.http.download(this.captchaPath+'?'+random).subscribe(res=>{
        let img = this.render2.createElement('img');
        img.src = DOMURL.createObjectURL(res.blob)
        this.render2.listen(img,'click',this.onCaptchaHandler.bind(this));
        this.render2.appendChild(this.yzm.element.nativeElement,img);
    });
  }

  public toOnePath():string{
    let menu = this.helpers.menuData();
    // console.log(menu);
    let url = '';
        menu.forEach((item,index)=>{
          if(index != 0){return;}
          if(item && item.childrens && item.childrens.length > 0){
            url = item.childrens[0]['path'];
          }else if(item && item['path']){
            url = item['path'];
          }
        });
    return url;
  }

  public setIconLink(href:string){
    let link = getDOM().querySelector(this._doc,'link');
    if(getDOM().getAttribute(link,'type') == 'image/x-icon'){
      getDOM().setAttribute(link,'href',href);
    }
  }
}
