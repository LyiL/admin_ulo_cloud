import {DataSource} from '@angular/cdk';
import {Response} from "@angular/http";
import {MdPaginator, UUID} from "@angular/material";
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {Subject} from "rxjs/Subject";
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/map';
import {HelpersAbsService} from "../../services/helpers.abs.service";

let TABLE_FIELD:string = "table_id";

export function has(obj,key){
  return Object.prototype.hasOwnProperty.call(obj,key);
}

export abstract class Database{
    dataChange:BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    curPageDataChange:BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    recordChange:Subject<any> = new Subject<any>();
    refreshChange:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    get data():any[]{return this.dataChange.value;};
    get curPageData():any[]{return this.curPageDataChange.value};

    get oldData(){
      return this._oldData;
    }
    set oldData(_oldData:any){
      this._oldData = _oldData;
    }
    private _oldData:any;
    public setPreviousValues(value:any){
        if(this.dataComparison(value)){//一致返回 true，否则 false
          return false;
        }
        if(this.previousValues.findIndex((pValue)=>{
                if(pValue[TABLE_FIELD] == value[TABLE_FIELD]){
                    return true;
                }
                return false;
            }) == -1){
            this.previousValues.push(value);
            this.recordChange.next({previousValue:value,previousValues:this.previousValues,r:Math.random()});
        }
    }
    private previousValues:any[] = [];

    get pageSize():number{
        return this._pageSize;
    }
    set pageSize(pageSize:number){
        this._pageSize = pageSize;
    }
    private _pageSize:number = 10;

    get pageIndex():number{
        return this._pageIndex;
    }
    set pageIndex(pageIndex:number){
        this._pageIndex = pageIndex;
    }
    private _pageIndex:number = 0;

    get params():any{
        return this._params;
    }
    set params(params:any){
        this._params = params;
    }
    private _params:any = {};

    loadData(res):Observable<any>{
        return Observable.of(null);
    }

    /**
     * 刷新
     */
    refresh():void{

    }

  /**
   * 判断数据是否与源始数据不一致
   * @param newData
   * @returns {boolean} 一致返回 true，否则 false
   */
    public dataComparison(newData:any){
      let flag = false;
      this.oldData && this.oldData.forEach((_old:any)=>{
        if(_.isEqual(newData,_old)){
          flag = true;
        }
      })
      return flag;
    }

    public editRow(row:any){
      let _ind:number;
      let _oldRowData = this.data.find((_old,index)=>{
        if(row[TABLE_FIELD] == _old[TABLE_FIELD]){
          _ind = index;
          return true;
        }
        return false;
      });
      if(_oldRowData){
        this.data[_ind] = _.extend(_oldRowData,row);
      }
    }


  /**
   * 还原数据
   * @param row
   * @returns {Observable<T>|undefined|T|KeyValueDifferFactory|number|IterableDifferFactory}
   */
    public restoreData(row:any){
      let _oldRowData = this.oldData && this.oldData.find((_old)=>{
        if(row[TABLE_FIELD] == _old[TABLE_FIELD]){
          return true;
        }
        return false;
      });
      if(_oldRowData){
        row = _.extend(row,_oldRowData);
      }
    }

  /**
   * 获取原始数据
   * @param tableId
   * @returns {any}
   */
  public getSourceData(row:any,flag:boolean = false):any{
      if(flag){
        return (this.oldData instanceof Array) && this.oldData.find((res)=>{
            return res[TABLE_FIELD] = row[TABLE_FIELD];
          });
      }
      return (this.data instanceof  Array) && this.data.find((res)=>{
          return res[TABLE_FIELD] = row[TABLE_FIELD];
        });
    }
}

export class MdTableExtendDataSource extends DataSource<any>{
    resultsLength: number = 0;

    localRefreshSourceDataChange:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(private _database:Database,private _paginator: MdPaginator,private _isLocal:boolean = false,private initLoad:boolean = true,private helper:HelpersAbsService){
        super();
        this._paginator.pageIndex = this._database.pageIndex;
        this._paginator.pageSize = this._database.pageSize;
    }

    refresh(page:number){
      this.initLoad = true;
      this._database.pageIndex = page || 0;
      this._paginator.pageIndex = page || 0;
      this._paginator.page.next();
    }

