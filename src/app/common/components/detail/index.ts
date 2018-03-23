import {NgModule} from "@angular/core";
import {ULODetailContainer} from "./detail-container";
import {MdTabsModule} from "@angular/material";
import {CommonModule} from "@angular/common";
import {ULODetail} from "./detail";
import {ULOImageModule} from "../image-preview/index";
import {CommonDirectiveModule} from "../../directives/index";
@NgModule({
  imports:[
    CommonModule,
    MdTabsModule,
    ULOImageModule,
    CommonDirectiveModule
  ],
  declarations:[
    ULODetailContainer,
    ULODetail
  ],
  exports:[
    ULODetailContainer,
    ULODetail
  ]
})
export class ULODetailModule{

}
export * from "./detail";
export * from "./detail-container";
