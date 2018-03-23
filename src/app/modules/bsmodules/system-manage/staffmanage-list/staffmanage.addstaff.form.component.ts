import {AfterViewInit, ChangeDetectorRef, Component, ViewChild} from "@angular/core";
import {AddStaffBaseInfoComponent} from "./staffadd-component/addstaff.baseinfo.form.component";
import {AddStaffAllocationRoleComponent} from "./staffadd-component/addstaff.allocationrole.form.component";
import {ULODetailContainer} from "../../../../common/components/detail/detail-container";
import {ISidenavSrvice} from "../../../../common/services/isidenav.service";
@Component({
  selector:'staffmanage-addstaff-form',
  templateUrl:'staffmanage.addstaff.form.component.html',
  providers:[],
  entryComponents:[AddStaffBaseInfoComponent,AddStaffAllocationRoleComponent]
})
export class StaffManageAddStaffComponent  implements AfterViewInit{
  public staffAddFormTabs:Array<any> = [
    {label:"基本信息",content:AddStaffBaseInfoComponent},
    {label:"分配角色",content:AddStaffAllocationRoleComponent}
  ];
  @ViewChild('staffAddFormContainer') staffAddFormContainer:ULODetailContainer;
  constructor(public sidenavSrvice:ISidenavSrvice,public changeDetectorRef:ChangeDetectorRef){}
  ngAfterViewInit():void{
    let params = this.sidenavSrvice.getPageParams();
    let step = params && params['step'] || 0;
    if(params && params['isEdit'] && params['isEdit'] === true){
      this.staffAddFormContainer.params = params;
    }
    if(this.staffAddFormContainer.selectedIndex != step){
      this.staffAddFormContainer.selectedIndex = step;
      this.changeDetectorRef.detectChanges();
    }
  }
}




