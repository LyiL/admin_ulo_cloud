import {
  Output,
  EventEmitter,
  Input,
  ViewChild,
  Component,
  OnInit,
  Renderer2,
  Inject,
  ElementRef,
  OnDestroy
} from "@angular/core";
import {Action, Column, MdTableExtendConfig, EditWinOption} from "./table-extend-config";
import {MdTableExtendService, MD_TABLE_EXTEND_DATA} from "./table-extend-service";
import {Database, MdTableExtendDataSource} from "./table-extend-data-source";
import {coerceBooleanProperty} from "@angular/cdk";
import {extendObject, MdPaginator, MdSnackBar, MdPupop} from "@angular/material";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/delay";
import {MdTableEditWin} from "./edit/table-edit-win";
import {DOCUMENT} from "@angular/common";
import {HelpersAbsService} from "../../services/helpers.abs.service";
import {Subscription} from "rxjs/Subscription";

export type TableMode = "inline"|"edit"|"editWin";

let TABLE_FIELD:string = "table_id";
/**
 * 表格控件
 */
@Component({
    moduleId: module.id,
    selector:'md-table-extend,mat-table-extend',
    templateUrl:'table-extend.html',
    styleUrls:['table-extend.scss'],
    host: {
        'class': 'mat-table-extend'
    },
    providers:[MdTableExtendService]
})
export class MdTableExtend implements OnInit, OnDestroy{

    get ctrId(){
      return this._ctrId;
    }
    set ctrId(_ctrId:string){
      this._ctrId = _ctrId;
    }
    private _ctrId:string;

    get columns():Array<Column>{
        return this._columns;
    }
    @Input()
    set columns(_columns:Array<Column>){
        this._columns = this.handleColumnsData(_columns);
        this.displayedColumns = this.getShowColumn(_columns);
        this.columnsChange.emit(_columns);
    }
    private _columns:Array<Column>;//表格列
    @Output()
    public columnsChange:EventEmitter<any> = new EventEmitter();
    public displayedColumns:Array<string>;//显示列，私有
    public _defColumn:string = "table_action";

    @Input() public editWinOption: EditWinOption={title:'',width:'1000px',isRequser:true}; //编辑窗体标题， mode 为 editWin模式生效

    get database():Database{
        return this._database;
    }
    @Input()
    set database(database:Database){
        if(this._database != database){
            this._database = database;
        }
    }
    private _database:Database;//数据源
    @Input()
    get detailCfg():MdTableExtendConfig{
        return this._detailCfg;
    }
    set detailCfg(cfg:MdTableExtendConfig){
        this._detailCfg = cfg;
    }
    private _detailCfg:MdTableExtendConfig;
    @Input()
    get local(){
        return this._local;
    }
    set local(_local:any){
        this._local = coerceBooleanProperty(_local);
    }
    private _local = false;

    @Input()
    get mode():TableMode{
      return this._mode;
    }
    set mode(mode:TableMode){
      this._mode = mode;
    }
    private _mode:TableMode = "inline";

    @Input()
    get isShowOddEffet(){
        return this._isShowOddEffet;
    }
    set isShowOddEffet(_isShowOddEffet:any){
        this._isShowOddEffet = coerceBooleanProperty(_isShowOddEffet);
    }
    private _isShowOddEffet = false;

    // @Input()
    // pageSizeOptions:Array<number> | undefined = [5, 10, 25, 100];

    private _actionDisplay:string = 'table-cell';


