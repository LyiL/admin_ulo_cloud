import {Database} from "../../../../common/components/table/table-extend-data-source";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/of';
import {HttpService} from "../../../../common/services/impl/http.service";

@Injectable()
export class StaffManageListDBService extends Database{

  constructor(private http:HttpService){
    super();
  }

  loadData(res: string):Observable<any>{
    if (res == null) {
      this.pageIndex = this.params["page"];
    } else {
      this.params["page"] = this.pageIndex;
    }
    return this.http.post("/userAction/findByPage",this.params);
  }
}


@Injectable()
export class StaffFormDBLoad {
  constructor(private http: HttpService) {
  }
  /**
   * 删除角色
   *   id:number  // 编号   *
   */
  loadUserDel(params:any):Observable<any>{
    return this.http.post('/userAction/del',params);
  }

  /**
   * 修改员工
   *    Integer     id          主键编号    *
   String      userName    用户名      *
   String      phone       联系电话
   String      realName    真实姓名    *
   *
   *
   */
  loadModifyStaff(params:any):Observable<any>{
    return this.http.post('/userAction/modify',params);
  }

  /**
   * 修改员工密码
   *  Integer     id          主键编号    *
   String      userPwd     密码        *
   */
  loadUserModifyPwd(params:any):Observable<any>{
    return this.http.post('/userAction/modifyPwd',params);
  }

  /**
   * 获取角色列表-不分页
   *   string username 用户名
   int  parentIds 父级id
   */
  loadRoleList(params:any):Observable<any>{
    return this.http.post('/roleAction/findByList',params);
  }

  /**
   * 员工分配角色
   *  Integer     id          主键编号*
   Integer[]   roleIds     角色id集*
   */
  loadStaffAllot(params:any):Observable<any>{
    return this.http.post('/userAction/allotRole',params);
  }

  /**
   * 查询员工
   *  Integer     id          主键编号    *
   */
  loadStaff(params:any):Observable<any>{
    return this.http.post('/userAction/findById',params);
  }
  /**
   * 新增或编辑角色组
   * @param params ：StaffAddBaseInfoModel
   * @returns {Observable<any>}
   */
  saveStaffInfo(params:any){
    let url = '/userAction/add';
    if(params && params['id']){
      url = '/userAction/modify';
    }
    return this.http.post(url,params);
  }

}
