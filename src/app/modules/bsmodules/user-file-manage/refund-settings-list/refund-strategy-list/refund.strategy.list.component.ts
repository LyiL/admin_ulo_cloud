/**
 * Created by lenovo on 2017/8/1.
 */
import {Component, OnInit, ViewChild} from "@angular/core";
import {MdPupop} from "@angular/material";
import {RefundStrategyListService} from "./refund.strategy.list.db.service";
import {Column} from "../../../../../common/components/table/table-extend-config";
import {ISidenavSrvice} from "../../../../../common/services/isidenav.service";
import {RefundStrategyListAddbtnWinComponent} from "./refund.strategy.list.addbtn.win.component";
import {HelpersAbsService} from "app/common/services/helpers.abs.service";
import {MdTableExtend} from "../../../../../common/components/table/table-extend";
import {RefundStrategyListEditbtnWinComponent} from "./refund.strategy.list.editbtn.win.component";
import {BaseSearchForm} from "../../../../../common/search.form/base.search.form";


@Component({
  selector: 'refund-strategy-list',
  templateUrl: "refund.strategy.list.component.html",
  providers: [RefundStrategyListService]
})
export class RefundStrategyListComponent implements OnInit{
  public form: BaseSearchForm = new BaseSearchForm();
  @ViewChild('refundStrategyTable') refundStrategyTable: MdTableExtend;
  //表格
  public refundStrategyColumns:Array<Column>=[{
    name:"merchantNo",
    title:"商户编号"
  },{
    name:"transType",
    title:"支付类型"
  },{
    name:"transId",
    title:"支付接口",
  },{
    name:"refundDayRange",
    title:"允许退款天数（天）"
  },{
    name:"dayRefundCount",
    title:"当日退款笔数（笔）"
  },{
    name:"singleRefundFee",
    title:"单笔退款额（元）",
    render:(function(row:any,name:string){
      return this.helper.shuntElement(row[name]);
    }).bind(this)
  },{
    name:"dayRefundFee",
    title:"当日退款额（元）",
    render:(function(row:any,name:string){
      return this.helper.shuntElement(row[name]);
    }).bind(this)
  },{
    name:"useState",
    title:"启用状态",
    render:this.onExamState.bind(this)
  },{
    name:"createdTime",
    title:"开通时间",
    xtype:"datetime"
  }];
  public tableActionCfg: any = {
    actions:[{
      btnName:"del",
      hide:true,
    },{
      btnName:"edit",
      hide:(()=>{
        if(this.helper.btnRole('REFUNDPOLICYSETTINGEDIT')){
          return false;
        }
        return true;
      }).bind(this),
      click:this.openAddDialog.bind(this)
    }]
  };

  constructor(
    public refundStrategyDBService: RefundStrategyListService,
    public helper: HelpersAbsService,
    private sidenavService: ISidenavSrvice,
    private pupop: MdPupop
  ) {
  }

  ngOnInit(){
    let params = this.sidenavService.getPageParams();
    this.form['merchantNo'] = params['merchantNo'];
    // 加载退款策略列表里的数据
    this.refundStrategyDBService.params = this.form;
  }

  /**
   * 用户状态
   * @author lyl
   */
  onExamState(row:any,name:string,cell:any,cellEl:any) {
    if(this.helper.isEmpty(row[name])){
      return '/';
    }else{
      let _status = row[name];
      switch(_status){
        case 0:
          cell.bgColor = 'danger-bg';
          break;
        case 1:
          cell.bgColor = 'success-bg';
          break;
      }
      return this.helper.dictTrans('ENABLE_STATUS',_status);
    }
  }
  /**
   * 添加退款策略按钮
   */
  onAddStrategy(row: any) {
    let params = this.sidenavService.getPageParams();//路由参数
    let addDialog = this.pupop.openWin(RefundStrategyListAddbtnWinComponent, {
      title:'新增退款策略',
      width:'406px',
      height:'550px',
      data:{
        name:params['name'],
        merchantNo:params['merchantNo']
      }
    });
    addDialog.afterClosed().subscribe(result => {
      this.refundStrategyTable.refresh(this.form.page);
    });
  }
  /**
   * 编辑按钮点击事件
   */
  openAddDialog(row:any,e:MouseEvent) {
    let params = this.sidenavService.getPageParams();//路由参数
    let editDialog = this.pupop.openWin(RefundStrategyListEditbtnWinComponent, {
      title:'编辑退款策略',
      width:'406px',
      height:'550px',
      data: {
        id: row['id'],
        name:params['name']
      },
    });
    editDialog.afterClosed().subscribe(result => {
      this.refundStrategyTable.refresh(this.form.page);
    });
  }
}