    get actionCfg():any{
        return this._actionCfg;
    }
    @Input()
    set actionCfg(_actionCfg:any){
      if(_actionCfg){
          if(typeof _actionCfg.hide == 'function'){
            _actionCfg.hide = _actionCfg.hide();
          }

          if(_actionCfg.hide){
            this._actionDisplay = "none";
          }else{
            this._actionDisplay = "table-cell";
          }
          if(_actionCfg && _actionCfg['actions']){
            this.setAction(_actionCfg.actions);
            extendObject(this._actionCfg,this.helper.clone(_actionCfg,['actions'])) ;
          }
          this._actionCfg.width = _actionCfg.width ? _actionCfg.width : '200px';
          this._actionCfg.isEidtModel = _actionCfg.isEidtModel ? _actionCfg.isEidtModel : false;
          this.actionCfgChange.next(_actionCfg);
        }
    }
    private _actionCfg:any = {
        width:'200px',
        isEidtModel:false,
        hide:false || (()=> {return false}),
        actions:[{
            click:this.edit.bind(this),
            btnName:'edit',
            btnDisplay:'编辑',
            hide:((row:any)=>{
                if(row['isEdit'] == true){
                    return true;
                }
                return false;
            })
        },{click:this.delete.bind(this),
            btnName:'del',
            btnDisplay:'删除',
            hide:((row:any)=>{
                if(row['isEdit'] == true){
                    return true;
                }
                return false;
            })
        },{click:this.confirm.bind(this),
            btnName:'confirm',
            btnDisplay:'确定',
            hide:((row:any)=>{
                if(!row['isEdit'] || row['isEdit'] == false){
                    return true;
                }
                return false;
            })
        },{click:this.cancel.bind(this),
            btnName:'cancel',
            btnDisplay:'取消',
            hide:((row:any)=>{
                if(!row['isEdit'] || row['isEdit'] == false){
                    return true;
                }
                return false;
            })
        }]
    };
    public actionCfgChange:EventEmitter<any> = new EventEmitter<any>();

    public dataSource:MdTableExtendDataSource | null;
    @ViewChild(MdPaginator) _paginator: MdPaginator;

    //是否初始加载数据
    @Input()
    get initLoad(){
      return this._initLoad;
    }
    set initLoad(_initLoad:any){
      this._initLoad = coerceBooleanProperty(_initLoad);
    }
    private _initLoad = true;
    //input function
    @Input()
    delConfirmFunc:Function | undefined;//删除确认事件
    @Input()
    saveConfirmFunc:Function | undefined;//保存确认
    @Input()
    onSaveOb:Function | undefined;//mode 为 editWin时，点击保存掉用此方法

    //output event
    @Output()
    onDelete:EventEmitter<any> | Function | undefined = new EventEmitter<any>(); //删除事件
    @Output()
    onSave:EventEmitter<any> | Function | undefined = new EventEmitter<any>();//编辑保存事件
    @Output()
    rowClick:EventEmitter<any> = new EventEmitter<any>();//表格点击事件
    @Output()
    onEditBefore:EventEmitter<any> | Function | undefined = new EventEmitter<any>();//点击编辑按钮前事件
    @Output()
    onCancel:EventEmitter<any> | Function | undefined = new EventEmitter<any>();//取消按钮事件
    public isDetailTable:boolean = false;
    public detailTables:any = {};
    public emptyFn = (value: any) => {};

    private hasEdit:boolean = false;//判断是否有修改数据

    constructor(private ren:Renderer2,private snackBar:MdSnackBar,
                private pupop:MdPupop,
                private el:ElementRef,
                private tableExtendService:MdTableExtendService,
                private helper:HelpersAbsService,
                @Inject(MD_TABLE_EXTEND_DATA) public data: any,
                @Inject(DOCUMENT) public _doc: any){
        if(data instanceof MdTableExtendConfig){
            this.columns = data.columns;
            this.database = data.database;
            this.local = data.local;
            this.initLoad = data.initLoad;
            this.actionCfg = data.actionCfg;
            this.mode = data.mode;
            this.onSave = data.onSave;
            this.onDelete = data.onDelete;
            this.onCancel = data.onCancel;
            this.onEditBefore = data.onEditBefore;
            this.delConfirmFunc = data.delConfirmFunc;
            this.saveConfirmFunc = data.saveConfirmFunc;
            this.isDetailTable = true;
            this.ctrId = data.ctrId;
        }
    }

