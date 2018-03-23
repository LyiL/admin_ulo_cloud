import {Component, OnInit, Inject} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs/Observable";
import {HelpersAbsService} from "../../../../common/services/helpers.abs.service";
import {ISidenavSrvice} from "../../../../common/services/isidenav.service";
import {MdSnackBar} from "@angular/material";
import {ResourcePoolListDBService, ResourcePoolOtherDBService} from "./resource.pool.list.db.service";
import {ResourcePoolAddModel} from "../../../../common/models/user-file-manage/resource.pool.add.model";
import {CommonDBService} from "../../../../common/db-service/common.db.service";

@Component({
  selector: 'resource-pool-add',
  templateUrl: 'resource.pool.add.component.html',
  providers: [ResourcePoolOtherDBService,CommonDBService]
})
export class ResourcePoolAddComponent implements OnInit {

  public resPoolFormGroup: FormGroup;
  public model: ResourcePoolAddModel = new ResourcePoolAddModel();

  public payStates:Observable<any>; // 支付权限
  public useStates:Observable<any>; // 启用状态
  public params: any;
  /**
   * 支付类型配置
   */
  public payTypes:Array<string>= [];
  public uloCode:any;
  public flag: boolean = true;
  constructor(public resPoolOtherDB: ResourcePoolOtherDBService,
              public helper: HelpersAbsService,
              public sidenavService: ISidenavSrvice,
              public snackBar: MdSnackBar,
              protected CommonDB: CommonDBService,
  ) {
    this.uloCode = this.helper.getDictByKey('CLOUD_ULO_BANK_NO');
    this.CommonDB.loadTransApi({bankNo:this.uloCode}).subscribe(res =>{
      this.payTypes = res;
    });//支付类型
  }

  ngOnInit():void {
    this.resPoolFormGroup = new FormGroup({
      'mchNo': new FormControl(this.model.mchNo), // 商户编号
      'chanNo': new FormControl(this.model.chanNo), // 服务商/渠道编号
      'bankMchno': new FormControl(this.model.bankMchno), // 银行商户号
      'partner': new FormControl(this.model.partner, [Validators.required]), // 微信受理机构号
      'subPartner': new FormControl(this.model.subPartner, [Validators.required]), // 微信交易识别码
      'chanPartner': new FormControl(this.model.chanPartner), // 微信渠道编号
      'tradeType': new FormControl(this.model.tradeType), // 支付类型
      'payState': new FormControl(this.model.payState), // 支付权限
      'useState': new FormControl(this.model.useState), // 启用状态
    });
    this.model.payState = 1;
    this.model.useState = 1;
    this.payStates = Observable.of(this.helper.getDictByKey('RES_POOL_STATUS')); // 支付权限
    this.useStates = Observable.of(this.helper.getDictByKey('RES_POOL_STATUS')); // 启用状态

    this.params = this.sidenavService.getPageParams();

    if(this.params && this.params['id']) {
      this.flag = false;
      this.resPoolOtherDB
        .getAppDetail({ id: this.params['id']})
        .subscribe( res => {
          if(res && res.status == 200) {
            this.model.resetValue(res['data']);
          }
        })
    }

  }


  // 新增,编辑
  public onSubmit() {
    if (this.resPoolFormGroup.valid) {

      let _obs: Observable<any>;
      if(this.helper.isEmpty(this.model['id'])) { // 根据这个id去判断是新增还是编辑
        _obs = this.resPoolOtherDB.addResourcePool(this.model); // 如果为空，那就是添加
      }else {
        _obs = this.resPoolOtherDB.updateResourcePool(this.model); // 如果不为空，那就是编辑修改
      }

      _obs.subscribe( res => {
        if(res && res['status'] == 200) {
          this.snackBar.alert('保存成功');
          this.sidenavService.onNavigate('/admin/resourcepoollist', '识别码管理', {resPoolAdd:'resPoolAdd'}, true);
        }else {
          this.snackBar.alert(res['message']);
        }
      })


      // this.resPoolOtherDB.addResourcePool(this.model).subscribe(res => {
      //   if (res && res['status'] == 200) {
      //     this.snackBar.alert('保存成功');
      //     this.sidenavService.onNavigate('/admin/resourcepoollist', '识别码管理', {resPoolAdd:'resPoolAdd'}, true);
      //   } else {
      //     this.snackBar.alert(res['message']);
      //   }
      // })
    }
  }




  /**
   * 新增页面取消按钮
   */
  public onCancel() {
    this.sidenavService.onNavigate('/admin/resourcepoollist', '识别码管理', {resPoolAdd:'resPoolAdd'}, true);
  }
}
