/**
 * Created by lenovo on 2017/8/2.
 */
import {Database} from "../../../../common/components/table/table-extend-data-source";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/of';
import {HttpService} from "../../../../common/services/impl/http.service";

@Injectable()
export class BussinessAccountCheckService extends Database{

  constructor(private http:HttpService){
    super();
  }

  loadData(res):Observable<any>{
    if (res == null) {
      this.pageIndex = this.pageIndex;
    }else {
      this.params['page'] = this.pageIndex;
    }
    return this.http.post("/pctsManager/seachMchAccountPage",this.params);
  }
}
