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
    let filterData = {
      "ApplicationNumber": this.applicationNumber,
      "ClientInvoiceNumber": this.clientInvoiceNumber,
      "Status": this.Status,
    }
    this.getData.emit(filterData)
  }

  onClearFilter() {
    this.Status = undefined;
    this.applicationNumber = undefined;
    this.clientInvoiceNumber = undefined;
    this.getData.emit({
      clientInvoiceNumber:undefined ,
      Status: undefined,
      applicationNumber: undefined
    });
  }
}
