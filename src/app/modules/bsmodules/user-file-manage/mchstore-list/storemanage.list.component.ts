import {Component} from "@angular/core";
import {StoreManageListDBService} from "./storemanage.db.service";
import {Column} from "../../../../common/components/table/table-extend-config";
import {ISidenavSrvice} from "../../../../common/services/isidenav.service";
import {MdDialog} from "@angular/material";

@Component({
  selector:'storemanage-list-component',
  templateUrl:'storemanage.list.component.html',
  providers:[StoreManageListDBService]
})
export class StoreManageListComponent{

  public StoreManageListColumns:Array<Column>=
    [
      {
        name:"mchId",
        title:"门店商户编号"
      },{
      name:"name",  //根据接收参数
      title:"门店名称",
    },{
      name:"groupName",
      title:"所属商户"
    },{
      name:"status",
      title:"激活状态"
    }
    ];
  public tableActionCfg: any = {
    actions:[{
      btnName:"del",
      hide:true
    },{
      btnName:"edit",
      hide:false,
      click:this.onEdit.bind(this)
    },{
      btnDisplay:"详情",
      click:this.onDetailHendler.bind(this)
    }]
  };
  public dbService:StoreManageListDBService;
  constructor(public _dbService:StoreManageListDBService ,public sidenavService:ISidenavSrvice,
              public dialog: MdDialog
  ){
    this.dbService = _dbService;
  }
  onDetailHendler(row:any,e:MouseEvent):void{
    this.sidenavService.onNavigate('/admin/mchstoredetaillist','门店详情');
  }
  onEdit(row:any,e:MouseEvent):void{
    this.dialog.open(mchStoreAddWinComponent)
  }
  addStore(){
    this.dialog.open(mchStoreAddWinComponent)
  }

}
@Component({
  selector:"mchstore-add-win",
  templateUrl:"mchstore.add.win.component.html"
})
export class mchStoreAddWinComponent{
  RoleGroup = [
    {value: '云平台-0', viewValue: '云平台'},
    {value: '云平台员工-1', viewValue: '云平台员工'}
  ];
}
