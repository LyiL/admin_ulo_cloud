import {TradeBlackuserDBService, TradeBlackuserListDBService} from "./trade.blackuser.list.db.service";
import {Component, OnInit, ViewChild} from "@angular/core";
import {ISidenavSrvice} from "../../../../common/services/isidenav.service";
import {MdSnackBar, MdPupop, Confirm} from "@angular/material";
import {HelpersAbsService} from "../../../../common/services/helpers.abs.service";
import {TradeBlackuserForm} from "../../../../common/search.form/trade-manage.form/trade.blackuser.form";
import {MdTableExtend} from "../../../../common/components/table/table-extend";
import {Column} from "../../../../common/components/table/table-extend-config";
import {TradeBlackuserAddWinComponent} from "./trade.blackuser.add.win.component";
import {TradeBlackuserImportWinComponent} from "./trade.blackuser.import.win.component";

/**
 * 交易黑名单列表
 */
@Component({
  selector:"trade-blackuser-lis",
  templateUrl:"./trade.blackuser.list.component.html",
  providers:[TradeBlackuserListDBService,TradeBlackuserDBService]
})
export class TradeBlackuserListComponent implements OnInit{

  public form:TradeBlackuserForm = new TradeBlackuserForm();
  @ViewChild('TradeBlackuserTable') TradeBlackuserTable:MdTableExtend;

  public TradeBlackuserColumns:Array<Column>=
    [
      {
        name:"openId",
        title:"openId"
      },{
      name:"appid",
      title:"appid"
      },{
      name:"createAt",
      title:"时间",
      xtype:"datetime"
    }
    ];

  public tableActionCfg: any = {
    actions:[
      {
        btnName:"edit",
        hide:true
      },
      {
        btnName:"del",
        hide:(()=>{
          if(this.helper.btnRole('TRADEBLACKUSERDELETE')){
            return false;
          }
          return true;
        }).bind(this),
        click: this.onDelete.bind(this)
      }
    ]
  };

  constructor(public tradeBlackuserListDB:TradeBlackuserListDBService,public sidenavService:ISidenavSrvice,public tradeBlackuserDB:TradeBlackuserDBService,
              public snackBar: MdSnackBar,public helper:HelpersAbsService, public pupop:MdPupop
  ){}

  ngOnInit(){
    this.tradeBlackuserListDB.params = this.form;
  }

  /**
   * 查询列表
   */
  public onSearch(){
    //默认查询第一页
    this.form.doSearch(this.tradeBlackuserListDB);
    this.TradeBlackuserTable.refresh();
  }

  /**
   * 删除黑名单用户
   */
  onDelete(row: any, e: MouseEvent){
    let _confirm = this.pupop.confirm({
      message: "您确认要删除该黑名单吗？",
      confirmBtn: "是",
      cancelBtn: "否"
    });
    _confirm.afterClosed().subscribe(res => {
      if (res == Confirm.YES) {
        this.tradeBlackuserDB.delete( { id: row['id'] }).subscribe(_res => {
          if (_res && _res['status'] == 200) {
            this.snackBar.alert('删除成功');
            this.TradeBlackuserTable.refresh(this.form.page);
          } else {
            this.snackBar.alert(_res['message']);
          }
        })
      }
    })
  }

  /**
   * 打开添加页面
   */
  public openAddWin(e:MouseEvent){
    let refundWin = this.pupop.openWin(TradeBlackuserAddWinComponent,{title:'添加黑名单',width:'550px',height:'240px'});
    refundWin.afterClosed().subscribe(result => {
      this.TradeBlackuserTable.refresh(this.form.page)
    });
  }

  /**
   * 打开导入页面
   */
  public openImportWin(e:MouseEvent){
    let importWin = this.pupop.openWin(TradeBlackuserImportWinComponent,{title:'导入黑名单',width:'550px',height:'240px'});
    importWin.afterClosed().subscribe(result => {
      this.TradeBlackuserTable.refresh(this.form.page)
    });
  }
}
