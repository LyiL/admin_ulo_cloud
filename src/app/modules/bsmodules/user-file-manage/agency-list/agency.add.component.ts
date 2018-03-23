import {Component, ViewChild, ChangeDetectorRef, AfterViewInit} from "@angular/core";
import {AgencyBaseInfoComponent} from "./edit-component/agency.base.info.component";
import {AgencyAccountComponent} from "./edit-component/agency.account.component";
import {AgencyChannelComponent} from "./edit-component/agency.channel.component";
import {ISidenavSrvice} from "../../../../common/services/isidenav.service";
import {ULODetailContainer} from "../../../../common/components/detail/detail-container";
import {AgencyDetailProductComponent} from "./detail-component/agency.detail.product.component";

@Component({
  selector:'agency-add-component',
  templateUrl:'./agency.add.component.html',
  entryComponents:[AgencyBaseInfoComponent, AgencyAccountComponent, AgencyChannelComponent,AgencyDetailProductComponent]
})
export class AgencyAddComponent implements AfterViewInit{

  public tabs:Array<any> = [
    {label:"基本信息",content: AgencyBaseInfoComponent},
    {label:"账户信息",content: AgencyAccountComponent},
    {label:"产品开通",content: AgencyDetailProductComponent},
    {label:"渠道配置",content: AgencyChannelComponent}
  ];
  @ViewChild('agencyAddDetailContainer') agencyAddDetailContainer: ULODetailContainer;

  constructor(public sidenavSrvice: ISidenavSrvice, public changeDetectorRef: ChangeDetectorRef){}

  ngAfterViewInit():void{
    let params = this.sidenavSrvice.getPageParams();
    let step = params && params['step'] || 0;
    if(params && params['isEdit'] && params['isEdit'] === true){
      this.agencyAddDetailContainer.params = params;
    }
    if(this.agencyAddDetailContainer.selectedIndex != step){
      this.agencyAddDetailContainer.selectedIndex = step;
      this.changeDetectorRef.detectChanges();
    }
  }
}
