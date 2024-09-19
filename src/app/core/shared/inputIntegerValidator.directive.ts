import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[inputIntegerValidator]'
})
export class InputIntegerValidator {

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if ([8, 9, 27, 13, 46].indexOf(charCode) !== -1 ||
      (charCode === 65 && (event.ctrlKey || event.metaKey)) || 
      (charCode === 67 && (event.ctrlKey || event.metaKey)) || 
      (charCode === 86 && (event.ctrlKey || event.metaKey)) || 
      (charCode === 88 && (event.ctrlKey || event.metaKey)) || 
      (charCode >= 35 && charCode <= 39)) {
      return;
    }

    if ((charCode < 48 || charCode > 57) && (charCode < 96 || charCode > 105)) {
      event.preventDefault();
    }
  }
}
