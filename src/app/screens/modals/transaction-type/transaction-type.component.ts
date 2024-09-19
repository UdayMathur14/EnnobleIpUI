import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-transaction-type-modal',
  templateUrl: './transaction-type.component.html',
  styleUrl: './transaction-type.component.scss'
})
export class TransactionTypeModalComponent implements OnInit {
  @Input() transactionTypes : any ;
  activeTransactionTypes:any = []
  
  constructor(public activeModal: NgbActiveModal){}

  ngOnInit(): void {
    
    this.filterActiveTransactions()
  }

  filterActiveTransactions(): void {
    this.activeTransactionTypes = this.transactionTypes.filter((transaction: any) =>
      transaction?.status === 'Active'
    );
  }

}
