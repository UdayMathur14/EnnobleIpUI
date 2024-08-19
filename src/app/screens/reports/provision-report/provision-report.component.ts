import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { XlsxService } from '../../../core/service/xlsx.service';
import { ReportService } from '../../../core/service/report.service';
import { ExportService } from '../../../core/service/export.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-provision-report',
  templateUrl: './provision-report.component.html',
  styleUrl: './provision-report.component.scss',
})
export class ProvisionReportComponent {
  provisionalReport = [];
  isFilters: boolean = true;
  currentPage: number = 1;
  count: number = 10;
  totalReports: number = 0;
  filters: any = [];
  appliedFilters: any = {};
  headers: string[] = [];
  loadSpinner: boolean = true;

  constructor(
    private router: Router,
    private exportService: ExportService,
    private reportService: ReportService,
    private xlsxService: XlsxService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getReports();
  }

  getReports(
    offset: number = 0,
    count: number = this.count,
    filters: any = this.filters
  ) {
    const data = {
      fromDate: filters?.fromDate || null,
      toDate: filters?.toDate || null,
    };
    this.reportService.getProvisionReport(data, offset, count).subscribe(
      (res: any) => {
        this.provisionalReport = res.provisionalReport;
        this.totalReports = res.paging.total;
        this.loadSpinner = false;
      },
      (error) => {
        this.loadSpinner = false;
      }
    );
  }
  onExportHeader(headers: string[]) {
    this.headers = headers;
  }

  exportData(fileName: string = 'Provision') {
    const data = {
      fromDate: this.appliedFilters?.fromDate || null,
      toDate: this.appliedFilters?.toDate || null,
    };

    if (this.totalReports === 0) {
      this.toastr.error('Can not export with 0 rows!');
    }

    this.reportService.getProvisionReport(data, 0, this.totalReports).subscribe(
      (res: any) => {
        const provisionalReportToExport = res.provisionalReport;
        const mappedAdviceList = provisionalReportToExport.map((row: any) => ({
          accountingType: row?.accountingType,
          accountingDate: row?.accountingDate,
          branch: row?.branch,
          documentNo: row?.documentNo,
          invoiceCurrencyCode: row?.invoiceCurrencyCode,
          invoiceNo: row?.invoiceNo,
          invoiceDate: row?.invoiceDate,
          sourceName: row?.sourceName,
          status: row?.status,
        }));
        this.xlsxService.xlsxExport(mappedAdviceList, this.headers, fileName);
      },
      (error) => {}
    );
  }

  getData(data: any) {
    this.filters = data;
    this.appliedFilters = data;
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
}
