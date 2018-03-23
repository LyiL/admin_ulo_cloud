import {Component, Input, OnChanges, SimpleChanges, EventEmitter, Output, LOCALE_ID, Inject} from "@angular/core";
import {coerceBooleanProperty} from "@angular/cdk";
import {HttpService} from "../../services/impl/http.service";
import {Observable} from "rxjs";
import {ULOImagePreviewService} from "../image-preview/image.preview.service";
import {DateFormatter} from "../../services/impl/intl";
import {HelpersAbsService} from "../../services/helpers.abs.service";

export type DetailFieldType = "text"|"image"|"html"|"datetime"|"price";

export interface DetailField{
  title:string;
  field?:string;
  type?:DetailFieldType;
  format?:string | {limit:number,thousandsSeparator:string};
  childs?:Array<DetailField>;
  joinField?:Array<string>;
  des?:string,
  render?:((data:any,field:DetailField)=>any)
}

@Component({
  selector:'ulo-detail',
  templateUrl:'detail.html',
  styleUrls:['detail.scss'],
  host:{
    'class':'ulo-detail',
    '[class.three-column]':'threeColumn'
  }
})
export class ULODetail implements OnChanges{
  @Input()
  get hasGroup():any{
    return this._hasGroup;
  }
  set hasGroup(_hasGroup:any){
    this._hasGroup = coerceBooleanProperty(_hasGroup);
  }
  private _hasGroup = false;

  @Input()
  get detailFields():Array<DetailField>{
    return this._detailFields;
  }
  set detailFields(_detailFields:Array<DetailField>){
    this._detailFields = _detailFields;
  }
  private _detailFields:Array<DetailField> = [];

  @Input()
  get reqParams():any{
    return this._reqParams;
  }
  set reqParams(reqParams:any){
    this._reqParams = reqParams;
    this.reqParamsChange.emit(reqParams);
  }
  private _reqParams:any = {
    url:'',
    params:{}
  };
  @Input()
  get threeColumn(){
    return this._threeColumn;
  }
  set threeColumn(_threeColumn:any){
    this._threeColumn = coerceBooleanProperty(_threeColumn);
  }
  private _threeColumn = false;
  @Input()
  get inpData(){
    return this._inpData;
  }
  set inpData(_inpData:any){
    this._inpData = _inpData;
    this.inpDataChange.emit(_inpData);
  }
  private _inpData:any;
  @Output()
  inpDataChange:EventEmitter<any> = new EventEmitter<any>();
  @Output()
  reqParamsChange:EventEmitter<any> = new EventEmitter<any>();

  @Output()
  detailData:EventEmitter<any> = new EventEmitter<any>();

  private _data:any={};
  private _image:Array<any> = [];

  constructor(private http:HttpService,private helper:HelpersAbsService,private imgService:ULOImagePreviewService,@Inject(LOCALE_ID) private _locale: string){}

  ngOnChanges(changes: SimpleChanges):void{
    if((changes['detailFields'] && changes['detailFields'].currentValue != undefined) ||
      (changes['reqParams'] && changes['reqParams'].currentValue != undefined)){
      this.loadData();
    }
  }

  refresh(){
    this.loadData();
  }

  ngOnInit():void{

  }

  hasDataArr(){
    return this._data instanceof Array;
  }

  isEmpty(val:any){
    return this.helper.isEmpty(val);
  }

  private loadData(){
    if(this.reqParams && this.reqParams.url && !this.inpData){
      this.http.post(this.reqParams.url,this.reqParams.params).subscribe(res=>{
        if(res && res['status'] == 200){
          this._data = res['data'] ? res['data'] : this.generateEmptyData();
          this.initImageDatas();
          this.detailData.emit(res['data']);
        }
      });
    }else{
      this._data = this.inpData;
      this.initImageDatas();
      this.detailData.emit(this.inpData);
    }
  }

  private generateEmptyData(){
    let newData:any = {};
    this.detailFields && this.detailFields.forEach((field:DetailField)=>{
      newData[field.field] = null;
    })
    return newData;
  }

  private initImageDatas(){
    let fields:Array<any> = [];
    if(this.hasDataArr()){
      _.forEach(this._data,(item)=>{
        this.initImageData(fields,item);
      });
    }else{
      this.initImageData(fields,this._data);
    }
    this.imgService.loadImages(fields);
  }

  private initImageData(fields:Array<any>,data){
    this.detailFields.forEach((field:DetailField)=>{
      if(this.hasGroup){
        field.childs.forEach((cField:DetailField)=>{
          if(cField.type != 'image'){
            return;
          }
          let _imgUrl:string = data && data[cField.field];
          let _desHtml = this.getImageJoinData(cField.title,cField['des'],field.childs,cField.joinField);

          if(_imgUrl){
            fields.push({fieldName:cField.field,imageUrl:'/assets/'+_imgUrl,describe:_desHtml});
          }
        })
      }else if(field.type == 'image'){
        let _imgUrl:string = data && data[field.field];
        let _desHtml = this.getImageJoinData(field.title,field['des'],this.detailFields,field.joinField);

        if(_imgUrl){
          fields.push({fieldName:field.field,imageUrl:'/assets/'+_imgUrl,describe:_desHtml});
        }
      }
    });
  }

  /**
   * 获取图片所需要关联显示的数据
   * @param fieldTitle 图片字段显示名称
   * @param fields 同级字段
   * @param joinFields 所关联的数据
   */
  private getImageJoinData(fieldTitle:string,des:string,fields:Array<DetailField> = [],joinFields:Array<string>=[]):string{
    let _html:string='<div class="title">'+fieldTitle.substring(0,fieldTitle.length -1)+'</div>';

        if(des){
          _html += '<div class="field-des">'+des+'</div>';
        }

        if(joinFields && joinFields.length > 0){
          _html +='<ul>';
        }

        joinFields.forEach((_joinField:string)=>{
          let tmp:DetailField = fields.find((_field:DetailField)=>{return _field.field == _joinField});
          if(tmp){
            _html += '<li><label>'+tmp.title+'</label><span>'+this._data[tmp.field]+'</span></li>';
          }
        });

        if(joinFields && joinFields.length > 0){
          _html +='</ul>';
        }

    return _html;
  }

  private onImagePreview(data:any,field:DetailField,index:number){
    if(this.helper.isEmpty(data[field.field])){
      return false;
    }
    this.imgService.showImageByFieldName(field.field);
    this.imgService.showImageViewer(true);
  }

  private render(data:any,field:DetailField){
    if(this.helper.isEmpty(data[field.field])){
      return ' / ';
    }
    if(field && field.render){
      return ''+field.render(data,field);
    }
    let _val = data && data[field.field];
    let _format:any;
    if(field.type == 'datetime'){
      if(!field.format){
        _format = 'yyyy-MM-dd HH:mm:ss';
      }else if(field.format && typeof field.format == 'string'){
        _format = field.format;
      }
      _val = DateFormatter.format(_val,this._locale,_format);
    }else if(field.type == 'price'){
      if(field.format && typeof field.format == 'object'){
        _format = field.format;
      }
      _val = this.helper.priceFormat(this.helper.shuntElement(_val),_format);
    }
    return this.helper.isEmpty(_val) ? ' / ' :''+ _val;
  }
}
