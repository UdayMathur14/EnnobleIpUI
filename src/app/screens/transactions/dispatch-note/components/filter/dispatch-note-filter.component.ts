import { Component, EventEmitter, Input, Output } from '@angular/core';
import { APIConstant } from '../../../../../core/constants';

@Component({
  selector: 'app-dispatch-note-filters',
  templateUrl: './dispatch-note-filter.component.html',
  styleUrl: './dispatch-note-filter.component.scss'
})
export class DispatchNoteFiltersComponent {
  
  @Output() getData: EventEmitter<any> = new EventEmitter();
  dispatchNumber:any = undefined;
  status: any = undefined;
  frlrNo: any = undefined;
  @Input() filters : any = [];
  locations:any[] = APIConstant.locationsListDropdown;
  locationIds:any[]= APIConstant.locationsListDropdown.map((e:any)=>(e.id));

  constructor() { }

  handleSearch() {
    this.getData.emit({ dispatchNumber: this.dispatchNumber,locationIds:this.locationIds, status: this.status, frlrNo: this.frlrNo })
  }

  onClearFilter() {
    this.dispatchNumber = null;
    this.status = undefined;
    this.frlrNo = undefined;
    this.locationIds = [];
    this.getData.emit({ dispatchNumber: null,locationIds:[], status: '', frlrNo: ''})
  }
}
