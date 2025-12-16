import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, inject } from '@angular/core';

@Component({
  selector: 'app-provisional-report-filter',
  templateUrl: './provisional-report-filter.component.html',
  styleUrl: './provisional-report-filter.component.scss'
})
export class ProvisionalReportFilterComponent {

  @Output() exportData: EventEmitter<any> = new EventEmitter();
 
  @Output() getData: EventEmitter<any> = new EventEmitter();

  vendor: any = undefined;
  status: any = undefined;
  applicationNumber: any = undefined;
  clientInvoiceNo: any = undefined;
  @Input() filters: any = [];

  constructor() { }

  handleSearch() {
    this.getData.emit({ 
      vendor: this.vendor,
      status: this.status,
      applicationNumber: this.applicationNumber,
      clientInvoiceNo: this.clientInvoiceNo
    })
  }

  onClearFilter() {
   this.vendor = '',
   this.status = '',
   this.applicationNumber = '',
   this.clientInvoiceNo = ''  
    this.getData.emit({ 
      vendor: '',
      status: '',
      applicationNumber: '',
      clientInvoiceNo: ''
    })
  }
}
