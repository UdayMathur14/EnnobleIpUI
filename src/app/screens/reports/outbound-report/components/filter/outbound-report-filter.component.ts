import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-outbound-report-filter',
  templateUrl: './outbound-report-filter.component.html',
  styleUrl: './outbound-report-filter.component.scss',
})
export class OutboundReportFilterComponent implements OnInit {
  @Input() filters: any = [];
  batchId: number | null = null;
  invoiceNumber: any = undefined;
  transactionCode: any = undefined;
  employeerCode: any = undefined;
  approverEmployeerCode: any = undefined;
  invoiceFromDate: any = undefined;
  invoiceToDate: any = undefined;
  accountingFromDate: any = undefined;
  accountingToDate: any = undefined;
  @ViewChild('table') table!: ElementRef;
  @Output() filterSearchObj: EventEmitter<any> = new EventEmitter();
  @Output() exportData: EventEmitter<any> = new EventEmitter();

  ngOnInit(): void {}

  handleSearch() {
    const filterObj = {
      batchId: this.batchId,
      invoiceNumber: this.invoiceNumber,
      transactionCode: this.transactionCode,
      invoiceFromDate: this.invoiceFromDate,
      invoiceToDate: this.invoiceToDate,
      accountingFromDate: this.accountingFromDate,
      accountingToDate: this.accountingToDate,
      employeerCode: this.employeerCode,
      approverEmployeerCode: this.approverEmployeerCode,
    };
    this.filterSearchObj.emit(filterObj)
  }

  onClearFilter() {
      this.batchId = null,
      this.invoiceNumber = '',
      this.transactionCode = '',
      this.invoiceFromDate = null,
      this.invoiceToDate = null,
      this.accountingFromDate = null,
      this.accountingToDate = null,
      this.employeerCode = '',
      this.approverEmployeerCode = ''
      const filterObj = { 
        batchId: null, 
        invoiceNumber: '' , 
        transactionCode: '', 
        invoiceFromDate: null,
        invoiceToDate: null, 
        accountingFromDate: null, 
        accountingToDate: null, 
        employeerCode: '', 
        approverEmployeerCode: '' 
       };
       this.filterSearchObj.emit(filterObj)
  }
}
