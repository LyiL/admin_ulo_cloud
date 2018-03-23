import {ProductListComponent} from "./product-manages/product.list.component";
import {ProductDetailComponent} from "./product-manages/product.detail.component";
import {ProductFormComponent} from "./product-manages/product.form.component";
import {OpenProductListComponent} from "./open-product-manages/open.product.list.component";

export const productCfgRouting = [
  {path:'productlist', component:ProductListComponent},
  {path:'productdetail',component:ProductDetailComponent},
  {path:'productform',component:ProductFormComponent},
  {path:'roductopenlist',component:OpenProductListComponent}
];
