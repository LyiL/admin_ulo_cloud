import {NgModule} from "@angular/core";
import {MdTableExtendContainer} from "./table-extend-container";
import {MD_TABLE_EXTEND_DATA} from "./table-extend-service";
import { MaterialModule } from "@angular/material";
import {MdTableExtend} from "./table-extend";
import {CommonModule} from "@angular/common";
import {CdkTableModule} from "@angular/cdk";
import {FormsModule} from "@angular/forms";
import {TableCell} from "./table-cell";
import {CommonDirectiveModule} from "../../directives/index";
import {MdTableEditWin} from "./edit/table-edit-win";

export * from "./table-extend-config";
export * from "./table-extend-container";
export * from "./table-extend-data-source";
export * from "./table-extend-service";
export * from "./table-cell";
export * from "./edit/table-edit-win";

@NgModule({
    imports: [CommonModule,FormsModule,CdkTableModule,MaterialModule,CommonDirectiveModule],
    exports: [MdTableExtend,MdTableExtendContainer,TableCell,MdTableEditWin],
    declarations: [MdTableExtend,MdTableExtendContainer,TableCell,MdTableEditWin],
    providers:[{ provide: MD_TABLE_EXTEND_DATA, useValue: ''}],
    entryComponents:[MdTableExtendContainer,MdTableExtend,MdTableEditWin]
})
export class MdTableExtendModule {}
