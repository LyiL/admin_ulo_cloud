import {Component, OnInit, ViewChild} from "@angular/core";
import {DetailField, ULODetail} from "../../../../../common/components/detail/detail";
import {Column} from "../../../../../common/components/table/table-extend-config";
import {Router} from "@angular/router";
import {ISidenavSrvice} from "../../../../../common/services/isidenav.service";
import {HelpersAbsService} from "../../../../../common/services/helpers.abs.service";
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/of";
import {SubmerchantDetailDBService} from "../submerchant.list.db.service";
import {MdPupop} from "@angular/material";
import {ULODetailContainer} from "../../../../../common/components/detail/detail-container";
import {AuthAbsService} from "../../../../../common/services/auth.abs.service";

@Component({
  selector:"submerchant-detail-content",
  templateUrl:"submerchant.detail.content.component.html",
  providers: [SubmerchantDetailDBService]
})

export class SubmerchantDetailContentComponent implements OnInit{
  public submerchantDetailReqParam:any;//子商户详情参数
  public submerchantDetailData:any;//子商户详情信息
  public subMchOperationLog:Observable<any>;//子商户操作日志
  public ctr:ULODetailContainer;
  public bankNo:any;
  @ViewChild('submerchantDetail') submerchantDetail:ULODetail;
  public submerchantDetailFields:Array<DetailField> = [{
      title:'企业信息',
      childs:[
        {
          title:'所属机构：',
          field:'bankName'
        },{
          title:'所属上级：',
          field:'chanName'
        },
        {
          title:'企业名称：',
          field:'name'
        },{
          title:'企业简称：',
          field:'shortName'
        },{
          title:'商户编号：',
          field:'merchantNo'
        }
        // ,{
        //   title:'企业邮箱：',
        //   field:'orgEmail'
        // }
        ,{
          title:'所在地：',
          field:'provinceName',
          render:(function(data:any,field:DetailField){
            if(!this.helper.isEmpty(data[field.field])){
              return data[field.field] + ' ' + data['cityName']+' '+data['countyName'];
            }else {
              return "/";
            }
          }).bind(this)
        },{
          title:'经营地址：',
          field:'address'
        },{
          title:'商户证件类型：',
          field:'certificateType',
          render:(function(data:any,field:DetailField){
            if(data && data[field.field] !== undefined){
              return this.helper.dictTrans('CERTIFICATE_TYPE',data[field.field]);
            }else {
              return "/";
            }
          }).bind(this)
        },{
          title:'商户证件编号：',
          field:'linenceNo'
        }
        // ,{
        //   title:'证件有效期：',
        //   field:'linenceTermStart',
        //   render:(function(data:any,field:DetailField){
        //     if(!this.helper.isEmpty(data[field.field])){
        //       let beginTime = this.helper.format(data[field.field],'yyyy-MM-dd');
        //       let endTime = this.helper.format(data['linenceTermEnd'],'yyyy-MM-dd');
        //       return beginTime+' - '+endTime;
        //     }else {
        //       return "/";
        //     }
        //   }).bind(this)
        // }
        ,{
          title:'所属行业：',
          field:'categoryType',
          render:(function(data:any,field:DetailField){
            let _val = data[field.field];
            if(!this.helper.isEmpty(_val)){
              // return this.helper.dictTrans('PAY_MCH_ISBIGBUSI',data['mchRole']) +"-" +this.helper.dictTrans('MCH_TYPE',_val[0]) + ' - ' + data['mchTypeName'];
              return this.helper.dictTrans('MCH_TYPE',_val[0]);
            }else {
              return "/";
            }
          }).bind(this)
        }
        // ,{
        //   title:'企业网站：',
        //   field:'orgWebsite'
        // }
        ,{
          title:'客服电话：',
          field:'customerPhone'
        }
        // ,{
        //   title:'所属业务员：',
        //   field:'salesmanName'
        // }
        ,{
          title:'创建时间：',
          field:'createdAt',
          type:"datetime"
        },{
          title:'审核时间：',
          field:'examTime',
          type:"datetime"
        }]
    },{
      title:'负责人信息',
      childs:[
        {
          title:'负责人姓名：',
          field:'operator'
        }
        // ,{
        //   title:'负责人类型：',
        //   field:'contactsType',
        //   render:(function(data:any,field:DetailField){
        //     if(!this.helper.isEmpty(data[field.field])){
        //       return this.helper.dictTrans('CONTACTS_TYPE',data[field.field]);
        //     }else {
        //       return "/";
        //     }
        //   }).bind(this)
        // }
        ,{
          title:'身份证号：',
          field:'operatorIdno'
        }
        // ,{
        //   title:'负责人电话：',
        //   field:'operatorPhone'
        // },{
        //   title:'负责人邮箱：',
        //   field:'operatorEmail'
        // }
        ]
    },{
      title:'联系人信息',
      childs:[
        {
          title:'联系人姓名：',
          field:'linkman'
        },{
          title:'联系人邮箱：',
          field:'email'
        },{
          title:'联系人手机：',
          field:'phone'
        }]
    }
    // ,{
    //   title:'附件信息',
    //   childs:[
    //     {
    //       title:'营业执照：',
    //       field:'linenceImg',
    //       type:'image',
    //     },{
    //       title:'开户许可证：',
    //       field:'orgAccountImg',
    //       type:'image'
    //     },{
    //       title:'法人身份证-正面：',
    //       field:'indentityImg',
    //       type:'image',
    //     },{
    //       title:'法人身份证-反面：',
    //       field:'indentityBackImg',
    //       type:'image'
    //     },{
    //       title:'银行卡照：',
    //       field:'bankCardImg',
    //       type:'image'
    //     }]
    // }
    ];
  constructor(
              public sidenavService: ISidenavSrvice,
              public helper: HelpersAbsService,
              public subMchDetailDBService:SubmerchantDetailDBService,
              public pupop:MdPupop,
              private authService: AuthAbsService
  ){
  }
  ngOnInit():void{
    this.loadData();
  }
  public loadData(isRefreash:boolean = false){
    let params = this.sidenavService.getPageParams();
    if(params){
      //初始化操作日志
      // this.subMchDetailDBService.loadExamLog({id:params['id']}).subscribe(res=>{
      //   if(res && res['status'] == 200){
      //     this.subMchOperationLog = Observable.of(res['data']);
      //   }
      // });
      //子商户详情信息
      this.submerchantDetailReqParam = {
        url: '/cloud/dealercodesubmch/getsubmch',
        params: params
      };
    }
  }


