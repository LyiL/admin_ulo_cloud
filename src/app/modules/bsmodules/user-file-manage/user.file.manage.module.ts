import {NgModule} from "@angular/core";
import {ULOServiceProviderComponent} from "./service-provider-list/sp.list.component";
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {FlexLayoutModule} from "@angular/flex-layout";
import {
  MdInputModule, MdCardModule, MdTabsModule, MdInputSearchModule, MdDialogModule, MdSelectModule, MdCheckboxModule,
  MdRadioModule, MdButtonModule, MdPupopModule, MdDatepickerModule, MdNativeDateModule
} from "@angular/material";
import {MdTableExtendModule} from "../../../common/components/table/index";
import {ULOServiceProviderDetailComponent} from "./service-provider-list/sp.detail.component";
import {ULODetailModule} from "../../../common/components/detail/index";
import {ULOSPDetailContentComponent} from "./service-provider-list/detail-component/sp.detail.content.component";
import {ULOSPDetailProductComponent} from "./service-provider-list/detail-component/sp.detail.product.component";
import {ULOSPAddComponent} from "./service-provider-list/sp.add.component";
import {ULOSPBaseInfoComponent} from "./service-provider-list/edit-component/sp.base.info.component";
import {ULOSPAccountComponent} from "./service-provider-list/edit-component/sp.account.component";
import {ULOSPChannelComponent} from "./service-provider-list/edit-component/sp.channel.component";
import {RefundSettingsListComponent} from "./refund-settings-list/refund.settings.list.component";
import {RefundStrategyListComponent} from "./refund-settings-list/refund-strategy-list/refund.strategy.list.component";
import {RefundStrategyListAddbtnWinComponent} from "./refund-settings-list/refund-strategy-list/refund.strategy.list.addbtn.win.component";
import {RefundAuthorityListComponent} from "./refund-settings-list/refund-authority-list/refund.authority.list.component";
import {RefundAuthorityListAddbtnWinComponent} from "./refund-settings-list/refund-authority-list/refund.authority.list.addbtn.win.component";
import {AgencyListComponent} from "./agency-list/agency.list.component";
import {AgencyAddComponent} from "./agency-list/agency.add.component";
import {AgencyBaseInfoComponent} from "./agency-list/edit-component/agency.base.info.component";
import {AgencyAccountComponent} from "./agency-list/edit-component/agency.account.component";
import {AgencyChannelComponent} from "./agency-list/edit-component/agency.channel.component";
import {AgencyDetailComponent} from "./agency-list/agency.detail.component";
import {AgencyDetailContentComponent} from "./agency-list/detail-component/agency.detail.content.component";
import {AgencyDetailProductComponent} from "./agency-list/detail-component/agency.detail.product.component";
import {MerchantListComponent} from "./merchant-list/merchant.list.component";
import {
  mchStoreAddWinComponent,
  StoreManageListComponent
} from "app/modules/bsmodules/user-file-manage/mchstore-list/storemanage.list.component";
import {IntoPiecesListComponent} from "./mchentry-list/intopieces.list.component";
import {MerchantAddListComponent} from "app/modules/bsmodules/user-file-manage/merchant-list/merchant.add.list.component";
import {MchBaseInfoComponent} from "./merchant-list/edit-component/mch.base.info.component";
import {
  MchAccountInfoComponent,
} from "./merchant-list/edit-component/mch.account.info.component.";

import { MchDetailListComponent} from "app/modules/bsmodules/user-file-manage/merchant-list/detail-component/mch.detail.list.component";
import {MchDetailProductComponent} from "./merchant-list/detail-component/mch.detail.product.component";
import {MerchantDetailComponent} from "./merchant-list/merchant.detail.component";
import {MchChannelInfoComponent} from "app/modules/bsmodules/user-file-manage/merchant-list/edit-component/mch.channel.info.component";
import {MchStoreDetailListComponent} from "./mchstore-list/mchstore.detail.list.component";
import {MchStorePayTypeFormComponent} from "./mchstore-list/mchstorepaytype.form.component";

