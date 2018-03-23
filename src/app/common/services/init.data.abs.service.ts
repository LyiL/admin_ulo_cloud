import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {BehaviorSubject} from "rxjs";

@Injectable()
export abstract class InitDataAbsService{

  //数据字典
  public systemConfigSubject:BehaviorSubject<any> = new BehaviorSubject<any>({});
  //领域信息
  public domainCfgSubject:BehaviorSubject<any> = new BehaviorSubject<any>({});

  public menuDataSubject:BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  get menuData():any[]{
    return this.menuDataSubject.getValue();
  }

  public funcDataSubject:BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  get funcData():any[]{
    return this.funcDataSubject.getValue();
  }

  abstract initLoad(host:string);
}
