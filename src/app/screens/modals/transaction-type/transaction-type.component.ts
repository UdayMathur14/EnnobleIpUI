import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-transaction-type',
  templateUrl: './transaction-type.component.html',
  styleUrl: './transaction-type.component.scss'
})
export class TransactionTypeComponent {
  constructor(public activeModal: NgbActiveModal){}

}
