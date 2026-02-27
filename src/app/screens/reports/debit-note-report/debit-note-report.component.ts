import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { XlsxService } from '../../../core/service/xlsx.service';
import { ReportService } from '../../../core/service/report.service';
import { ExportService } from '../../../core/service/export.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApprovalPdfComponent } from '../../modals/approval-pdf/approval-pdf.component';

@Component({
  selector: 'app-debit-note-report',
  templateUrl: './debit-note-report.component.html',
  styleUrl: './debit-note-report.component.scss'
})
export class DebitNoteReportComponent {

  billTiBillReport = [];
  isFilters: boolean = true;
  reportFilter: any = [];
  currentPage: number = 1;
  count: number = 10;
  totalReports: number = 0;
  filters: any = [];
  maxCount: number = Number.MAX_VALUE;
  searchedData:any = [];
  appliedFilters: any = {};
  headers: string[] = [];
  loadSpinner: boolean = true;

  columns = [
    { header: 'Vendor Name', field: 'vendorName', visible: true },
    { header: 'Invoice Date', field: 'invoiceDate', visible: true },
    { header: 'F.Y', field: 'fy', visible: true },
    { header: 'Client Invoice No', field: 'clientInvoiceNo', visible: true },
    { header: 'Due Date As Per Invoice', field: 'dueDateAsPerInvoice', visible: true },
    { header: 'Title', field: 'title', visible: true },
    { header: 'Application Number', field: 'applicationNumber', visible: false },
    { header: 'Filing Date', field: 'filingDate', visible: false },
    { header: 'Client Ref No', field: 'clientRefNo', visible: false },
    { header: 'Our Ref No', field: 'ourRefNo', visible: false },
    { header: 'Official Filing Receipt Supporting', field: 'officialFilingReceiptSupporting', visible: false },
  ];

  constructor(
    private reportService: ReportService,
    private exportService: ExportService,
    private xlsxService: XlsxService,
    private toastr: ToastrService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.getReports();
  }

  getReports(offset: number = 0, count: number = this.count, filters: any = this.searchedData) {
    const data = {
      applicationNumber: filters?.applicationNumber || null,
      clientInvoiceNo: filters?.clientInvoiceNo || null,
      status: filters?.status || null
    }
    this.reportService.getDebitNote(data, offset, count).subscribe((res: any) => {
      this.billTiBillReport = res.vendorInvoiceReport.map((report: any) => {
        return {
          vendorName: report?.vendorDetails?.vendorName,
          fy: report?.fy,
          invoiceDate: report?.invoiceDate,
          clientInvoiceNo: report?.clientInvoiceNo,
          dueDateAsPerInvoice: report?.dueDateAsPerInvoice,
          title: report?.title,
          applicationNumber: report?.applicationNumber,
          filingDate: report?.filingDate,
          clientRefNo: report?.clientRefNo,
          ourRefNo: report?.ourRefNo,
          officialFilingReceiptSupporting: report?.officialFilingReceiptSupporting,
        }
      });
      this.reportFilter = res.filters;
      this.totalReports = res.paging.total;
      this.loadSpinner = false;
    }, error => {
      this.loadSpinner = false;
    })
  }

  getData(data: any){
    this.searchedData = data;
    this.appliedFilters = data;
    this.currentPage = 1;
    this.getReports(0, this.count, this.searchedData);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    const offset = (this.currentPage - 1) * this.count;
    this.getReports(offset, this.count, this.searchedData);
  }

  onPageSizeChange(data: any) {
      this.count = data;
      this.currentPage = 1;
      this.getReports(0, this.count, this.searchedData);
    }

  onColumnVisibilityChange(column: any) {
    this.columns = this.columns.map(col => col.field === column.field ? column : col);
  }

  onExportHeader(headers: string[]) {
    this.headers = headers;
  }

  exportExcel(fileName: string = 'Debit Report') {
    const data = {
      batchNumber: this.appliedFilters?.batchNumber || null,
    };

    if (this.totalReports === 0) {
      this.toastr.error('Can not export with 0 rows!');
    }

    this.reportService.getDebitNote(data, 0, this.totalReports).subscribe(
      (res: any) => {
        const debitReportToExport = res.vendorInvoiceReport;
        const mappedAdviceList = debitReportToExport.map((row: any) => ({
          vendorName: row?.vendorDetails?.vendorName,
          fy: row?.fy,
          invoiceDate: row?.invoiceDate,
          clientInvoiceNo: row?.clientInvoiceNo,
          dueDateAsPerInvoice: row?.dueDateAsPerInvoice,
          title: row?.title,
          applicationNumber: row?.applicationNumber,
          filingDate: row?.filingDate,
          clientRefNo: row?.clientRefNo,
          totalAmount: row?.totalAmount,
          vendorDetails: row?.vendorDetails?.vendorName,
          saleCurrency: row?.saleCurrency,
        }));
        this.xlsxService.xlsxExport(mappedAdviceList, this.headers, fileName);
      },
      (error) => {}
    );
  }

  exportPdf(){
    let documentModal = this.modalService.open(ApprovalPdfComponent, {
      size: 'xl',
      backdrop: 'static',
      windowClass: 'modal-width',
    });
    documentModal.componentInstance.title = 'report';
    documentModal.componentInstance.biltiData = this.searchedData;

    documentModal.result.then(
      (result) => {
        if (result) {
        }
      },
      (reason) => {}
    );
  }
}
