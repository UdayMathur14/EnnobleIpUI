import { Component } from '@angular/core';
import { Router } from '@angular/router';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { APIConstant } from '../../../core/constants';
import { XlsxService } from '../../../core/service/xlsx.service';
import { GlAccrualPostingService } from '../../../core/service/gl-accrual-posting.service';

@Component({
  selector: 'app-provisional-report',
  templateUrl: './provisional-report.component.html',
  styleUrl: './provisional-report.component.scss',
})
export class ProvisionalReportComponent {
  isFilters: boolean = true;
  searchedData: any;
  fromDate: any = '1990-01-01';
  batchNumber: any;
  adviceType: any;
  loadSpinner: boolean = false;
  locationIds: any[] = APIConstant.commonLocationsList.map((e: any) => e.id);
  toDate: any = moment().format('YYYY-MM-DD');
  currentPage: number = 1;
  count: number = 10;
  filters: any = [];
  maxCount: number = Number.MAX_VALUE;
  headers: string[] = [];
  locations: any = [];
  glAccrualList = [];
  totalglAccrualLists: number = 0;

  constructor(
    private router: Router,
    private glAccrualPostingService: GlAccrualPostingService,
    private toastr: ToastrService,
    private xlsxService: XlsxService,
  ) {}

  ngOnInit(): void {
    this.getProvisionReport();
  }

  getProvisionReport(
    offset: number = 0,
    count: number = this.count,
    filters: any = this.searchedData,
  ) {
    this.loadSpinner = true;
    const obj = {
      vendorName: filters?.vendor || '',
      status: filters?.status || '',
      applicationNumber: filters?.applicationNumber || '',
      ClientInvoiceNumber: filters?.clientInvoiceNo || '',
    };
    this.glAccrualPostingService
      .getGlAccrualPosting(obj, offset, count)
      .subscribe(
        (response: any) => {
          this.loadSpinner = false;
          this.glAccrualList = response.vendorPurchaseReports;
          this.totalglAccrualLists = response.paging.total;
          this.filters = response.filters;
          this.loadSpinner = false;
        },
        (error) => {
          //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
          this.loadSpinner = false;
        },
      );
  }

  filteredData(data: any) {
    this.searchedData = data;
    this.batchNumber = data.batchNumber;
    this.currentPage = 1;
    this.getProvisionReport(0, this.count, this.searchedData);
  }

  onCreateBilti() {
    this.router.navigate(['transaction/biltiBillProcess']);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    const offset = (this.currentPage - 1) * this.count;
    this.getProvisionReport(offset, this.count, this.searchedData);
  }

  onPageSizeChange(data: any) {
    this.count = data;
    this.currentPage = 1;
    this.getProvisionReport(0, this.count, this.searchedData);
  }

  onExportHeader(headers: any) {
    console.log(headers);

    this.headers = headers;
  }

  exportData(fileName: string = 'Outstanding Vendor Payment Report') {
    const obj = {
      vendorName: this.searchedData?.vendor || '',
      status: this.searchedData?.status || '',
      applicationNumber: this.searchedData?.applicationNumber || '',
      ClientInvoiceNumber: this.searchedData?.clientInvoiceNo || '',
    };

    if (this.totalglAccrualLists === 0) {
      this.toastr.error('Can not export with 0 rows!');
    }

    this.glAccrualPostingService
      .getGlAccrualPosting(obj, 0, this.totalglAccrualLists)
      .subscribe(
        (res: any) => {
          const processedReportToExport = res.vendorPurchaseReports;
          const mappedList = processedReportToExport.map((row: any) => ({
            vendorName: row?.vendorName || '-',
            applicatioNumber: row?.applicationNumber || '-',
            clientInvoiceNumber: row?.clientInvNo || '-',
            invoiceDate: row?.invoiceDate.split('T')[0].split('-').reverse().join('-'),
            DueDate: row?.dueDate.split('T')[0].split('-').reverse().join('-') ,
            ClientrefNumber: row?.clientRefNumber || '-',
            Currency : row?.currencySymbol || '-',
            TotalAmount: row?.totalAmount,
            status: row?.status || '-',
          }));
          this.xlsxService.xlsxExport(mappedList, ["Vendor Name", "Application Number", "Client Invoice Number", "Invoice Date", "Due Date", "Client Reference Number", "Currency", "Total Amount", "Status"], fileName);
        },
        (error) => {},
      );
  }
}
