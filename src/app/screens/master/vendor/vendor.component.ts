import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrl: './vendor.component.scss'
})
export class VendorComponent {
  constructor(private router: Router) { }

  isFilters: boolean = true;
  searchedVendor: string = '';
  onCreateVendor() {
    this.router.navigate(['master/addEditVendor'])
  }

  searchVendor(event: any) {
    this.searchedVendor = event;
  }
}
