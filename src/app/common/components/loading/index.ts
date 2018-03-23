import {LoadingService} from "./loading.service";
import {LoadingComponent} from "./loading.component";
import {CommonDirectiveModule} from "../../directives/index";
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {MdLoadingService} from "./loading.init.service";

@NgModule({
  imports:[CommonModule,CommonDirectiveModule],
  declarations:[LoadingComponent],
  exports:[LoadingComponent],
  providers:[LoadingService,MdLoadingService],
  entryComponents:[LoadingComponent]
})
export class ULOLoadingModule{}

export * from "./loading.component";
export * from "./loading.service";
