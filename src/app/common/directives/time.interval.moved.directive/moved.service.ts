import {Injectable} from "@angular/core";
import {Subject} from "rxjs/Subject";

@Injectable()
export class TimeIntervalMovedService{
  /**
   * 移动事件
   * @type {Subject}
   */
  public moveEvent:Subject<{before:boolean,after:boolean}> = new Subject<{before:boolean,after:boolean}>();

  /**
   * 重置时间轴
   * @type {Subject<any>}
   */
  public resetIntervalEvent:Subject<boolean> = new Subject();
}
