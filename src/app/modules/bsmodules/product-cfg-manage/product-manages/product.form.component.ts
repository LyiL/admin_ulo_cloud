import {Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef} from "@angular/core";
import {ULODetailCtrConfig, ULODetailContainer} from "../../../../common/components/detail/detail-container";
import {ProductBaseComponent} from "./product-cfg-form/product.base.component";
import {ProductCfgInfoComponent} from "./product-cfg-form/product.cfg.info.component";
import {ISidenavSrvice} from "../../../../common/services/isidenav.service";
@Component({
  selector:'ulo-product-form',
  templateUrl:'./product.form.component.html'
})
export class ProductFormComponent implements AfterViewInit{
  public prodCfgFormTabs:Array<ULODetailCtrConfig> = [
    {label:'基本信息',content:ProductBaseComponent},
    {label:'配置信息',content:ProductCfgInfoComponent}];

  @ViewChild('prodFormContainer') prodFormContainer:ULODetailContainer;

  constructor(public sidenavSrvice:ISidenavSrvice,public changeDetectorRef:ChangeDetectorRef){}

  ngAfterViewInit():void{
    let params = this.sidenavSrvice.getPageParams();
    let step = params && params['step'] || 0;
    if(params && params['isEdit'] && params['isEdit'] === true){
      this.prodFormContainer.params = params;
    }
    if(this.prodFormContainer.selectedIndex != step){
      this.prodFormContainer.selectedIndex = step;
      this.changeDetectorRef.detectChanges();
    }
  }
}
