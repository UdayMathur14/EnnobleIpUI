import { Component, OnInit, SimpleChanges, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionTypesService } from '../../../../../core/service/transactionTypes.service';
import { ToastrService } from 'ngx-toastr';
import { TransactionTypeListModel } from '../../../../../core/model/transactionType.model';

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
      this.toastr.error(error.statusText, error.status);
      this.loadSpinner = false;
    })
  }

  onGoToEditTransaction(transactionData:TransactionTypeListModel){
    this.router.navigate(['master/addEditTransactionTypes',  transactionData.id]);
  }
}