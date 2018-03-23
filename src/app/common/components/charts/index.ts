import {NgModule} from "@angular/core";
import {BaseChartDirective} from "./base.chart.directive";
@NgModule({
  declarations: [
    BaseChartDirective
  ],
  exports: [
    BaseChartDirective
  ],
  imports: []
})
export class ChartsModule {
}
