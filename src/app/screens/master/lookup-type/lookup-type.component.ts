import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lookup-type',
  templateUrl: './lookup-type.component.html',
  styleUrl: './lookup-type.component.scss'
})
export class LookupTypeComponent {
  isFilters: boolean = false;
  filterKeyword: string = '';

  constructor(private router: Router) { }

  onCreateLookup() {
    this.router.navigate(['master/addEditLookupType', '0'])
  }

  onSearch(e: any) {
    this.filterKeyword = e.target.value;
  }
}
