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

  batchNumber!: string;
  @Input() reportFilter: any = [];

  constructor(private toastr: ToastrService) { }

  handleSearch() {
    this.getData.emit({ batchNumber: this.batchNumber })
  }

  onClearFilter() {
    this.batchNumber = '';
    this.getData.emit({ batchNumber: '' })
  }

  onExportPDF() {
    this.exportPdf.emit();
  }

  onExportExcel() {
    this.exportExcel.emit();
  }
}
