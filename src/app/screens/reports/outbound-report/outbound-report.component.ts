import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../../core/service/report.service';
import { ToastrService } from 'ngx-toastr';
import { XlsxService } from '../../../core/service/xlsx.service';

@Component({
  selector: 'app-outbound-report',
  templateUrl: './outbound-report.component.html',
  styleUrl: './outbound-report.component.scss'
})
export class OutboundReportComponent implements OnInit {
  outboundData: any = [];
  count: number = 10;
  loadSpinner: boolean = true;
  isFilters: boolean = true;
  filters: any = [];
  reportData: any = [];
  searchedData: any;
  currentPage: number = 1;
  totalReports: number = 0;
  headers: string[] = [];

  constructor(private reportService: ReportService,
    private xlsxService: XlsxService,
    private toastr: ToastrService
  ){}

  ngOnInit(): void {
    this.getReports();
    
  }

  getReports(offset: number = 0, count: number = this.count, filters: any = this.searchedData) {
    const data = {
      batchId: filters?.batchId || null,
      invoiceNumber: filters?.invoiceNumber ||'',
      transactionCode: filters?.transactionCode || '',
      invoiceFromDate: filters?.invoiceFromDate || null,
      invoiceToDate: filters?.invoiceToDate || null,
      accountingFromDate: filters?.accountingFromDate || null,
      accountingToDate: filters?.accountingToDate || null,
      employeerCode: filters?.employeerCode || '',
      approverEmployeerCode: filters?.approverEmployeerCode || '',
    };

    this.reportService.getOutboundData(data, offset, count).subscribe((res: any) => {
      this.reportData = res;
      this.totalReports = res.paging.total;
      this.filters = res.filters;
      this.loadSpinner = false;
    }, error => {
      this.loadSpinner = false;
    })
  }