    ngOnInit(){
        Observable.timer(100).subscribe(()=>{
          this.dataSource = new MdTableExtendDataSource(this._database,this._paginator,this.local,this.initLoad,this.helper);
        });

        this._database.dataChange.subscribe(res=>{
          if(this.local){
            let nodes = this.el.nativeElement.querySelectorAll('table-wrap');
            if(nodes && nodes.length > 0){
              nodes.forEach((node)=>{
                this.ren.removeChild(this.el.nativeElement,node);
              })
            }
            this.detailTables = {};
          }
        });
        this.database.recordChange.subscribe(()=>{
          this.hasEdit = true;
        });
    }

  ngOnDestroy(){
    // this.unsubscribe(this.onDelete);
    // this.unsubscribe(this.onSave);
    // this.unsubscribe(this.rowClick);
    // this.unsubscribe(this.onEditBefore);
    // this.unsubscribe(this.onCancel);
  }

    /**
     * 刷新请求
     */
    refresh(page?:number){
      this.dataSource.refresh(page);
    }

    onRowClick(row:any,e:any){
        e.event.preventDefault();
        e.event.stopPropagation();
        let detailTable = this.detailTables[row[TABLE_FIELD]];
        if(!this.detailCfg || row['isEdit'] == true || (detailTable && detailTable['hasEdit'] == true)){
            return false;
        }
        let clickRowEl = e.view.element.nativeElement;
        let nextSibling:HTMLElement = this.ren.nextSibling(clickRowEl);
        let parent = this.ren.parentNode(clickRowEl);

        if(nextSibling && nextSibling.nodeName == 'TABLE-WRAP'){
            this.ren.removeChild(parent,nextSibling);
            detailTable && (detailTable['hasEdit'] = false);
            delete this.detailTables[row[TABLE_FIELD]];
            return;
        }

        const detailTableCfg = this.detailCfg;
        const _detailTableInstance = this.tableExtendService.init(MdTableExtend,{columns:detailTableCfg.columns,
            database:new detailTableCfg.database(),
            local:detailTableCfg.local,
            initLoad:detailTableCfg.initLoad,
            actionCfg:detailTableCfg.actionCfg,
            pageSizeOptions:detailTableCfg.pageSizeOptions,
            mode:detailTableCfg.mode,
            onSave:detailTableCfg.onSave,
            onCancel:detailTableCfg.onCancel,
            onDelete:detailTableCfg.onDelete,
            onEditBefore:detailTableCfg.onEditBefore,
            delConfirmFunc:detailTableCfg.delConfirmFunc,
            saveConfirmFunc:detailTableCfg.saveConfirmFunc,
            ctrId:row[TABLE_FIELD]
        },parent,nextSibling);
      this.detailTables[row[TABLE_FIELD]] = _detailTableInstance;
      this.rowClick.emit({parentData:row,detailCtr:_detailTableInstance});
    }
  // detailTableCfg.database.params = extendObject(detailTableCfg.database.params || {},row);

    private _editTmpRow:any;//编辑时数据
    private _editAbnormal:boolean = false;//编辑异常状态
    /**
     * 编辑事件
     * @param row
     */
    edit(row:any,cell:any,e:any){
        this._editTmpRow = this.helper.clone(row);
        if(this.mode == "edit"){
            if(this.hasDataEditMode() === false){
              return false;
            }
        }

        row['isEdit'] = true;
        this._editTmpRow['isEdit'] = true;

        if(this.onEditBefore){
            if(this.onEditBefore instanceof Function){
              this.onEditBefore(row);
            }else{
              this.onEditBefore.emit(row);
            }
        }

        if(this.mode == 'editWin') {
            e.preventDefault();
            e.stopPropagation();

            this.editWin(row,'编辑');
        }
    }

    editRowData(row:any){
      this.database.editRow(row);
      this.refresh(0);
    }

