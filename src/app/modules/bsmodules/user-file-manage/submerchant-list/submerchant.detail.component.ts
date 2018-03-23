import {AfterViewInit, ChangeDetectorRef, Component, ViewChild} from "@angular/core";
import {ULODetailContainer} from "../../../../common/components/detail/detail-container";
import {SubmerchantDetailContentComponent} from "./detail-component/submerchant.detail.content.component";
import {SubmerchantDetailIdcodeComponent} from "./detail-component/submerchant.detail.idcode.component";
@Component({
  selector:"submerchant-detail",
  templateUrl:"submerchant.detail.component.html",
  entryComponents:[SubmerchantDetailContentComponent, SubmerchantDetailIdcodeComponent]
})
export class SubmerchantDetailComponent implements AfterViewInit{
  public tabs: Array<any> = [
    {label: "商户详情", content: SubmerchantDetailContentComponent},
    {label: "报备信息", content: SubmerchantDetailIdcodeComponent},
  ];
  @ViewChild('SubmerchantDetailContainer') SubmerchantDetailContainer: ULODetailContainer;

  constructor(public changeDetectorRef: ChangeDetectorRef){}

  ngAfterViewInit():void{
    this.SubmerchantDetailContainer.selectedIndex = 0;
    this.changeDetectorRef.detectChanges();
  }
}
