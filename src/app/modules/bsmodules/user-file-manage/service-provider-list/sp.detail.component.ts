import {Component, AfterViewInit, ViewChild, ChangeDetectorRef} from '@angular/core';
import {ULOSPDetailContentComponent} from './detail-component/sp.detail.content.component';
import {ULOSPDetailProductComponent} from './detail-component/sp.detail.product.component';
import {ULODetailContainer} from '../../../../common/components/detail/detail-container';
import { ULOSPDetailChannelComponent } from './detail-component/sp.detail.channel.component';
import {ULOSPInfoComponent} from './sp.info.component';
@Component({
  selector: 'ulo-service-provider-detail',
  templateUrl: 'sp.detail.component.html',
  entryComponents: [
    ULOSPDetailContentComponent,
    ULOSPDetailProductComponent,
    ULOSPDetailChannelComponent,
    ULOSPInfoComponent
  ]
})
export class ULOServiceProviderDetailComponent implements AfterViewInit {
  public tabs: Array<any> = [
    {label: '服务商详情', content: ULOSPDetailContentComponent},
    {label: '产品开通', content: ULOSPDetailProductComponent},
    {label: '渠道配置', content: ULOSPDetailChannelComponent},
    { label: '信息配置', content: ULOSPInfoComponent}
  ];

  @ViewChild('spDetailContainer') spDetailContainer: ULODetailContainer;

  constructor(public changeDetectorRef: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.spDetailContainer.selectedIndex = 0;
    this.changeDetectorRef.detectChanges();
  }
}
