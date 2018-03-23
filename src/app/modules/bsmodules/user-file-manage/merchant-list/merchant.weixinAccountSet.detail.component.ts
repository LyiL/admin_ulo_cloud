import {Component, ViewChild} from "@angular/core";
import {DetailField, ULODetail} from "../../../../common/components/detail/detail";
import {ISidenavSrvice} from "../../../../common/services/isidenav.service";
import {HelpersAbsService} from "../../../../common/services/helpers.abs.service";
@Component({
  selector:"merchant-weixinAccountSet-detail",
  templateUrl:"merchant.weixinAccountSet.detail.component.html"
})
export class merchantWeixinAccountSetDetailComponent{
  public mchWXDetailFields:Array<DetailField> =
    [
      {
        title:'支付类型：',
        field:'transType'
      },{
      title:'商户识别码：',
      field:'ally'
    },{
      title:'授权目录：',
      field:'jsapiPathList',
      render:(function(data:any,field:DetailField){
        if(!this.helper.isEmpty(data['jsapiPathList'] && data['jsapiPathList'].length != 0)){
        return  data['jsapiPathList'].join('  ,  ')
        }else {
          return "/"
        }
      }).bind(this)
    },{
      title:'推荐关注APPID：',
      field:'subscribeAppid'
    },{
      title:'关联APPID：',
      field:'subAppidList',
      render:(function(data:any,field:DetailField){
        if(!this.helper.isEmpty(data['subAppidList'] && data['subAppidList'].length != 0)){
          var subAppidList = data['subAppidList'];
          var subAppid = [];
          subAppidList.forEach((val)=> {
            subAppid.push(val['subAppid'])
          });
            return subAppid.join(',')
        }else {
          return '/'
        }
      }).bind(this)
    }
    ];
  /**
   * d订单详情请求参数
   * @type {{url: string}}
   */
  public mchWXDDetailReqParam:any;

  constructor( public sidenavService:ISidenavSrvice,public helper:HelpersAbsService){
    let params = this.sidenavService.getPageParams();
    //查询产品详情信息
    this.mchWXDDetailReqParam = {
      url:'/mchManager/searchAccountConfig',
      params:params
    };
  }
  public onBack(){
    this.sidenavService.onNavigate('/admin/mchlist','商户列表',null,true);
  }
}





