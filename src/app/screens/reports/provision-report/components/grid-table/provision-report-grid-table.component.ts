import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-provision-report-grid-table',
  templateUrl: './provision-report-grid-table.component.html',
  styleUrl: './provision-report-grid-table.component.scss'
})
export class ProvisionReportGridTableComponent {

  @Input() provisionReports: any = [];
}
