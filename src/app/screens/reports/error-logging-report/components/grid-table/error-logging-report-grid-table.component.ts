import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-error-logging-report-grid-table',
  templateUrl: './error-logging-report-grid-table.component.html',
  styleUrl: './error-logging-report-grid-table.component.scss'
})
export class ErrorLoggingReportGridTableComponent {

  @Input() errorLoggings: any[] = [];

}
