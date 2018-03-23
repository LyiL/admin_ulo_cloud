import {Component, OnInit} from "@angular/core";
import {ULODetailContainer} from "../../../../../common/components/detail/detail-container";
import {MdSnackBar, MdTreeNode} from "@angular/material";
import {RolePermissionModel} from "../../../../../common/models/system-manage.models/rolepermission.model";
import {ISidenavSrvice} from "../../../../../common/services/isidenav.service";
import {HelpersAbsService} from "../../../../../common/services/helpers.abs.service";
import {RoleFormDBLoad} from "../rolemanage.list.db.service";

@Component({
  selector:'roleadd-rolemenupermission',
  templateUrl:'role.add.rolemenupermission.component.html',
  providers:[RoleFormDBLoad]
})
export class RoleAddRoleMenuPermissionComponent implements OnInit{
  public ctr:ULODetailContainer;
  private funcTrees:Array<any> = new Array<any>();
  public form:RolePermissionModel = new RolePermissionModel();
  constructor(public sidenavSrvice:ISidenavSrvice, public helper:HelpersAbsService,public loadDB:RoleFormDBLoad,
              public snackBar: MdSnackBar){

  }
  Cancel():void{
    this.sidenavSrvice.onNavigate('/admin/rolemanage','角色管理',[],true);
  }
  ngOnInit(){
    this.form = this.ctr.params;
    this.form.nodeIds=[];
    this.loadDB.loadAllNode({roleId:this.form.id,appId:this.form["appId"],parentRoleId:this.form["parentIds"],organNo:this.form["orgNo"]})
      .subscribe(res =>{
      if(res && res["status"] == 200){
        this.funcTrees = res['data'];
        this.funcTrees.forEach((value)=>{
          let data = value['data'];
          if(value['partialSelected']){
            this.form.nodeIds.push(data['id']);
            if(value['children'] && value['children'].length > 0){
              this.setDefaultSelectedChildrenId(value['children']);
            }
          }
        });
      }

    })


  }
  onSubmit():void{
    if(!this.form.id || this.form.nodeIds.length == 0){
      this.snackBar.alert('请选择功能节点');
      return;
    }
    this.loadDB.loadSaveAllotNode(this.form)
      .subscribe((_res)=>{
        if(_res && _res['status'] == 200){
          this.snackBar.alert('关联权限成功');
          this.sidenavSrvice.onNavigate('/admin/rolemanage','角色管理',this.form,true);
        }else{
          this.snackBar.alert(_res['message']);
        }
      });
  }
  onNextSetp(){
    if(!this.form.id || this.form.nodeIds.length == 0){
      this.snackBar.alert('请选择功能节点');
      return;
    }
    this.loadDB.loadSaveAllotNode(this.form)
      .subscribe((_res)=>{
        if(_res && _res['status'] == 200){
          this.snackBar.alert('关联权限成功');
          if(this.ctr){
            this.ctr.onStep(2);
          }
        }else{
          this.snackBar.alert(_res['message']);
        }
      });


  };
  /**
   * 设置默认选种的节点ID
   * @param children
   */
  public setDefaultSelectedChildrenId(children:Array<any>){
    children.forEach((value)=>{
      let cData = value['data'];
      if(value['partialSelected']){
        this.form.nodeIds.push(cData['id']);
        if(cData['children'] && cData['children'].length > 0){
          this.setDefaultSelectedChildrenId(value['children']);
        }
      }
    });
  }
  public onNodeSelectHeadler(node:Array<any>){
    if(node.length == 0){
      this.form.nodeIds = [];
      return false;
    }
    let nodeIds = this.form.nodeIds;
    node.forEach((value)=>{
      let data = value['data'];
      if(nodeIds.findIndex(value=>{//判断是否存在了
          if(data['id'] == value){
            return true;
          }
          return false;
        }) != -1){
        return;
      }
      nodeIds.push(value['data']['id']);
    });
  }

  public onNodeUnSelectHeadler(nodes){
    let nodeIds = this.form.nodeIds;
    let node = nodes['node'];
    let nodeData = node['data'];
    let pNodeInd = nodeIds.findIndex((value)=>{
      if(nodeData['id'] == value){
        return true;
      }
      return false;
    });

    nodeIds.splice(pNodeInd,1);
    if(!node['parent'] && node['children'] && node['children'].length > 0){
      let children:Array<any> = node['children'];
      this.removeChildren(children);
    }
    this.removeParent(node);
  }

  public removeParent(node){
    let parentNode = node['parent'];
    if(parentNode && parentNode['partialSelected'] == false){
      let nodeIds = this.form.nodeIds;
      let idx = nodeIds.findIndex((value)=>{
        return parentNode['data']['id'] == value;
      });
      nodeIds.splice(idx,1);
    }
  }

  /**
   * 删除子节点ID
   * @param children
   */
  public removeChildren(children:Array<any>){
    let nodeIds = this.form.nodeIds;
    children.forEach((value)=>{
      let cData = value['data'];
      let cNodeInde = nodeIds.findIndex((_value)=>{
        if(cData['id'] == _value){
          return true;
        }
        return false;
      });
      nodeIds.splice(cNodeInde,1);
      if(cData['children'] && cData['children'].length > 0){
        this.removeChildren(cData['children']);
      }
    });
  }
  public hasDisabled(){
    if(!this.form.id|| this.form.nodeIds.length == 0){
      return true;
    }
    return false;
  }


}
