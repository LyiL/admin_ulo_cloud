import {Database} from "../../../../common/components/table/table-extend-data-source";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/of';
import {HttpService} from "../../../../common/services/impl/http.service";

@Injectable()
export class VersionManageListDBService extends Database{

  constructor(private http:HttpService){
    super();
  }

  loadData():Observable<any>{
    this.params['page'] = this.pageIndex;
    this.params['size'] = this.pageSize;
    return this.http.post("/versionManage/searchPlatVersion",this.params);
  }
}
@Injectable()
export class VersionDBLoad {
  constructor(private http: HttpService) {
  }
  /**
   *查询版本详情
   *   int  id 主键 *
   */
  loadVersion(params:any):Observable<any>{
    return this.http.post('/versionManage/searchById',params);
  }

  /**
   * 编辑版本
   *  int    id           主键编号    *
   String platform     客户端编号  *
   String version      版本号      *
   String versionName  版本名称
   String versionRemark 版本说明
   *
   *
   */
  loadUpdatePlatVersio(params:any):Observable<any>{
    return this.http.post('/versionManage/updatePlatVersion',params);
  }
  /**
   * 新增或编辑版本
   * @param params ：StaffAddBaseInfoModel
   * @returns {Observable<any>}
   */
  saveVersionInfo(params:any){
    let url = '/versionManage/addPlatVersion';
    if(params && params['id']){
      url = '/versionManage/updatePlatVersion';
    }
    return this.http.post(url,params);
  }
}

