import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-debit-note-report-filter',
  templateUrl: './debit-note-report-filter.component.html',
  styleUrl: './debit-note-report-filter.component.scss'
})
export class DebitNoteReportFilterComponent {

  @Output() getData: EventEmitter<any> = new EventEmitter();
  @Output() exportExcel: EventEmitter<any> = new EventEmitter();
  @Output() exportPdf: EventEmitter<any> = new EventEmitter();

  batchNumber!: any;  
  applicationNumber!: any;
  clientInvoiceNo!: any;
  status!: any;
  @Input() reportFilter: any = [];

  constructor(private toastr: ToastrService) { }

  handleSearch() {
    this.getData.emit({ applicationNumber: this.applicationNumber, clientInvoiceNo: this.clientInvoiceNo, status: this.status })
  }

  onClearFilter() {
    this.applicationNumber = '';
    this.clientInvoiceNo = '';
    this.status = '';
    this.getData.emit({ applicationNumber: '', clientInvoiceNo: '', status: '' })
  }

  onExportPDF() {
    // this.exportPdf.emit();
  }

  onExportExcel() {
    // this.exportExcel.emit();
  }
}
