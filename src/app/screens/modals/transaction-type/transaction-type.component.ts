import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-transaction-type-modal',
  templateUrl: './transaction-type.component.html',
  styleUrl: './transaction-type.component.scss'
})
export class TransactionTypeModalComponent implements OnInit {
  constructor(public activeModal: NgbActiveModal){}

  @Input() transactionTypes : any ;

  ngOnInit(): void {
  }

}
