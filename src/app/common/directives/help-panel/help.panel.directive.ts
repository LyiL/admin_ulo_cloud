import {Directive, ElementRef, Input, Renderer2, OnInit} from "@angular/core";
@Directive({
  selector:'[help]'
})
export class HelpPanelDirective implements OnInit{

  @Input("help")
  des:string;

  constructor(private el:ElementRef,private render:Renderer2){}

  ngOnInit(){
    if(this.des){
      this.render.setAttribute(this.el.nativeElement,"title",this.des);
    }
  }
}
