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
    { header: 'Supplier Code', field: 'supplierCode', visible: true },
    { header: 'Supplier Name', field: 'supplierName', visible: true },
    { header: 'Total Basic Freight Charges', field: 'totalBasicFreightCharges', visible: true },
    { header: 'Total Cgst Amount', field: 'totalCgstAmount', visible: true },
    { header: 'Total Debit Note Amount', field: 'totalDebitNoteAmount', visible: true },
    { header: 'Total Detention Charges', field: 'totalDetentionCharges', visible: true },
    { header: 'Total Grand Total Amount', field: 'totalGrandTotalAmount', visible: false },
    { header: 'Total Igst Amount', field: 'totalIgstAmount', visible: false },
    { header: 'Total Net Amount', field: 'totalNetAmount', visible: false },
    { header: 'Total OverLoad Charges', field: 'totalOverLoadCharges', visible: false },
    { header: 'Total Point Charges', field: 'totalPointCharges', visible: false },
    { header: 'Total Sgst Amount', field: 'totalSgstAmount', visible: false },
    { header: 'Payment Advice No', field: 'paymentAdviceNo', visible: false },
    { header: 'Payment TTL', field: 'paymentTTL', visible: false },
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
      batchNumber: filters?.batchNumber || "",
      screenCode: 309
    }
    this.reportService.getDebitNote(data, offset, count).subscribe((res: any) => {
      this.billTiBillReport = res.billTiBillReport;
      this.reportFilter = res.filters.BatchNumber;
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
        const debitReportToExport = res.billTiBillReport;
        const mappedAdviceList = debitReportToExport.map((row: any) => ({
          supplierCode: row?.supplierCode,
          supplierName: row?.supplierName,
          totalBasicFreightCharges: row?.totalBasicFreightCharges,
          totalCgstAmount: row?.totalCgstAmount,
          totalDebitNoteAmount: row?.totalDebitNoteAmount,
          totalDetentionCharges: row?.totalDetentionCharges,
          totalGrandTotalAmount: row?.totalGrandTotalAmount,
          totalIgstAmount: row?.totalIgstAmount,
          totalNetAmount: row?.totalNetAmount,
          totalOverLoadCharges: row?.totalOverLoadCharges,
          totalPointCharges: row?.totalPointCharges,
          totalSgstAmount: row?.totalSgstAmount,
          paymentAdviceNo: row?.paymentAdviceNo,
          paymentTTL: row?.paymentTTL,
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
