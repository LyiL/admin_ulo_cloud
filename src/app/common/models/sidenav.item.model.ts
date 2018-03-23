export class SidenavItem {
  name: string;
  iconClass: string;
  route: string;
  selected:boolean = false;
  parent: SidenavItem;
  params:any[];
  subItems: SidenavItem[];
  position: number;
  badge: string;
  badgeColor: string;

  constructor(model:any = null) {
    if(model) {
      this.name = model.name;
      this.iconClass = model.iconClass;
      this.route = model.route;
      this.parent = model.parent;
      this.params = model.params;
      this.selected = model.selected || false;
      this.subItems = this.mapSubItems(model.subItems);
      this.position = model.position;
      this.badge = model.badge;
      this.badgeColor = model.badgeColor;
    }
  }

  hasSubItems() {
    if(this.subItems) {
      return this.subItems.length > 0;
    }

    return false;
  }

  hasParent() {
    return !!this.parent;
  }

  mapSubItems(list: SidenavItem[]) {
    if(list) {
      list.forEach((item, index) => {
        list[index] = new SidenavItem(item);
      });

      return list;
    }
  }

  setSelected(){
    this.selected = true;
    if(this.parent){
      this.hasChiledSelected()
    }
  }

  hasChiledSelected(){
    let _subItems:SidenavItem[];
    if(this.parent){
      _subItems = this.parent.subItems;
    }else if(this.subItems){
      _subItems = this.subItems;
    }
    if(_subItems && _subItems.length > 0){
      _subItems.forEach((item:SidenavItem,index)=>{
        if(this.route != item.route){
          item.selected = false;
        }
        if(item.selected){
          if(this.parent){
            this.parent.selected = true;
          }else{
            this.selected = true;
          }
        }
      });
    }
  }
}
