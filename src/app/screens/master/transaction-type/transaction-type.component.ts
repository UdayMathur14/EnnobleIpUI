import { Component, OnInit } from '@angular/core';
import { XlsxService } from '../../../core/service/xlsx.service';

@Component({
  selector: 'app-transaction-type',
  templateUrl: './transaction-type.component.html',
  styleUrls: ['./transaction-type.component.scss']
})
export class TransactionTypeComponent implements OnInit {

  isFilters: boolean = false;
  filterKeyword: string = '';
  fullScreen: boolean = false;
  transactionTypesList: any[] = [];
  headers: string[] = [];
  constructor(private xlsxService: XlsxService) { }

  ngOnInit() { }

  onSearch(e: any) {
    this.filterKeyword = e.target.value;
  }

  onTransactionListChange(transactionTypesList: any[]) {
    this.transactionTypesList = transactionTypesList;
  }

  onHeadersChange(headers: string[]) {
    this.headers = headers;
  }

  exportData(fileName: string = "Transaction Type") {
    // Map the data to include only the necessary fields
    const mappedTransactionsList = this.transactionTypesList.map(transaction => ({
      code: transaction.code,
      name: transaction.name,
      glSubCategory: transaction.glSubCategory.value,
      transactionTypeInterface: transaction?.transactionTypeInterface?.transactionTypeName,
      status: transaction.status,
    }));
    this.xlsxService.xlsxExport(mappedTransactionsList, this.headers, fileName);
  }
}
