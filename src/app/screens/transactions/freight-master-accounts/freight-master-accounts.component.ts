import { Component } from '@angular/core';

@Component({
  selector: 'app-freight-master-accounts',
  templateUrl: './freight-master-accounts.component.html',
  styleUrl: './freight-master-accounts.component.scss'
})
export class FreightMasterAccountsComponent {

  searchedFreight: any;
  isFilters: boolean = true;
  //HOLDING SEARCHED VALUE FROM FILTERS
  searchFreightCode(event: any) {
    this.searchedFreight = event;
  }

}
