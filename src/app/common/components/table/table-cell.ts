import {Component, Input, ElementRef, Renderer2, LOCALE_ID, Inject, AfterContentChecked} from "@angular/core";
import {HelpersAbsService} from "../../services/helpers.abs.service";

@Component({
  moduleId: module.id,
  selector:'md-render-cell',
  template:`<div *ngIf="cell && cell?.render && content" [innerHtml]="content"></div>
            <div *ngIf="cell && !cell?.render">{{cellRander(row,cell.name,cell)}}</div>`
})
export class TableCell implements AfterContentChecked{

  @Input()
  row:any;

  @Input()
  cell:any;

  public content:any;

  constructor(private el:ElementRef,private helper:HelpersAbsService,private render2:Renderer2,@Inject(LOCALE_ID) private _locale: string){}

  ngAfterContentChecked(){
    let cell = _.clone(this.cell);
    let row = _.clone(this.row);
    let el = _.clone(this.el);
    if(cell){
      if(cell.render && row){
        this.content = ''+cell.render(row,cell.name,cell,el);
      }
      let parentNode = el.nativeElement.parentNode;
      let _class = parentNode.classList && parentNode.classList[parentNode.classList.length - 1];
      if(cell.bgColor){
        if(_class && _class.endsWith('-bg')){
          this.render2.removeClass(parentNode,_class);
        }
        this.render2.addClass(parentNode,cell.bgColor);
      }
      if(cell.color){
        if(_class && _class.endsWith('-front')){
          this.render2.removeClass(parentNode,_class);
        }
        this.render2.addClass(parentNode,cell.color);
      }
    }
  }

  /**
   * 列渲染方法
   * @param row 数据
   * @param name 字段名
   * @param cell 列
   * @returns {string}
   */
  public cellRander(row:any,name:string|Array<string>,cell:any):string{
    let _randerValue = '';
    if(name instanceof Array){
      let _delimiter = cell['delimiter'] ? cell.delimiter : ' / ';
      name.forEach((_n,index)=>{
        _randerValue += this.helper.isEmpty(row[_n]) ? ' / ' : row[_n];
        if(index != name.length -1){
          _randerValue += _delimiter;
        }
      });
      return _randerValue;
    }else{
      if(cell.xtype == 'datetime' && (!cell.format || (cell.format && typeof cell.format == 'string'))) {
        _randerValue = this.helper.isEmpty(row[name]) ? ' / ' :moment(row[name]).format(cell.format || 'YYYY-MM-DD HH:mm:ss');
      }else if(cell.xtype == 'price' && (!cell.format || (cell.format && typeof cell.format == 'object'))){
        _randerValue = ''+this.helper.priceFormat(this.helper.shuntElement(row[name]),cell.format);
      }else{
        _randerValue = row[name];
      }
    }
    return this.helper.isEmpty(_randerValue) ? ' / ' :''+ _randerValue;
  }
}
