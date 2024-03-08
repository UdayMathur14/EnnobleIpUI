import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bilti-bill-process',
  templateUrl: './bilti-bill-process.component.html',
  styleUrl: './bilti-bill-process.component.scss'
})
export class BiltiBillProcessComponent {
  constructor(private router: Router) { }

  isFilters: boolean = true;

  onCreateBilti() {
    this.router.navigate(['transaction/addEditBilti'])
  }
}
