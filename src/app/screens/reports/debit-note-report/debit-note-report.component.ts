import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { XlsxService } from '../../../core/service/xlsx.service';
import { ReportService } from '../../../core/service/report.service';
import { ExportService } from '../../../core/service/export.service';

@Component({
  selector: 'app-debit-note-report',
  templateUrl: './debit-note-report.component.html',
  styleUrl: './debit-note-report.component.scss'
})
export class DebitNoteReportComponent {

  billTiBillReport = [];
  isFilters: boolean = true;
  reportFilter: any = [];

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
  ) { }

  ngOnInit(): void {
    this.getData();
  }

  getData(batchNumber: string = '') {

    this.reportService.getDebitNote({ batchNumber }).subscribe((res: any) => {
      this.billTiBillReport = res.billTiBillReport;
      this.reportFilter = res.filters.BatchNumber;
    }, error => {

    })
  }

  onColumnVisibilityChange(column: any) {
    this.columns = this.columns.map(col => col.field === column.field ? column : col);
  }

  exportData(fileName: string = "Debit Note Report") {
    this.exportService.csvExport(fileName);
  }
}
