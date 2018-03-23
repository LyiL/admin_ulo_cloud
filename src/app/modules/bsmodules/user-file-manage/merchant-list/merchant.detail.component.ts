import {ChangeDetectorRef, Component, ViewChild,AfterViewInit} from "@angular/core";
import {MchDetailListComponent} from "./detail-component/mch.detail.list.component";
import {MchDetailProductComponent} from "./detail-component/mch.detail.product.component";
import {ULODetailContainer} from "../../../../common/components/detail/detail-container";
import {MchDetailChannelComponent} from "./detail-component/mch.detail.channel.component";
import {MchDetailInfoConfigComponent} from "./detail-component/mch.detail.info.config.component";
@Component({
  selector:"merchant--detail",
  templateUrl:"merchant.detail.component.html",
  entryComponents:[MchDetailListComponent,MchDetailProductComponent,MchDetailChannelComponent]
})
export class MerchantDetailComponent implements AfterViewInit{
  public tabs:Array<any> = [
    {label:"商户详情",
    content:MchDetailListComponent},
    {label:"产品开通",
    content:MchDetailProductComponent},
    {label:"渠道配置",
      content:MchDetailChannelComponent},
    {label:"信息配置",
      content:MchDetailInfoConfigComponent}
  ];
  @ViewChild('mchDetailContainer') mchDetailContainer:ULODetailContainer;
  constructor(public changeDetectorRef:ChangeDetectorRef){}


  ngAfterViewInit():void{
    this.mchDetailContainer.selectedIndex = 0;
    this.changeDetectorRef.detectChanges();
  }
}
