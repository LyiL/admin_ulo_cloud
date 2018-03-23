import {Injectable} from "@angular/core";
import {Database} from "../../../../common/components/table/table-extend-data-source";
import {HttpService} from "../../../../common/services/impl/http.service";
import {Observable} from "rxjs/Observable";

@Injectable()
export class ResourcePoolAccurateDbService extends Database{
  constructor(private http:HttpService){
    super();
  }

  loadData(res):Observable<any>{
    if(res == null){
      this.pageIndex = this.params['page'];
    }else {
      this.params['page'] = this.pageIndex;
    }

    return this.http.post("/cloud/dealersubmchpool/searchpool",this.params);
  }
}
