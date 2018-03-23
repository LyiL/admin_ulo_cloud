import {
  Directive, Input, Output, EventEmitter, OnDestroy, OnChanges, OnInit, ElementRef,
  SimpleChanges
} from "@angular/core";
import { Chart } from 'chart.js';
import {Observable} from "rxjs/Observable";
import "rxjs/observable/timer"

@Directive({selector: 'canvas[baseChart]', exportAs: 'base-chart'})
export class BaseChartDirective implements OnDestroy, OnChanges, OnInit {
  public static defaultColors:Array<number[]> = [
    [255, 99, 132],
    [54, 162, 235],
    [255, 206, 86],
    [231, 233, 237],
    [75, 192, 192],
    [151, 187, 205],
    [220, 220, 220],
    [247, 70, 74],
    [70, 191, 189],
    [253, 180, 92],
    [148, 159, 177],
    [77, 83, 96]
  ];

  @Input() public data:number[] | any[];
  @Input() public datasets:any[];
  @Input()
  get labels():Array<any>{
    return this._labels;
  }
  set labels(_labels:Array<any>){
    this._labels = _labels;
  }
  private _labels:Array<any> = [];

  @Input() public options:any = {};
  @Input() public chartType:string;
  @Input() public colors:Array<any>;
  @Input() public legend:boolean;

  @Output() public chartClick:EventEmitter<any> = new EventEmitter();
  @Output() public chartHover:EventEmitter<any> = new EventEmitter();

  public ctx:any;
  public chart:any;
  private cvs:any;

  private element:ElementRef;

  public constructor(element:ElementRef) {
    this.element = element;
  }

  public ngOnInit():any {
    this.ctx = this.element.nativeElement.getContext('2d');
    this.cvs = this.element.nativeElement;
  }

  public ngOnChanges(changes: SimpleChanges): void {
    // Check if the changes are in the data or datasets
    if (changes.hasOwnProperty('data') || changes.hasOwnProperty('datasets') || changes.hasOwnProperty('labels')) {
      if(!this.chart){
        if((!!this.datasets && this.datasets.length > 0) || (!this.datasets && this.data && this.data.length > 0 )){
          this.refresh();
        }
      }else if(changes['labels']){
        if(this.data){
          this.updateChartData(this.data);
        }else if(this.datasets){
          this.updateChartData(this.datasets);
        }
        this.chart.update();
      }else{
        if (changes['data']) {
          this.updateChartData(changes['data'].currentValue);
        } else {
          this.updateChartData(changes['datasets'].currentValue);
        }
        this.chart.update();
      }
    }
  }

  public ngOnDestroy():any {
    if (this.chart) {
      this.chart.destroy();
      this.chart = void 0;
    }
  }

  public getChartBuilder(ctx:any/*, data:Array<any>, options:any*/):any {
    let datasets:any = this.getDatasets();
    let options:any = Object.assign({}, this.options);
    if (this.legend === false) {
      options.legend = {display: false};
    }
    // hock for onHover and onClick events
    options.hover = options.hover || {};
    if (!options.onHover) {
      options.onHover = (active:Array<any>) => {
        if (active && !active.length) {
          return;
        }
        this.chartHover.emit({active});
      };
    }

    if (!options.onClick) {
      options.onClick = (event:any, active:Array<any>) => {
        this.chartClick.emit({event, active});
      };
    }

    if(!options.tooltips){
      options.tooltips = {
        enabled: false,
        mode: 'index',
        position: 'nearest',
        custom:function(tooltip){
          customTooltips.call(this,tooltip,options.toolipsCallback);
        }
      }
    }

    let opts = {
      type: this.chartType,
      data: {
        labels: this.labels,
        datasets: datasets
      },
      options: options
    };
    return new Chart(ctx, opts);
  }

  private updateChartData(newDataValues: number[] | any[]): void {
    if(!newDataValues || (newDataValues && newDataValues.length <= 0)){
      return;
    }
    let datasets = this.chart.data.datasets;
    if (Array.isArray(newDataValues[0].data)) {
      this.chart.data.datasets = this.getDatasets();
      this.chart.data.labels = this.labels;
    } else {
      this.chart.data.datasets[0].data = newDataValues;
    }
  }

