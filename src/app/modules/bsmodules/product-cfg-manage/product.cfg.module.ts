import {NgModule} from "@angular/core";
import {
  MdTabsModule, MdDialogModule, MdTableModule, MdButtonModule, MdInputSearchModule,
  MdInputModule, MdSelectModule, MdCardModule, MdPupopModule, MdCheckboxModule
} from "@angular/material";
import {MdTableExtendModule} from "../../../common/components/table/index";
import {FlexLayoutModule} from "@angular/flex-layout";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {BrowserModule} from "@angular/platform-browser";
import {ProductListComponent} from "./product-manages/product.list.component";
import {CommonDirectiveModule} from "../../../common/directives/index";
import {ProductDetailComponent} from "./product-manages/product.detail.component";
import {ULODetailModule} from "../../../common/components/detail/index";
import {ProductFormComponent} from "./product-manages/product.form.component";
import {ProductBaseComponent} from "./product-manages/product-cfg-form/product.base.component";
import {ProductCfgInfoComponent} from "./product-manages/product-cfg-form/product.cfg.info.component";
import {OpenProductListComponent} from "./open-product-manages/open.product.list.component";
import {OpenProductDetailComponent} from "./open-product-manages/open.product.detail.component";
@NgModule({
  imports:[
    BrowserModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MdCardModule,
    MdSelectModule,
    MdInputModule,
    MdInputSearchModule,
    MdButtonModule,
    MdTableModule,
    MdTableExtendModule,
    MdDialogModule,
    MdTabsModule,
    MdPupopModule,
    MdCheckboxModule,
    ULODetailModule,
    CommonDirectiveModule
  ],
  declarations:[
    ProductListComponent,
    ProductDetailComponent,
    ProductFormComponent,
    ProductBaseComponent,
    ProductCfgInfoComponent,
    OpenProductListComponent,
    OpenProductDetailComponent,
  ],
  providers:[],
  entryComponents:[
    ProductBaseComponent,
    ProductCfgInfoComponent,
    OpenProductDetailComponent,
  ]
})
export class ProductCfgModule{

}
