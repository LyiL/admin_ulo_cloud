import {Component, OnInit, ViewChild} from "@angular/core";
import {Column} from "../../../../common/components/table/table-extend-config";
import {MdTableExtend} from "../../../../common/components/table/table-extend";
import {HelpersAbsService} from "../../../../common/services/helpers.abs.service";
import {MdSnackBar} from "@angular/material";
import {RiskMchDbService} from "./risk.mch.service";
import {RiskMchSearchForm} from "../../../../common/search.form/risk-manage/risk.mch.search.form";
import {InputSearchDatasource} from "../../../../common/services/impl/input.search.datasource";
import {LoadAgentAndSPDBService} from "../../../../common/db-service/common.db.service";

/**
 * 风险商户列表页
 */
@Component({
  selector:'risk-mch-list',
  templateUrl:'./risk.mch.list.component.html',
  providers:[RiskMchDbService,LoadAgentAndSPDBService]
})

export class RiskMchListComponent implements OnInit{
  public form:RiskMchSearchForm = new RiskMchSearchForm();
  // 接收时间配置
  public createTimeOpts:any = { lastMinDate:this.form.createStartTime };
  // 所属上级配置
  public mchAgentFilterFields:Array<string>= ["chanCode","name"];
  // 风险类型
  public risktypes: Array<any>;
  // 处理结果
  public processCodes: Array<any>;
  // 所属上级数据源
  public mchAgentDataSource:InputSearchDatasource;

  @ViewChild('riskMchListTable') riskMchListTable:MdTableExtend;

  /**
   * 风险商户表格列
   */
  public riskMchColumns: Array<Column> = [
    {
      name:'createTime',
      title:'接收时间',
      render: (function(row: any){
        return this.helper.isEmpty(row['createTime']) ? '/' : this.helper.format(row['createTime'])
      }).bind(this)
    },
    {
      name:'merchantName',
      title:'商户名称'
    },
    {
      name:'merchantNo',
      title:'商户编号'
    },
    {
      name:'smid',
      title:'识别码'
    },
    {
      name:'chanName',
      title:'所属上级'
    },
    {
      name:'risktype',
      title:'风险类型'
    },
    {
      name:'processCode',
      title:'处理结果',
      render:(function(row:any,name:string){
        if(this.helper.isEmpty(row[name])){
          return '/';
        }else{
          return this.helper.dictTrans('ALIPAY_RISK_PROCESS',row[name]);
        }
      }).bind(this)
    },
    {
      name:'tradeNos',
      title:'平台单号'
    }
  ];

  public tableActionCfg: any = {
    hide:true
  };

  constructor(
    public riskMchDB:RiskMchDbService,
    public helper:HelpersAbsService,
    public snackBar: MdSnackBar,
    public mckAgentOrganDb:LoadAgentAndSPDBService,
  ){
    this.mchAgentDataSource = new InputSearchDatasource(mckAgentOrganDb);
  }

  ngOnInit(){
    this.risktypes = this.helper.getDictByKey('ALIPAY_RISK_TYPE'); // 风险类型
    this.processCodes = this.helper.getDictByKey('ALIPAY_RISK_PROCESS'); // 处理结果
    this.riskMchDB.params = this.form;
  }

  /**
   * 查询
   */
  public onSearch() {
    if(this.helper.isEmpty(this.form.createEndTime)){
      this.snackBar.alert('接收结束时间不能为空');
      return;
    }
    this.form.doSearch(this.riskMchDB);
    this.riskMchListTable.refresh();
  }

  /**
   *所属上级控件显示函数
   */
  public mchAgentDisplayFn(value: any):string{
    if(!this.helper.isEmpty(this.form._chanName)){
      return this.form._chanName;
    }
    let name = value && value['name'];
    if(name){
      this.form._chanName = name;
    }
    return name;
  }

  /**
   * 所属上级控件选中事件
   */
  public chanSelected(res) {
    if(res) {
      this.form._chanName = res["value"]["name"];
    }
  }

  /**
   * 所属上级控件选项显示函数
   */
  public mchAgentOptionDisplayFn(value:any):string{
    return value && value['name'] +'('+value['chanCode']+')';
  }

  /**
   * 所属上级控件选中前事件
   */
  public mchAgentBeforClickFunc(value:any):boolean{
    let flag: boolean = true;
    if(this.helper.isEmpty(value)){
      this.snackBar.alert('请先输入过滤值！');
      flag = false;
    }
    this.mckAgentOrganDb.params = {name:value};
    return flag;
  }
}