  private getDatasets():any {
    let datasets:any = void 0;
    // in case if datasets is not provided, but data is present
    if (!this.datasets || !this.datasets.length && (this.data && this.data.length)) {
      if (Array.isArray(this.data[0])) {
        datasets = (this.data as Array<number[]>).map((data:number[], index:number) => {
          return {data, label: this.labels[index] || `Label ${index}`};
        });
      } else {
        datasets = [{data: this.data, label: `Label 0`}];
      }
    }

    if (this.datasets && this.datasets.length ||
      (datasets && datasets.length)) {
      datasets = (this.datasets || datasets)
        .map((elm:number, index:number) => {
          let newElm:any = Object.assign({}, elm);
          if (this.colors && this.colors.length) {
            Object.assign(newElm, this.colors[index]);
          } else {
            Object.assign(newElm, getColors(this.chartType, index, newElm.data.length));
          }
          return newElm;
        });
    }

    if (!datasets) {
      throw new Error(`ng-charts configuration error, data or datasets field are required to render char ${this.chartType}`);
    }
    return datasets;
  }

  private refresh():any {
    // todo: remove this line, it is producing flickering
    this.ngOnDestroy();
    this.chart = this.getChartBuilder(this.ctx/*, data, this.options*/);
  }
}

export interface Color {
  backgroundColor?:string | string[];
  borderWidth?:number | number[];
  borderColor?:string | string[];
  borderCapStyle?:string;
  borderDash?:number[];
  borderDashOffset?:number;
  borderJoinStyle?:string;

  pointBorderColor?:string | string[];
  pointBackgroundColor?:string | string[];
  pointBorderWidth?:number | number[];

  pointRadius?:number | number[];
  pointHoverRadius?:number | number[];
  pointHitRadius?:number | number[];

  pointHoverBackgroundColor?:string | string[];
  pointHoverBorderColor?:string | string[];
  pointHoverBorderWidth?:number | number[];
  pointStyle?:string | string[];

  hoverBackgroundColor?:string | string[];
  hoverBorderColor?:string | string[];
  hoverBorderWidth?:number;
}

// pie | doughnut
export interface Colors extends Color {
  data?:number[];
  label?:string;
}

function rgba(colour:Array<number>, alpha:number):string {
  return 'rgba(' + colour.concat(alpha).join(',') + ')';
}

function getRandomInt(min:number, max:number):number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatLineColor(colors:Array<number>):Color {
  return {
    backgroundColor: rgba(colors, 0),
    borderColor: rgba(colors, 1),
    pointBackgroundColor: rgba(colors, 1),
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: rgba(colors, 0.8)
  };
}

function formatBarColor(colors:Array<number>):Color {
  return {
    backgroundColor: rgba(colors, 0.6),
    borderColor: rgba(colors, 1),
    hoverBackgroundColor: rgba(colors, 0.8),
    hoverBorderColor: rgba(colors, 1)
  };
}

function formatPieColors(colors:Array<number[]>):Colors {
  return {
    backgroundColor: colors.map((color:number[]) => rgba(color, 0.6)),
    borderColor: colors.map(() => '#fff'),
    pointBackgroundColor: colors.map((color:number[]) => rgba(color, 1)),
    pointBorderColor: colors.map(() => '#fff'),
    pointHoverBackgroundColor: colors.map((color:number[]) => rgba(color, 1)),
    pointHoverBorderColor: colors.map((color:number[]) => rgba(color, 1))
  };
}

function formatPolarAreaColors(colors:Array<number[]>):Color {
  return {
    backgroundColor: colors.map((color:number[]) => rgba(color, 0.6)),
    borderColor: colors.map((color:number[]) => rgba(color, 1)),
    hoverBackgroundColor: colors.map((color:number[]) => rgba(color, 0.8)),
    hoverBorderColor: colors.map((color:number[]) => rgba(color, 1))
  };
}

function getRandomColor():number[] {
  return [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255)];
}

/**
 * Generate colors for line|bar charts
 * @param index
 * @returns {number[]|Color}
 */
function generateColor(index:number):number[] {
  return BaseChartDirective.defaultColors[index] || getRandomColor();
}

/**
 * Generate colors for pie|doughnut charts
 * @param count
 * @returns {Colors}
 */
