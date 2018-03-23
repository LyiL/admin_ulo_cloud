import {EventEmitter} from "@angular/core";

export type TableColumnType = "input"|"select"|"multipleSelect"|"checkbox"|"inputSearch"|"inputGroup";

export type DateType = "number"|"string"|"datetime"|"tel"|"price"|"text";

export class Column{
    name:string|Array<string>;
    title:string;
    firstTitle?:string;
    lastTitle?:string;
    type?:TableColumnType;
    xtype?:DateType;
    format?:string | {limit:number,thousandsSeparator:string};
    delimiter?:string;
    otherOpts?:any;
    defValue?:any;
    hide?:boolean | (()=>boolean);
    width?:string;
    bgColor?:string;
    color?:string;
    des?:string;
    inputDes?:string;
    render?:((row:any,fieldName:string|Array<string>,cell?:any,el?:any) => any) | null;
}

export class EditWinOption{
  title:string = '';
  width:string = '1000px';
  isRequser:boolean = false;//是否请求远端
}

export class Action{
    btnName:string;
    click?:EventEmitter<any> | ((row:any,e:Event)=>void);
    btnDisplay?:string | ((row:any)=>string);
    hide?:boolean|((row:any,target:any)=> boolean) = false;
    disabled?:boolean|((row:any)=>boolean) = false;
}

export class MdTableExtendConfig{
    columns:Column[];
    database:any;
    local:boolean = false;
    ctrId?:string;
    actionCfg?:any;
    mode?:"inline"|"edit"|"editWin";
    initLoad?:boolean = true;
    pageSizeOptions?:Array<number> = [5, 10, 25, 100];
    delConfirmFunc?:Function;
    saveConfirmFunc?:Function;
    onEditBefore?:Function;
    onDelete?:Function;
    onSave?:Function;
    onCancel?:Function;
}
