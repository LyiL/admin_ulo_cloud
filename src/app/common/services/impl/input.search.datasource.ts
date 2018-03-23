import {DataSource} from "@angular/cdk";
import {Observable} from "rxjs/Observable";
import {Database} from "../../components/table/table-extend-data-source";

/**
 * input search数据源
 */
export class InputSearchDatasource extends DataSource<any>{
  constructor(private database:Database){
    super();
  }

  connect(): Observable<any[]> {

    const localDataChanges = [
      this.database.refreshChange,
    ];

    return Observable.merge(...localDataChanges).switchMap(()=>{
      return this.database.loadData(null);
    });
  }

  disconnect(): void {
  }

}
