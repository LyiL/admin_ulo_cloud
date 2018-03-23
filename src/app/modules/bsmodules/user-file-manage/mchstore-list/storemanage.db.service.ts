import {Database} from "../../../../common/components/table/table-extend-data-source";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/of';
import {HttpService} from "../../../../common/services/impl/http.service";

@Injectable()
export class StoreManageListDBService extends Database{

  constructor(private http:HttpService){
    super();
  }

  loadData():Observable<any>{
    // return this.http.post("tradeoffQuery/orderQueryByCloud",this.params);
    return this.http.get("webassets/test-data/service-provider-list/list.data.json");
  }
}
