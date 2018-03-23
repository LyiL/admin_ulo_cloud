import {NgModule, ModuleWithProviders} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {ULOImageModule} from "../image-preview/index";
import {UloFileSelectComponent} from "./file.select.component";
import {UPLOAD_DIRECTIVES} from "../../directives/file/index";
import {CommonDirectiveModule} from "../../directives/index";

@NgModule({
  imports:[
    CommonModule,
    FormsModule,
    ULOImageModule,
    CommonDirectiveModule
  ],
  exports:[UloFileSelectComponent,UPLOAD_DIRECTIVES],
  declarations:[
    UloFileSelectComponent,
    UPLOAD_DIRECTIVES
  ],
})
export class UloFileUploaderModule{
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: UloFileUploaderModule,
      providers: []
    };
  }
}

export * from "./file.select.component";
