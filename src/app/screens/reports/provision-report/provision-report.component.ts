import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../../core/service/report.service';
import { ExportService } from '../../../core/service/export.service';

@Component({
  selector: 'app-provision-report',
  templateUrl: './provision-report.component.html',
  styleUrl: './provision-report.component.scss'
})
export class ProvisionReportComponent implements OnInit {

  provisionReports = [];
  isFilters: boolean = true;

  constructor(private reportService: ReportService,
    private exportService: ExportService
  ){}

  ngOnInit(): void {
    this.getData(null, null);
  }

  getData(fromDate: Date| null, toDate: Date | null) {
    this.reportService.getProvisionReport(fromDate, toDate).subscribe((res: any) => {
      this.provisionReports = res.provisionalReport;
    })
  }

  exportData(fileName: string = "ProvisionReport") {
    this.exportService.csvExport(fileName);
  }
}
