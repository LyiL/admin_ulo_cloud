import {Component, OnInit, Inject} from "@angular/core";
import {LuoAppListDbService, LuoAppService} from "./luoluo.application.list.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {luoAppModel} from "app/common/models/marketing-manage/luoluo.list.model";
import {Observable} from "rxjs/Observable";
import {HelpersAbsService} from "../../../../common/services/helpers.abs.service";
import {ISidenavSrvice} from "../../../../common/services/isidenav.service";
import {MdSnackBar} from "@angular/material";
import {ValidatorsPatterns} from "../../../../common/services/impl/validators.patterns.const";

@Component({
  selector: 'luo-application-add',
  templateUrl: 'luoluo.application.add.component.html',
  providers: [LuoAppListDbService, LuoAppService]
})
export class LuoApplicationAddComponent implements OnInit {

  public luoAppFormGroup: FormGroup;
  public model: luoAppModel = new luoAppModel();

  public platforms:Observable<any>; // 平台方

  public flag: boolean = true;

  public params: any;

  //文件上传控件配置
  public defFieldUploadSetting: any = {
    url:'/assets/upload',
    fileSuffix:'.jpg;.jpeg;.png;.gif;'
  };

  constructor(public luoAppService: LuoAppService,
              public luoAppDB: LuoAppListDbService,
              public helper: HelpersAbsService,
              public sidenavService: ISidenavSrvice,
              public snackBar: MdSnackBar
  ) {

  }

  ngOnInit():void {
    this.luoAppFormGroup = new FormGroup({
      'appName': new FormControl(this.model.appName, [Validators.required]), // 应用名称
      'devName': new FormControl(this.model.devName, [Validators.required]), // 开发者名称
      'downloadNum': new FormControl(this.model.downloadNum, [Validators.required]), // 下载量
      'downloadUrl': new FormControl(this.model.downloadUrl, [Validators.required]), // 下载地址
      'remark': new FormControl(this.model.remark, [Validators.required]), // 软件说明
      'platform': new FormControl(this.model.platform), // 应用系统
      'releaseTime': new FormControl(this.model.releaseTime, [Validators.required]), // 发布日期
      'appLogo': new FormControl(this.model.appLogo, [Validators.required]), // 应用logo
      'appImg1': new FormControl(this.model.appImg1, [Validators.required]), // 应用图片1
      'appImg2': new FormControl(this.model.appImg2, [Validators.required]), // 应用图片2
      'appImg3': new FormControl(this.model.appImg3, [Validators.required]) // 应用图片3
    });

    this.platforms = Observable.of(this.helper.getDictByKey('CLOUD_PLATFORM_DATA')); // 获取应用系统
    this.params = this.sidenavService.getPageParams();

    if(this.params && this.params['id']) {
      this.flag = false;
      this.luoAppService
        .getAppDetail({ id: this.params['id']})
        .subscribe( res => {
          if(res && res.status == 200) {
            this.model.resetValue(res['data']);
            this.luoAppDB.params = { name: this.model['appName'] };
            this.luoAppDB.refreshChange.next(true);
          }
        })
    }
  }

  /**
   * 下载量提示语
   */
  public onHint() {
    this.snackBar.alert('下载量必须为纯数字！');
  }

  // 编辑 / 新增
  public onSubmit() {
    if(this.luoAppFormGroup.valid) {
      let _obs: Observable<any>;
      if(this.helper.isEmpty(this.model['id'])) { // 根据这个id去判断是新增还是编辑
        _obs = this.luoAppService.addApp(this.model); // 如果为空，那就是添加
      }else {
        _obs = this.luoAppService.updateApp(this.model); // 如果不为空，那就是编辑修改
      }

      _obs.subscribe( res => {
        if(res && res['status'] == 200) {
          this.snackBar.alert('保存成功');
          this.sidenavService.onNavigate('/admin/luoapplication', '络络应用', null, true);
        }else {
          this.snackBar.alert(res['message']);
        }
      })
    }
  }

  /**
   * 新增页面取消按钮
   */
  public onCancel() {
    this.sidenavService.onNavigate('/admin/luoapplication', '络络应用', null, true);
  }

  /**
   * 文件上传错误信息
   * @param data
   */
  public onFileUploadError(data){
    if(data && data['message']){
      this.snackBar.alert(data['message']);
    }
  }
}
