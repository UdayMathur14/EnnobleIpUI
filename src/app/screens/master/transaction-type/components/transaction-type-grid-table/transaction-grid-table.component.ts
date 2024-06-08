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
  @Input() transactionTypesList : any[] = [];
  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  loadSpinner : boolean = true;
  constructor(private router : Router,
    private transactionTypesService : TransactionTypesService,
    private toastr : ToastrService
    ){}

  ngOnInit(): void {

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