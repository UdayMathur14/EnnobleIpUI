import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[inputDecimalValidator]'
})
export class InputDecimalValidator {
  private regex: RegExp = new RegExp(/^\d+(\.\d{0,2})?$/);
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Delete'];

  constructor(private el: ElementRef) { }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return; 
    }

    if ((event.ctrlKey || event.metaKey) && (event.key === 'a' || event.key === 'c' || event.key === 'v' || event.key === 'x')) {
      return;
    }

    const current: string = this.el.nativeElement.value;
    const next: string = current.concat(event.key);
    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }
  }
}
