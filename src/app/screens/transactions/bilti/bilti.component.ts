import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bilti',
  templateUrl: './bilti.component.html',
  styleUrl: './bilti.component.scss'
})
export class BiltiComponent {
  constructor(private router : Router){}

  isFilters : boolean = true;

  onCreateBilti(){
    this.router.navigate(['transaction/bilti'])
  }
  onCancelPress(){
    this.router.navigate(['transaction/bilti'])
  }
}
