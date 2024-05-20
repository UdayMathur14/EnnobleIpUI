import { Component, OnInit, SimpleChanges, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionTypesService } from '../../../../../core/service/transactionTypes.service';
import { ToastrService } from 'ngx-toastr';
import { TransactionTypeListModel } from '../../../../../core/model/masterModels.model';
import { CommonUtility } from '../../../../../core/utilities/common';

@Component({
  selector: 'app-transaction-grid-table',
  templateUrl: './transaction-grid-table.component.html',
  styleUrl: './transaction-grid-table.component.scss'
})
export class TransactionGridTableComponent implements OnInit{
  constructor(private router : Router,
    private transactionTypesService : TransactionTypesService,
    private toastr : ToastrService
    ){}
    sortField: string = '';
    sortDirection: 'asc' | 'desc' = 'asc';
    transactionTypesList : TransactionTypeListModel[] = [];
    transactionTypesListOrg : TransactionTypeListModel[] = [];
    loadSpinner : boolean = true;
    @Input() filterKeyword!: string;

  ngOnInit(): void {
    this.getAllTransactionTypes()
  }


  ngOnChanges(changes: SimpleChanges): void {
    if(this.transactionTypesListOrg && this.transactionTypesListOrg.length && changes['filterKeyword'].currentValue){
      this.transactionTypesList = this.transactionTypesListOrg.filter((e:any) =>e.code.toLowerCase().indexOf(changes['filterKeyword'].currentValue.toLowerCase()) !== -1)
    }
    else if(this.transactionTypesListOrg && this.transactionTypesListOrg.length && !changes['filterKeyword'].currentValue){
      this.transactionTypesList = this.transactionTypesListOrg;
    }
  }

  getAllTransactionTypes(){
    let data = {
      "code" : ''
    }
    this.transactionTypesService.getTransactionTypes(data).subscribe((response:any) => {
      this.transactionTypesList = response.transactionTypes;
      this.transactionTypesListOrg = response.transactionTypes;
      this.loadSpinner = false;
    }, error => {
      this.toastr.error(error.error.details.map((detail: any) => detail.description).join(', '));
      this.loadSpinner = false;
    })
  }

  onGoToEditTransaction(transactionData:TransactionTypeListModel){
    this.router.navigate(['master/addEditTransactionTypes',  transactionData.id]);
  }

  sortData(field: string) {
    this.sortDirection = (this.sortField === field && this.sortDirection === 'asc') ? 'desc' : 'asc';
    this.sortField = field;
    CommonUtility.sortTableData(field, this.sortDirection, this.transactionTypesList);
  }
}