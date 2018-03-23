import {
  Component,
  Input,
  ViewContainerRef,
  ComponentFactoryResolver,
  ViewChildren,
  QueryList,
  Renderer2,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef
} from "@angular/core";

export class ULODetailCtrConfig{
  label:string;
  content:any
}

@Component({
  selector:'ulo-detail-container',
  templateUrl:'detail-container.html'
})
export class ULODetailContainer implements AfterViewInit,OnDestroy{
  @Input()
  get tabs():Array<ULODetailCtrConfig>{
    return this._tabs;
  }
  set tabs(tabs:Array<ULODetailCtrConfig>){
    this._tabs = tabs;
  }
  private _tabs:Array<ULODetailCtrConfig>;

  @Input()
  className:string = '';

  @Input()
  isStep:boolean = false;

  @ViewChildren('dynamicTarget', { read: ViewContainerRef }) dynamicTarget: QueryList<any>;

  params:any = {};

  @Input()
  get selectedIndex(){
    return this._selectedIndex;
  }
  set selectedIndex(_selectedIndex){

    if(_selectedIndex == 0 && this._selectedIndex == -1){
      setTimeout((function(){
            this.render(this.tabs[_selectedIndex]['content']);
      }).bind(this),200);
    }
    if(_selectedIndex != this._selectedIndex){
      this._selectedIndex = _selectedIndex;
    }
    this.changeDetectorRef.detectChanges();
  }
  public _selectedIndex:number = -1;
  public customComponent:any;
  constructor(private resolver: ComponentFactoryResolver,private render2:Renderer2,private changeDetectorRef:ChangeDetectorRef){

  }

  onStep(step:number){
      if(step > this.tabs.length - 1 || step < 0){
        return false;
      }
      this.selectedIndex = step;
      this.changeDetectorRef.detectChanges();
  }

  ngAfterViewInit(){
    if(!this.tabs || (this.tabs && this.tabs.length == 0)){
      console.log('Please configure the tabs property.');
      return;
    }
  }

  public onSelectChange(){
    if(this.customComponent){
      this.customComponent.destroy();
    }
    this.render(this.tabs[this.selectedIndex]['content']);
  }

  public render(content:any){
    let target:any = this.getDynamicTarget();
    if(typeof content == 'string'){
      let nativeEl = target.element.nativeElement;
      let pEl = nativeEl.parentElement;
      if(pEl){
        let removeNode = pEl.getElementsByClassName('tab-content-html')[0];
        if(!!removeNode){
          pEl.removeChild(removeNode);
        }
      }

      let div = this.render2.createElement('div');
        div.setAttribute('class','tab-content-html');
      div.innerHTML = content;
      this.render2.insertBefore(nativeEl.parentElement,div,nativeEl);
    }else{
      target.clear();
      const componentFactory = this.resolver.resolveComponentFactory(content);
      this.customComponent = target.createComponent(componentFactory);
      this.customComponent.instance['ctr'] = this;
    }
  }

  public getDynamicTarget():any{
    return this.dynamicTarget && this.dynamicTarget.find((item:any,ind:number)=>{
      return this.selectedIndex == ind;
      });
  }

  public hasStep(index:number){
    if(this.isStep){
      return this.selectedIndex != index;
    }
    return false;
  }

  ngOnDestroy(){
    if(this.customComponent){
      this.customComponent.destroy();
    }
  }
}
