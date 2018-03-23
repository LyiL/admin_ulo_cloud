import {Component, OnInit, ViewChild, ElementRef, EventEmitter} from "@angular/core";
import {TradeBlackuserDBService} from "./trade.blackuser.list.db.service";
import {FormBuilder} from "@angular/forms";
import {MdDialogRef, MdSnackBar} from "@angular/material";
import {HelpersAbsService} from "../../../../common/services/helpers.abs.service";


/**
 * 导入交易黑名单组件
 */
@Component({
  selector:"trade-blackuser-import-win",
  templateUrl:"./trade.blackuser.import.win.component.html",
  providers:[TradeBlackuserDBService],
  styleUrls:['./trade.blackuser.import.win.component.scss']
})
export class TradeBlackuserImportWinComponent implements OnInit{
  //上传文件控件
  @ViewChild('fileUpload') input:ElementRef;
  public onUpload:EventEmitter<any> = new EventEmitter();
  //文件名
  public fileName;
  //上传按钮是否启用
  public disabled=false;

  constructor(private fb:FormBuilder, public dialogRef: MdDialogRef<TradeBlackuserImportWinComponent>,private snackBar:MdSnackBar,public helper: HelpersAbsService){}

  ngOnInit():void{
    this.defFieldUploadSetting['url'] = '/cloud/tradeblackuser/import';
  }

  /**
   * 提交上传文件
   */
  public onSubmit(){
    this.onUpload.emit('startUpload');
  }

  /**
   *打开上传文件控件
   */
  public onUploadHeadler(event){
    event.stopPropagation();
    this.input.nativeElement.click();
  }

  /**
   * 上传文件控件修改时
   */
  public onChange(event){
    let path = this.input.nativeElement.value;
    if(!this.helper.isEmpty(path)){
      let arr = path.split("\\");
      let reg = new RegExp("xls$");
      this.fileName = arr[arr.length-1];
      //验证是否是xls文件
      if(reg.test(path)){
        this.disabled=false;
      }else {
        this.disabled=true;
        this.fileName+="【请选择xls文件】"
      }
    }
  }

  /**
   * 上传文件
   * @param data
   */
  public handleUpload(data){
    if(data['status'] != 200){
      return;
    }
    let _res = JSON.parse(data.response);
    if(_res && _res['status'] == 200){
      this.snackBar.alert('导入成功');
      this.dialogRef.close(_res);
    }else if(_res){
      this.snackBar.alert(_res['message']);
      this.dialogRef.close(_res);
    }
  }

  /**
   * 上传文件失败操作
   * @param res
   */
  public uploadError(res){
    if(res && res['message']){
      this.snackBar.alert(res.message);
    }else if(res['error'] == true){
      this.snackBar.alert('系统异常，请联系管理员');
    }
  }

  /**
   * 上传文件控件配置
   * @type {{url: string; autoUpload: boolean}}
   */
  public defFieldUploadSetting:any = {
    url:'',
    autoUpload:false
  }
}