    /**
     * 删除事件
     * @param row 行数据
     */
    delete(row:any,cell:any){

        let returnDelVal:any = this.delConfirmFunc && this.delConfirmFunc(row);
        if( returnDelVal === false){
          return false;
        }else if(returnDelVal instanceof Observable){
          returnDelVal.subscribe(res=>{
            if(res === true){
              this.dataSource && this.dataSource.deleteRow(row);
              if(this.onDelete){
                if(this.onDelete instanceof Function){
                  this.onDelete(row);
                }else{
                  this.onDelete.emit(row);
                }
              }
            }
          });
        }

        if(!(returnDelVal instanceof Observable)){
          this.dataSource && this.dataSource.deleteRow(row);
          if(this.onDelete){
            if(this.onDelete instanceof Function){
              this.onDelete(row);
            }else{
              this.onDelete.emit(row);
            }
          }

        }
    }

    /**
     * 确认事件
     * @param row
     */
    confirm(row:any,cell:any,flag:boolean = false){
        if(this.saveConfirmFunc && this.saveConfirmFunc(row,this.database) === false){
            this._editAbnormal = true;
            row = this._editTmpRow;
            return false;
        }
        let errTitle = this.hasDataRequired(row,cell);
        if(errTitle.length > 0){//交验数据是否都填写好了
          this.snackBar.alert('以下信息为必填项('+errTitle.join(',')+')');
          this._editAbnormal = true;
          row = this._editTmpRow;
          return false;
        }
        row['isEdit'] = false;
        delete row['isNewest'];
        this._database.setPreviousValues(this.helper.clone(row));

        if(this.mode == 'editWin' && this.editWinOption.isRequser){
          if(this.onSaveOb){
            return this.onSaveOb(row);
          }
        }else{
          if(this.onSave){
            if(this.onSave instanceof Function){
              this.onSave(row);
            }else {
              this.onSave.emit(row);
            }
          }
          if(this.local && flag !== true){//操作本地数据时，点击确认按钮需要将原始数据更新
            this.dataSource.localRefreshSourceDataChange.next(true);
          }
          if(this._editTmpRow != undefined){
            this._editTmpRow = undefined;
          }
          return true;
        }
    }

    /**
     * 取消事件
     */
    cancel(row:any){
        row['isEdit'] = false;
        if(row['isNewest'] == true){
            this.dataSource && this.dataSource.deleteRow(row);
        }else{
            this._database.restoreData(row);
        }

        if(this._editAbnormal){
            row = _.extend(row,this._editTmpRow);
            row['isEdit'] = false;
            this._editAbnormal = false;
            this._editTmpRow = undefined;
        }else if(this.onCancel){
            if(this.onCancel instanceof Function){
              this.onCancel(row);
            }else{
              this.onCancel.emit(row);
            }
        }
    }

    /**
     *
     * @returns {boolean}
     */
    newRow(row?: any){
        // if(this.hasDataEditMode() === false){
        //   return false;
        // }
        if(!this.dataSource){
            return false;
        }
        const data = this.database.data.slice();
        let tmpRow = this.dataSource.createNewRow(this.columns);
            tmpRow['isNewest'] = true;
            tmpRow['isNew'] = true;
            tmpRow['isEdit'] = true;
        if(row && _.isObject(row) && _.size(row) > 0){
          tmpRow = _.extend(tmpRow,row);
        }
        data.push(tmpRow);
        this.database.dataChange.next(data);

        if(this.mode == 'editWin'){
          this.editWin(tmpRow);
        }
    }

    /**
     * 判断显示的列
     * @param _columns
     * @returns {Array<string>}
     */
    getShowColumn(_columns:Array<Column>):Array<string>{
        let _displayCols:Array<string> = new Array<string>();
        for(let i=0, _col:Column; i<_columns.length; i++){
            _col = _columns[i];
            let hide = false;
            if(_col['hide']){
              hide = _col.hide instanceof Function ? _col.hide() : _col.hide;
            }
            if(hide === false){
                if(_col.name instanceof Array){
                    _displayCols.push(_col.name[0]);
                }else{
                    _displayCols.push(_col.name);
                }
            }
        }
        _displayCols.push(this._defColumn);
        return _displayCols;
    }

