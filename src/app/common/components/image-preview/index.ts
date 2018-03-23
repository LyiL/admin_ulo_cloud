import {NgModule} from "@angular/core";
import {ULOImagePreview} from "./image.preview";
import {CommonModule} from "@angular/common";
import {ULOImagePreviewService} from "./image.preview.service";
import {CommonDirectiveModule} from "../../directives/index";

@NgModule({
  imports:[CommonModule,CommonDirectiveModule],
  declarations:[ULOImagePreview],
  exports:[ULOImagePreview],
  providers:[ULOImagePreviewService]
})
export class ULOImageModule{}

export * from "./image.preview.service";
export * from "./image.preview";
