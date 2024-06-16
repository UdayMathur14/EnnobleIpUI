import { Component, EventEmitter, Output, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-debit-note-report-filter',
  templateUrl: './debit-note-report-filter.component.html',
  styleUrl: './debit-note-report-filter.component.scss'
})
export class DebitNoteReportFilterComponent {

  @Output() getData: EventEmitter<any> = new EventEmitter();

  batchNumber!: string;

  constructor(private toastr: ToastrService) { }

  handleSearch() {
    this.getData.emit({ batchNumber: this.batchNumber })
  }

  onClearFilter() {
    this.getData.emit({ batchNumber: '' })
  }
}
