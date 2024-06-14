import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-provision-report-filter',
  templateUrl: './provision-report-filter.component.html',
  styleUrl: './provision-report-filter.component.scss'
})
export class ProvisionReportFilterComponent {

  fromDate: Date | null = null;
  toDate: Date | null = null;
  @Output() getData: EventEmitter<any> = new EventEmitter();
  @Output() exportData: EventEmitter<any> = new EventEmitter();

  handleSearch() {
    this.getData.emit({fromDate: this.fromDate, toDate: this.toDate })
  }

  onClearFilter() {
    this.fromDate = null,
    this.toDate = null;
    let obj = {
      fromDate: null,
      toDate: null,
    }
    this.getData.emit(obj)
  }

  handleExportData(){
    this.exportData.emit();
  }

}