    public handleColumnsData(columns:Array<any>){
      columns.forEach((column,index)=>{
        if(!column){return;}
        let type = column['type'];//当type为undefined是，对应的控件为input
        let otherOpts = column['otherOpts'];

        if(otherOpts && (type == 'select' || type == 'multipleSelect')){
          if(!column['otherOpts']['open']){
            columns[index]['otherOpts']['open'] = ()=>{};
          }
          if(!column['otherOpts']['onChange']){
            columns[index]['otherOpts']['onChange'] = ()=>{};
          }
        } else if((type == 'inputSearch' || type == undefined) && (otherOpts === undefined || (otherOpts && !otherOpts['onBlur']))){
          if(otherOpts == undefined){
            columns[index]['otherOpts'] = {};
            otherOpts = {};
          }
          columns[index]['otherOpts']['onBlur'] = ()=>{};
        }
        if(!otherOpts){
          columns[index]['otherOpts'] = {disabled:()=>{return false;},required:()=>{return false;}};
          otherOpts = {};
        }
        if(otherOpts && !otherOpts['disabled']){
          columns[index]['otherOpts']['disabled'] = ()=>{return false;};
        }else if(otherOpts && otherOpts['disabled'] && !(otherOpts['disabled'] instanceof Function)){
          if(otherOpts['disabled'] === true){
            columns[index]['otherOpts']['disabled'] = ()=>{return true};
          }else{
            columns[index]['otherOpts']['disabled'] = ()=>{return false};
          }
        }
        if(otherOpts && otherOpts['required'] === undefined){
          columns[index]['otherOpts']['required'] = ()=>{return false;};
        }else if(otherOpts && otherOpts['required'] !== undefined && !(otherOpts['required'] instanceof Function)){
          if(otherOpts['required'] === true){
            columns[index]['otherOpts']['required'] = ()=>{return true};
          }else{
            columns[index]['otherOpts']['required'] = ()=>{return false};
          }
        }
      });
      return columns;
    }


    public cellName(name:string|Array<string>){
        if(name instanceof Array){
            return name[0];
        }
        return name;
    }

    public setAction(actions:any[]){
        if(!actions || (actions && actions.length == 0)){
            return;
        }
        actions.forEach((action:Action,index:number)=>{
            let _defActionInd = this.actionCfg.actions.findIndex((defAction:Action)=>{
                if(action.btnName && action.btnName == defAction.btnName){
                    return true;
                }
                return false;
            });

            if(_defActionInd != -1){
                extendObject(this._actionCfg.actions[_defActionInd],action);
            }else{
                if(action.hide == undefined){
                    action.hide = false;
                }
                this._actionCfg.actions.push(action);
            }
        });
    }

    /**
     * 判断按钮是否为最后一位
     * @param indx
     * @param row
     * @param actions
     * @returns {boolean}
     */
    public hasShowBtns(indx:number,row:any,actions:any[]){
      let showActionCount:number = 0;
      let showActions:number[] = []
      actions.forEach((action,ind)=>{
        if(this.hasShowBtn(row,action)){
          showActions[showActionCount] = ind;
          showActionCount++;
        }
      });
      if(showActions.find((val,ind)=>{
        if(indx == val && ind == showActions.length - 1){
          return true;
        }
        return false;
      }) != undefined){
        return true;
      }
      return false;
    }

    public hasShowBtn(row:any,btn:Action):boolean{
        let btnFlag = false;
        if(btn.hide instanceof Function){
            btnFlag = btn.hide(this.helper.clone(row),this);
        }else{
            btnFlag = btn.hide === false ? false : true;
        }
        if(btnFlag === true){
            return false;
        }

        return true;
    }

