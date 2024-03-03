import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-freight-master-accounts',
  templateUrl: './freight-master-accounts.component.html',
  styleUrl: './freight-master-accounts.component.scss'
})
export class FreightMasterAccountsComponent {
  constructor(private router : Router){}

  isFilters : boolean = true;

}
