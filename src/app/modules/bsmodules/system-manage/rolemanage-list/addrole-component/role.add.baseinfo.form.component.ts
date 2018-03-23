import {Component, OnInit} from "@angular/core";
import {ULODetailContainer} from "../../../../../common/components/detail/detail-container";
import {RoleAddManageModel} from "../../../../../common/models/system-manage.models/roleaddmanage.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpService} from "../../../../../common/services/impl/http.service";
import {ISidenavSrvice} from "../../../../../common/services/isidenav.service";
import {MdSnackBar} from "@angular/material";
import {RoleFormDBLoad} from "../rolemanage.list.db.service";
import {HelpersAbsService} from "../../../../../common/services/helpers.abs.service";

@Component({
    selector:'roleadd-baseinfo-form',
    templateUrl:'role.add.baseinfo.form.component.html',
     providers:[RoleFormDBLoad]
})
export class RoleAddBaseInfoComponent implements OnInit{
  public ctr:ULODetailContainer;
  public model:RoleAddManageModel = new RoleAddManageModel();
  public roleAdd: FormGroup;
  /**
   * 角色组数据
   */
  public parentIds:Array<string>= [];

  constructor( public fb: FormBuilder, public http: HttpService,public helper:HelpersAbsService,
               public sidenavSrvice:ISidenavSrvice, public snackBar: MdSnackBar,public loadDB:RoleFormDBLoad){

  }

  ngOnInit(){
    this.roleAdd = this.fb.group({
      roleName: [this.model.roleName ],
      description: [this.model.description ],
      parentIds: [this.model.parentIds ],
    });
    this.loadDB.loadGetExtends().subscribe(res =>{
      if(res && res["status"] == 200){
        this.parentIds = res.data;
      }
    })
    let params = this.sidenavSrvice.getPageParams();
    if(params && !this.helper.isEmpty(params['id'])){
      this.loadDB.loadRoleInfo(params['id']).subscribe(res=>{
        if(res && res['status'] == 200){
          this.model.resetValue(res['data']);
        }
      });
    }
  }

  back():void{
    this.sidenavSrvice.onNavigate('/admin/rolemanage','角色管理',[],true);
  }

   onSubmit() {
    this.loadDB.saveRoleInfo(this.model).subscribe(res=>{

      if(res && res['status'] == 200){
        this.snackBar.alert('保存成功！');
        this.sidenavSrvice.onNavigate('/admin/rolemanage','角色管理',[],true);
      }else {
          this.snackBar.alert(res['message']);
      }
    })
  }
  onNextSetp(){

    this.loadDB.saveRoleInfo(this.model).subscribe(res=>{
      if(res && res['status'] == 200){
        this.snackBar.alert('保存成功！');
         this.ctr.params = res.data;
          this.ctr.onStep(1);
      }else {
        this.snackBar.alert(res['message']);
      }
    })
  }





}
