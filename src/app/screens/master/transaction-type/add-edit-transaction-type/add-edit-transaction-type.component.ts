import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-edit-transaction-type',
  templateUrl: './add-edit-transaction-type.component.html',
  styleUrl: './add-edit-transaction-type.component.scss'
})
export class AddEditTransactionTypeComponent {
  constructor(private router: Router) {}

  onCancelPress(){
    this.router.navigate(['/master/transactionTypes'])
  }
}
