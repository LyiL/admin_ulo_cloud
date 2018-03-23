import {Component, Inject, OnInit} from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef, MdSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {HelpersAbsService} from '../../../../common/services/helpers.abs.service';
import { SPDetailDBService } from 'app/modules/bsmodules/user-file-manage/service-provider-list/sp.db.service';
import { SpWeixinModel } from '../../../../common/models/user-file-manage/sp.weixin.model';

@Component({
    selector: 'ulo-sp-info-weixin-win',
    templateUrl: './sp.info.weixin.win.component.html',
    providers: [
        SPDetailDBService
    ]
})

export class ULOSPInfoWeixinWinComponent implements OnInit {
    public spInfoWeixinGroup: FormGroup;
    public model: SpWeixinModel = new SpWeixinModel();

    constructor(
        public helper: HelpersAbsService,
        @Inject(MD_DIALOG_DATA) public data: any,
        public dialogRef: MdDialogRef<ULOSPInfoWeixinWinComponent>,
        public snackBar: MdSnackBar,
        protected fb: FormBuilder,
        public sPDetailDBService: SPDetailDBService
    ) {
        this.spInfoWeixinGroup = this.fb.group({
          subAppid: [this.model['subAppid'], [Validators.required]],
          subscribeAppid: [this.model['subscribeAppid'], [Validators.required]],
          jsapiPath: [this.model['jsapiPath'], [Validators.required]]
        });
    }

    ngOnInit() {
        if(this.data && this.data['chanCode']){
            this.model['chanCode'] = this.data['chanCode'];
            this.sPDetailDBService.querySPWxConfig(this.data).subscribe( res => {
                if(res && res['status'] == 200 && res['data']){
                    this.model.resetValue(res['data']);
                }
            })
        }
    }


    /**
     * 表单提交
     */
    onSubmit() {
        this.model['jsapiPath'] = this.model['jsapiPath'].replace(/\s*/g, '').replace(/\n/g, '').replace(/\r/g, '').replace(/\r\n/g, '');
        let result = this.pathValidator(this.model['jsapiPath']);
        if(!result){
            return;
        }
        if(this.helper.isEmpty(this.model['id'])){
            this.sPDetailDBService.addSPWxConfig(this.model).subscribe(res => {
                if (res && res['status'] == 200) {
                    this.snackBar.alert('保存成功！');
                    this.dialogRef.close(res);
                } else {
                    this.snackBar.alert(res.message);
                }
            })
        }else{
            this.sPDetailDBService.updateSPWxConfig(this.model).subscribe(res => {
                if (res && res['status'] == 200) {
                    this.snackBar.alert('保存成功！');
                    this.dialogRef.close(res);
                } else {
                    this.snackBar.alert(res.message);
                }
            })
        }
    }

    /**
     * 验证支付授权目录
     */
    private pathValidator(path): boolean {
        let flag = true;
        let _arr: Array<any> = path && path.split('|');
        if(_arr instanceof Array){
            _arr.forEach(e => {
                if (this.helper.isEmpty(e)) {
                    this.snackBar.alert('请用|分隔有内容的支付授权目录！');
                    flag = false;
                }
            });
            if(_arr.length > 5){
                this.snackBar.alert('授权目录不能超过5个！');
                flag = false;
            }
        }
        return flag;
    }


    /**
     * 关联公众号与推荐关联公众号联动事件
     */
    public onBlurRelate() {
        if (this.helper.isEmpty(this.model['subscribeAppid'])){
            this.model['subscribeAppid'] = this.model['subAppid'];
        }
    }
}