function generateColors(count:number):Array<number[]> {
  let colorsArr:Array<number[]> = new Array(count);
  for (let i = 0; i < count; i++) {
    colorsArr[i] = BaseChartDirective.defaultColors[i] || getRandomColor();
  }
  return colorsArr;
}

/**
 * Generate colors by chart type
 * @param chartType
 * @param index
 * @param count
 * @returns {Color}
 */
function getColors(chartType:string, index:number, count:number):Color {
  if (chartType === 'pie' || chartType === 'doughnut') {
    return formatPieColors(generateColors(count));
  }

  if (chartType === 'polarArea') {
    return formatPolarAreaColors(generateColors(count));
  }

  if (chartType === 'line' || chartType === 'radar') {
    return formatLineColor(generateColor(index));
  }

  if (chartType === 'bar' || chartType === 'horizontalBar') {
    return formatBarColor(generateColor(index));
  }
  return generateColor(index);
}

function customTooltips(tooltip,callback){
  let tooltipEl = document.getElementById('chartjs-tooltip');
  let bodyPoints = [];
  if (!tooltipEl) {
    tooltipEl = document.createElement('div');
    tooltipEl.id = 'chartjs-tooltip';
    tooltipEl.setAttribute('class','chartjs-tooltip');
    this._chart.canvas.parentNode.appendChild(tooltipEl);
  }

  tooltipEl.style.position = 'absolute';
  tooltipEl.style.background = 'rgba(0, 0, 0, .7)';
  tooltipEl.style.color = 'white';
  tooltipEl.style.borderRadius = '3px';
  tooltipEl.style.webkitTransition = 'all .1s ease';
  tooltipEl.style.transition = 'all .1s ease';
  tooltipEl.style.pointerEvents = 'none';
  tooltipEl.style.webkitTransform = 'translate(-50%, 0)';
  tooltipEl.style.transform = 'translate(-50%, 0)';

  // Hide if no tooltip
  if (tooltip.opacity === 0) {
    tooltipEl.style.opacity = '0';
    return;
  }

  tooltipEl.classList.remove('above', 'below', 'no-transform');
  if (tooltip.yAlign) {
    tooltipEl.classList.add(tooltip.yAlign);
  } else {
    tooltipEl.classList.add('no-transform');
  }

  function getBody(bodyItem) {
    return bodyItem.lines;
  }

  if (tooltip.body) {
    let bodyLines = tooltip.body.map(getBody);
    let titleLines = tooltip.title || [];
    bodyPoints = tooltip.dataPoints.map(function(dataPoint){
      return dataPoint.index;
    });

    let html = '<span>'+titleLines[0]+'</span>';
    bodyLines.forEach((body,i)=>{
      let colors = tooltip.labelColors[i];
      let style = 'background:' + colors.borderColor;
      style += '; display:inline-block';
      style += '; width:10px';
      style += '; height:10px';
      style += '; margin-right:10px;';
      let span = '<span style="' + style + '"></span>';
      html += '<p>'+span+body+'</p>';
    });
    if(callback && _.isFunction(callback)){
      callback(tooltipEl,tooltip,this._chart);
    }
    tooltipEl.innerHTML = html;
  }
  let positionY = this._chart.canvas.offsetTop;
  let positionX = this._chart.canvas.offsetLeft;
  // Display, position, and set styles for font

  let _tooltipElLeft = 0;

  if('0,1,2'.indexOf(bodyPoints[0]) != -1){
    _tooltipElLeft = tooltip.x + tooltip.width - positionX;
  }else if(bodyPoints[0] == this._chart.data.labels.length - 1){
    _tooltipElLeft = tooltip.x - 60;
  }else{
    _tooltipElLeft = positionX + tooltip.x;
  }

  tooltipEl.style.opacity = '1';
  tooltipEl.style.left = _tooltipElLeft + 'px';
  tooltipEl.style.top = tooltip.y + 'px';
  tooltipEl.style.fontFamily = tooltip._fontFamily;
  tooltipEl.style.fontSize = tooltip.fontSize;
  tooltipEl.style.fontStyle = tooltip._fontStyle;
  tooltipEl.style.padding = tooltip.yPadding + 'px ' + tooltip.xPadding + 'px';
}
