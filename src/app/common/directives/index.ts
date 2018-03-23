import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {StopPropagationDirective} from "./click.stop.directive";
import {ValidateInputDirective} from "./validate-input/validate.input.directive";
import {HelpPanelDirective} from "./help-panel/help.panel.directive";
import {TimeIntervalMovedDirective} from "./time.interval.moved.directive/timeinterval.moved.directive";
import {TimeIntervalMovedService} from "./time.interval.moved.directive/moved.service";

@NgModule({
  imports:[CommonModule],
  exports:[StopPropagationDirective,ValidateInputDirective,HelpPanelDirective,TimeIntervalMovedDirective],
  declarations:[StopPropagationDirective,ValidateInputDirective,HelpPanelDirective,TimeIntervalMovedDirective],
  providers:[{ provide: TimeIntervalMovedService, useClass: TimeIntervalMovedService}]
})
export class CommonDirectiveModule{

}

export * from './click.stop.directive';
export * from './validate-input/validate.input.directive';
export * from './help-panel/help.panel.directive'
