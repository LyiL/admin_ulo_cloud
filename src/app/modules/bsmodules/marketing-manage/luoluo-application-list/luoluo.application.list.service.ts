/**
 * Created by Administrator on 2017/11/30.
 */
import {Injectable} from "@angular/core";
import {HttpService} from "../../../../common/services/impl/http.service";
import {Database} from "../../../../common/components/table/table-extend-data-source";
import {Observable} from "rxjs/Observable";

@Injectable()
export class LuoAppListDbService extends Database {
  constructor(private http: HttpService) {
    super();
  }

  loadData (res): Observable<any> {
    if (res == null) {
      this.pageIndex = this.pageIndex;
    }else {
      this.params['page'] = this.pageIndex;
    }
    return this.http.post('/otoAppRelease/search/page', this.params);
  }
}

@Injectable()
export class LuoAppService {
  constructor(private http: HttpService) {

  }

  /**
   * 删除络络应用
   * @param params
   * @returns {Observable<any>}
   */
  deleteApp (params: any): Observable<any> {
    return this.http.post('/otoAppRelease/delete', params);
  }

  /**
   * 更新络络应用
   * @param params
   * @returns {Observable<any>}
   */
  updateApp (params: any): Observable<any> {
    return this.http.post('/otoAppRelease/update', params);
  }

  /**
   * 新增络络应用
   * @param params
   * @returns {Observable<any>}
   */
  addApp (params: any): Observable<any> {
    return this.http.post('/otoAppRelease/add', params);
  }

  /**
   * 获取络络应用详情数据
   * @param params
   * @returns {Observable<any>}
   */
  getAppDetail(params: any): Observable<any> {
    return this.http.post('/otoAppRelease/detail', params);
  }
}
