import {Database} from "../../../../common/components/table/table-extend-data-source";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/of';
import {HttpService} from "../../../../common/services/impl/http.service";
import {MdTreeNode} from "@angular/material";

@Injectable()
export class RoleManageListDBService extends Database{
  constructor(private http:HttpService){
    super();
  }

  loadData(res: string):Observable<any>{
    if (res == null) {
      this.pageIndex = this.params["page"];
    } else {
      this.params["page"] = this.pageIndex;
    }
    return this.http.post("/roleAction/findByPage",this.params);
  }
}


/**
 * 加载角色信息
 */
@Injectable()
export class RoleFormDBLoad{
  constructor(private http:HttpService){}

  /**
   * 加载角色基础信息
   */
  loadRoleInfo(id:number):Observable<any>{
    return this.http.post('/roleAction/findById',{id:id});
  }

  /**
   * 删除角色
   *   id:number  // 编号   *
   */
  loadRoleDel(params:any):Observable<any>{
    return this.http.post('/roleAction/del',params);
  }

  /**
   * 获取角色可继承角色组(仅自身平台)
   *
   */
  loadGetExtends():Observable<any>{
    return this.http.post('/roleAction/getExtends');
  }
  /**
   * 新增或编辑角色组
   * @param params ：RoleAddManageModel
   * @returns {Observable<any>}
   */
  saveRoleInfo(params:any){
    let url = '/roleAction/add';
    if(params && params['id']){
      url = '/roleAction/modify';
    }
    return this.http.post(url,params);
  }

  /**
   * 获得角色功能权限列表
   *  roleId :string  角色主键     *
   *  appId :string   领域id       *
   *  organNo:string 组织机构编号 *
   *  parentRoleId:number  角色父级ID  *
   *
   */
  loadGetAllFunc(params:any):Observable<any>{
    return this.http.post('/roleAction/getAllFunc',params);
  }

  /**
   * 保存关联功能权限
   *   String      rolecode        角色编码     *
   String      appId           领域id       *
   String      orgNo           组织机构编号 *
   Integer[]   nodeIds;        权限编号集合 *
   */
  loadSaveRoleFunc(params:any):Observable<any>{
    return this.http.post('/roleAction/savaRoleFunc',params);
  }

  /**
   * 获得角色菜单权限列表
   * String      roleId          角色主键     *
   String      appId           领域id       *
   String      organNo         组织机构编号 *
   String      subAppid        子应用编码
   Integer     parentRoleId    角色父级ID
   */
  loadAllNode(params:any):Observable<any>{
    return this.http.post('/roleAction/getAllNode',params);
  }

  /**
   * 保存菜单权限
   *  String      id          角色主键     *
   String      rolecode    角色编码     *
   String      appId       领域id       *
   String      orgNo       组织机构编号 *
   Integer[]   nodeIds     菜单编号集合 *
   */
  loadSaveAllotNode(params:any):Observable<any>{
    return this.http.post('/roleAction/allotNode',params);
  }


}