  /**
   * 明细数据加载完成
   * @param data
   */
  public submerchantDetailDataLoaded(data:any){
    this.submerchantDetailData = data;
    /**
     * 把参数传给父组件，其他子组件可以取到this.ctr.params
     */
    if(this.ctr){
      this.ctr.params = {
        merchantNo:data['merchantNo'],
      };
    }
    this.bankNo = data['bankNo'];
  }

  /**
   * 审核子商户
   */
  public onExamine(){
    this.pupop.openStatus({
      title:'审核子商户',
      statusDatas:this.helper.getDictByKey('EXAMINE_STATUS'),
      statusField:{
        name: 'examState',
        value: this.submerchantDetailData['examState']
      },
      remarkField:{
        name:'examIllu',
        value:''
      },
      onConfirm:(function(value:any){
        value = _.extend(value,{merchantNo: this.submerchantDetailData['merchantNo']});
        return this.subMchDetailDBService.examineSubMch(value).map(res=>{
          if(res && res['status'] == 200){
            this.loadData(true);
          }
          return res;
        });
      }).bind(this)
    });
  }

  /**
   * 判断用户审核状态
   * [{"id":0,"name":"待审核"},{"id":1,"name":"通过"},{"id":2,"name":"未通过"},{"id":3,"name":"冻结"},{"id":4,"name":"接口"}]
   */
  public userState():string{
    if(!this.submerchantDetailData){
      return '';
    }
    let _state = this.submerchantDetailData['examState'];
    let _stateClass = 'normal';
    switch (_state){
      case 0://待审核
        _stateClass = 'pending-audit';
        break;
      case 1://通过
        _stateClass = 'normal';
        break;
      case 2://未通过
        _stateClass = 'fail';
        break;
      case 3:
      case 4:
        _stateClass = 'in-process';
        break;
    }
    return _stateClass;
  }

}





