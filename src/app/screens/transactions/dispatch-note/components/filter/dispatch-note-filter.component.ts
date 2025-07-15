import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { APIConstant } from '../../../../../core/constants';
import { LookupService } from '../../../../../core/service/lookup.service';

@Component({
  selector: 'app-dispatch-note-filters',
  templateUrl: './dispatch-note-filter.component.html',
  styleUrl: './dispatch-note-filter.component.scss',
})
export class DispatchNoteFiltersComponent implements OnInit {
  @Output() getData: EventEmitter<any> = new EventEmitter();
  dispatchNumber: any = undefined;
  Status: any = undefined;
  frlrNo: any = undefined;
  dispatchStatus: any = undefined;
  @Input() filters: any = [];
  commonLocations: any = [];
  locationIds: any[] = APIConstant.commonLocationsList.map((e: any) => e.id);
  locations: any[] = APIConstant.commonLocationsList;
  @Output() locationsData: EventEmitter<any[]> = new EventEmitter();
  applicationNumber: undefined;
  clientInvoiceNumber: undefined;

  constructor(private lookupService: LookupService) {}

  ngOnInit(): void {}
  handleSearch() {
    this.getData.emit({
      dispatchNumber: this.dispatchNumber,
      clientInvoiceNumber: this.clientInvoiceNumber,
      status: this.Status,
      applicationNumber: this.applicationNumber,
    });
  }

  onClearFilter() {
    this.dispatchNumber = null;
    this.Status = undefined;
    this.applicationNumber = undefined;
    this.clientInvoiceNumber = undefined;
    this.locationIds = this.locationIds;
    this.getData.emit({
      dispatchNumber: null,
      locationIds: this.locationIds,
      status: '',
      frlrNo: '',
      dispatchStatus: ''
    });
  }
}
