import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-provision-report-grid-table',
  templateUrl: './provision-report-grid-table.component.html',
  styleUrl: './provision-report-grid-table.component.scss'
})
export class ProvisionReportGridTableComponent {

  @Input() provisionalReport: any[] = [];

}
