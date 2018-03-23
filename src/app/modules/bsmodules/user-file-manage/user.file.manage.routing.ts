import {ULOServiceProviderComponent} from "./service-provider-list/sp.list.component";
import {ULOServiceProviderDetailComponent} from "./service-provider-list/sp.detail.component";
import {ULOSPAddComponent} from "./service-provider-list/sp.add.component";
import {RefundSettingsListComponent} from "./refund-settings-list/refund.settings.list.component";
import {RefundStrategyListComponent} from "./refund-settings-list/refund-strategy-list/refund.strategy.list.component";
import {RefundAuthorityListComponent} from "./refund-settings-list/refund-authority-list/refund.authority.list.component";
import {AgencyListComponent} from "./agency-list/agency.list.component";
import {AgencyAddComponent} from "./agency-list/agency.add.component";
import {AgencyDetailComponent} from "./agency-list/agency.detail.component";
import {MerchantListComponent} from "./merchant-list/merchant.list.component";
import {IntoPiecesListComponent} from "./mchentry-list/intopieces.list.component";
import {StoreManageListComponent} from "./mchstore-list/storemanage.list.component";
import {MerchantAddListComponent} from "./merchant-list/merchant.add.list.component";
import {MerchantDetailComponent} from "./merchant-list/merchant.detail.component";
import {MchStoreDetailListComponent} from "./mchstore-list/mchstore.detail.list.component";
import {MchStorePayTypeFormComponent} from "./mchstore-list/mchstorepaytype.form.component";
import {merchantWeixinAccountSetDetailComponent} from "./merchant-list/merchant.weixinAccountSet.detail.component";
import {SubmerchantListComponent} from "./submerchant-list/submerchant.list.component";
import {SubmerchantDetailComponent} from "./submerchant-list/submerchant.detail.component";
import {ResourcePoolListComponent} from "./resource-pool-list/resource.pool.list.component";
import {ResourcePoolAddComponent} from "./resource-pool-list/resource.pool.add.component";
import {ResourcePoolDetailComponent} from "./resource-pool-list/resource.pool.detail.component";
export const routers = [
    {path: 'splist', component: ULOServiceProviderComponent},
    {path: 'spdetail', component: ULOServiceProviderDetailComponent},
    {path: 'spedit', component:ULOSPAddComponent},
    {path: 'refundset', component: RefundSettingsListComponent},
    {path: 'refundstrategy', component: RefundStrategyListComponent},
    {path: 'refundauthority', component: RefundAuthorityListComponent},
    {path: 'agencylist', component: AgencyListComponent},
    {path: 'agencyedit', component: AgencyAddComponent},
    {path: 'agencydetail', component: AgencyDetailComponent},
	  {path: 'mchlist', component:MerchantListComponent},
    {path: 'storemanage', component:StoreManageListComponent},
    {path: 'intopieces', component:IntoPiecesListComponent},
    {path: 'merchantadd', component:MerchantAddListComponent},
    {path: 'merchantdetail', component:MerchantDetailComponent},
    {path: 'merchantweixincfgdetail', component:merchantWeixinAccountSetDetailComponent},
    {path: 'mchstoredetaillist', component:MchStoreDetailListComponent},
    {path: 'mchstorepaytypeform', component:MchStorePayTypeFormComponent},
    {path: 'submerchantlist', component:SubmerchantListComponent},
    {path: 'submerchantdetail', component:SubmerchantDetailComponent},
    {path: 'resourcepoollist', component:ResourcePoolListComponent},
    {path: 'resourcepooladd', component:ResourcePoolAddComponent},
    {path: 'resourcepooldetail', component:ResourcePoolDetailComponent}
];

