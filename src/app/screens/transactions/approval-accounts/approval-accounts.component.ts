import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-approval-accounts',
  templateUrl: './approval-accounts.component.html',
  styleUrl: './approval-accounts.component.scss'
})
export class ApprovalAccountsComponent {
  constructor(private router : Router){}

  isFilters : boolean = true;

}
