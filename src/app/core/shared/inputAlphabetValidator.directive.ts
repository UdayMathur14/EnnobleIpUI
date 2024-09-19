import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[inputAlphabetValidator]'
})
export class inputAlphabetValidator {
  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;

    if (
      (charCode > 31 && (charCode < 65 || charCode > 90)) &&
      (charCode < 97 || charCode > 122) &&
      charCode !== 32 &&
      charCode !== 8 &&
      charCode !== 46 
    ) {
      event.preventDefault();
    }
  }
}
