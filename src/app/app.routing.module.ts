import {Routes, RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";
import {AdminComponent} from "./modules/admin/admin.component";
import {LoginComponent} from "./modules/login/login.component";
import {BS_ROUTING} from "./modules/bsmodules/bs.modules.routing";
import {RouterInterceptService} from "./common/services/impl/router.intercept.service";

const routers:Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'admin', component: AdminComponent,
    canActivate:[RouterInterceptService],
    canActivateChild:[RouterInterceptService],
    children: BS_ROUTING
  },
  {path:'login',component:LoginComponent},
  {path:'**',redirectTo:'/login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routers, { useHash: true })],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {
}
