import {Component, Inject, OnInit, ViewChild} from "@angular/core";
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/of";
import {MdSelectChange, MdDialogRef, MD_DIALOG_DATA, MdSnackBar} from "@angular/material";
import {Column} from "../../../../../common/components/table/table-extend-config";
import {HelpersAbsService} from "../../../../../common/services/helpers.abs.service";
import {CommonDBService, LoadTableDbService} from "../../../../../common/db-service/common.db.service";
import {MdTableExtend} from "../../../../../common/components/table/table-extend";
import {AgencyDetailDBService} from "../agency.list.db.service";

/**
 * 代理商明细产品添加控件
 */
@Component({
  selector: 'ulo-agency-detail-product-form',
  templateUrl: './agency.detail.product.form.component.html',
  providers: [CommonDBService, LoadTableDbService, AgencyDetailDBService]
})
export class AgencyDetailProductFormComponent implements OnInit {
  @ViewChild('agencyProdFormTable') agencyProdFormTable: MdTableExtend;
  /**
   * 配置信息列表字段
   */
  public agencyProdFormColumns: Array<Column> = [{
    name: 'transId',
    title: '支付类型',
    type: 'select',
    otherOpts: {
      valueField: 'transId',
      displayField: 'transType',
      data: this.commonDBService.loadTransApi({}),
      onChange: (function (row, change: MdSelectChange) {
        row['transType'] = change.source.triggerValue;
      }).bind(this),
      required: true
    },
    render: (function (row: any, name: string) {
      return row['transType'];
    }).bind(this)
  },{
    name: 'categoryType',
    title: '行业类别',
    type: 'select',
    otherOpts: {
      valueField: 'id',
      displayField: 'name',
      required: true,
      data: Observable.of(this.helper.getDictByKey('MCH_TYPE')),
    },
    render: (function (row: any, name: string) {
      if(this.helper.isEmpty(row[name])){
        return '/';
      }else{
        return this.helper.dictTrans('MCH_TYPE', row[name]);
      }
    }).bind(this)
  }, {
    name: 'limitDay',
    title: '单日限额（元）',
    xtype: 'number',
    otherOpts: {
      // required: true
    },
    render: (function (row: any, name: string) {
      let _limitDay = row[name];
      if (this.helper.isEmpty(_limitDay)) {
        _limitDay = '/';
      } else {
        _limitDay = this.helper.shuntElement(_limitDay);
      }
      return _limitDay;
    }).bind(this)
  }, {
    name: ['limitSingleMin', 'limitSingle'],
    title: '单笔限额（元）',
    xtype: 'number',
    firstTitle: '单笔最小',
    lastTitle: '单笔最大',
    type: 'inputGroup',
    width: '100px',
    render: (function (row: any, name: string) {
      let _min = row[name[0]];
      let _max = row[name[1]];
      if (this.helper.isEmpty(_min)) {
        _min = '/';
      } else {
        _min = this.helper.shuntElement(_min);
      }
      if (this.helper.isEmpty(_max)) {
        _max = '/';
      } else {
        _max = this.helper.shuntElement(_max);
      }
      return _min + '-' + _max;
    }).bind(this),
    otherOpts: {
      // required: true
    }
  }, {
    name: 'settleRate',
    title: '费率(‰)',
    xtype: 'number',
    render: (function (row: any, name: string) {
      return row[name];
    }).bind(this),
    otherOpts: {
      required: true
    }
  },{
    name: 'fixFloatRate',
    title: '费率类型',
    type: 'select',
    otherOpts: {
      valueField: 'id',
      displayField: 'name',
      required:true,
      data: Observable.of(this.helper.getDictByKey('RATE_TYPE'))
    },
    render: (function (row: any, name: string) {
      return this.helper.isEmpty(row[name]) ? '/':this.helper.dictTrans('RATE_TYPE', row[name]);
    }).bind(this)
  }, {
    name: 'settleCycle',
    title: '结算/分润周期',
    type: 'select',
    otherOpts: {
      valueField: 'id',
      displayField: 'name',
      data: Observable.of(this.helper.getDictByKey('BALANCE_DATE')),
      required: true
    },
    render: (function (row: any, name: string) {
      return this.helper.dictTrans('BALANCE_DATE', row[name]);
    }).bind(this)
  }, {
    name: 'shareRule',
    title: '分润规则',
    type: 'select',
    otherOpts: {
      valueField: 'id',
      displayField: 'name',
      data: Observable.of(this.helper.getDictByKey('PAYCENTER_CH_TYPE')),
      required: true
    },
    render: (function (row: any, name: string) {
      return this.helper.dictTrans('PAYCENTER_CH_TYPE', row[name]);
    }).bind(this)
  }];

  /**
   * 操作按钮配置
   * @type {{width: string}}
   */
  public agencyProdFormActions: any = {
    width: '62px'
  };
  //产品信息
  public agencyProdInfo: any;

