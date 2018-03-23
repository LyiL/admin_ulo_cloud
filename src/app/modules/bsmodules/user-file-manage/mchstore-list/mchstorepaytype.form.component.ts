import {Component} from "@angular/core";
import {StoreManageListDBService} from "./storemanage.db.service";


@Component({
  selector:'mchstorepaytype-form',
  templateUrl:'mchstorepaytype.form.component.html',
  providers:[StoreManageListDBService]
})
export class MchStorePayTypeFormComponent {
  RoleGroup = [
    {value: '云平台-0', viewValue: '云平台'},
    {value: '云平台员工-1', viewValue: '云平台员工'}
  ];
}
