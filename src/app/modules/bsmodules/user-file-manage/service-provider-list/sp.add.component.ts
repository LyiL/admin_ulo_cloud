import {Component, AfterViewInit, ChangeDetectorRef, ViewChild} from '@angular/core';
import {ULOSPBaseInfoComponent} from './edit-component/sp.base.info.component';
import {ULOSPAccountComponent} from './edit-component/sp.account.component';
import {ULOSPChannelComponent} from './edit-component/sp.channel.component';
import {ISidenavSrvice} from '../../../../common/services/isidenav.service';
import {ULODetailContainer} from '../../../../common/components/detail/detail-container';
import {ULOSPDetailProductComponent} from './detail-component/sp.detail.product.component';
import {ULOSPInfoComponent} from './sp.info.component';
@Component({
  selector: 'ulo-add-component',
  templateUrl: './sp.add.component.html',
  entryComponents:[
    ULOSPBaseInfoComponent,
    ULOSPAccountComponent,
    ULOSPChannelComponent
  ]
})
export class ULOSPAddComponent implements AfterViewInit{

  public tabs: Array<any> = [
    {label: '基本信息', content: ULOSPBaseInfoComponent},
    {label: '账户信息', content: ULOSPAccountComponent},
    {label: '产品开通', content: ULOSPDetailProductComponent},
    {label: '渠道配置', content: ULOSPChannelComponent},
    {label: '信息配置', content: ULOSPInfoComponent}
  ];

  @ViewChild('spAddDetailContainer') spAddDetailContainer: ULODetailContainer;

  constructor(
    public sidenavSrvice: ISidenavSrvice,
    public changeDetectorRef: ChangeDetectorRef
  ){}

  ngAfterViewInit(): void{
    let params = this.sidenavSrvice.getPageParams();
    let step = params && params['step'] || 0;
    if(params && params['isEdit'] && params['isEdit'] === true){
      this.spAddDetailContainer.params = params;
    }
    if(this.spAddDetailContainer.selectedIndex != step){
      this.spAddDetailContainer.selectedIndex = step;
      this.changeDetectorRef.detectChanges();
    }
  }
}
