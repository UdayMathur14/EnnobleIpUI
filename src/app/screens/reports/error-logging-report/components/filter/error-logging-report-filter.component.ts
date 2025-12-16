import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-error-logging-report-filter',
  templateUrl: './error-logging-report-filter.component.html',
  styleUrl: './error-logging-report-filter.component.scss'
})
export class ErrorLoggingReportFilterComponent {
  @Input() filters: any = [];
  @Output() getData: EventEmitter<any> = new EventEmitter();
  @Output() exportData: EventEmitter<any> = new EventEmitter();
  
  today = inject(NgbCalendar).getToday();
  fromDate!: NgbDateStruct | null;
  toDate!: NgbDateStruct | null;
  messageSource: any = undefined;
  messageName: any = undefined;
  responseCode: any = undefined;
  vendorName: any = undefined;
country: any;
status: any;
vendortype: any;

  constructor(private toastr: ToastrService) { }

  handleSearch() {
    // if (!this.fromDate || !this.toDate) {
    //   this.toastr.error("Filter is Mandatory");
    //   return;
    // }

    // this.getData.emit({ fromDate: this.fromDate, 
    //   toDate: this.toDate, })
  }

  onClearFilter() {
    this.fromDate = null;
    this.toDate = null;
    this.vendorName = null;
    this.country = null;
    this.status = null;
    this.vendortype = null;
    this.getData.emit({ fromDate: '', 
      toDate: '' ,vendorName: '', country: '', status: '', vendortype: ''
    })
  }
}
