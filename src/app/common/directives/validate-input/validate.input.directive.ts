import {Directive, Input, HostListener} from "@angular/core";
import {NgControl} from "@angular/forms";

@Directive({
  selector:'input[validate]'
})
export class ValidateInputDirective{

  get mask():string{
    return this._mask;
  }
  @Input('validate')
  set mask(_mask:string){
    this._mask = _mask;
  }
  private _mask:string;

  constructor(
    private control: NgControl
  ) { }

  @HostListener('keyup', ['$event'])
  onKeyUp($event: any) {
    if ($event.keyCode !== 13 && $event.keyCode !== 9) {
      let value = this.control.control.value;

      this.control.control.setValue(this.validate(value));
    }
  }

  private validate(v: string): string {
    let s: string = '';

    const matches = v.match(/[a-zA-Z0-9]+/g);
    if (matches !== null) {
      let value = matches.join('').split('');

      const chars = this.mask.split('');
      for (let c of chars) {
        if (value.length === 0) {
          break;
        }

        switch (c) {
          case '#':
            s += value[0];
            value = value.slice(1);
            break;

          case '9':
            if (value[0].match(/\d/) !== null) {
              s += value[0];
              value = value.slice(1);
            }
            break;

          case 'A':
            if (value[0].match(/[a-zA-Z]/) !== null) {
              s += value[0];
              value = value.slice(1);
            }
            break;

          default:
            s += c;
        }
      }
    }

    return s;
  }
}
