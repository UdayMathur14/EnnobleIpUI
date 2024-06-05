import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bilti',
  templateUrl: './bilti.component.html',
  styleUrl: './bilti.component.scss'
})
export class BiltiComponent {
  isFilters: boolean = true;
  searchedBilti: string = '';
  
  constructor(private router: Router) { }

  onCreateBilti() {
    this.router.navigate([`transaction/addEditBilti/0`])
  }

  searchBilti(event: any) {
    this.searchedBilti = event;
  }
}
