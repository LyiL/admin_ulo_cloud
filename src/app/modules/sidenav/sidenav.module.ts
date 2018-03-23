import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";

import { PerfectScrollbarModule, PerfectScrollbarConfigInterface } from "angular2-perfect-scrollbar";
import {MaterialModule} from "@angular/material";
import {FlexLayoutModule} from "@angular/flex-layout";
import {SidenavComponent} from "./sidenav.component";
import {ItemComponent} from "./item/item.component";
import {RouterModule} from "@angular/router";
const perfectScrollbarConfig: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations:[
    SidenavComponent,
    ItemComponent
  ],
  imports:[
    CommonModule,
    RouterModule,
    MaterialModule,
    FlexLayoutModule,
    PerfectScrollbarModule.forRoot(perfectScrollbarConfig),
  ],
  exports:[
    SidenavComponent
  ]
})
export class SidenavModule{}
