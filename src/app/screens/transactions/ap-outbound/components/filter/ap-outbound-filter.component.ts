import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-ap-outbound-filter',
  templateUrl: './ap-outbound-filter.component.html',
  styleUrl: './ap-outbound-filter.component.scss'
})
export class ApOutboundFilterComponent {
  @Output() getData: EventEmitter<any> = new EventEmitter();

  batchNumber: any = undefined;
  @Input() filters: any = [];

  constructor() { }

  handleSearch() {
    this.getData.emit({ batchNumber: this.batchNumber})
  }

  onClearFilter() {
   this.batchNumber = ''
    this.getData.emit({ batchNumber: '' })
  }
}
