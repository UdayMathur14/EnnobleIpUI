import { Component } from '@angular/core';

@Component({
  selector: 'app-point-master-accounts',
  templateUrl: './point-master-accounts.component.html',
  styleUrl: './point-master-accounts.component.scss'
})
export class PointMasterAccountsComponent {
  constructor(){}

  isFilters : boolean = true;
  searchedPoint: any;
  searchPointName(event: any) {
    this.searchedPoint = event;
  }
}
