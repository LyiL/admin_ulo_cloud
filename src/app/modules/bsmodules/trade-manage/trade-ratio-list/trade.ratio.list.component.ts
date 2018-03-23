import {Component, ViewChild,OnInit} from "@angular/core";
import {Column} from "../../../../common/components/table/table-extend-config";
import {TradeRatioListDBService} from "./trade.ratio.list.db.service";
import {ISidenavSrvice} from "../../../../common/services/isidenav.service";
import {TradeRatioForm} from "../../../../common/search.form/trade-manage.form/trade.ratio.form";
import {MdTableExtend} from "../../../../common/components/table/table-extend";
import {MdSnackBar} from "@angular/material";
import {CommonDBService, LoadMerchantDBService, LoadAgentAndSPDBService} from "../../../../common/db-service/common.db.service";
import {InputSearchDatasource} from "../../../../common/services/impl/input.search.datasource";
import {HelpersAbsService} from "../../../../common/services/helpers.abs.service";
@Component({
  selector:"trade-ratio-list-list",
  templateUrl:"trade.ratio.list.component.html",
  providers:[TradeRatioListDBService,LoadMerchantDBService,CommonDBService,LoadAgentAndSPDBService]
})
export class TradeRatioComponent implements OnInit{
  public form :TradeRatioForm = new TradeRatioForm();//form
  @ViewChild('TradeRatioTable') TradeRatioTable:MdTableExtend;
  /**
   * 支付类型配置
   */
  public tradeTypes:Array<string>= [];
 public UloCode:any;
  /**
   * 商户信息配置
   */
  public merchantFilterFields:Array<string>= ["merchantNo","name"];
  /**
   * 所属渠道配置
   */
  public mchAgentFilterFields:Array<string>= ["chanCode","name","agentno"];

  public merchantDataSource:InputSearchDatasource;//获取商户信息数据源
  public mchAgentDataSource:InputSearchDatasource;//受理机构数据源

  /**
   *时间配置
   */
  public dateOpts:any = {
    format:'yyyy-MM-dd',
  };
  public TradeRatioColumns:Array<Column>=
    [
    {
    name:"countTime",
    title:"统计时间",
      xtype:"datetime",
      format:"YYYY-MM-DD"
  },{
    name:"mchName",
    title:"商户名称"
  },{
    name:"tradeType",
    title:"支付类型"
  },{
    name:"allNum",
    title:"订单总数"
  },{
    name:"sucNum",
    title:"成功订单总数"
  },{
      name:"b",
      title:"成功比率（%）",
    render:((row:any,fieldName:string,cell?:any) => {
        let _allNum = row['allNum'] || 0;
        let _sucNum = row['sucNum'] || 0;
        if(_allNum ==0 || _sucNum == 0){
          return "0";
        }else {
          return ((_sucNum / _allNum)*100).toFixed(2);
        }
    })
    }
    ,{
      name:"totalFee",
      title:"交易总额（元）",
      xtype:'price'
    }
  ];
  /**
   * 配置按钮
   *
   */
  public _actionCfg: any = {
   hide:true
  };

  constructor(public TradeRatioDB:TradeRatioListDBService,
              public merchantOrganDb:LoadMerchantDBService,public helper:HelpersAbsService,
              public CommonDB:CommonDBService,public mckAgentOrganDb:LoadAgentAndSPDBService,
              public snackBar:MdSnackBar,
              private sidenavSrvice:ISidenavSrvice
  ){
    this.CommonDB.loadTransApi({transId:""}).subscribe(res =>{
           this.tradeTypes = res
    })
    this.merchantDataSource = new InputSearchDatasource(merchantOrganDb);
    this.mchAgentDataSource = new InputSearchDatasource(mckAgentOrganDb);

    // this.TradeRatioDB.params = this.form;
  }
  ngOnInit(){
    this.TradeRatioDB.params = this.form;
     this.UloCode = this.helper.getDictByKey('CLOUD_ULO_BANK_NO');
  }
  public onSearch(){
    this.form.doSearch(this.TradeRatioDB);
    this.TradeRatioTable.refresh();
  }


  onChangeTime(result: any){
    this.form.statisticTime = result.value;
  }


  /**
   *所属渠道控件显示函数
   */
  public mchAgentDisplayFn(value: any):string{
    if(!this.helper.isEmpty(this.form._agentName)){
      return this.form._agentName;
    }
    let name = value && value['name'];
    if(name){
      this.form._agentName = name;
    }
    return name;
  }

  public agentSelected(res) {
    if(res) {
      this.form["_agentName"] = res["value"]["name"];
    }
  }

  /**
   * 所属渠道控件选项显示函数
   */
  public mchAgentOptionDisplayFn(value:any):string{
    return value && value['name'] +'('+value['chanCode']+')';
  }

  public mchAgentBeforClickFunc(value:any):boolean{
    let flag: boolean = true;
    if(this.helper.isEmpty(value)){
      this.snackBar.alert('请先输入过滤值！');
      flag = false;
    }
    this.mckAgentOrganDb.params = {name:value,bankCode:this.UloCode};
    return flag;
  }


  /**
   * 商户名称控件显示函数
   */
  public merchantDisplayFn(value: any):string{
    if(!this.helper.isEmpty(this.form._merchantName)){
      return this.form._merchantName;
    }
    let name = value && value['name'];
    if(name){
      this.form._merchantName = name;
    }
    return name;
  }

  public merchantSelected(res) {
    if(res) {
      this.form["_merchantName"] = res["value"]["name"];
    }
  }

  /**
   * 商户名称控件选项显示函数
   */
  public merchantOptionDisplayFn(value:any):string{
    return value && value['name'] +'('+value['merchantNo']+')';
  }

  public merchantBeforClickFunc(value:any):boolean{
    let flag: boolean = true;
    if(this.helper.isEmpty(value)){
      this.snackBar.alert('请先输入过滤值！');
      flag = false;
    }
    this.merchantOrganDb.params = {name:value,bankNo:this.UloCode};
    return flag;
  }

  public goRatioChart(){
    this.sidenavSrvice.onNavigate('/admin/tradesuccessratiochart','交易比率图');
  }

}