  constructor(public dialog: MdDialogRef<AgencyDetailProductFormComponent>,
              public helper: HelpersAbsService,
              public commonDBService: CommonDBService,
              public agencyProdFormDB: LoadTableDbService,
              @Inject(MD_DIALOG_DATA) public data: any,
              public agencyDetailDBService: AgencyDetailDBService,
              protected snackBar: MdSnackBar) {
    if (data) {
      this.agencyProdInfo = {
        userNo: data['userNo'],
        userName: data['userName'],
        combName: '',
        tradetypes: []
      };
    }
  }

  ngOnInit(): void {
    Observable.timer(500).subscribe(() => {
      if (this.agencyProdFormTable) {
        this.agencyProdFormTable.newRow({shareRule:1,fixFloatRate:0});
      }
    });
  }

  /**
   * 新增产品配置
   */
  public onNewProdCfg() {
    this.agencyProdFormTable.newRow({shareRule:1,fixFloatRate:0});
  }

  public hasData() {
    //产品名称不能为空
    if (this.agencyProdInfo && this.agencyProdInfo['tradetypes'] && this.agencyProdInfo['tradetypes'].length > 0 && this.agencyProdInfo['combName']) {
      return true;
    }
    return false;
  }

  /**
   * 确认保存前的事件
   * @param row
   * @returns {boolean}
   */
  public onBeforeSaveCfg(row: any) {
    let _day = this.headlerNumberNull(row['limitDay'], row, 'limitDay'), // 单日限额
      _min = this.headlerNumberNull(row['limitSingleMin'], row, 'limitSingleMin'), // 单笔限额最小
      _max = this.headlerNumberNull(row['limitSingle'], row, 'limitSingle'), // 单笔限额最大
      _settleRate = this.helper.isEmpty(row['settleRate']) ? 0 : row['settleRate'];
    if ((_max !== null && _day !== null) && _max*1 > _day*1) {
      this.snackBar.alert('单日限额需大于单笔限额最大值！');
      return false;
    }
    if ((_min !== null && _day !== null) && _min*1 > _day*1) {
      this.snackBar.alert('单日限额需大于单笔限额最小值！');
      return false;
    }
    if ((_min !== null && _max !== null) && _min*1 > _max*1) {
      this.snackBar.alert('单笔限额最大值需大于单笔限额最小值！');
      return false;
    }
    if (this.judgeSign(_min) || this.judgeSign(_max) || this.judgeSign(_day) || this.judgeSign(_settleRate)) {
      this.snackBar.alert('请填写正数！');
      return false;
    }
  }

  public judgeSign(num) {
    let reg = new RegExp("^-?[0-9]*.?[0-9]*$");
    if (reg.test(num)) {
      let absVal = Math.abs(num);
      // return num==absVal?'是正数':'是负数';
      return num == absVal ? false : true;
    }
    else {
      // return '不是数字';
      return false;
    }
  }

  private headlerNumberNull(val: any, row: any, fieldName: string): any {
    if (this.helper.isEmpty(val)) {
      row[fieldName] = undefined;
      return null;
    }
    return val;
  }

  public onSaveProdCfg(row: any) {
    this.agencyProdInfo.tradetypes = this.agencyProdFormDB.data;
    if (!this.helper.isEmpty(row['limitDay'])) {
      row['limitDay'] *= 100;
    }
    if (!this.helper.isEmpty(row['limitSingleMin'])) {
      row['limitSingleMin'] *= 100;
    }
    if (!this.helper.isEmpty(row['limitSingle'])) {
      row['limitSingle'] *= 100;
    }
  }


  public onDeleteProdCfg(row: any) {
    this.agencyProdInfo.tradetypes = this.agencyProdFormDB.data;
  }

  /**
   * 编辑
   */
  onEditProdCfg(row: any) {
    row['limitDay'] = this.helper.shuntElement(row['limitDay']);
    row['limitSingleMin'] = this.helper.shuntElement(row['limitSingleMin']);
    row['limitSingle'] = this.helper.shuntElement(row['limitSingle']);
  }

  /**
   * 保存产品
   */
  public onSaveProdCfgInfo() {
    if (this.hasData()) {
      let flag: boolean = false;
      this.agencyProdFormDB.data.forEach(_data => {
        if (_data['isEdit'] == true) {
          flag = true;
        }
      });
      if (flag) {
        this.snackBar.alert('您有正在编辑的数据，请先确认或取消！');
        return false;
      }
      this.agencyDetailDBService.saveAgencyProdInfo(this.agencyProdInfo).subscribe(res => {
        if (res && res['status'] == 200) {
          this.snackBar.alert('保存成功！');
          this.dialog.close(res);
        } else {
          this.snackBar.alert(res['message']);
        }
      });
    }
  }
}
