import {Component, forwardRef, OnInit, Input, EventEmitter, Output, ViewChild, ElementRef} from "@angular/core";
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from "@angular/forms";
import {UploadRejected, MdUploader} from "../../directives/file/uploader";
import {ULOImagePreviewService} from "../image-preview/image.preview.service";

// 要实现双向数据绑定，这个不可少
export const FILE_SELECT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => UloFileSelectComponent),
  multi: true
};

@Component({
  selector:'ulo-file-select',
  templateUrl:'./file.select.component.html',
  styleUrls:['./file.select.component.scss'],
  providers:[FILE_SELECT_VALUE_ACCESSOR]
})
export class UloFileSelectComponent implements OnInit,ControlValueAccessor{
  @Input() events: EventEmitter<any>;
  @Output() onUpload: EventEmitter<any> = new EventEmitter();
  @Output() onPreviewData: EventEmitter<any> = new EventEmitter();
  @Output() onUploadRejected: EventEmitter<UploadRejected> = new EventEmitter<UploadRejected>();
  @Output() onProgress:EventEmitter<any> = new EventEmitter();
  @Output() onAbort:EventEmitter<any> = new EventEmitter();
  @Output() onError:EventEmitter<any> = new EventEmitter();

  private _focused: boolean = false;
  private _value: any = '';
  protected _disabled: boolean = false;
  protected _readonly: boolean = false;
  protected _required: boolean = false;
  private _isEithFile:boolean = false;


  /** View -> model callback called when value changes */
  _onChange = (value: any) => {};

  /** View -> model callback called when select has been touched */
  _onTouched = () => {};

  @Input()
  get fileClass(){
    return this._fileClass;
  }
  set fileClass(v:string){
    this._fileClass = v;
  }
  private _fileClass:string='';
  @Input()
  get name():string{
    return this._name;
  }
  set name(val:string){
    this._name = val;
  }
  private _name:string='';

  @Input()
  get placeholder():string{
    return this._placeholder;
  }

  set placeholder(val:string){
    this._placeholder = val;
  }
  private _placeholder:string='';
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value) {
    this._disabled = this._coerceBooleanProperty(value);
  }
  @Input()
  get readonly(): boolean {
    return this._readonly;
  }
  set readonly(value) {
    this._readonly = this._coerceBooleanProperty(value);
  }

  @Input()
  get required() { return this._required; }
  set required(value: any) { this._required = this._coerceBooleanProperty(value); }

  @Input()
  get options(): any {
    return this._options;
  }
  set options(value: any) {
    this._options = value;
    this.uploader.setOptions(this.options);
  }
  _options:any;
  files: any[] = [];
  uploader: MdUploader;

  @ViewChild('fileUploader') input:ElementRef;

  get value():any{
    return this._value;
  }
  @Input()
  set value(value:any){
    if (value !== this._value) {
      this._value = value;
      // 触发值改变事件，冒泡给父级
      this._onChange(value);
      if(this._value == undefined){
        this._isEithFile = true;
      }else{
        this._isEithFile = false;
      }
    }
  }
  // 只读属性
  get focused() {
    return this._focused;
  }

  constructor(private imageService:ULOImagePreviewService){
    this.uploader = new MdUploader();
  }

  ngOnInit():void{
    this.uploader.setOptions(this.options);

    this.uploader._emitter.subscribe((data: any) => {
      this.onUpload.emit(data);
      if (data.done) {
        this._isEithFile = false;
        let res = JSON.parse(data['response']);
        this.value = this.getDeepFromObject(res['data'],this.options['dataKey'] || 'key');
        this.files = this.files.filter(f => f.name !== data.originalName);
      }
    });

    this.uploader._abort.subscribe((data:any) =>{
      this.onAbort.emit(data);
    });

    this.uploader._progress.subscribe((data:any) =>{
      this.onProgress.emit(data);
    });

    this.uploader._error.subscribe((data:any) =>{
      this.onError.emit(data);
    });

    this.uploader._previewEmitter.subscribe((data: any) => {
      this.onPreviewData.emit(data);
    });

    setTimeout(() => {
      if (this.events) {
        this.events.subscribe((data: string) => {
          if (data === 'startUpload') {
            this.uploader.uploadFilesInQueue();
          }
        });
      }
    });

    jQuery(this.input.nativeElement).bind('change',this.onChange.bind(this));
  }

  filterFilesByExtension(): void {
    this.files = this.files.filter(f => {
      if (this.options.allowedExtensions.indexOf(f.type) !== -1) {
        return true;
      }

      let ext: string = f.name.split('.').pop();
      if (this.options.allowedExtensions.indexOf(ext) !== -1 ) {
        return true;
      }

      this.onUploadRejected.emit({file: f, reason: UploadRejected.EXTENSION_NOT_ALLOWED});

      return false;
    });
  }

  onChange(event): void {
    this.files = Array.from(this.input.nativeElement.files);
    if (this.options.filterExtensions && this.options.allowedExtensions) {
      this.filterFilesByExtension();
    }

    if (this.files.length) {
      this.uploader.addFilesToQueue(this.files);
    }
  }

  /**
   * 阅览上传的图片
   */
  onOpenImg(){
    if(!this.value || this._isEithFile){
      return false;
    }
    this.imageService.loadImages([{imageUrl:'/assets/'+this._value}]);
    this.imageService.showImageByIndex(0);
    this.imageService.showImageViewer(true);
  }

  onEdit(){
    event.stopPropagation();
    this._isEithFile = true;
  }

  onDelete(){
    event.stopPropagation();
    if(this.value){
      this.value = '';
    }
  }

  _onClick(){
    if((this.value !== undefined && this.value != '') && !this._isEithFile){
      return false;
    }
    this.input.nativeElement.click();
  }

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  private _coerceBooleanProperty(value: any): boolean {
    return value != null && `${value}` !== 'false';
  }

  private getDeepFromObject(data:any,key:string){
    let _val:any = '';
    for(let _key in data){
      if(_key == key){
        _val = data[_key];
      }
    }
    return _val;
  }

}
