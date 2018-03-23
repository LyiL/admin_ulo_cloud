import {Component, ComponentRef, ViewChild, EventEmitter, ElementRef, Renderer2} from "@angular/core";
import {BasePortalHost, ComponentPortal, TemplatePortal, PortalHostDirective} from "@angular/cdk";
import {MdTableExtendConfig} from "./table-extend-config";

@Component({
    selector:"table-wrap",
    template:`
        <ng-template cdkPortalHost></ng-template>
    `,
    host:{
      '[attr.id]':'config && config.ctrId'
    }
})
export class MdTableExtendContainer extends BasePortalHost{

    @ViewChild(PortalHostDirective) _portalHost: PortalHostDirective;
    config:MdTableExtendConfig;

    stateChange = new EventEmitter<any>();

    constructor(private ren2:Renderer2,private el:ElementRef){
      super();
      this.stateChange.subscribe((res)=>{
        if(res === 'exit'){
          this.el.nativeElement.remove();
        }
      });
    }

    attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T> {
        return this._portalHost.attachComponentPortal(portal);
    }

    attachTemplatePortal(portal: TemplatePortal): Map<string, any> {
        return this._portalHost.attachTemplatePortal(portal);
    }

}
