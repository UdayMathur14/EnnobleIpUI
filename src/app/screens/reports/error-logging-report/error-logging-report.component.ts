import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { XlsxService } from '../../../core/service/xlsx.service';
import { ReportService } from '../../../core/service/report.service';

@Component({
  selector: 'app-error-logging-report',
  templateUrl: './error-logging-report.component.html',
  styleUrl: './error-logging-report.component.scss'
})
export class ErrorLoggingReportComponent {

  errorLoggings = [];
  isFilters: boolean = true;

  constructor(
    private router: Router,
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

    this.reportService.getErrorLogging({ ...body }).subscribe((res: any) => {
      this.errorLoggings = res.errorLoggings.map((e: any) => ({ ...e, detailDescriptions: e.detailDescriptions.join(',') }));
    }, error => {

    })
  }
}