    public btnDisplay(row:any,action:Action){
      if(action.btnDisplay instanceof Function){
        return action.btnDisplay(row);
      }
      return action.btnDisplay;
    }

    public btnDisabled(row,action:Action):boolean{
      let flag:boolean = false;
      if(action && action.disabled){
        if(action.disabled instanceof Function){
          flag = action.disabled(row);
        }else{
          flag = action.disabled;
        }
      }
      return flag;
    }

    /**
     * 按钮点击事情
     */
    public btnClick(btn:any,row:any,cell:any,e:any){
      if(btn && btn.click){
        btn.click(row,cell,e,this);
      }
    }

    /**
     * 判断当前是否有数据
     */
    public hasData(){
      if(this.local == true && ((this.database && this.database.data && this.database.data.length <= 0) || !this.database || (this.database && !this.database.data))){
        return true;
      }else if(this.local == false && ((this.database && this.database.curPageData && this.database.curPageData.length <= 0) || !this.database || this.database && !this.database.curPageData)){
        return true;
      }
      return false;
    }

    public hasWith(_width:any){
      if(_width != undefined){
        return 'auto';
      }
      return 1;
    }

    /**
     * 获取必填字段
     * @returns {any}
     */
    public getRequiredField(row:any,cell:any):any{
      let requiredColumns:any = {};
      this.columns.forEach((column)=>{
        if(column['otherOpts']){
          let _required = column['otherOpts']['required'];
          if(_required instanceof Function){
            _required = _required(row,cell);
          }
          if(_required === true){
            if(column['name'] instanceof Array){
              requiredColumns[column['name'][0]] = column['firstTitle'];
              requiredColumns[column['name'][1]] = column['lastTitle'];
            }else{
              let name:any = column['name'];
              requiredColumns[name] = column['title'];
            }
          }
        }
      });
      return requiredColumns;
    }

    /**
     * 交验是否有必填内容没有填写
     * @param row
     * @returns {boolean}
     */
    public hasDataRequired(row:any,cell:any){
      let requiredColumns:any = this.getRequiredField(row,cell);
      let errTitle:Array<string> = [];
      for(let key in requiredColumns){
        if(!_.isArray(row[key]) && this.isEmpty(row[key])){
          errTitle.push(requiredColumns[key]);
        }else if(_.isArray(row[key]) && row[key].length <= 0){
          errTitle.push(requiredColumns[key]);
        }
      }
      return errTitle;
    }

    public isEmpty(val:any){
      if(val == null || val == undefined || val === '' || val == 'null'){
        return true;
      }
      return false;
    }

    /**
     * 处理NUMBER值，将个位重置为0
     */
    private handlerNumber(val:number):number{
        let tmp:string = (val+'');
        if(tmp.length > 1){
            tmp = tmp.substring(0,tmp.length - 1)+'0';
        }
        return Number(tmp);
    }

    private hasDataEditMode():boolean{
      let filterData:Array<any> = this.local ? this.database.data.filter((_row)=>{
        return _row['isEdit'];
      }) : this.database.curPageData.filter((_row)=>{
        return _row['isEdit'];
      });
      if(filterData && filterData.length > 0){
        this.snackBar.alert('您已有一条数据处于编辑状态，请先处理完！');
        return false;
      }
      return true;
    }

    private unsubscribe(obj:any){
      if(obj && ((obj instanceof EventEmitter) || (obj instanceof Subscription))){
        if(!obj['closed']){
          obj.unsubscribe();
        }
      }
    }

    private editWin(row:any,title:string = '新增'){
      let opt = this.editWinOption;
      let tableEditWin = this.pupop.openWin(MdTableEditWin,{title:title+opt.title,width:opt.width? opt.width:'1200px',height:'0',data:{columns:this.columns,confirm:this.confirm.bind(this),rowData:row}});
      tableEditWin.afterClosed().subscribe((res)=>{
        if(res === undefined){
          this.cancel(row);
        }
      });
    }
}
