import {AfterViewInit, ChangeDetectorRef, Component, ViewChild} from "@angular/core";
import {AgencyDetailContentComponent} from "./detail-component/agency.detail.content.component";
import {AgencyDetailProductComponent} from "./detail-component/agency.detail.product.component";
import {ULODetailContainer} from "../../../../common/components/detail/detail-container";
import {AgencyDetailChannelComponent} from "./detail-component/agency.detail.channel.component";
@Component({
  selector:"agency-detail",
  templateUrl:"agency.detail.component.html",
  entryComponents:[AgencyDetailContentComponent, AgencyDetailProductComponent,AgencyDetailChannelComponent]
})
export class AgencyDetailComponent implements AfterViewInit{
  public tabs: Array<any> = [
    {label: "用户信息", content: AgencyDetailContentComponent},
    {label: "产品开通", content: AgencyDetailProductComponent},
    {label: "渠道配置", content: AgencyDetailChannelComponent}
  ];
  @ViewChild('agencyDetailContainer') agencyDetailContainer: ULODetailContainer;

  constructor(public changeDetectorRef: ChangeDetectorRef){}

  ngAfterViewInit():void{
    this.agencyDetailContainer.selectedIndex = 0;
    this.changeDetectorRef.detectChanges();
  }
}
