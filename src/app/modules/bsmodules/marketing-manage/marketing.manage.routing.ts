import {LuoApplicationComponent} from "./luoluo-application-list/luoluo.application.list.component";
import {LuoApplicationAddComponent} from "./luoluo-application-list/luoluo.application.add.component";
import {LuoApplicationDetailComponent} from "./luoluo-application-list/luoluo.application.detail.component";

export const macketingtrouters = [
  {path: 'luoapplication', component: LuoApplicationComponent},
  {path: 'luoadd', component: LuoApplicationAddComponent},
  {path: 'luodetail', component: LuoApplicationDetailComponent},
];
