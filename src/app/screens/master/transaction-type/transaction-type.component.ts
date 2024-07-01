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
  transactionTypesListOrg : any = [];
  loadSpinner : boolean = true;
  headers: any [] = [];
  constructor(
    private transactionTypesService : TransactionTypesService,
    private xlsxService : XlsxService
  ) { }

  ngOnInit() {
    this.getAllTransactionTypes()
  }

  getAllTransactionTypes(){
    let data = {
      "transactionTypeCode": "",
      "transactionTypeName": "",
      "glSubCategory": ""
    }
    this.transactionTypesService.getTransactionTypes(data).subscribe((response:any) => {
      this.transactionTypesList = response.transactionTypes;
      this.transactionTypesListOrg = response.transactionTypes;
      this.loadSpinner = false;
    }, error => {
      // this.toastr.error(error.error.details.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  getData(e:any){
    this.loadSpinner = true;
    let data = {
      "transactionTypeCode": e.transactionTypeCode || "",
      "transactionTypeName": e.transactionTypeName || "",
      "glSubCategory": e.glSubCategory || ""
    }
    this.transactionTypesService.getTransactionTypes(data).subscribe((response: any) => {
      this.transactionTypesList = response.transactionTypes;
      this.loadSpinner = false;
    }, error => {
      this.loadSpinner = false
    })
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
}
