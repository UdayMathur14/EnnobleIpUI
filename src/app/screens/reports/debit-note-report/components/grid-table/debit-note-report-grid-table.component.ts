import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-debit-note-report-grid-table',
  templateUrl: './debit-note-report-grid-table.component.html',
  styleUrl: './debit-note-report-grid-table.component.scss'
})
export class DebitNoteReportGridTableComponent {

  @Input() billTiBillReport: any[] = [];
  @Input() columns: any = [];

}
