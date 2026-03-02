import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { XlsxService } from '../../../core/service/xlsx.service';
import { ReportService } from '../../../core/service/report.service';
import { ExportService } from '../../../core/service/export.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-error-logging-report',
  templateUrl: './error-logging-report.component.html',
  styleUrl: './error-logging-report.component.scss',
})
export class ErrorLoggingReportComponent {
  errorLoggings = [];
  isFilters: boolean = true;
  currentPage: number = 1;
  count: number = 10;
  totalReports: number = 0;
  filters: any = [];
  maxCount: number = Number.MAX_VALUE;
  appliedFilters: any = {};
  headers: string[] = [];
  loadSpinner: boolean = true;

  constructor(
    private router: Router,
    private reportService: ReportService,
    private exportService: ExportService,
    private xlsxService: XlsxService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.getReports();
  }

  getReports(
    offset: number = 0,
    count: number = this.count,
    filters: any = this.filters,
  ) {
    this.loadSpinner = true;

    const data = {
      vendorName: filters?.vendorName || '',
      vendorCode: filters?.vendorCode || '',
      vendorType: filters?.vendorType || '',
      status: filters?.status || '',
      country: filters?.country || '',
    };

    this.reportService.getErrorLogging(data, offset, count).subscribe(
      (res: any) => {
        this.errorLoggings = res.vendors;
        this.totalReports = res.paging.total;
        this.filters = res.filters;
        this.loadSpinner = false;
      },
      (error) => {
        console.error(error);
        this.loadSpinner = false;
      },
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

  onExportHeader(headers: string[]) {
    this.headers = headers;
  }

  exportData(fileName: string = 'Vendor By Country Report') {
    const data = {
      vendorName: this.appliedFilters?.vendorName || '',
      vendorCode: this.appliedFilters?.vendorCode || '',
      status: this.appliedFilters?.status || '',
      country: this.appliedFilters?.country || '',
    };

    // if (this.totalReports === 0) {
    //   this.toastr.error('Can not export with 0 rows!');
    // }

    this.reportService.getErrorLogging(data, 0, this.totalReports).subscribe(
      (res: any) => {
        const vendor = res.vendors;
        const mappedAdviceList = vendor.map((row: any) => ({
          vendorType: row.vendorType || '',
          vendorName: row.vendorName || '',
          billingCountry: row.billingCountry || '',
          contactPersonName: row.contactPersonName || '',
          mobileNo: row.phoneMobileNo || '',
          status: row.status || '',
        }));

        this.xlsxService.xlsxExport(mappedAdviceList, this.headers, fileName);
      },
      (error) => {},
    );
  }
}