    connect(): Observable<any>{
        const displayDataChanges = [
            this._paginator.page
        ];

        const localDataChanges = [
          this._database.dataChange,
          this._paginator.page,
          this._database.refreshChange,
          this.localRefreshSourceDataChange
        ];

        if(this._isLocal){
          return Observable.merge(...localDataChanges)
            .startWith(null)
            .switchMap((res) => {
              if(this._database.data && this._database.data.length == 0){
                return this._database.loadData(res);
              }else{
                this._database.data.map((_res:any)=>{
                  _res[TABLE_FIELD] = _res[TABLE_FIELD] ? _res[TABLE_FIELD] : UUID.UUID();
                  _res['isEdit'] =  _res['isEdit'] ? true : false;
                  return _res;
                });
                if((this._database.oldData === undefined || res == true) && !this._database.data.find(_d=>{return _d['isNewest']})){
                  this._database.oldData = this.helper.clone(this._database.data);
                }
              }
              return Observable.of(this._database.data);
            })
            .catch((e)=>{
              return Observable.of(null);
            })
            .map(result => {
              // if (!result) { return []; }
              // if(!(this._database.data && this._database.data.length > 0)){
              //   return this.readResult(result);
              // }
              return result;
            })
            .map(result => {
              if (!result) { return []; }
              if(this._database.data && this._database.data.length > 0){
                return this.localData();
              }
              return result;
            });
        }

        return Observable.merge(...displayDataChanges)
            .startWith(null)
            .switchMap((res) => {
                  this._database.pageIndex = this._paginator.pageIndex;
                  this._database.pageSize = this._paginator.pageSize;
                  if(this.initLoad == false){
                    return Observable.of([]);
                  }
                  return this._database.loadData(res);
            })
            .catch((e) => {
                return Observable.of(null);
            })
            .map(result => {
                return result;
            })
            .map(result => {
                if (!result) { return []; }
                return this.readResult(result);
            });
    }

    disconnect() {
      // this.unsubscribe(this._database.dataChange);
      // this.unsubscribe(this._database.refreshChange);
      // this.unsubscribe(this._paginator.page);
      // this.unsubscribe(this.localRefreshSourceDataChange);
    }

    /**
     * 创建新一个新行
     * @param columns
     * @param data
     * @returns {any}
     */
    createNewRow(columns:any[],data?:any):any{
        let tmpRow:any = {};
        columns.forEach((col)=>{
            let _name = col.name;
            if(_name instanceof Array){
                _name.forEach((_n)=>{
                    tmpRow[_n] = !data ? (col.defValue ? col.defValue : this.dataTypeDefValue(col)) : data[_n];
                });
            }else{
              tmpRow[_name] = !data ? (col.defValue ? col.defValue : this.dataTypeDefValue(col)) : data[_name];
            }
        });
        const newRow = tmpRow;
        return newRow;
    }

    /**
     * 删除数据
     * @param data
     * @returns {boolean}
     */
    deleteRow(data:any){
        const _datasource = this._database.data.slice();
        if(!_datasource || (_datasource && _datasource.length <= 0)){
            return false;
        }
        let removeIndex = _datasource.findIndex((item)=>{
            if(data[TABLE_FIELD] == item[TABLE_FIELD]){
                return true;
            }
            return false;
        });
        if(removeIndex != -1){
            _datasource.splice(removeIndex,1);
        }
        this._database.dataChange.next(_datasource);
    }

    private localData(){
        const data = this._database.data.slice();
        this.resultsLength = data.length;
        const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
        const _data = data.splice(startIndex, this._paginator.pageSize);
        this._database.curPageDataChange.next(_data);
        return _data
    }

    private readResult(result:any):Array<any>{
        let _res = result;
        if(result instanceof Response){
            _res = result.json();
            this.resultsLength = _res['data'] && _res['data'].totalRows || 0;
        }else if(result instanceof Object){
            this.resultsLength = result['data'] && result['data'].totalRows || 0;
        }else{
            try{
                _res = JSON.parse(result);
                this.resultsLength = _res['data'] && _res['data'].totalRows || 0;
            }catch (e){}

        }
        const _data = _res.data && _res.data['innerData'] && _res.data['innerData'].map((_res:any)=>{
            _res[TABLE_FIELD] = !_res[TABLE_FIELD] ? UUID.UUID() : _res[TABLE_FIELD];
            _res['isEdit'] = false;
            return _res;
        });

        if(!this._isLocal){
          this._database.oldData = this.helper.clone(_data);
          this._database.curPageDataChange.next(_data);
        }else{
          this._database.dataChange.next(_data);
        }
        return _data;
    }

  /**
   * 根据数据类型返回默认值
   * @param column
   * @returns {number}
   */
    private dataTypeDefValue(column:any):any{
      if(column && column.xtype){
        const xtype = column.xtype;
        if(xtype == 'number'){
          return undefined;
        }
      }else if(column && column.type){
        const type = column.type;
        if(type == 'multipleSelect'){
          return [];
        }
      }
      return '';
    }

    /**
     * 销毁消息监听
     * @param obj
     */
    private unsubscribe(obj:any){
      if(obj && has(obj,'closed') && !obj['closed']){
        obj.unsubscribe();
      }
    }
}
