import { Component, OnInit, Input,Inject, HostBinding, ViewEncapsulation } from '@angular/core';
import { SidenavItem } from '../../../common/models/sidenav.item.model';
import {ISidenavSrvice} from "../../../common/services/isidenav.service";
import {CommonEnumConst} from "../../../common/services/impl/common.enum.const";

@Component({
  selector: 'sidenav-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ItemComponent implements OnInit {

  @Input() item: SidenavItem;

  @HostBinding('class.open')
  get isOpen() {
    return this.sidenavService.isOpen(this.item);
  }

  constructor(public sidenavService:ISidenavSrvice) {
  }

  ngOnInit() {
  }

  toggleDropdown() {
    if(this.isOpen === false){
      let sessionQueryParams = sessionStorage.getItem(CommonEnumConst.QUERY_PARAMS_STORAGE_KEY);
      let queryKeys:Array<any> = [];
      let reg:RegExp = /^query_(.*)/;
      let key:string = undefined;
      for(let i=0; i<sessionStorage.length; i++){
         key = sessionStorage.key(i);
        if(reg.test(key)){
          queryKeys.push(key);
        }
      }
      if(queryKeys && queryKeys.length > 0){
        queryKeys.forEach((_key)=>{
          sessionStorage.removeItem(_key);
        });
      }
      if(this.item.hasSubItems()) {
        let subItem:SidenavItem = this.item.subItems.find((subItem,index) => {
          if(subItem.selected){
            return true;
          }else if(index == 0){
            return true;
          }
          return false;
        });
        this.sidenavService.toggleCurrentlyOpen(subItem);
        this.sidenavService.onNavigate(subItem.route,'',subItem.params);
      }else{
        this.sidenavService.toggleCurrentlyOpen(this.item);
      }
    }
    //清空头陪导航非菜单中的值
    this.sidenavService.initHeadNav();
  }

  /*
   *  获取子菜单高度
   * */
  getSubItemsHeight() {
    if (this.item.hasSubItems()) {
      return (this.getOpenSubItemsCount(this.item) * 56) + 'px';
    }
  }

  /*
   * 计算子菜单高度
   * */
  getOpenSubItemsCount(item: SidenavItem): number {
    let count = 0;
    if (item.hasSubItems() && this.sidenavService.isOpen(item)) {
      count += item.subItems.length;
      item.subItems.forEach((subItem) => {
        count += this.getOpenSubItemsCount(subItem);
      })
    }
    return count;
  }
}
