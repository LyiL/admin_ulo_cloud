import {AfterViewInit, ChangeDetectorRef, Component, ViewChild} from "@angular/core";
import {MchBaseInfoComponent} from "./edit-component/mch.base.info.component";
import {MchChannelInfoComponent} from "./edit-component/mch.channel.info.component";
import {MchAccountInfoComponent} from "./edit-component/mch.account.info.component.";
import {ULODetailContainer} from "../../../../common/components/detail/detail-container";
import {ISidenavSrvice} from "../../../../common/services/isidenav.service";
import {MchDetailProductComponent} from "./detail-component/mch.detail.product.component";
import {MchInfoConfigComponent} from "./edit-component/mch.info.config.component";


@Component({
  selector:'merchant-add-list-component',
  templateUrl:'merchant.add.list.component.html',
  providers:[],
  entryComponents:[MchBaseInfoComponent,MchAccountInfoComponent,MchChannelInfoComponent,MchDetailProductComponent]
})
export class MerchantAddListComponent implements AfterViewInit{
  public mchAddCfgFormTabs:Array<any> = [
    {label:"基本信息",content:MchBaseInfoComponent},
    {label:"账户信息",content:MchAccountInfoComponent},
    {label:"产品开通",content:MchDetailProductComponent},
    {label:"渠道信息",content:MchChannelInfoComponent},
    {label:"信息配置",content:MchInfoConfigComponent}
  ];
  @ViewChild('mchAddFormContainer') mchAddFormContainer:ULODetailContainer;
  constructor(public sidenavSrvice:ISidenavSrvice,public changeDetectorRef:ChangeDetectorRef){}
  ngAfterViewInit():void{
    let params = this.sidenavSrvice.getPageParams();
    let step = params && params['step'] || 0;
    if(params && params['isEdit'] && params['isEdit'] === true){
      this.mchAddFormContainer.params = params;
    }
    if(this.mchAddFormContainer.selectedIndex != step){
      this.mchAddFormContainer.selectedIndex = step;
      this.changeDetectorRef.detectChanges();
    }
  }
}
