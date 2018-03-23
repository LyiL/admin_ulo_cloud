import {Injectable, Injector, ComponentRef} from "@angular/core";
import {ComponentPortal} from "@angular/cdk";
import {OverlayRef, Overlay, OverlayState} from "@angular/material";
import {LoadingComponent} from "./loading.component";

@Injectable()
export class MdLoadingService{
  constructor(private _overlay: Overlay,private _injector:Injector){}

  public init(){
    let overlayRef = this._createOverlay();
    this._attachDialogContainer(overlayRef);
  }

  private _attachDialogContainer(overlay: OverlayRef): void {
    let containerPortal = new ComponentPortal(LoadingComponent);
    let containerRef: ComponentRef<LoadingComponent> = overlay.attach(containerPortal);
  }

  private _createOverlay(): OverlayRef {
    let overlayState = this._getOverlayState();
    return this._overlay.create(overlayState);
  }

  private _getOverlayState(): OverlayState {
    let overlayState = new OverlayState();
    overlayState.positionStrategy = this._overlay.position().global();
    return overlayState;
  }

}

