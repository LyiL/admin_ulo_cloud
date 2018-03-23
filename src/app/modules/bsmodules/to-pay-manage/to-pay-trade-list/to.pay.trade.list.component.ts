/**
 * Created by lenovo on 2017/8/1.
 */
import { ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {Column} from '../../../../common/components/table/table-extend-config';
import {ISidenavSrvice} from "../../../../common/services/isidenav.service";
import {MdDialog, MdPupop, MdSnackBar} from '@angular/material';
import {ToPayTradeListService, ToPayTradeOtherDBLoad} from "./to.pay.trade.list.db.service";
import {ToPayTradeSearchForm} from "../../../../common/search.form/to-pay-manage/to.pay.trade.search.form";
import {MdTableExtend} from "../../../../common/components/table/table-extend";
import {HelpersAbsService} from "../../../../common/services/helpers.abs.service";
import {HttpService} from "../../../../common/services/impl/http.service";
import {InputSearchDatasource} from "../../../../common/services/impl/input.search.datasource";
import {LoadMerchantDBService} from "../../../../common/db-service/common.db.service";
import {ToPayTradeSearchOrderForm} from "../../../../common/search.form/to-pay-manage/to.pay.trade.search.order.form";

@Component({
  selector: 'to-pay-trade-list',
  templateUrl: "to.pay.trade.list.component.html",
  providers: [ToPayTradeListService, LoadMerchantDBService,ToPayTradeOtherDBLoad]
})
export class ToPayTradeListComponent implements OnInit{
  /**
   * 交易状态
   */
  public tradeStates:Array<any> = [];
  /**
   * 商户信息配置
   */
  public merchantFilterFields: Array<string>= ["merchantNo","name"];
  public merchantDataSource: InputSearchDatasource;//获取商户信息数据源
  /**
   *查询表单
   */
  public form: ToPayTradeSearchForm = new ToPayTradeSearchForm();
  public orderForm:ToPayTradeSearchOrderForm = new ToPayTradeSearchOrderForm();
  @ViewChild('toPayTradeListTable') toPayTradeListTable: MdTableExtend;

  /**
   * 时间控件配置
   */
  public dateOpts:any = {
    limit:14
  };

  //表格
  public toPayTradeListColumns:Array<Column>=[{
    name:"tradeTime",
    title:"交易时间",
    xtype:"datetime"
  },{
    name:"outTradeNo",
    title:"商户单号/代付单号",
    width:"80px",
    render:((row:any,fieldName:string,cell?:any) => {
      return (this.helper.isEmpty(row[fieldName])? '/': row[fieldName]) + '<br/>'+ (this.helper.isEmpty(row['transNo'])? '/': row['transNo']);
    })
  },{
    name:"mchName",
    title:"商户名"
  },{
    name:"payName",
    title:"银行账户"
  },{
    name:"payCardNo",
    title:"银行卡号"
  },{
    name:"tradeState",
    title:"交易状态",
    render:(function(row:any,name:string, cell:any){
      let _status = row[name];
      return this.helper.isEmpty(_status) ? '/' : this.helper.dictTrans('CASH_ORDER_STATUS', _status);
    }).bind(this)
  },{
    name:"totalFee",
    title:"代付金额（元）",
    xtype:'price',
  },{
    name:"totalAmount",
    title:"总金额（元）",
    xtype:'price',
  }];
  public tableActionCfg: any = {
    width:"80px",
    actions:[{
      btnName:"sameStep",
      btnDisplay:"同步",
      hide:(()=>{
        if(this.helper.btnRole('PAYSYN')){
          return false;
        }
        return true;
      }).bind(this),
      click:this.onSynchro.bind(this)
    },{
      btnName:"detail",
      btnDisplay:"详情",
      hide:(()=>{
        if(this.helper.btnRole('PAYINFO')){
          return false;
        }
        return true;
      }).bind(this),
      click:this.onDetailHendler.bind(this)
    },{
      btnName:"del",
      hide:true,
    },{
      btnName:"edit",
      hide:true,
    }]
  };
  public summaryCount: any = {};
  constructor(
    public toPayTradeListDB: ToPayTradeListService,
    protected sidenavService: ISidenavSrvice,
    public dialog: MdDialog,
    protected snackBar: MdSnackBar,
    public helper: HelpersAbsService,
    protected http: HttpService,
    public merchantOrganDb: LoadMerchantDBService,
    public pupop: MdPupop,
    public toPayTradeOtherDBLoad:ToPayTradeOtherDBLoad,
    private changeDetectorRef:ChangeDetectorRef
  ) {
    this.merchantDataSource = new InputSearchDatasource(merchantOrganDb);//商户信息
  }
  ngOnInit(){
    this.tradeStates = this.helper.getDictByKey('CASH_ORDER_STATUS');
    this.toPayTradeListDB.params = this.form;
    this.changeDetectorRef.detectChanges();
    /**
     * 代付交易统计
     */
    this.loadTradeCount();
  }
  public loadTradeCount(){
    if(this.form.isDataEmpty()){
      return;
    }
    this.toPayTradeOtherDBLoad.loadCount(_.clone(this.form)).subscribe(res=>{
      if(res && res['status'] == 200){
        this.summaryCount = res.data;
      }else {
        this.snackBar.alert(res['message']);
      }
    });
  }
  /**
   * 商户名称控件显示函数
   */
  public merchantDisplayFn(value: any):string{
    // return value && value['name'];
    if(!this.helper.isEmpty(this.form._name)){
      return this.form._name;
    }
    let name = value && value['name'];
    if(name){
      this.form._name = name;
    }
    return name;
  }
  public merchantSelected(res){
    if(res) {
      this.form._name = res['value']['name'];
    }
  }
  /**
   * 商户名称控件选项显示函数
   */
  public merchantOptionDisplayFn(value:any):string{
    return value && value['name'] +'('+value['merchantNo']+')';
  }

  public merchantBeforClickFunc(value:any):boolean{
    if(this.helper.isEmpty(value)){
      this.snackBar.alert('请先输入过滤值！');
      return false;
    }
    this.merchantOrganDb.params = {name: value};
  }
  /**
   * 详情按钮点击事件
   */
  onDetailHendler(row:any,e:MouseEvent):void{
    this.sidenavService.onNavigate('/admin/topaytradedetail','代付交易详情', {transNo: row['transNo']});
  }

  /**
   * 同步按钮
   * @author lyl
   * @date 2017/08/16
   */
  onSynchro(row: any){
    this.toPayTradeOtherDBLoad.loadSynch({transNo: row['transNo']}).subscribe(res=>{
      if(res && res['status'] == 200){
        this.snackBar.alert("同步成功");
        this.toPayTradeListTable.refresh(this.form.page);
      }else {
        this.snackBar.alert(res['message']);
      }
    });
  }
  /**
   * 导出报表按钮
   * @author lyl
   */
  onExport() {
    // let params = {
    //   startDate: this.form.startDate,
    //   endDate: this.form.endDate,
    //   mchName: this.form.mchName,
    //   tradeState: this.form.tradeState,
    //   payName: this.form.payName,
    //   payCardNo: this.form.payCardNo,
    // };
    let params = _.clone(this.form);
    this.toPayTradeOtherDBLoad.loadExport(params).subscribe(res => {
      if(res instanceof FileReader){
        res.onloadend=(function(){
          let _res = JSON.parse(res.result);
          this.snackBar.alert(_res['message']);
        }).bind(this);
      }else{
        this.downloadFile(res.fileName, res.blob); //导出报表
      }
    });
  }
  downloadFile(fileName, content){
    var aLink = document.createElement('a');
    var blob = content;
    aLink.download = fileName;
    aLink.href = URL.createObjectURL(blob);
    aLink.click()
  }
  /**
   * tab栏切换
   */
  onChangeSearchTab(selectedIndex:any){
    if(selectedIndex == 1){
      // this.onSearchOrder();
      this.orderForm.transNo = '';
      this.orderForm.outTradeNo = '';
    }else if(selectedIndex == 0){
      this.onSearch();
    }
  }
  /**
   * 查询按钮
   */
  onSearch() {
    if(this.helper.isEmpty(this.form['_endDate'])) {
      this.snackBar.alert('请选择结束日期!');
    } else {
      this.form.doSearch(this.toPayTradeListDB);
      this.toPayTradeListTable.refresh();
      this.summaryCount = {};
      /**
       * 代付交易统计
       */
      this.loadTradeCount();
    }
  }
  onSearchOrder(){
    if(this.helper.isEmpty(this.orderForm.transNo) && this.helper.isEmpty(this.orderForm.outTradeNo)){
      this.snackBar.alert('至少输入一个单号');
    }else{
      this.orderForm.doSearch(this.toPayTradeListDB);
      this.toPayTradeListTable.refresh();
    }
  }
}





