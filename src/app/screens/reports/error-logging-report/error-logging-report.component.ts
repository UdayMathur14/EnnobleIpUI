import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { XlsxService } from '../../../core/service/xlsx.service';
import { ReportService } from '../../../core/service/report.service';
import { ExportService } from '../../../core/service/export.service';

@Component({
  selector: 'app-error-logging-report',
  templateUrl: './error-logging-report.component.html',
  styleUrl: './error-logging-report.component.scss'
})
export class ErrorLoggingReportComponent {

  errorLoggings = [];
  isFilters: boolean = true;
  currentPage: number = 1;
  count: number = 10;
  totalReports: number = 0;
  filters: any = [];
  maxCount: number = Number.MAX_VALUE;

  constructor(
    private router: Router,
    private reportService: ReportService,
    private exportService: ExportService,
  ) { }

  ngOnInit(): void {
    this.getReports();
  }

  getReports(offset: number = 0, count: number = this.count, filters: any = this.filters) {

    const data = {
      fromDate: filters?.fromDate || null,
      toDate: filters?.toDate || null,
    };

    this.reportService.getErrorLogging(data, offset, count).subscribe((res: any) => {
      this.errorLoggings = res.errorLoggings.map((e: any) => ({ ...e, detailDescriptions: e.detailDescriptions.join(',') }));
      this.totalReports = res.paging.total;
      this.filters = res.filters;
    }, error => {

    })
  }

  getData(data: any) {
    this.filters = data;
    this.currentPage = 1;
    this.getReports(0, this.count, this.filters);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    const offset = (this.currentPage - 1) * this.count;
    this.getReports(offset, this.count, this.filters);
  }

  onPageSizeChange(data: any) {
      this.count = data;
      this.currentPage = 1;
      this.getReports(0, this.count, this.filters);
    }

  exportData(fileName: string = "Error Logging") {
    this.exportService.csvExport(fileName);
  }
}
