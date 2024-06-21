import { Component, EventEmitter, Output, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-provision-report-filter',
  templateUrl: './provision-report-filter.component.html',
  styleUrl: './provision-report-filter.component.scss'
})
export class ProvisionReportFilterComponent {

  @Output() getData: EventEmitter<any> = new EventEmitter();
  @Output() exportData: EventEmitter<any> = new EventEmitter();

  fromDate!: any;
  toDate!: any;

  constructor(private toastr: ToastrService) { }

  handleSearch() {
    if (!this.fromDate || !this.toDate) {
      this.toastr.error("Filter is Mandatory");
      return;
    }

    this.getData.emit({ fromDate: this.fromDate, toDate: this.toDate })
  }

  onClearFilter() {
    this.fromDate = null;
    this.toDate = null;
    this.getData.emit({ fromDate: '', toDate: '' })
  }
}
