import {Injectable} from "@angular/core";
import {InitDataAbsService} from "../init.data.abs.service";
import {HttpService} from "./http.service";
import {CommonEnumConst} from "./common.enum.const";
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/forkJoin";

@Injectable()
export class InitDataService extends InitDataAbsService{
  constructor(private http:HttpService){
    super();
  }

  /**
   * 初始化数据
   * @param host
   */
  initLoad(host:string){
    const _host = host;
    let _sessionSysCfg = sessionStorage.getItem(CommonEnumConst.INIT_DATA_SESSION_STORAGE_KEY.SYSTEM_CFG);
    let _sessionDomainCfg = sessionStorage.getItem(CommonEnumConst.INIT_DATA_SESSION_STORAGE_KEY.DOMAIN_CFG);
    if(_sessionSysCfg && _sessionDomainCfg){
      _sessionSysCfg = JSON.parse(_sessionSysCfg);
      _sessionDomainCfg = JSON.parse(_sessionDomainCfg);
      _sessionDomainCfg && this.domainCfgSubject.next(_sessionDomainCfg);
      _sessionSysCfg && this.systemConfigSubject.next(_sessionSysCfg);
      return;
    }

    Observable.forkJoin([this.loadDomainInfo(_host),this.loadSysCfg()]).subscribe((res)=>{
      if(res){
        let domainCfgRes = res[0];
        let sysCfgRes = res[1];
        domainCfgRes && this.domainCfgSubject.next(domainCfgRes['data']);
        sysCfgRes && this.systemConfigSubject.next(sysCfgRes['data']);
        sessionStorage.setItem(CommonEnumConst.INIT_DATA_SESSION_STORAGE_KEY.SYSTEM_CFG,JSON.stringify(sysCfgRes['data']));
        sessionStorage.setItem(CommonEnumConst.INIT_DATA_SESSION_STORAGE_KEY.DOMAIN_CFG,JSON.stringify(domainCfgRes['data']));
      }
    });
  }

  /**
   * 获取配置信息
   * @returns {Observable<R>}
   */
  private loadSysCfg(): Observable<any> {
    return this.http.post('/sysConfig/finds');
  }

  /**
   * 加载领域信息
   * @param host
   * @returns {Observable<R>}
   */
  private loadDomainInfo(host: string): Observable<any> {
    return this.http.post('/platDomainCfg/getByHost',{hosts:host});
  }

}
