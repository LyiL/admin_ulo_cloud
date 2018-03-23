import { Database } from "../../../../common/components/table/table-extend-data-source";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/of";
import { HttpService } from "../../../../common/services/impl/http.service";

@Injectable()
export class RiskMchDbService extends Database {
  constructor(private http: HttpService) {
    super();
  }

  /**
   * 风险商户列表查询
   * @param {
   * beginTime 结算开始日期 *
   * endTime 结算结束日期 *
   * String smid 识别码
   * String merchantName 商户名称
   * String merchantNo 商户编号
   * String chanNo 所属上级编号
   * String risktype 风险类型
   * String processCode 处理结果编号
   * }
   * @returns {Observable<any>}
   */
  loadData(res: string): Observable<any> {
    if (res == null) {
      this.pageIndex = this.params['page'];
    } else {
      this.params['page'] = this.pageIndex;
    }
    return this.http.post('/cloud/incoming/merchant/riskquery', this.params);
  }
}
