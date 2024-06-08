import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExportService } from '../../../core/service/export.service';
import { TransactionTypesService } from '../../../core/service/transactionTypes.service';

@Component({
  selector: 'app-transaction-type',
  templateUrl: './transaction-type.component.html',
  styleUrls: ['./transaction-type.component.scss']
})
export class TransactionTypeComponent implements OnInit {

  isFilters: boolean = true;
  filterKeyword: string = '';
  fullScreen : boolean = false;
  transactionTypesList : any = [];
  transactionTypesListOrg : any = [];
  loadSpinner : boolean = false;
  constructor(private router: Router,
    private exportService: ExportService,
    private transactionTypesService : TransactionTypesService
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

  exportData(fileName: string = "Transaction Type") {
    this.exportService.csvExport(fileName);
  }
}
