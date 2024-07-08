import { Component, OnInit } from '@angular/core';
import { TransactionTypesService } from '../../../core/service/transactionTypes.service';
import { XlsxService } from '../../../core/service/xlsx.service';

@Component({
  selector: 'app-transaction-type',
  templateUrl: './transaction-type.component.html',
  styleUrls: ['./transaction-type.component.scss']
})
export class TransactionTypeComponent implements OnInit {

  isFilters: boolean = true;
  filterKeyword: string = '';
  fullScreen : boolean = false;
  transactionTypesList : any[] = [];
  loadSpinner : boolean = true;
  headers: any [] = [];
  currentPage: number = 1;
  count: number = 10;
  totalTransactions: number = 0;
  filters: any = [];
  appliedFilters: any = [];
  maxCount: number = Number.MAX_VALUE;
  constructor(
    private transactionTypesService : TransactionTypesService,
    private xlsxService : XlsxService
  ) { }

  ngOnInit() {
    this.getAllTransactionTypes()
  }

  getAllTransactionTypes(offset: number = 0, count: number = this.count, filters: any = this.appliedFilters){
    let data = {
      "transactionTypeCode": filters?.transactionTypeCode || "",
      "transactionTypeName": filters?.transactionTypeName || "",
      "glSubCategory": filters?.glSubCategory || "",
      "status": filters?.status || ""
    }
    this.transactionTypesService.getTransactionTypes(data, offset, count).subscribe((response:any) => {
      this.transactionTypesList = response.transactionTypes;
      this.totalTransactions = response.paging.total;
      this.filters = response.filters
      this.loadSpinner = false;
    }, error => {
      // this.toastr.error(error.error.details.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  getData(e:any){
    this.appliedFilters = e;
    this.currentPage = 1;
    this.getAllTransactionTypes(0, this.count, this.appliedFilters);
  }

  onExportHeader(headers: string[]) {
    this.headers = headers;
  }

  exportData(fileName: string = "Transaction Type") {
    const mappedTransactionsList = this.transactionTypesList.map(transaction => ({
      code: transaction.code,
      name: transaction.name,
      glSubCategory: transaction.glSubCategory.value,
      transactionTypeInterfaceCode: transaction?.transactionTypeInterface?.transactionTypeCode,
      transactionTypeInterface: transaction?.transactionTypeInterface?.transactionTypeName,
      status: transaction.status,
    }));
    this.xlsxService.xlsxExport(mappedTransactionsList, this.headers, fileName);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    const offset = (this.currentPage - 1) * this.count;
    this.getAllTransactionTypes(offset, this.count, this.appliedFilters);
  }

  onPageSizeChange(data: any) {
      this.count = data;
      this.currentPage = 1;
      this.getAllTransactionTypes(0, this.count, this.appliedFilters);
    }
}
