import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { XlsxService } from '../../../core/service/xlsx.service';
import { ReportService } from '../../../core/service/report.service';
import { ExportService } from '../../../core/service/export.service';

@Component({
  selector: 'app-provision-report',
  templateUrl: './provision-report.component.html',
  styleUrl: './provision-report.component.scss'
})
export class ProvisionReportComponent {

  provisionalReport = [];
  isFilters: boolean = true;

  constructor(
    private router: Router,
    private exportService: ExportService,
    private reportService: ReportService,
    private xlsxService: XlsxService
  ) { }

  ngOnInit(): void {
    this.getData();
  }

  getData(fromDate: string = '', toDate: string = '') {

    const body: any = {};
    if (fromDate && toDate) {
      body.fromDate = fromDate;
      body.toDate = toDate;
    }

    this.reportService.getProvisionReport({ ...body }).subscribe((res: any) => {
      this.provisionalReport = res.provisionalReport;
    }, error => {

    })
  }

  exportData(fileName: string = "Error Logging") {
    this.exportService.csvExport(fileName);
  }
}