  filteredData(data: any) {
    this.searchedData = data;
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

    onExportHeader(headers: any) {
      this.headers = headers;
    }
  
    exportData(
      fileName1: string = 'Outbound Report',
      fileName2: string = 'GL Taxation OutBound',
      fileName3: string = 'GL TDS OutBound'
  ) {
      const data = {
          batchId: this.searchedData?.batchId || null,
          invoiceNumber: this.searchedData?.invoiceNumber || '',
          transactionCode: this.searchedData?.transactionCode || '',
          invoiceFromDate: this.searchedData?.invoiceFromDate || null,
          invoiceToDate: this.searchedData?.invoiceToDate || null,
          accountingFromDate: this.searchedData?.accountingFromDate || null,
          accountingToDate: this.searchedData?.accountingToDate || null,
          employeerCode: this.searchedData?.employeerCode || '',
          approverEmployeerCode: this.searchedData?.approverEmployeerCode || '',
      };
  
      if (this.totalReports === 0) {
          this.toastr.error('Can not export with 0 rows!');
          return;
      }
      
      this.reportService.getOutboundData(data, 0, this.totalReports).subscribe(
          (res: any) => {
              const outBoundReportToExport = res.apGlOutBound.map((report: any) => ({
                  batchId: report?.batchId || null,
                  employeeNumber: report?.employeeNumber || '',
                  approverEmployeeNumber: report?.approverEmployeeNumber || '',
                  companyCode: report?.companyCode || '',
                  category: report?.category || '',
                  accountingDate: report?.accountingDate || null,
                  descText: report?.descText || '-',
                  exchangeDate: report?.exchangeDate || null,
                  exchangeRate: report?.exchangeRate || '',
                  fixedValueAp: report?.fixedValueAp || null,
                  invoiceNo: report?.invoiceNo || '',
                  invoiceNumberWithSupplierCode: report?.invoiceNumberWithSupplierCode || '',
                  invoiceCurrencyCode: report?.invoiceCurrencyCode || '',
                  invoiceDate: report?.invoiceDate || null,
                  sourceName: report?.sourceName || '',
                  systemCode: report?.systemCode || '',
                  transactionCode: report?.transactionCode || '',
              }));
  
              const taxReports = res.apGlOutBound.reduce((acc: any[], report: any) => {
                  const taxationReports = report.glTaxationOutBound.map((taxReport: any) => ({
                      batchId: taxReport?.batchId || null,
                      category: taxReport?.category || '',
                      businessPlace: taxReport?.businessPlace || '',
                      companyCode: taxReport?.companyCode || '',
                      debitCredit: taxReport?.debitCredit || '',
                      descText: taxReport?.descText || '-',
                      evidenceType: taxReport?.evidenceType || '',
                      exclusivePayment: taxReport?.exclusivePayment || '',
                      invoiceLineAmount: taxReport?.invoiceLineAmount || '',
                      invoiceLineId: taxReport?.invoiceLineId || '',
                      invoiceNo: taxReport?.invoiceNo || '',
                      lineItem: taxReport?.lineItem || '',
                      paymentGroup: taxReport?.paymentGroup || '',
                      paymentMethodCode: taxReport?.paymentMethodCode || '',
                      paymentTermsDate: taxReport?.paymentTermsDate || '',
                      paymentTermsName: taxReport?.paymentTermsName || '',
                      profitCenter: taxReport?.profitCenter || '',
                      projectCode: taxReport?.projectCode || '',
                      sectionCode: taxReport?.sectionCode || '',
                      segment1BusinessArea: taxReport?.segment1BusinessArea || '',
                      segment2CostCenter: taxReport?.segment2CostCenter || '',
                      segment3GlAccount: taxReport?.segment3GlAccount || '',
                      sourceName: taxReport?.sourceName || '',
                      systemCode: taxReport?.systemCode || '',
                      taxAmountInTc: taxReport?.taxAmountInTc || '',
                      taxBaseAmountInTc: taxReport?.taxBaseAmountInTc || '',
                      taxJurisdictionCode: taxReport?.taxJurisdictionCode || '',
                      taxRateCode: taxReport?.taxRateCode || '',
                      vendorSiteCode: taxReport?.vendorSiteCode || '',
                  }));
                  return acc.concat(taxationReports);
              }, []);
  
              const tds = res.apGlOutBound.reduce((acc: any[], report: any) => {
                  const tdsReports = report.glTdsOutBound.map((tdsReport: any) => ({
                      batchId: tdsReport?.batchId || null,
                      category: tdsReport?.category || '',
                      companyCode: tdsReport?.companyCode || '',
                      invoiceNo: tdsReport?.invoiceNo || '',
                      sourceName: tdsReport?.sourceName || '',
                      systemCode: tdsReport?.systemCode || '',
                      taxAmountInTc: tdsReport?.taxAmountInTc || '',
                      taxBaseInLc: tdsReport?.taxBaseInLc || '',
                      taxType: tdsReport?.taxType || '',
                      tdsTaxCode: tdsReport?.tdsTaxCode || '',
                      withholdingTaxAmountDocumentCurrency: tdsReport?.withholdingTaxAmountDocumentCurrency || '',
                      withholdingTaxAmountSecondLocalCurrency: tdsReport?.withholdingTaxAmountSecondLocalCurrency || '',
                      withholdingTaxAmountThirdLocalCurrency: tdsReport?.withholdingTaxAmountThirdLocalCurrency || '',
                      wtaxBaseAmountForeignCurrency: tdsReport?.wtaxBaseAmountForeignCurrency || '',
                      wtaxBaseAmountSecondLocalCurrency: tdsReport?.wtaxBaseAmountSecondLocalCurrency || '',
                      wtaxBaseAmountThirdLocalCurrency: tdsReport?.wtaxBaseAmountThirdLocalCurrency || '',
                  }));
                  return acc.concat(tdsReports);
              }, []);
              const headersTax = [
                'Batch Id', 'Category', 'Business Place', 'Company Code', 'Debit Credit', 'Desc Text', 
                'Evidence Type', 'Exclusive Payment', 'Invoice Line Amount', 'Invoice Line Id', 
                'Invoice No.', 'Line Item', 'Payment Group', 'Payment Method Code', 'Payment Terms Date', 
                'Payment Terms Name', 'Profit Center', 'Project Code', 'Section Code', 'Segment1 Business Area', 
                'Segment 2 Cost Center', 'Segment3 Gl Account', 'Source Name', 'System Code', 
                'Tax Amount InTc', 'Tax Base Amount InTc', 'Tax Jurisdiction Code', 'Tax Rate Code', 
                'Vendor Site Code'
            ];

            const headersTds = [
                'Batch Id', 'Category', 'Company Code', 'Invoice No.', 'Source Name', 'System Code', 
                'Tax Amount InTc', 'Tax Base InLc', 'Tax Type', 'TDS Tax Code', 
                'Withholding Tax Amount Document Currency', 'Withholding Tax Amount Second Local Currency', 
                'Withholding Tax Amount Third Local Currency', 'Wtax Base Amount Foreign Currency', 
                'Wtax Base Amount Second Local Currency', 'Wtax Base Amount Third Local Currency'
            ];
              this.xlsxService.xlsxMultipleExport({
                  [fileName1]: { rows: outBoundReportToExport, headers: this.headers },
                  [fileName2]: { rows: taxReports, headers: headersTax },
                  [fileName3]: { rows: tds, headers: headersTds }
              }, 'Provisional Report');
          },
          (error) => {
              console.error('Error fetching outbound data:', error);
          }
      );
  }
}
