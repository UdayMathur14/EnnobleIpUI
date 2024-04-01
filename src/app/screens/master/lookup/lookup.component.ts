import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lookup',
  templateUrl: './lookup.component.html',
  styleUrl: './lookup.component.scss'
})
export class LookupComponent {

  isFilters : boolean = false;
  filterKeyword : string = '';

  constructor(private router: Router){}

  onCreateLookup(){
    this.router.navigate(['master/addEditLookup', '0'])
  }

  onSearch(e:any){
    this.filterKeyword = e.target.value;
  }

}
