import {UloFileDropDirective} from "./file.drop.directive";
import {UloFileSelectDirective} from "./file.select.directive";

export * from "./file.drop.directive";
export * from "./file.select.directive";
export * from "./uploader";

export const UPLOAD_DIRECTIVES: any[] = [
  UloFileDropDirective,
  UloFileSelectDirective
];
