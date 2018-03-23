import {
    Injectable, ComponentRef, ComponentFactoryResolver, Injector, ApplicationRef,
    EmbeddedViewRef, InjectionToken
} from "@angular/core";
import {ComponentPortal, ComponentType, Portal, DomPortalHost} from "@angular/cdk";
import {MdTableExtendConfig} from "./table-extend-config";
import {MdTableExtendContainer} from "./table-extend-container";
import {PortalInjector, extendObject} from "@angular/material";

export const MD_TABLE_EXTEND_DATA = new InjectionToken<any>('MdDetailTableData');

@Injectable()
export class MdTableExtendService{
    constructor(private _componentFactoryResolver: ComponentFactoryResolver,private _injector:Injector,private _appRef: ApplicationRef){}

    public init<T>(componentOrTemplateRef: ComponentType<T>,config: MdTableExtendConfig, _hostDomElement: Element,nextSibling: Element):T{
        config = _applyConfigDefaults(config);
        let componentPortal = new ComponentPortal(MdTableExtendContainer);
        let containerCmpRef:ComponentRef<MdTableExtendContainer> = this.attachParentComponent(componentPortal,_hostDomElement,nextSibling);
        containerCmpRef.instance.config = config;
        let componentRef:ComponentRef<T> = this.attachComponent(componentOrTemplateRef,containerCmpRef.instance,config);
        return componentRef.instance;
    }

    attachParentComponent<T>(componentPortal:ComponentPortal<T>,_hostDomElement: Element,nextSibling: Element): ComponentRef<T>{
        let componentFactory = this._componentFactoryResolver.resolveComponentFactory(componentPortal.component);
        let componentRef: ComponentRef<T> = componentFactory.create(this._injector);
        this._appRef.attachView(componentRef.hostView);

        this.setDisposeFn(() => {
            this._appRef.detachView(componentRef.hostView);
            componentRef.destroy();
        });

        _hostDomElement.insertBefore(this._getComponentRootNode(componentRef),nextSibling);

        return componentRef;
    }

    attachComponent<T>(componentOrTemplateRef: ComponentType<T>,detailTableContainer:MdTableExtendContainer,config: MdTableExtendConfig):ComponentRef<T>{
        let injector = this._createInjector<T>(config, detailTableContainer);
        return detailTableContainer.attachComponentPortal(new ComponentPortal(componentOrTemplateRef,undefined,injector));
    }

    setDisposeFn(fn: () => void){};

    private _getComponentRootNode(componentRef: ComponentRef<any>): HTMLElement {
        return (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    }

    private _createInjector<T>(
        config: MdTableExtendConfig,
        dialogContainer: MdTableExtendContainer): PortalInjector {

        let injectionTokens = new WeakMap();

        injectionTokens.set(MdTableExtendConfig, dialogContainer);
        injectionTokens.set(MD_TABLE_EXTEND_DATA, config);

        return new PortalInjector(this._injector, injectionTokens);
    }
}

function _applyConfigDefaults(config?: MdTableExtendConfig): MdTableExtendConfig {
    return extendObject(new MdTableExtendConfig(), config);
}
