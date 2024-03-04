import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-point-master-accounts',
  templateUrl: './point-master-accounts.component.html',
  styleUrl: './point-master-accounts.component.scss'
})
export class PointMasterAccountsComponent {
  constructor(private router : Router){}

  isFilters : boolean = true;

}