import {CommonDirectiveModule} from "../../../common/directives/index";
import {SPDetailProductFormComponent} from "./service-provider-list/detail-component/sp.detail.product.form.component";
import {UloFileUploaderModule} from "../../../common/components/file-update/index";
import {RefundStrategyListEditbtnWinComponent} from "./refund-settings-list/refund-strategy-list/refund.strategy.list.editbtn.win.component";
import {RefundAuthorityListEditbtnWinComponent} from "./refund-settings-list/refund-authority-list/refund.authority.list.editbtn.win.component";
import {MchDetailProductFormComponent} from "./merchant-list/detail-component/mch.detail.product.form.component";
import {IntopiecesAddWinComponent} from "./mchentry-list/intopieces.add.win.component";
import {UloSubContainer} from "../../../common/components/sub-mch-channel/sub.container";
import {AgencyDetailProductFormComponent} from "./agency-list/detail-component/agency.detail.product.form.component";
import {MerchantWeixinAccountSetComponent} from "./merchant-list/merchant.weixinAccountSet.win.component";
import {merchantWeixinAccountSetDetailComponent} from "app/modules/bsmodules/user-file-manage/merchant-list/merchant.weixinAccountSet.detail.component";
import {MchDetailChannelComponent} from "./merchant-list/detail-component/mch.detail.channel.component";
import {AgencyDetailChannelComponent} from "./agency-list/detail-component/agency.detail.channel.component";
import {ULOSPInfoComponent} from './service-provider-list/sp.info.component';
import {ULOSPInfoWeixinWinComponent} from './service-provider-list/sp.info.weixin.win.component';
import {ULOSPDetailChannelComponent} from './service-provider-list/detail-component/sp.detail.channel.component';
import { ULOSPInfoSubMchPatternWinComponent } from './service-provider-list/sp.info.subMchPattern.win.component';
import {SubmerchantListComponent} from "./submerchant-list/submerchant.list.component";
import {SubmerchantDetailComponent} from "./submerchant-list/submerchant.detail.component";
import {SubmerchantDetailContentComponent} from "./submerchant-list/detail-component/submerchant.detail.content.component";
import {SubmerchantDetailIdcodeComponent} from "./submerchant-list/detail-component/submerchant.detail.idcode.component";
import {ResourcePoolListComponent} from "./resource-pool-list/resource.pool.list.component";
import {ResourcePoolAddComponent} from "./resource-pool-list/resource.pool.add.component";
import {ULOSpTradeRuleWinComponent} from "./service-provider-list/sp.tradeRule.win.component";
import {mchDetailChannelTradeRulerWinComponent} from "./merchant-list/detail-component/mch.detail.channel.tradeRuler.win.component";
import {ULOSPInfoTradeLimitWinComponent} from "./service-provider-list/sp.info.tradeLimit.win.component";
import {MchInfoConfigComponent} from "./merchant-list/edit-component/mch.info.config.component";
import {mchInfoTradeLimitWinComponent} from "./merchant-list/detail-component/mch.info.tradeLimit.win.component";
import {MchDetailInfoConfigComponent} from "./merchant-list/detail-component/mch.detail.info.config.component";
import {ResourcePoolDetailComponent} from "./resource-pool-list/resource.pool.detail.component";
import {ULOSPChannelDetailComponent} from "./service-provider-list/edit-component/sp.channel.detail.component";
import {ULOSPChannelEditWinComponent} from "./service-provider-list/edit-component/sp.channel.edit.win.component";
import {mchInfoSecretkeyComponent} from "./merchant-list/detail-component/mch.info.secretkey.component";
import {spDetailSecretkeyComponent} from "./service-provider-list/detail-component/sp.detail.secretkey.component";

