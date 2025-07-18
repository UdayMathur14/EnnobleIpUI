import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ExportService } from '../../../core/service/export.service';
import { DispatchNoteService } from '../../../core/service/dispatch-note.service';
import { APIConstant } from '../../../core/constants';
import { XlsxService } from '../../../core/service/xlsx.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dispatch-note',
  templateUrl: './dispatch-note.component.html',
  styleUrl: './dispatch-note.component.scss',
  providers: [DatePipe],
})
export class DispatchNoteComponent {
  fullScreen: boolean = false;
  isFilters: boolean = true;
  dispatchNumber: string = '';
  dispatchNotes = [];
  locations: any = [];
  loadSpinner: boolean = true;
  currentPage: number = 1;
  count: number = 10;
  totaldispatchNotes: number = 0;
  filters: any = [];
  appliedFilters: any = [];
  maxCount: number = Number.MAX_VALUE;
  headers: any[] = [];

  constructor(
    private router: Router,
    private dispatchNoteService: DispatchNoteService,
    private xlsxService: XlsxService,
    private toastr: ToastrService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.getDispatchData();
  }

  getDispatchData(
    offset: number = 0,
    count: number = this.count,
    filters: any = this.appliedFilters
  ) {
    const data = {
      ApplicationNumber: filters?.ApplicationNumber || '',
      ClientInvoiceNumber: filters?.ClientInvoiceNumber,
      Status: filters?.status || '',
    };
    this.loadSpinner = true;
    this.dispatchNoteService.getDispatchNote(data, offset, count).subscribe(
      (res: any) => {
        this.dispatchNotes = res.vendorInvoiceTxns;
        console.log(this.dispatchNotes);
        this.totaldispatchNotes = res.paging.total;
        this.filters = res.filters;
        this.loadSpinner = false;
      },
      (error) => {
        this.loadSpinner = false;
      }
    );
  }

  getData(e: any) {
    this.appliedFilters = e;
    this.currentPage = 1;
    this.getDispatchData(0, this.count, this.appliedFilters);
  }

  onCreateDispatchNote() {
    this.router.navigate(['transaction/addEditVendorInvoice/0']);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    const offset = (this.currentPage - 1) * this.count;
    this.getDispatchData(offset, this.count, this.appliedFilters);
  }

  onPageSizeChange(data: any) {
    this.count = data;
    this.currentPage = 1;
    this.getDispatchData(0, this.count, this.appliedFilters);
  }

  onExportHeader(headers: any) {
    this.headers = headers;
  }

  exportData(fileName: string = 'Vendor Invoice Details') {
    const data = {
      ApplicationNumber: this.appliedFilters?.applicationNumber || '',
      ClientInvoiceNumber: this.appliedFilters?.clientInvoiceNumber || '',
      Status: this.appliedFilters?.Status || '',
    };
    this.dispatchNoteService
      .getDispatchNote(data, 0, this.totaldispatchNotes)
      .subscribe(
        (response: any) => {
          const dispatchListToExport = response.vendorInvoiceTxns;
          const mappedDispatchNotesList = dispatchListToExport.map(
            (item: any) => ({
              'Invoice Date': item?.invoiceDate,
              'Client Invoice No': item?.clientInvoiceNo,
              'Due Date (Before)': this.datePipe.transform(
                item?.dueDateAsPerContract,
                'yyyy-MM-dd'
              ),
              'Customer Name': item?.customerDetails?.customerName,
              Description: item?.description,
              Title: item?.title,
              'Prof Fee': item?.professionalFeeAmt,
              'Govt Fee': item?.govtOrOfficialFeeAmt,
              Discount: item?.discountAmt,
              'Total Amt': item?.totalAmount,
              'Discount (Credit Note)': item?.discountCreditNoteAmt,
              'Payment Date': item?.paymentDate,
              'From Bank': item?.vendorDetails?.bankName,
              'Total Outstanding Amount': item?.paymentAmount,
              'Application No': item?.applicationNumber,
              'EPO Filing Received or Not':
                item?.officialFilingReceiptSupporting === '1' ? 'Yes' : 'No',
              'Filing Date': item?.filingDate,
              'Client Ref No.': item?.clientRefNo,
              'Our Ref No.': item?.ourRefNo,
              'Customer PO No': item?.customerPONo,
              'PO Date': item?.pODate,
              'PO Value Inclusive of Taxes': item?.pOValueInclusiveTaxes,
              'Our Invoice No.': item?.clientInvoiceNo,
              'Invoice Amt In INR': item?.totalAmount,
              'Govt Fee Invoice No.': '-', // You can replace this with actual field if available
              'Govt Fee (In Amt)': item?.govtOrOfficialFeeAmt,
              'Estimate No. (Prof Fee)': '-', // Replace if estimate no exists
              'Estimate No. (Govt Fee)': '-', // Replace if estimate no exists
              'Remarks For CA/Tally Posting': '-', // Add if you store it somewhere
              Status: item?.status,
            })
          );

          this.xlsxService.xlsxExport(mappedDispatchNotesList, Object.keys(mappedDispatchNotesList[0]), fileName);

          this.loadSpinner = false;
        },
        (error) => {
          this.toastr.error(
            error.error.details
              .map((detail: any) => detail.description)
              .join('<br>')
          );
          this.loadSpinner = false;
        }
      );
  }
}
