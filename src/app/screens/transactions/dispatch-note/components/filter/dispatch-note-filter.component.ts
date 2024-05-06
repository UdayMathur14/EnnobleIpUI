import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dispatch-note-filters',
  templateUrl: './dispatch-note-filter.component.html',
  styleUrl: './dispatch-note-filter.component.scss'
})
export class DispatchNoteFiltersComponent {
  
  @Output() getData: EventEmitter<any> = new EventEmitter();
  dispatchNumber:any = '';

  constructor() { }

  handleSearch() {
    this.getData.emit({ dispatchNumber: this.dispatchNumber })
  }

}
