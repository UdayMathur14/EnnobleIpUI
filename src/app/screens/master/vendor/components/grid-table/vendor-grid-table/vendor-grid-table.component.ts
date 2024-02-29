import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vendor-grid-table',
  templateUrl: './vendor-grid-table.component.html',
  styleUrl: './vendor-grid-table.component.scss'
})
export class VendorGridTableComponent {
  constructor(private router: Router) {}

  onEditVendor(){
    this.router.navigate(['master/addEditVendor']);
  }
}
