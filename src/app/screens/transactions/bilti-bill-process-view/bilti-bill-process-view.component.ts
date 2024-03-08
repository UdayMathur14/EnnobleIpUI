import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bilti-bill-process-view',
  templateUrl: './bilti-bill-process-view.component.html',
  styleUrl: './bilti-bill-process-view.component.scss'
})
export class BiltiBillProcessViewComponent {
  constructor(private router: Router) { }

  isFilters: boolean = true;

  onCreateBilti() {
    this.router.navigate(['transaction/addEditBilti'])
  }
}