@NgModule({
  declarations: [
    ULOServiceProviderComponent,
    ULOServiceProviderDetailComponent,
    ULOSPDetailContentComponent,
    ULOSPDetailProductComponent,
    ULOSPDetailChannelComponent,
    ULOSPInfoComponent,
    ULOSPInfoWeixinWinComponent,
    ULOSPAddComponent,
    ULOSPBaseInfoComponent,
    ULOSPAccountComponent,
    ULOSPChannelComponent,
    ULOSPChannelDetailComponent,
    ULOSPChannelEditWinComponent,
	  ULOSpTradeRuleWinComponent,
	  ULOSPInfoSubMchPatternWinComponent,
    ULOSPInfoTradeLimitWinComponent,
    RefundSettingsListComponent,
    RefundStrategyListComponent,
    RefundStrategyListAddbtnWinComponent,
    RefundAuthorityListComponent,
    RefundAuthorityListAddbtnWinComponent,
    AgencyListComponent,
    AgencyAddComponent,
    AgencyBaseInfoComponent,
    AgencyAccountComponent,
    AgencyChannelComponent,
    AgencyDetailComponent,
    AgencyDetailContentComponent,
    AgencyDetailProductComponent,
	  MerchantListComponent,
    StoreManageListComponent,
    IntoPiecesListComponent,
    MerchantAddListComponent,
    MchBaseInfoComponent,
    MchDetailListComponent,
    MchDetailProductComponent,
    MchDetailChannelComponent,
    MerchantDetailComponent,
    MchAccountInfoComponent,
    MchChannelInfoComponent,
    mchStoreAddWinComponent,
    MchStoreDetailListComponent,
    MchStorePayTypeFormComponent,
    SPDetailProductFormComponent,
    RefundStrategyListEditbtnWinComponent,
    RefundAuthorityListEditbtnWinComponent,
    MchDetailProductFormComponent,
    IntopiecesAddWinComponent,
    UloSubContainer,
    AgencyDetailProductFormComponent,
    merchantWeixinAccountSetDetailComponent,
    MerchantWeixinAccountSetComponent,
    AgencyDetailChannelComponent,
    SubmerchantListComponent,
    SubmerchantDetailComponent,
    SubmerchantDetailContentComponent,
    SubmerchantDetailIdcodeComponent,
    ResourcePoolListComponent,
    mchDetailChannelTradeRulerWinComponent,
    ResourcePoolAddComponent,
	MchDetailInfoConfigComponent,
    MchInfoConfigComponent,
    mchInfoTradeLimitWinComponent,
    ResourcePoolDetailComponent,
    mchInfoSecretkeyComponent,
    spDetailSecretkeyComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    MdInputModule,
    MdInputSearchModule,
    MdCardModule,
    FlexLayoutModule,
    MdTableExtendModule,
    MdTabsModule,
    MdButtonModule,
    ULODetailModule,
    MdDialogModule,
    MdSelectModule,
    MdCheckboxModule,
    CommonDirectiveModule,
    ReactiveFormsModule,
    MdDatepickerModule,
    MdNativeDateModule,
    MdPupopModule,
    UloFileUploaderModule,
	MdRadioModule
  ],
  entryComponents: [
    RefundStrategyListAddbtnWinComponent,
    RefundAuthorityListAddbtnWinComponent,
    mchStoreAddWinComponent,
    ULOSPDetailContentComponent,
    ULOSPDetailProductComponent,
    ULOSPDetailChannelComponent,
    ULOSPInfoComponent,
    ULOSPInfoWeixinWinComponent,
    SPDetailProductFormComponent,
    ULOSPBaseInfoComponent,
    ULOSPAccountComponent,
    ULOSPChannelComponent,
    ULOSPChannelDetailComponent,
    ULOSPChannelEditWinComponent,
	  ULOSpTradeRuleWinComponent,
	  ULOSPInfoSubMchPatternWinComponent,
    ULOSPInfoTradeLimitWinComponent,
    RefundStrategyListEditbtnWinComponent,
    RefundAuthorityListEditbtnWinComponent,
    MchDetailProductFormComponent,
    IntopiecesAddWinComponent,
    UloSubContainer,
    AgencyDetailProductFormComponent,
    MerchantWeixinAccountSetComponent,
    AgencyDetailChannelComponent,
    SubmerchantDetailContentComponent,
    SubmerchantDetailIdcodeComponent,
    mchDetailChannelTradeRulerWinComponent,
    MchDetailInfoConfigComponent,
    MchInfoConfigComponent,
    mchInfoTradeLimitWinComponent,
    mchInfoSecretkeyComponent,
    spDetailSecretkeyComponent
  ]
})
export class UserFileManageModule { }
